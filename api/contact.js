import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// In-memory rate limiting and duplicate submission protection
const rateLimitMap = new Map();
const inflightSubmissions = new Map();

// Helper to sanitize header strings against CRLF injection
function sanitizeHeader(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n]+/g, ' ').trim();
}

// Helper to escape HTML characters
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Client IP resolver
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const list = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return list.trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

// Check and clean rate limit entries (max 5 requests per 10 minutes)
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const userRecord = rateLimitMap.get(ip) || [];
  const validRequests = userRecord.filter((timestamp) => now - timestamp < windowMs);

  if (validRequests.length >= maxRequests) {
    return true;
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);

  // Periodically sweep old map keys
  if (rateLimitMap.size > 1000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const active = timestamps.filter((t) => now - t < windowMs);
      if (active.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, active);
      }
    }
  }

  return false;
}

// Create Supabase client for audit logs
function getSupabaseClient() {
  const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (url && key) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.warn('[API/Contact] Failed to initialize Supabase client:', e.message);
    }
  }
  return null;
}

// Create Nodemailer Transporter for Gmail SMTP
function getMailTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, ''), // Strip spaces if user pasted 16-char app password with spaces
    },
  });
}

// Fetch dynamic contact receiving email & enabled status from Supabase site_settings
async function getAdminContactConfig(supabaseClient) {
  let receivingEmail = process.env.CONTACT_RECEIVING_EMAIL || process.env.GMAIL_USER || 'nuwandevinda2002@gmail.com';
  let isFormEnabled = true;

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('site_settings')
        .select('section_content')
        .limit(1)
        .maybeSingle();

      if (!error && data?.section_content?.contact) {
        const contact = data.section_content.contact;
        const savedEmail = contact.contactSettings?.receivingEmail || contact.directEmail;
        if (savedEmail && typeof savedEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(savedEmail.trim())) {
          receivingEmail = savedEmail.trim();
        }
        if (contact.contactSettings?.isFormEnabled !== undefined) {
          isFormEnabled = Boolean(contact.contactSettings.isFormEnabled);
        } else if (contact.formFields?.enabled !== undefined) {
          isFormEnabled = Boolean(contact.formFields.enabled);
        }
      }
    } catch (e) {
      console.warn('[API/Contact] Failed to fetch dynamic admin contact config:', e.message);
    }
  }

  return { receivingEmail, isFormEnabled };
}


export default async function handler(req, res) {
  // CORS & Header Setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const supabaseClient = getSupabaseClient();
  const adminConfig = await getAdminContactConfig(supabaseClient);

  // Parse query or URL parameters
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const action = urlObj.searchParams.get('action') || req.body?.action;

  // -------------------------------------------------------------
  // ACTION: STATUS (Health & Config Check)
  // -------------------------------------------------------------
  if (req.method === 'GET' || action === 'status') {
    const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    const resendKey = process.env.RESEND_API_KEY;
    const receivingEmail = adminConfig.receivingEmail;

    const isGmailReady = Boolean(gmailUser && gmailPass);
    const isResendReady = Boolean(resendKey);
    const isConfigured = isGmailReady || isResendReady;

    return res.status(200).json({
      success: true,
      configured: isConfigured,
      formEnabled: adminConfig.isFormEnabled,
      provider: isGmailReady ? 'gmail_smtp' : isResendReady ? 'resend' : 'awaiting_credentials',
      receivingEmail: receivingEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask for privacy
      fullReceivingEmail: receivingEmail,
      status: isConfigured ? 'Operational' : 'Awaiting GMAIL_USER and GMAIL_APP_PASSWORD in .env',
    });
  }

  // Only POST allowed for message submissions and tests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Use POST for submissions.',
    });
  }

  // -------------------------------------------------------------
  // ACTION: SEND TEST EMAIL (Admin verification)
  // -------------------------------------------------------------
  if (action === 'test') {
    const transporter = getMailTransporter();
    const targetEmail = req.body?.recipient || adminConfig.receivingEmail;

    if (!transporter && !process.env.RESEND_API_KEY) {
      return res.status(200).json({
        success: false,
        error: 'Email service credentials not found. Please set GMAIL_USER and GMAIL_APP_PASSWORD in your environment (.env file).',
        configured: false,
      });
    }

    try {
      const timestamp = new Date().toISOString();
      const mailOptions = {
        from: `"Nuwan.dev Portfolio" <${process.env.GMAIL_USER}>`,
        to: targetEmail,
        subject: `[Test] Portfolio Contact Delivery Verification - ${new Date().toLocaleDateString()}`,
        text: `This is a test email sent from your Nuwan.dev portfolio admin portal.\n\nTime: ${timestamp}\nStatus: Verified & Operational\nOrigin IP: ${clientIp}\nUser Agent: ${userAgent}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #10B981; border-radius: 12px; background-color: #080D0B; color: #ECFDF5;">
            <h2 style="color: #34D399; margin-top: 0;">Test Email Delivery Succeeded</h2>
            <p style="color: #A7F3D0; font-size: 14px; line-height: 1.6;">Your contact email delivery pipeline on <strong>Nuwan.dev</strong> is active, authenticated, and ready to forward incoming visitor inquiries to your Gmail inbox.</p>
            <div style="margin: 20px 0; padding: 14px; background: rgba(16, 185, 129, 0.12); border-left: 4px solid #10B981; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; font-family: monospace; color: #6EE7B7;">
                <strong>Timestamp:</strong> ${timestamp}<br/>
                <strong>Recipient:</strong> ${targetEmail}<br/>
                <strong>Provider:</strong> Gmail SMTP (nodemailer)
              </p>
            </div>
            <p style="font-size: 12px; color: #6EE7B7; border-top: 1px solid rgba(52, 211, 153, 0.2); padding-top: 12px; margin-bottom: 0;">
              Sent via Nuwan.dev Portfolio System.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      return res.status(200).json({
        success: true,
        message: `Test email successfully delivered to ${targetEmail}`,
        messageId: info.messageId,
      });
    } catch (testErr) {
      console.error('[API/Contact] Test email failure:', testErr);
      return res.status(500).json({
        success: false,
        error: testErr.message || 'Failed to send test email via SMTP transporter.',
      });
    }
  }

  // -------------------------------------------------------------
  // REGULAR CONTACT SUBMISSION
  // -------------------------------------------------------------
  const body = req.body || {};
  const { name, email, subject, message, website, honeypot } = body;

  // 0. Form Enabled Check
  if (!adminConfig.isFormEnabled) {
    return res.status(403).json({
      success: false,
      error: 'The contact form is currently disabled by the site administrator. Please reach out directly via email.',
    });
  }

  // 1. Honeypot check (Spam Protection)
  // If the hidden 'website' or 'honeypot' field is filled out, reject bot silently
  if ((website && String(website).trim() !== '') || (honeypot && String(honeypot).trim() !== '')) {
    console.warn(`[API/Contact] Honeypot triggered by bot from IP: ${clientIp}`);
    // Return standard success to fool the spam bot
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
    });
  }

  // 2. Rate Limiting Check
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many messages sent from your IP. Please wait a few minutes before trying again.',
    });
  }

  // 3. Validation
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedSubject = (subject || '').trim();
  const trimmedMessage = (message || '').trim();

  if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid name (2 to 100 characters).',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.',
    });
  }

  if (!trimmedSubject || trimmedSubject.length < 2 || trimmedSubject.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid subject (2 to 200 characters).',
    });
  }

  if (!trimmedMessage || trimmedMessage.length < 5 || trimmedMessage.length > 5000) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a message of at least 5 characters.',
    });
  }

  // 4. In-Flight Duplicate Submission Lock
  const submissionKey = `${clientIp}:${trimmedEmail}:${trimmedSubject}:${trimmedMessage.slice(0, 30)}`;
  const now = Date.now();
  if (inflightSubmissions.has(submissionKey)) {
    const lastTime = inflightSubmissions.get(submissionKey);
    if (now - lastTime < 30000) {
      // 30 seconds debounce
      return res.status(409).json({
        success: false,
        error: 'Duplicate message detected. Your previous submission was already received.',
      });
    }
  }
  inflightSubmissions.set(submissionKey, now);

  // 5. Audit Recording in Supabase `contact_messages` table
  let dbRecordId = null;

  if (supabaseClient) {
    try {
      const { data: dbData, error: dbErr } = await supabaseClient
        .from('contact_messages')
        .insert([
          {
            name: trimmedName,
            email: trimmedEmail,
            subject: trimmedSubject,
            message: trimmedMessage,
            delivery_status: 'sending',
            delivery_provider: 'gmail_smtp',
            reply_to: trimmedEmail,
            ip_address: clientIp,
          },
        ])
        .select('id')
        .single();

      if (!dbErr && dbData) {
        dbRecordId = dbData.id;
      }
    } catch (auditErr) {
      console.warn('[API/Contact] Supabase audit insert non-fatal warning:', auditErr.message);
    }
  }

  // 6. Real Email Dispatch via Gmail SMTP (nodemailer)
  const transporter = getMailTransporter();
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const receivingEmail = adminConfig.receivingEmail;

  const cleanName = sanitizeHeader(trimmedName);
  const cleanEmail = sanitizeHeader(trimmedEmail);
  const cleanSubject = sanitizeHeader(trimmedSubject);
  const formattedDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Colombo',
    dateStyle: 'full',
    timeStyle: 'long',
  });

  if (transporter) {
    try {
      const mailOptions = {
        // Authenticated sender address with visitor's name
        from: `"${cleanName} via Portfolio" <${gmailUser}>`,
        // Reply-To header points to the visitor's email address
        replyTo: `"${cleanName}" <${cleanEmail}>`,
        to: receivingEmail,
        subject: `[Portfolio Inquiry] ${cleanSubject}`,
        text: `New Portfolio Message\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\nDate: ${formattedDate} (${new Date().toISOString()})\nIP: ${clientIp}\nUser-Agent: ${userAgent}\n\nMessage:\n${trimmedMessage}\n\n---\nHit 'Reply' directly to respond to ${cleanEmail}.`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>New Portfolio Message</title>
          </head>
          <body style="margin: 0; padding: 24px; background-color: #080D0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ECFDF5;">
            <div style="max-width: 620px; margin: 0 auto; background: #0E1612; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #064E3B 0%, #10B981 100%); padding: 20px 24px;">
                <h1 style="margin: 0; font-size: 20px; color: #FFFFFF; font-weight: 700; letter-spacing: -0.02em;">
                  New Message from Nuwan.dev Portfolio
                </h1>
                <p style="margin: 4px 0 0; font-size: 13px; color: #D1FAE5;">
                  Received via Contact Form • ${escapeHtml(formattedDate)}
                </p>
              </div>

              <!-- Body -->
              <div style="padding: 24px;">
                
                <!-- Contact Summary Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 12px; font-weight: 600; color: #6EE7B7; width: 90px; border-bottom: 1px solid rgba(52, 211, 153, 0.15);">From:</td>
                    <td style="padding: 8px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(52, 211, 153, 0.15);"><strong>${escapeHtml(cleanName)}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; font-weight: 600; color: #6EE7B7; border-bottom: 1px solid rgba(52, 211, 153, 0.15);">Email:</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid rgba(52, 211, 153, 0.15);">
                      <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #34D399; text-decoration: none; font-weight: 600;">${escapeHtml(cleanEmail)}</a>
                      <span style="font-size: 11px; color: #A7F3D0; margin-left: 8px;">(Reply-To active)</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; font-weight: 600; color: #6EE7B7; border-bottom: 1px solid rgba(52, 211, 153, 0.15);">Subject:</td>
                    <td style="padding: 8px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(52, 211, 153, 0.15);">${escapeHtml(cleanSubject)}</td>
                  </tr>
                </table>

                <!-- Message Box -->
                <div style="margin-top: 16px;">
                  <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #34D399; margin: 0 0 8px;">Message Content</h3>
                  <div style="background: #080D0B; border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.65; color: #F0FDF4; white-space: pre-wrap; font-family: inherit;">${escapeHtml(trimmedMessage)}</div>
                </div>

                <!-- Action Button -->
                <div style="margin-top: 24px; text-align: center;">
                  <a href="mailto:${escapeHtml(cleanEmail)}?subject=Re:%20${encodeURIComponent(cleanSubject)}" style="display: inline-block; background: #10B981; color: #080D0B; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 22px; border-radius: 8px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                    Reply Directly to ${escapeHtml(cleanName)}
                  </a>
                </div>

                <!-- Footer & Metadata -->
                <div style="margin-top: 28px; padding-top: 14px; border-top: 1px solid rgba(52, 211, 153, 0.15); font-size: 11px; color: #6EE7B7; display: flex; justify-content: space-between;">
                  <span>Client IP: ${escapeHtml(clientIp)}</span>
                  <span>Origin: Nuwan.dev</span>
                </div>
              </div>

            </div>
          </body>
          </html>
        `,
      };

      const mailResult = await transporter.sendMail(mailOptions);

      // Update Supabase delivery status to 'delivered'
      if (supabaseClient && dbRecordId) {
        await supabaseClient
          .from('contact_messages')
          .update({
            delivery_status: 'delivered',
            updated_at: new Date().toISOString(),
          })
          .eq('id', dbRecordId);
      }

      return res.status(200).json({
        success: true,
        message: 'Message sent successfully!',
        messageId: mailResult.messageId,
      });
    } catch (sendError) {
      console.error('[API/Contact] Nodemailer send error:', sendError);

      if (supabaseClient && dbRecordId) {
        await supabaseClient
          .from('contact_messages')
          .update({
            delivery_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', dbRecordId);
      }

      return res.status(502).json({
        success: false,
        error: 'Failed to deliver message via email provider. Please contact directly via email.',
        details: sendError.message,
      });
    }
  }

  // Fallback: If credentials are not yet configured in local environment,
  // record message in database and inform client.
  if (supabaseClient && dbRecordId) {
    await supabaseClient
      .from('contact_messages')
      .update({
        delivery_status: 'recorded_offline',
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbRecordId);
  }

  return res.status(503).json({
    success: false,
    error: 'Email delivery service is awaiting Gmail credentials (GMAIL_USER and GMAIL_APP_PASSWORD in .env). Message was securely recorded in database.',
    recorded: Boolean(dbRecordId),
  });
}

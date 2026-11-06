import React, { useState } from 'react';
import { 
  Mail, 
  Phone,
  MapPin, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { 
  GithubIcon, 
  LinkedinIcon, 
  GmailIcon
} from './BrandIcons';
import { portfolioData } from '../data/portfolioData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations/MotionWrappers';

export default function Contact({ onShowToast, data, personalData }) {
  const contact = data || portfolioData.contact;
  const personal = personalData || portfolioData.personal;

  const display = contact.displaySettings || {
    showEmail: true,
    showPhone: true,
    showLocation: true,
    showSocialLinks: true,
    showContactForm: true,
    showAvailability: true,
  };

  const formConfig = contact.formFields || {};
  const isFormEnabled = display.showContactForm !== false && (formConfig.enabled !== false);

  const isNameRequired = formConfig.nameRequired !== false;
  const isEmailRequired = formConfig.emailRequired !== false;
  const isSubjectRequired = formConfig.subjectRequired !== false;
  const isMessageRequired = formConfig.messageRequired !== false;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const directEmail = contact.directEmail || personal.email || '';
  const directPhone = contact.phone || personal.phone || '';
  const locationText = contact.location || personal.location || '';

  // Extract strictly the three approved platforms: LinkedIn, GitHub, Gmail (matching Hero Section)
  const linkedInUrl = contact.socialLinks?.find(l => (l.platform || l.label || '').toLowerCase().includes('linkedin'))?.url 
    || personal.socialLinks?.find(l => (l.platform || l.label || '').toLowerCase().includes('linkedin'))?.url 
    || 'https://linkedin.com/in/nuwan-pinnaduwage';

  const githubUrl = contact.socialLinks?.find(l => (l.platform || l.label || '').toLowerCase().includes('git'))?.url 
    || personal.socialLinks?.find(l => (l.platform || l.label || '').toLowerCase().includes('git'))?.url 
    || 'https://github.com/nuwan-pinnaduwage';

  // Gmail / Email link resolution: prioritize configured social link, then direct email fallback
  const gmailSocialLink = contact.socialLinks?.find(l => {
    const p = (l.platform || l.label || '').toLowerCase();
    return p.includes('gmail') || p.includes('mail') || p.includes('email');
  }) || personal.socialLinks?.find(l => {
    const p = (l.platform || l.label || '').toLowerCase();
    return p.includes('gmail') || p.includes('mail') || p.includes('email');
  });

  const resolveEmailLink = (configuredUrl, fallbackEmail) => {
    const raw = (configuredUrl || '').trim();
    if (raw) {
      if (/^https?:\/\//i.test(raw)) return raw;
      if (raw.toLowerCase().startsWith('mailto:')) return raw;
      return `mailto:${raw}`;
    }
    const fallback = (fallbackEmail || '').trim();
    if (fallback) {
      if (/^https?:\/\//i.test(fallback)) return fallback;
      if (fallback.toLowerCase().startsWith('mailto:')) return fallback;
      return `mailto:${fallback}`;
    }
    return 'mailto:nuwan.pinnaduwage@example.com';
  };

  const gmailUrl = resolveEmailLink(
    gmailSocialLink?.url,
    contact.directEmail || personal.email || personal.directEmail
  );

  // Only display valid non-empty links for the 3 platforms (no broken links)
  const contactSocials = [
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      url: linkedInUrl,
      ariaLabel: 'LinkedIn profile',
      Icon: LinkedinIcon,
    },
    {
      id: 'github',
      platform: 'GitHub',
      url: githubUrl,
      ariaLabel: 'GitHub profile',
      Icon: GithubIcon,
    },
    {
      id: 'gmail',
      platform: 'Gmail',
      url: gmailUrl,
      ariaLabel: 'Send email via Gmail',
      Icon: GmailIcon,
    },
  ].filter(item => Boolean(item.url && item.url.trim() !== '' && item.url !== '#'));

  const validate = () => {
    const errs = {};
    if (isNameRequired && !formData.name.trim()) {
      errs.name = 'Please provide your name.';
    }
    if (isEmailRequired && !formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (isSubjectRequired && !formData.subject.trim()) {
      errs.subject = 'Please specify a subject.';
    }
    if (isMessageRequired && !formData.message.trim()) {
      errs.message = 'Please enter your message.';
    } else if (formData.message.trim() && formData.message.trim().length < 5) {
      errs.message = 'Message should be at least 5 characters long.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (onShowToast) {
        onShowToast({ type: 'error', message: 'Please correct the highlighted fields before submitting.' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error: insertErr } = await supabase.from('contact_messages').insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }]);
        if (insertErr) {
          console.error("Error submitting contact message to Supabase:", insertErr);
        }
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      if (onShowToast) {
        onShowToast({ 
          type: 'success', 
          message: formConfig.successMessage || "Thank you! Your message has been received. I'll get back to you shortly." 
        });
      }
    } catch (err) {
      console.error("Submission exception:", err);
      if (onShowToast) {
        onShowToast({
          type: 'error',
          message: 'Failed to send message. Please try reaching out directly via email.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to highlight "Connect" in Clean Slate brand tone
  const renderFormHeading = (heading = "Let's Connect") => {
    if (heading.includes("Connect")) {
      const parts = heading.split("Connect");
      return (
        <>
          {parts[0]}
          <span className="text-[#2D3748] dark:text-white font-bold">Connect</span>
          {parts.slice(1).join("Connect")}
        </>
      );
    }
    return heading;
  };

  return (
    <section 
      id="contact" 
      aria-labelledby="contact-heading"
      className="py-16 sm:py-24 relative overflow-hidden scroll-mt-24 bg-[#F5F7FA] dark:bg-[#050505] border-t border-[#A0AEC0]/20 dark:border-[#1F1F1F] transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Two-Column Layout (sitting directly on background without outer boxes/cards) */}
        <div className={
          isFormEnabled 
            ? "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start" 
            : "max-w-2xl mx-auto text-center"
        }>
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: CONTACT INFORMATION (Slides subtly from left) */}
          {/* ========================================================= */}
          <ScrollReveal 
            direction="left" 
            distance={24} 
            duration={0.65} 
            delay={0.05} 
            once={false}
            className={isFormEnabled ? "lg:col-span-5 space-y-6" : "space-y-6"}
          >
            <div>
              {/* Heading: Get In Touch (Balanced 1.25 line-height) */}
              <h2 
                id="contact-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white tracking-tight leading-[1.25]"
              >
                {contact.title || "Get In Touch"}
              </h2>

              {/* Introductory Paragraph (Readable 1.75-1.8 line-height) */}
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-[1.75] sm:leading-[1.8] max-w-lg">
                {contact.subtitle || "Whether you have an exciting project, a collaboration idea, or just want to say hello — I'd love to hear from you. Let's build something amazing together."}
              </p>

              {/* Optional Availability Status Badge */}
              {display.showAvailability !== false && (contact.availabilityStatus || contact.availabilityText) && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{contact.availabilityStatus || contact.availabilityText}</span>
                </div>
              )}
            </div>

            {/* Contact Details List (Consistent 28-32px vertical gap, borderless icons beside text) */}
            <div className="space-y-7 sm:space-y-8 pt-6 sm:pt-7">
              
              {/* Email Address */}
              {display.showEmail !== false && directEmail && (
                <div className="flex items-center gap-3.5 sm:gap-4 group">
                  <Mail className="w-5 h-5 text-[#2D3748] dark:text-[#A0AEC0] shrink-0 group-hover:text-[#1A202C] dark:group-hover:text-white transition-colors" />
                  <div className="min-w-0">
                    <a
                      href={`mailto:${directEmail}`}
                      className="text-sm sm:text-base font-medium text-[#2D3748] dark:text-[#F5F7FA] leading-[1.55] hover:text-[#2D3748] dark:hover:text-white transition-colors truncate block"
                    >
                      {directEmail}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone Number */}
              {display.showPhone !== false && directPhone && (
                <div className="flex items-center gap-3.5 sm:gap-4 group">
                  <Phone className="w-5 h-5 text-[#2D3748] dark:text-[#A0AEC0] shrink-0 group-hover:text-[#1A202C] dark:group-hover:text-white transition-colors" />
                  <div className="min-w-0">
                    <a
                      href={`tel:${directPhone.replace(/[^0-9+]/g, '')}`}
                      className="text-sm sm:text-base font-medium text-[#2D3748] dark:text-[#F5F7FA] leading-[1.55] hover:text-[#2D3748] dark:hover:text-white transition-colors truncate block font-mono"
                    >
                      {directPhone}
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              {display.showLocation !== false && locationText && (
                <div className="flex items-center gap-3.5 sm:gap-4 group">
                  <MapPin className="w-5 h-5 text-[#2D3748] dark:text-[#A0AEC0] shrink-0 group-hover:text-[#1A202C] dark:group-hover:text-white transition-colors" />
                  <div className="min-w-0">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(locationText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-medium text-[#2D3748] dark:text-[#F5F7FA] leading-[1.55] hover:text-[#2D3748] dark:hover:text-white transition-colors truncate block"
                    >
                      {locationText}
                    </a>
                  </div>
                </div>
              )}

            </div>
          </ScrollReveal>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: CONTACT FORM (Slides subtly from right)      */}
          {/* ========================================================= */}
          {isFormEnabled && (
            <ScrollReveal 
              direction="right" 
              distance={24} 
              duration={0.65} 
              delay={0.1} 
              once={false}
              className="lg:col-span-7"
            >
              <div>
                
                {/* Form Heading: Let's Connect (Clean Slate typography) */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight leading-[1.25] mb-6 sm:mb-7">
                  {renderFormHeading(formConfig.formHeading || "Let's Connect")}
                </h3>

                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-[#0E0E0E] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                      Message Sent Successfully!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-[1.6]">
                      {formConfig.successMessage || "Thank you! Your message has been received. I'll get back to you shortly."}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-8 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#2D3748] transition-all shadow-subtle"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                    <StaggerContainer staggerDelay={0.06} once={false} className="space-y-5 sm:space-y-6">
                      
                      {/* Row 1: Name & Email side-by-side (20-24px vertical gap, 16-20px horizontal gap) */}
                      <StaggerItem direction="up" distance={12} duration={0.45}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                          <div>
                            <input
                              id="contact-name"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder={formConfig.namePlaceholder || "Your Name"}
                              required={isNameRequired}
                              aria-label={formConfig.nameLabel || "Your Name"}
                              className={`w-full px-4 py-3 sm:py-3.5 rounded-xl text-sm leading-[1.5] bg-white dark:bg-[#0E0E0E] border ${
                                errors.name 
                                  ? 'border-rose-500 focus:ring-rose-500/30' 
                                  : 'border-slate-300 dark:border-[#222222] focus:border-[#2D3748] dark:focus:border-[#A0AEC0]'
                              } text-[#2D3748] dark:text-white placeholder-[#A0AEC0] dark:placeholder-[#A0AEC0] focus:outline-none focus:ring-1 focus:ring-[#2D3748] dark:focus:ring-[#A0AEC0] transition-all`}
                            />
                            {errors.name && (
                              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.name}</span>
                              </p>
                            )}
                          </div>

                          <div>
                            <input
                              id="contact-email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={formConfig.emailPlaceholder || "Your Email"}
                              required={isEmailRequired}
                              aria-label={formConfig.emailLabel || "Your Email"}
                              className={`w-full px-4 py-3 sm:py-3.5 rounded-xl text-sm leading-[1.5] bg-white dark:bg-[#0E0E0E] border ${
                                errors.email 
                                  ? 'border-rose-500 focus:ring-rose-500/30' 
                                  : 'border-slate-300 dark:border-[#222222] focus:border-[#2D3748] dark:focus:border-[#A0AEC0]'
                              } text-[#2D3748] dark:text-white placeholder-[#A0AEC0] dark:placeholder-[#A0AEC0] focus:outline-none focus:ring-1 focus:ring-[#2D3748] dark:focus:ring-[#A0AEC0] transition-all`}
                            />
                            {errors.email && (
                              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.email}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </StaggerItem>

                      {/* Row 2: Subject (full width) */}
                      <StaggerItem direction="up" distance={12} duration={0.45}>
                        <div>
                          <input
                            id="contact-subject"
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder={formConfig.subjectPlaceholder || "Subject"}
                            required={isSubjectRequired}
                            aria-label={formConfig.subjectLabel || "Subject"}
                            className={`w-full px-4 py-3 sm:py-3.5 rounded-xl text-sm leading-[1.5] bg-white dark:bg-[#0E0E0E] border ${
                              errors.subject 
                                ? 'border-rose-500 focus:ring-rose-500/30' 
                                : 'border-slate-300 dark:border-[#222222] focus:border-[#2D3748] dark:focus:border-[#A0AEC0]'
                            } text-[#2D3748] dark:text-white placeholder-[#A0AEC0] dark:placeholder-[#A0AEC0] focus:outline-none focus:ring-1 focus:ring-[#2D3748] dark:focus:ring-[#A0AEC0] transition-all`}
                          />
                          {errors.subject && (
                            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.subject}</span>
                            </p>
                          )}
                        </div>
                      </StaggerItem>

                      {/* Row 3: Message textarea (Readable 1.6 line-height) */}
                      <StaggerItem direction="up" distance={12} duration={0.45}>
                        <div>
                          <textarea
                            id="contact-message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={formConfig.messagePlaceholder || "Message"}
                            required={isMessageRequired}
                            aria-label={formConfig.messageLabel || "Message"}
                            className={`w-full px-4 py-3.5 rounded-xl text-sm leading-[1.6] bg-white dark:bg-[#0E0E0E] border ${
                              errors.message 
                                ? 'border-rose-500 focus:ring-rose-500/30' 
                                : 'border-slate-300 dark:border-[#222222] focus:border-[#2D3748] dark:focus:border-[#A0AEC0]'
                            } text-[#2D3748] dark:text-white placeholder-[#A0AEC0] dark:placeholder-[#A0AEC0] focus:outline-none focus:ring-1 focus:ring-[#2D3748] dark:focus:ring-[#A0AEC0] transition-all resize-none`}
                          ></textarea>
                          {errors.message && (
                            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.message}</span>
                            </p>
                          )}
                        </div>
                      </StaggerItem>

                      {/* Submit Button: Centered Pill-shaped with SEND label (Proper breathing room below field) */}
                      <StaggerItem direction="up" distance={12} duration={0.45}>
                        <div className="flex justify-center pt-3 sm:pt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-3 rounded-lg bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#2D3748] active:scale-98 disabled:opacity-60 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-subtle hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                                <span>{formConfig.submittingText || "SENDING..."}</span>
                              </>
                            ) : (
                              <span>{formConfig.buttonText || "SEND"}</span>
                            )}
                          </button>
                        </div>
                      </StaggerItem>

                    </StaggerContainer>
                  </form>
                )}

              </div>
            </ScrollReveal>
          )}

        </div>

        {/* ========================================================= */}
        {/* SOCIAL MEDIA ICONS: MATCHES HERO SECTION VISUAL DESIGN    */}
        {/* STRICTLY 3 PLATFORMS: LINKEDIN, GITHUB, GMAIL (NO EXTRAS) */}
        {/* ========================================================= */}
        {display.showSocialLinks !== false && contactSocials.length > 0 && (
          <ScrollReveal direction="up" distance={16} duration={0.6} once={false}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 mt-16 sm:mt-20 pt-4 sm:pt-6">
              {contactSocials.map((item) => {
                const IconComponent = item.Icon;
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white hover:bg-white dark:hover:bg-[#2D3748] transition-colors active:scale-95"
                    title={item.platform}
                  >
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                  </a>
                );
              })}
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
}

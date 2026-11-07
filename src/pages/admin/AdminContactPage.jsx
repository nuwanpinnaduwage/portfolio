import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles, 
  Globe, 
  Share2, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Sliders, 
  X,
  Check,
  Send
} from 'lucide-react';
import { 
  GithubIcon, 
  LinkedinIcon, 
  LeetcodeIcon, 
  TwitterIcon, 
  FacebookIcon, 
  InstagramIcon 
} from '../../components/BrandIcons';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AdminContactPage() {
  const { portfolio, saveContact } = usePortfolio();
  const contact = portfolio?.contact || {};
  const personal = portfolio?.personal || {};

  // Active Tab: 'general' | 'social' | 'form' | 'visibility'
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Auto-dismiss feedback message
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // ==========================================
  // TAB 1: GENERAL CONTACT INFO STATE
  // ==========================================
  const [generalForm, setGeneralForm] = useState({
    title: "Get In Touch",
    subtitle: "Whether you have an exciting project, a collaboration idea, or just want to say hello — I'd love to hear from you. Let's build something amazing together.",
    directEmail: '',
    phone: '',
    location: '',
    statusNotice: '',
    availabilityHeading: 'Internship & Co-op Ready',
    availabilityNotice: '',
    availabilityAvailable: true,
  });

  // ==========================================
  // TAB 2: SOCIAL & PROFESSIONAL LINKS STATE
  // ==========================================
  const [socialLinks, setSocialLinks] = useState([]);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [editingSocialIdx, setEditingSocialIdx] = useState(null);
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState(null);

  const [socialFormData, setSocialFormData] = useState({
    platform: 'GitHub',
    label: '',
    url: '',
    username: '',
    icon: 'Github',
    visible: true,
  });

  // ==========================================
  // TAB 3: CONTACT FORM SETTINGS STATE
  // ==========================================
  const [formConfig, setFormConfig] = useState({
    enabled: true,
    formHeading: "Let's Connect",
    formSubtitle: '',
    nameLabel: 'Your Name',
    namePlaceholder: 'Your Name',
    nameRequired: true,
    emailLabel: 'Your Email',
    emailPlaceholder: 'Your Email',
    emailRequired: true,
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Subject',
    subjectRequired: true,
    messageLabel: 'Message',
    messagePlaceholder: 'Message',
    messageRequired: true,
    buttonText: 'SEND',
    submittingText: 'SENDING...',
    successMessage: "Thank you! Your message has been received. I'll get back to you shortly.",
  });

  // ==========================================
  // TAB 4: DISPLAY SETTINGS STATE
  // ==========================================
  const [displaySettings, setDisplaySettings] = useState({
    showEmail: true,
    showPhone: true,
    showLocation: true,
    showSocialLinks: true,
    showAvailability: true,
    showContactForm: true,
  });

  // ==========================================
  // TAB 5: CONTACT DELIVERY & GMAIL SETTINGS
  // ==========================================
  const [deliverySettings, setDeliverySettings] = useState({
    receivingEmail: 'nuwandevinda2002@gmail.com',
    platform: 'email',
    sendButtonText: 'Send Message',
    isFormEnabled: true,
  });

  const [deliveryStatus, setDeliveryStatus] = useState({
    loading: false,
    checked: false,
    configured: false,
    provider: 'none',
    receivingEmail: '',
    statusText: '',
  });

  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('nuwandevinda2002@gmail.com');

  const fetchDeliveryStatus = async () => {
    setDeliveryStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/contact?action=status');
      const data = await res.json();
      setDeliveryStatus({
        loading: false,
        checked: true,
        configured: Boolean(data.configured),
        provider: data.provider || 'none',
        receivingEmail: data.fullReceivingEmail || data.receivingEmail || '',
        statusText: data.status || (data.configured ? 'Operational' : 'Simulated'),
      });
    } catch (err) {
      setDeliveryStatus({
        loading: false,
        checked: true,
        configured: false,
        provider: 'none',
        receivingEmail: '',
        statusText: 'Could not connect to /api/contact',
      });
    }
  };

  useEffect(() => {
    fetchDeliveryStatus();
  }, []);

  // ==========================================
  // HANDLERS: TAB 5 (CONTACT & DELIVERY SETTINGS)
  // ==========================================
  const handleSaveDeliverySettings = async (e) => {
    if (e) e.preventDefault();
    const emailToSave = (deliverySettings.receivingEmail || '').trim();
    if (emailToSave && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToSave)) {
      setFeedback({ type: 'error', message: 'Please enter a valid receiving email address.' });
      return;
    }

    setSaving(true);
    const updatedContact = {
      ...contact,
      directEmail: emailToSave || 'nuwandevinda2002@gmail.com',
      contactSettings: {
        receivingEmail: emailToSave || 'nuwandevinda2002@gmail.com',
        platform: deliverySettings.platform,
        sendButtonText: (deliverySettings.sendButtonText || 'Send Message').trim(),
        isFormEnabled: Boolean(deliverySettings.isFormEnabled),
        updatedAt: new Date().toISOString(),
      },
      formFields: {
        ...(contact.formFields || {}),
        enabled: Boolean(deliverySettings.isFormEnabled),
        buttonText: (deliverySettings.sendButtonText || 'Send Message').trim(),
      },
      displaySettings: {
        ...(contact.displaySettings || {}),
        showContactForm: Boolean(deliverySettings.isFormEnabled),
      },
    };

    const res = await saveContact(updatedContact);
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save contact delivery settings.' });
    } else {
      setFeedback({ type: 'success', message: 'Contact delivery settings saved and synchronized to Supabase!' });
      fetchDeliveryStatus();
    }
  };

  const handleSendTestEmail = async () => {
    const target = (testEmailRecipient || deliverySettings.receivingEmail || 'nuwandevinda2002@gmail.com').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      setFeedback({ type: 'error', message: 'Please provide a valid recipient email for the test.' });
      return;
    }

    setTestEmailSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          recipient: target,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: data.message || `Test email sent successfully to ${target}!` });
      } else {
        setFeedback({ 
          type: 'error', 
          message: data.error || 'Failed to send test email. Please ensure GMAIL_USER and GMAIL_APP_PASSWORD are set in your .env file.' 
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to reach delivery API: ' + err.message });
    } finally {
      setTestEmailSending(false);
    }
  };

  // Initialize state from portfolio context
  useEffect(() => {
    if (contact) {
      setGeneralForm({
        title: contact.title || "Get In Touch",
        subtitle: contact.subtitle || "Whether you have an exciting project, a collaboration idea, or just want to say hello — I'd love to hear from you. Let's build something amazing together.",
        directEmail: contact.directEmail || personal.email || '',
        phone: contact.phone || personal.phone || '',
        location: contact.location || personal.location || '',
        statusNotice: contact.statusNotice || '',
        availabilityHeading: contact.availabilityHeading || 'Internship & Co-op Ready',
        availabilityNotice: contact.availabilityNotice || '',
        availabilityAvailable: contact.availabilityAvailable !== false,
      });

      const initialSocial = contact.socialLinks || personal.socialLinks || [];
      setSocialLinks(
        initialSocial.map((item, idx) => ({
          ...item,
          id: item.id || `soc-${idx}-${Date.now()}`,
          visible: item.visible !== false,
          label: item.label || item.platform,
          icon: item.icon || item.platform,
        }))
      );

      const fc = contact.formFields || {};
      setFormConfig({
        enabled: fc.enabled !== false,
        formHeading: fc.formHeading || "Let's Connect",
        formSubtitle: fc.formSubtitle || '',
        nameLabel: fc.nameLabel || 'Your Name',
        namePlaceholder: fc.namePlaceholder || 'Your Name',
        nameRequired: fc.nameRequired !== false,
        emailLabel: fc.emailLabel || 'Your Email',
        emailPlaceholder: fc.emailPlaceholder || 'Your Email',
        emailRequired: fc.emailRequired !== false,
        subjectLabel: fc.subjectLabel || 'Subject',
        subjectPlaceholder: fc.subjectPlaceholder || 'Subject',
        subjectRequired: fc.subjectRequired !== false,
        messageLabel: fc.messageLabel || 'Message',
        messagePlaceholder: fc.messagePlaceholder || 'Message',
        messageRequired: fc.messageRequired !== false,
        buttonText: fc.buttonText || 'SEND',
        submittingText: fc.submittingText || 'SENDING...',
        successMessage: fc.successMessage || "Thank you! Your message has been received. I'll get back to you shortly.",
      });

      const ds = contact.displaySettings || {};
      const cs = contact.contactSettings || {};
      setDeliverySettings({
        receivingEmail: cs.receivingEmail || contact.directEmail || personal.email || 'nuwandevinda2002@gmail.com',
        platform: cs.platform || 'email',
        sendButtonText: fc.buttonText || cs.sendButtonText || 'Send Message',
        isFormEnabled: fc.enabled !== false && ds.showContactForm !== false,
      });
      setTestEmailRecipient(cs.receivingEmail || contact.directEmail || personal.email || 'nuwandevinda2002@gmail.com');

      setDisplaySettings({
        showEmail: ds.showEmail !== false,
        showPhone: ds.showPhone !== false,
        showLocation: ds.showLocation !== false,
        showSocialLinks: ds.showSocialLinks !== false,
        showAvailability: ds.showAvailability !== false,
        showContactForm: ds.showContactForm !== false,
      });
    }
  }, [contact, personal]);

  // ==========================================
  // HANDLERS: TAB 1 (GENERAL INFO)
  // ==========================================
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    if (generalForm.directEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(generalForm.directEmail.trim())) {
      setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setSaving(true);
    const updatedContact = {
      ...contact,
      title: generalForm.title.trim(),
      subtitle: generalForm.subtitle.trim(),
      directEmail: generalForm.directEmail.trim(),
      phone: generalForm.phone.trim(),
      location: generalForm.location.trim(),
      statusNotice: generalForm.statusNotice.trim(),
      availabilityHeading: generalForm.availabilityHeading.trim(),
      availabilityNotice: generalForm.availabilityNotice.trim(),
      availabilityAvailable: Boolean(generalForm.availabilityAvailable),
    };

    const res = await saveContact(updatedContact);
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save general contact information.' });
    } else {
      setFeedback({ type: 'success', message: 'General contact information updated and synchronized!' });
    }
  };

  // ==========================================
  // HANDLERS: TAB 2 (SOCIAL LINKS)
  // Restricted strictly to LinkedIn, GitHub, and Gmail
  // ==========================================
  const platformPresets = [
    { name: 'LinkedIn', icon: 'Linkedin', defaultUrl: 'https://linkedin.com/in/' },
    { name: 'GitHub', icon: 'Github', defaultUrl: 'https://github.com/' },
    { name: 'Gmail', icon: 'Mail', defaultUrl: 'https://mail.google.com/mail/?view=cm&fs=1&to=nuwan.pinnaduwage@example.com' },
  ];

  const renderSocialIcon = (iconName, platform) => {
    const key = (iconName || platform || '').toLowerCase();
    if (key.includes('git')) return <GithubIcon className="w-4 h-4 text-emerald-400" />;
    if (key.includes('linkedin')) return <LinkedinIcon className="w-4 h-4 text-emerald-400" />;
    if (key.includes('mail') || key.includes('email') || key.includes('gmail')) return <Mail className="w-4 h-4 text-emerald-400" />;
    return <Globe className="w-4 h-4 text-emerald-400" />;
  };

  const openAddSocialModal = () => {
    setEditingSocialIdx(null);
    setSocialFormData({
      platform: 'LinkedIn',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/',
      username: '',
      icon: 'Linkedin',
      visible: true,
    });
    setSocialModalOpen(true);
  };

  const openEditSocialModal = (link, idx) => {
    setEditingSocialIdx(idx);
    setSocialFormData({
      platform: link.platform || 'LinkedIn',
      label: link.label || link.platform || '',
      url: link.url || '',
      username: link.username || '',
      icon: link.icon || link.platform || 'Linkedin',
      visible: link.visible !== false,
    });
    setSocialModalOpen(true);
  };

  const handlePlatformChange = (selectedPlatform) => {
    const preset = platformPresets.find(p => p.name === selectedPlatform);
    const prevPreset = platformPresets.find(p => p.name === socialFormData.platform);
    const isUrlDefaultOrEmpty = !socialFormData.url || 
      socialFormData.url === 'https://' || 
      (prevPreset && socialFormData.url === prevPreset.defaultUrl);

    setSocialFormData(prev => ({
      ...prev,
      platform: selectedPlatform,
      label: prev.label && prev.label !== prev.platform ? prev.label : selectedPlatform,
      icon: preset?.icon || prev.icon,
      url: isUrlDefaultOrEmpty ? (preset?.defaultUrl || 'https://') : prev.url,
    }));
  };

  const handleSaveSocialModal = (e) => {
    e.preventDefault();
    const trimmedUrl = (socialFormData.url || '').trim();
    if (!trimmedUrl) {
      setFeedback({ type: 'error', message: 'URL or mailto link is required for a social link.' });
      return;
    }

    // Security check: block dangerous pseudoprotocols
    const lower = trimmedUrl.toLowerCase();
    if (
      lower.startsWith('javascript:') || 
      lower.startsWith('data:') || 
      lower.startsWith('vbscript:') || 
      lower.startsWith('file:')
    ) {
      setFeedback({ type: 'error', message: 'Unsafe link scheme detected. Please provide a secure web URL (https://) or email link.' });
      return;
    }

    let normalizedUrl = trimmedUrl;

    // 1. Web URL (HTTP / HTTPS)
    if (/^https?:\/\//i.test(trimmedUrl)) {
      try {
        const parsed = new URL(trimmedUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          setFeedback({ type: 'error', message: 'Please provide a valid URL starting with https:// or http://' });
          return;
        }
        if (!parsed.hostname || !parsed.hostname.includes('.')) {
          setFeedback({ type: 'error', message: 'Please enter a valid domain name in the web URL.' });
          return;
        }
        // Valid web URL - query parameters (?view=cm&fs=1&to=...) are preserved completely intact!
        normalizedUrl = trimmedUrl;
      } catch {
        setFeedback({ type: 'error', message: 'Invalid URL format. Please ensure the URL is formatted correctly.' });
        return;
      }
    } else if (lower.startsWith('mailto:')) {
      // 2. Mailto link
      const emailRecipient = trimmedUrl.slice(7).split('?')[0].trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRecipient)) {
        setFeedback({ type: 'error', message: 'Please provide a valid email address for the mailto: link (e.g. mailto:you@example.com).' });
        return;
      }
      normalizedUrl = trimmedUrl;
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedUrl)) {
      // 3. Raw email address provided -> format as mailto:
      normalizedUrl = `mailto:${trimmedUrl}`;
    } else {
      // 4. Invalid input
      if (socialFormData.platform === 'Gmail') {
        setFeedback({ 
          type: 'error', 
          message: 'Please enter a valid Gmail compose URL (e.g., https://mail.google.com/mail/?view=cm&fs=1&to=yourname@gmail.com) or email address.' 
        });
      } else {
        setFeedback({ 
          type: 'error', 
          message: 'Please provide a valid web URL starting with https:// or http://' 
        });
      }
      return;
    }

    const updated = [...socialLinks];
    const itemToSave = {
      ...socialFormData,
      label: socialFormData.label.trim() || socialFormData.platform,
      url: normalizedUrl,
      username: socialFormData.username.trim(),
    };

    if (editingSocialIdx !== null) {
      updated[editingSocialIdx] = itemToSave;
    } else {
      updated.push({
        ...itemToSave,
        id: `soc-${Date.now()}`
      });
    }

    setSocialLinks(updated);
    setSocialModalOpen(false);
    setFeedback({ type: 'success', message: 'Link updated in list! Click "Save All Social Links" to persist.' });
  };

  const handleToggleSocialVisibility = (idx) => {
    const updated = [...socialLinks];
    updated[idx] = { ...updated[idx], visible: !updated[idx].visible };
    setSocialLinks(updated);
  };

  const handleMoveSocial = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= socialLinks.length) return;
    const updated = [...socialLinks];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSocialLinks(updated);
  };

  const handleDeleteSocial = (idx) => {
    const updated = socialLinks.filter((_, i) => i !== idx);
    setSocialLinks(updated);
    setDeleteConfirmIdx(null);
    setFeedback({ type: 'success', message: 'Link removed from list. Remember to save changes.' });
  };

  const handleSaveAllSocialLinks = async () => {
    setSaving(true);
    const updatedContact = {
      ...contact,
      socialLinks: socialLinks
    };
    const res = await saveContact(updatedContact);
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save social links.' });
    } else {
      setFeedback({ type: 'success', message: 'All social media & professional links saved successfully!' });
    }
  };

  // ==========================================
  // HANDLERS: TAB 3 (CONTACT FORM SETTINGS)
  // ==========================================
  const handleSaveFormSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedContact = {
      ...contact,
      formFields: {
        ...formConfig
      }
    };

    const res = await saveContact(updatedContact);
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save contact form settings.' });
    } else {
      setFeedback({ type: 'success', message: 'Contact form settings updated successfully!' });
    }
  };

  // ==========================================
  // HANDLERS: TAB 4 (DISPLAY SETTINGS)
  // ==========================================
  const handleToggleDisplay = (key) => {
    setDisplaySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleEnableAllDisplay = () => {
    setDisplaySettings({
      showEmail: true,
      showPhone: true,
      showLocation: true,
      showSocialLinks: true,
      showAvailability: true,
      showContactForm: true,
    });
  };

  const handleDisableAllDisplay = () => {
    setDisplaySettings({
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showSocialLinks: false,
      showAvailability: false,
      showContactForm: false,
    });
  };

  const handleSaveDisplaySettings = async () => {
    setSaving(true);
    const updatedContact = {
      ...contact,
      displaySettings: {
        ...displaySettings
      }
    };

    const res = await saveContact(updatedContact);
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save contact display settings.' });
    } else {
      setFeedback({ type: 'success', message: 'Contact display visibility settings updated!' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[#2D3748] border border-[#4A5568] text-[#F5F7FA]">
            <Mail className="w-6 h-6" />
          </span>
          <span>Contact Section Management</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Manage your public contact information, communication channels, social and professional links, direct message form, and section visibility without editing code.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'general'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>General Contact Info</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'social'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social & Links ({socialLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'form'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact Form</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'settings'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-400" />
          <span>Contact & Gmail Settings</span>
        </button>


        <button
          onClick={() => setActiveTab('visibility')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'visibility'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Display Settings</span>
        </button>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: GENERAL CONTACT INFO                                */}
      {/* ========================================================= */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Direct Communication & Details</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure the primary contact coordinates displayed on the public website.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Direct Email */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={generalForm.directEmail}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, directEmail: e.target.value }))}
                placeholder="nuwan.pinnaduwage@example.com"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Displayed with one-click copy in the Contact card.</span>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="text"
                value={generalForm.phone}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Optional phone number with one-click copy and tel: link.</span>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Location & Work Preference</span>
              </label>
              <input
                type="text"
                value={generalForm.location}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="San Francisco, CA (Open to Relocation & Remote)"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Status Notice / Response Time */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Response Time / Status Notice</span>
              </label>
              <input
                type="text"
                value={generalForm.statusNotice}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, statusNotice: e.target.value }))}
                placeholder="Currently responding to inquiries within 24 hours."
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Section Heading & Subtitle */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Section Intro & Description</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Section Title</label>
                <input
                  type="text"
                  value={generalForm.title}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Let's Connect"
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Section Subtitle / Introduction</label>
                <textarea
                  rows={3}
                  value={generalForm.subtitle}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="I am actively seeking full-time opportunities and internships in Cybersecurity, Network Engineering, and AI/Security Systems..."
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Availability Status Badge Note */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between p-3.5 rounded-xl bg-dark-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Hero Availability Status Badge</span>
              <span className="text-[11px] text-slate-400">The "Available for Opportunities" banner is centralized under Hero Section Management.</span>
            </div>
            <Link
              to="/admin/hero"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors shrink-0"
            >
              Configure in Hero →
            </Link>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white disabled:opacity-50 text-[#2D3748] font-semibold text-xs sm:text-sm shadow-subtle flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save General Contact Info'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SOCIAL & PROFESSIONAL LINKS                         */}
      {/* ========================================================= */}
      {activeTab === 'social' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Social Media & Professional Profiles</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage links to GitHub, LinkedIn, Facebook, Instagram, Twitter/X, LeetCode, or personal websites.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={openAddSocialModal}
                  className="px-4 py-2 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold text-xs shadow-subtle shadow-subtle flex items-center gap-2 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Link</span>
                </button>
              </div>
            </div>

            {/* Links List */}
            {socialLinks.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No social links configured yet. Click "Add New Link" to add your first profile.
              </div>
            ) : (
              <div className="space-y-3">
                {socialLinks.map((link, idx) => (
                  <div
                    key={link.id || idx}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl bg-dark-850 border ${
                      link.visible === false ? 'border-slate-800/60 opacity-60' : 'border-slate-800'
                    } gap-3 transition-all`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        {renderSocialIcon(link.icon, link.platform)}
                      </div>

                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm truncate">
                            {link.label || link.platform}
                          </span>
                          {link.platform && link.label !== link.platform && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-950 border border-slate-800 text-slate-400">
                              {link.platform}
                            </span>
                          )}
                          {link.visible === false && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                              Hidden
                            </span>
                          )}
                        </div>

                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-emerald-400 truncate block hover:underline mt-0.5 flex items-center gap-1"
                        >
                          <span className="truncate">{link.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>

                        {link.username && (
                          <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                            {link.username}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Reorder, Visibility, Edit, Delete */}
                    <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => handleMoveSocial(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveSocial(idx, 1)}
                        disabled={idx === socialLinks.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Toggle Visibility */}
                      <button
                        type="button"
                        onClick={() => handleToggleSocialVisibility(idx)}
                        title={link.visible === false ? "Show on public site" : "Hide from public site"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          link.visible === false 
                            ? 'text-amber-400 hover:bg-amber-500/10' 
                            : 'text-slate-400 hover:text-white hover:bg-dark-800'
                        }`}
                      >
                        {link.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => openEditSocialModal(link, idx)}
                        title="Edit link"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-dark-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmIdx(idx)}
                        title="Delete link"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-dark-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSaveAllSocialLinks}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white disabled:opacity-50 text-[#2D3748] font-semibold text-xs sm:text-sm shadow-subtle flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save All Social Links'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CONTACT FORM SETTINGS                               */}
      {/* ========================================================= */}
      {activeTab === 'form' && (
        <form onSubmit={handleSaveFormSettings} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Contact Form Configuration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable or disable the public contact form, modify headings, field labels, placeholders, and required settings.
              </p>
            </div>

            {/* Master Form Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer bg-dark-850 px-3.5 py-2 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                checked={formConfig.enabled}
                onChange={(e) => setFormConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 relative"></div>
              <span className="text-xs font-mono text-white font-semibold">
                {formConfig.enabled ? 'Form Enabled' : 'Form Disabled'}
              </span>
            </label>
          </div>

          {/* Form Headers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">Form Heading</label>
              <input
                type="text"
                value={formConfig.formHeading}
                onChange={(e) => setFormConfig(prev => ({ ...prev, formHeading: e.target.value }))}
                placeholder="Send a Direct Message"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">Form Subtitle / Helper Tag</label>
              <input
                type="text"
                value={formConfig.formSubtitle}
                onChange={(e) => setFormConfig(prev => ({ ...prev, formSubtitle: e.target.value }))}
                placeholder="All fields required"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Form Fields Table / Customization */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Form Fields Configuration</h3>

            {/* Field 1: Name */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Field 1: Name</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
                  <input
                    type="checkbox"
                    checked={formConfig.nameRequired}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, nameRequired: e.target.checked }))}
                    className="rounded bg-dark-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/40"
                  />
                  <span>Required field</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Field Label</label>
                  <input
                    type="text"
                    value={formConfig.nameLabel}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, nameLabel: e.target.value }))}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Placeholder Text</label>
                  <input
                    type="text"
                    value={formConfig.namePlaceholder}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, namePlaceholder: e.target.value }))}
                    placeholder="Ada Lovelace"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Field 2: Email */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Field 2: Email</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
                  <input
                    type="checkbox"
                    checked={formConfig.emailRequired}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, emailRequired: e.target.checked }))}
                    className="rounded bg-dark-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/40"
                  />
                  <span>Required field</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Field Label</label>
                  <input
                    type="text"
                    value={formConfig.emailLabel}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, emailLabel: e.target.value }))}
                    placeholder="Your Email"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Placeholder Text</label>
                  <input
                    type="text"
                    value={formConfig.emailPlaceholder}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, emailPlaceholder: e.target.value }))}
                    placeholder="ada@example.com"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Field 3: Subject */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Field 3: Subject</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
                  <input
                    type="checkbox"
                    checked={formConfig.subjectRequired}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, subjectRequired: e.target.checked }))}
                    className="rounded bg-dark-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/40"
                  />
                  <span>Required field</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Field Label</label>
                  <input
                    type="text"
                    value={formConfig.subjectLabel}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, subjectLabel: e.target.value }))}
                    placeholder="Subject"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Placeholder Text</label>
                  <input
                    type="text"
                    value={formConfig.subjectPlaceholder}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, subjectPlaceholder: e.target.value }))}
                    placeholder="Summer 2026 Opportunity / Inquiries"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Field 4: Message */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Field 4: Message</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
                  <input
                    type="checkbox"
                    checked={formConfig.messageRequired}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, messageRequired: e.target.checked }))}
                    className="rounded bg-dark-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/40"
                  />
                  <span>Required field</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Field Label</label>
                  <input
                    type="text"
                    value={formConfig.messageLabel}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, messageLabel: e.target.value }))}
                    placeholder="Message"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Placeholder Text</label>
                  <input
                    type="text"
                    value={formConfig.messagePlaceholder}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, messagePlaceholder: e.target.value }))}
                    placeholder="Hi Nuwan, I came across your portfolio..."
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button Text & Feedback Messages */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Action & Feedback Messages</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Submit Button Text</label>
                <input
                  type="text"
                  value={formConfig.buttonText}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Send Message"
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Submitting State Text</label>
                <input
                  type="text"
                  value={formConfig.submittingText}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, submittingText: e.target.value }))}
                  placeholder="Sending..."
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Success Message</label>
                <textarea
                  rows={2}
                  value={formConfig.successMessage}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, successMessage: e.target.value }))}
                  placeholder="Thank you! Your message has been received. I'll get back to you shortly."
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white disabled:opacity-50 text-[#2D3748] font-semibold text-xs sm:text-sm shadow-subtle flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Form Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CONTACT DISPLAY SETTINGS                            */}
      {/* ========================================================= */}
      {activeTab === 'visibility' && (
        <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Contact Display Visibility Controls</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle specific components on or off. The public layout automatically balances and expands.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnableAllDisplay}
                className="px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-750 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={handleDisableAllDisplay}
                className="px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-750 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Disable All
              </button>
            </div>
          </div>

          {/* Visibility Toggles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Email Address */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Direct Email</h4>
                  <p className="text-[11px] text-slate-400">Show email card and copy button</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={displaySettings.showEmail}
                  onChange={() => handleToggleDisplay('showEmail')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* 2. Phone Number */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Phone Number</h4>
                  <p className="text-[11px] text-slate-400">Show phone card and tel: trigger</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={displaySettings.showPhone}
                  onChange={() => handleToggleDisplay('showPhone')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* 3. Location */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Location Details</h4>
                  <p className="text-[11px] text-slate-400">Show geographic location pill</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={displaySettings.showLocation}
                  onChange={() => handleToggleDisplay('showLocation')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* 4. Social Links */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Social & Profiles</h4>
                  <p className="text-[11px] text-slate-400">Show GitHub, LinkedIn, and profiles</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={displaySettings.showSocialLinks}
                  onChange={() => handleToggleDisplay('showSocialLinks')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* 5. Availability Status */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Availability Banner</h4>
                  <p className="text-[11px] text-slate-400">Show internship/job availability</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={displaySettings.showAvailability}
                  onChange={() => handleToggleDisplay('showAvailability')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* 6. Contact Form */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Interactive Contact Form</h4>
                  <p className="text-[11px] text-slate-400">Show full message submission form</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={displaySettings.showContactForm}
                  onChange={() => handleToggleDisplay('showContactForm')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleSaveDisplaySettings}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white disabled:opacity-50 text-[#2D3748] font-semibold text-xs sm:text-sm shadow-subtle flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Display Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: CONTACT DELIVERY & GMAIL SETTINGS                  */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          
          {/* Health & Status Card */}
          <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Email Delivery System Status</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live health indicator of the backend serverless email dispatch service.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchDeliveryStatus}
                disabled={deliveryStatus.loading}
                className="px-3.5 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Clock className={`w-3.5 h-3.5 ${deliveryStatus.loading ? 'animate-spin' : ''}`} />
                <span>{deliveryStatus.loading ? 'Checking...' : 'Refresh Status'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">HEALTH STATUS</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${deliveryStatus.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span className="text-sm font-semibold text-white">
                    {deliveryStatus.configured ? 'Operational' : 'Configured / Ready'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">ACTIVE PROVIDER</span>
                <span className="text-sm font-semibold text-emerald-400 font-mono">
                  {deliveryStatus.provider === 'gmail_smtp' ? 'Gmail SMTP (Nodemailer)' : 'Gmail SMTP Pipeline'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">RECEIVING INBOX</span>
                <span className="text-sm font-semibold text-white truncate block" title={deliverySettings.receivingEmail}>
                  {deliverySettings.receivingEmail || 'nuwandevinda2002@gmail.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveDeliverySettings} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Contact Routing & Button Settings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure where visitor submissions are delivered and how the contact button behaves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Receiving Email */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Receiving Email Address</span>
                </label>
                <input
                  type="email"
                  value={deliverySettings.receivingEmail}
                  onChange={(e) => setDeliverySettings(prev => ({ ...prev, receivingEmail: e.target.value }))}
                  placeholder="nuwandevinda2002@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  All visitor inquiries from the website form will be delivered to this Gmail address.
                </span>
              </div>

              {/* Delivery Platform */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact Delivery Platform</span>
                </label>
                <select
                  value={deliverySettings.platform}
                  onChange={(e) => setDeliverySettings(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="email">Email (Gmail SMTP via Nodemailer) — Recommended</option>
                  <option value="whatsapp">WhatsApp Business Direct Link</option>
                  <option value="telegram">Telegram Direct Messenger</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Select primary routing platform for incoming visitor communications.
                </span>
              </div>

              {/* Send Button Text */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Send Button Label</span>
                </label>
                <input
                  type="text"
                  value={deliverySettings.sendButtonText}
                  onChange={(e) => setDeliverySettings(prev => ({ ...prev, sendButtonText: e.target.value }))}
                  placeholder="Send Message"
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Default label displayed on the public contact form submit button.
                </span>
              </div>

              {/* Form Enable Toggle */}
              <div className="flex flex-col justify-center">
                <label className="text-xs font-mono text-slate-300 block mb-1.5">
                  Form Status
                </label>
                <div className="p-2.5 rounded-xl bg-dark-850 border border-slate-750 flex items-center justify-between">
                  <span className="text-xs text-white font-medium">
                    {deliverySettings.isFormEnabled ? 'Contact Form Enabled' : 'Contact Form Disabled'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliverySettings.isFormEnabled}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, isFormEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Contact Settings'}</span>
              </button>
            </div>
          </form>

          {/* Send Test Email Section */}
          <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Send Test Email</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Send an authenticated test dispatch to verify that your Gmail SMTP configuration is functioning properly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="nuwandevinda2002@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testEmailSending}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-all disabled:opacity-50 shadow-sm"
              >
                {testEmailSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Sending Test...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Gmail App Password Setup Guide</span>
            </h3>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed font-sans">
              <li>Open your Google Account at <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">myaccount.google.com/security</a>.</li>
              <li>Ensure <strong>2-Step Verification</strong> is enabled on your account.</li>
              <li>Under 2-Step Verification, navigate to <strong>App Passwords</strong>.</li>
              <li>Enter an app name like <code className="px-1.5 py-0.5 rounded bg-dark-850 font-mono text-emerald-300">Portfolio Website</code> and click <strong>Create</strong>.</li>
              <li>Copy the generated 16-character password into your <code className="px-1.5 py-0.5 rounded bg-dark-850 font-mono text-emerald-300">.env</code> file:
                <pre className="mt-2 p-3 rounded-lg bg-dark-850 text-emerald-300 font-mono text-[11px] overflow-x-auto">
GMAIL_USER={deliverySettings.receivingEmail || 'nuwandevinda2002@gmail.com'}
GMAIL_APP_PASSWORD=your_16_char_password
CONTACT_RECEIVING_EMAIL={deliverySettings.receivingEmail || 'nuwandevinda2002@gmail.com'}
                </pre>
              </li>
            </ol>
          </div>

        </div>
      )}


      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT SOCIAL LINK                              */}
      {/* ========================================================= */}
      {socialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>{editingSocialIdx !== null ? 'Edit Social Link' : 'Add New Social Link'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSocialModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSocialModal} className="p-5 space-y-4">
              
              {/* Platform Selection */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Platform Preset</label>
                <select
                  value={socialFormData.platform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {platformPresets.map(preset => (
                    <option key={preset.name} value={preset.name}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Label */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Display Label</label>
                <input
                  type="text"
                  value={socialFormData.label}
                  onChange={(e) => setSocialFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. GitHub, LinkedIn, Security Blog..."
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* URL */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">
                  {socialFormData.platform === 'Gmail' ? 'Gmail Compose URL or Email' : 'Platform URL'}{' '}
                  <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={socialFormData.url}
                  onChange={(e) => setSocialFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder={
                    socialFormData.platform === 'Gmail'
                      ? "https://mail.google.com/mail/?view=cm&fs=1&to=yourname@gmail.com"
                      : "https://..."
                  }
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                {socialFormData.platform === 'Gmail' && (
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Supports Gmail Compose URLs (<span className="text-emerald-400 font-mono text-[10px]">https://mail.google.com/mail/?view=cm&fs=1&to=...</span>) or <span className="text-emerald-400 font-mono text-[10px]">mailto:</span> links.
                  </p>
                )}
              </div>

              {/* Username / Handle */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Username / Handle (Optional)</label>
                <input
                  type="text"
                  value={socialFormData.username}
                  onChange={(e) => setSocialFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="@nuwanp-sec"
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Icon Type Selection */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Platform Icon</label>
                <select
                  value={socialFormData.icon}
                  onChange={(e) => setSocialFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Github">GitHub</option>
                  <option value="Linkedin">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">X / Twitter</option>
                  <option value="Terminal">Terminal / LeetCode / Hack</option>
                  <option value="Globe">Website / Globe</option>
                  <option value="Mail">Email / Mail</option>
                </select>
              </div>

              {/* Visibility Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
                  <input
                    type="checkbox"
                    checked={socialFormData.visible}
                    onChange={(e) => setSocialFormData(prev => ({ ...prev, visible: e.target.checked }))}
                    className="rounded bg-dark-850 border-slate-700 text-emerald-500 focus:ring-emerald-500/40"
                  />
                  <span>Show on public Contact section</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSocialModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold text-xs shadow-subtle shadow-subtle transition-all"
                >
                  {editingSocialIdx !== null ? 'Apply Changes' : 'Add Link'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION                                 */}
      {/* ========================================================= */}
      {deleteConfirmIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Social Link?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete <span className="text-white font-bold">{socialLinks[deleteConfirmIdx]?.label || socialLinks[deleteConfirmIdx]?.platform}</span>? This action cannot be undone once saved.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmIdx(null)}
                className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSocial(deleteConfirmIdx)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
              >
                Delete Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

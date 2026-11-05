import React, { useState, useEffect } from 'react';
import { 
  PanelBottom, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Sliders, 
  Type, 
  Palette, 
  Layout, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  X, 
  Check, 
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  Shield
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import Footer from '../../components/Footer';

export default function AdminFooterPage() {
  const { portfolio, saveFooter, resetFooterToDefault } = usePortfolio();
  const currentFooter = portfolio?.footer || {};
  const personal = portfolio?.personal || {};

  // Tabs: 'copyright' | 'appearance' | 'optional' | 'layout'
  const [activeTab, setActiveTab] = useState('copyright');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Auto-dismiss feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Form State initialized from portfolio.footer
  const [footerForm, setFooterForm] = useState({
    // Layout & Core
    layout: 'minimal',
    alignment: 'center',

    // Copyright Settings
    showCopyright: true,
    ownerName: 'Nuwan Pinnaduwage',
    autoYear: true,
    startYear: '2026',
    rightsText: 'All rights reserved.',
    prefixText: '©',

    // Appearance Settings
    bgColor: '#050706',
    textColor: '#94a3b8',
    highlightColor: '#22c55e',
    fontSize: 'sm',
    paddingY: 'normal',
    spacing: 'normal',
    showBorderTop: false,

    // Optional Content Elements
    showTagline: false,
    tagline: 'Designed & engineered with a security-first mindset, modern React, and Tailwind CSS.',

    showProfessionalTitle: false,
    professionalTitle: 'Cybersecurity, Networking & AI Specialist',

    showEmail: false,
    email: 'nuwan.pinnaduwage@example.com',

    showLocation: false,
    location: 'San Francisco, CA',

    showGithub: false,
    githubUrl: 'https://github.com',

    showLinkedin: false,
    linkedinUrl: 'https://linkedin.com',

    showNavLinks: false,
    navLinks: [
      { id: 'nav-about', name: 'About', href: '#about' },
      { id: 'nav-skills', name: 'Skills', href: '#skills' },
      { id: 'nav-projects', name: 'Projects', href: '#projects' },
      { id: 'nav-experience', name: 'Experience', href: '#experience' },
      { id: 'nav-education', name: 'Education', href: '#education' },
      { id: 'nav-contact', name: 'Contact', href: '#contact' },
    ],

    showPrivacyPolicy: false,
    privacyText: 'Privacy Policy',
    privacyUrl: '#privacy',

    showTerms: false,
    termsText: 'Terms & Conditions',
    termsUrl: '#terms',

    showBackToTop: false,
    backToTopText: 'Back to top',

    showCustomText: false,
    customText: 'Built with React & Tailwind CSS',
  });

  // Navigation Links mini-manager modal state
  const [navModalOpen, setNavModalOpen] = useState(false);
  const [editingNavIdx, setEditingNavIdx] = useState(null);
  const [navLinkItem, setNavLinkItem] = useState({ name: '', href: '' });

  // Sync state with portfolio data
  useEffect(() => {
    if (portfolio?.footer) {
      setFooterForm(prev => ({
        ...prev,
        ...portfolio.footer,
        ownerName: portfolio.footer.ownerName || personal.name || 'Nuwan Pinnaduwage',
        email: portfolio.footer.email || personal.email || 'nuwan.pinnaduwage@example.com',
        location: portfolio.footer.location || personal.location || 'San Francisco, CA',
        navLinks: portfolio.footer.navLinks || prev.navLinks,
      }));
    }
  }, [portfolio?.footer, personal]);

  // Handle Save
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      ...footerForm,
      copyrightNotice: `${footerForm.prefixText || '©'} ${new Date().getFullYear()} ${footerForm.ownerName}. ${footerForm.rightsText}`,
    };

    const res = await saveFooter(payload);
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save footer settings.' });
    } else {
      setFeedback({ type: 'success', message: 'Footer customized and published successfully!' });
    }
  };

  // Handle Reset to Default (Minimalist Reference)
  const handleResetToDefault = async () => {
    setSaving(true);
    const res = await resetFooterToDefault();
    setSaving(false);
    setResetModalOpen(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to reset footer settings.' });
    } else {
      setFooterForm({
        layout: 'minimal',
        alignment: 'center',
        showCopyright: true,
        ownerName: 'Nuwan Pinnaduwage',
        autoYear: true,
        startYear: '2026',
        rightsText: 'All rights reserved.',
        prefixText: '©',
        bgColor: '#050706',
        textColor: '#94a3b8',
        highlightColor: '#22c55e',
        fontSize: 'sm',
        paddingY: 'normal',
        spacing: 'normal',
        showBorderTop: false,
        showTagline: false,
        tagline: 'Designed & engineered with a security-first mindset, modern React, and Tailwind CSS.',
        showProfessionalTitle: false,
        professionalTitle: 'Cybersecurity, Networking & AI Specialist',
        showEmail: false,
        email: 'nuwan.pinnaduwage@example.com',
        showLocation: false,
        location: 'San Francisco, CA',
        showGithub: false,
        githubUrl: 'https://github.com',
        showLinkedin: false,
        linkedinUrl: 'https://linkedin.com',
        showNavLinks: false,
        navLinks: [
          { id: 'nav-about', name: 'About', href: '#about' },
          { id: 'nav-skills', name: 'Skills', href: '#skills' },
          { id: 'nav-projects', name: 'Projects', href: '#projects' },
          { id: 'nav-experience', name: 'Experience', href: '#experience' },
          { id: 'nav-education', name: 'Education', href: '#education' },
          { id: 'nav-contact', name: 'Contact', href: '#contact' },
        ],
        showPrivacyPolicy: false,
        privacyText: 'Privacy Policy',
        privacyUrl: '#privacy',
        showTerms: false,
        termsText: 'Terms & Conditions',
        termsUrl: '#terms',
        showBackToTop: false,
        backToTopText: 'Back to top',
        showCustomText: false,
        customText: 'Built with React & Tailwind CSS',
      });
      setFeedback({ type: 'success', message: 'Footer reset to default minimalist appearance!' });
    }
  };

  // Preset Presets
  const bgPresets = [
    { label: 'Deep Dark', value: '#050706' },
    { label: 'Pure Black', value: '#000000' },
    { label: 'Studio Dark', value: '#07090e' },
    { label: 'Dark Slate', value: '#0f172a' },
    { label: 'Dark Zinc', value: '#18181b' },
  ];

  const textPresets = [
    { label: 'Subtle Grey', value: '#94a3b8' },
    { label: 'Muted Slate', value: '#64748b' },
    { label: 'Zinc', value: '#71717a' },
    { label: 'Light Slate', value: '#cbd5e1' },
    { label: 'Pure White', value: '#ffffff' },
  ];

  const highlightPresets = [
    { label: 'Neon Emerald', value: '#22c55e' },
    { label: 'Mint', value: '#10b981' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Violet', value: '#8b5cf6' },
    { label: 'Amber', value: '#f59e0b' },
  ];

  // Nav link helpers
  const openAddNavModal = () => {
    setEditingNavIdx(null);
    setNavLinkItem({ name: '', href: '#' });
    setNavModalOpen(true);
  };

  const openEditNavModal = (link, idx) => {
    setEditingNavIdx(idx);
    setNavLinkItem({ name: link.name, href: link.href });
    setNavModalOpen(true);
  };

  const handleSaveNavLink = (e) => {
    e.preventDefault();
    if (!navLinkItem.name.trim() || !navLinkItem.href.trim()) return;

    const updated = [...(footerForm.navLinks || [])];
    if (editingNavIdx !== null) {
      updated[editingNavIdx] = { ...updated[editingNavIdx], ...navLinkItem };
    } else {
      updated.push({ id: `nav-${Date.now()}`, ...navLinkItem });
    }

    setFooterForm(prev => ({ ...prev, navLinks: updated }));
    setNavModalOpen(false);
  };

  const handleDeleteNavLink = (idx) => {
    const updated = footerForm.navLinks.filter((_, i) => i !== idx);
    setFooterForm(prev => ({ ...prev, navLinks: updated }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Page Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <PanelBottom className="w-6 h-6" />
            </span>
            <span>Footer Customization</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Recreate and manage the minimalist single-line copyright statement, highlight your name in neon emerald (<code className="text-emerald-400 font-mono">#22c55e</code>), and configure optional elements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-750 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs shadow-glow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Alert */}
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
          <button onClick={() => setFeedback(null)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* LIVE FOOTER PREVIEW                                        */}
      {/* ========================================================= */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-dark-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Live Footer Preview</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {footerForm.layout === 'minimal' ? 'Minimalist Mode' : 'Expanded Mode'} • {footerForm.alignment}
          </span>
        </div>

        {/* Live Rendering Component */}
        <div className="border border-slate-850 rounded-b-2xl overflow-hidden">
          <Footer
            data={footerForm}
            personalData={{
              name: footerForm.ownerName,
              email: footerForm.email,
              location: footerForm.location,
              socialLinks: [
                { platform: 'GitHub', url: footerForm.githubUrl },
                { platform: 'LinkedIn', url: footerForm.linkedinUrl }
              ]
            }}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('copyright')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'copyright'
              ? 'bg-emerald-500 text-dark-950 font-bold shadow-glow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Copyright Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'appearance'
              ? 'bg-emerald-500 text-dark-950 font-bold shadow-glow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance & Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('optional')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'optional'
              ? 'bg-emerald-500 text-dark-950 font-bold shadow-glow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Optional Content</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'layout'
              ? 'bg-emerald-500 text-dark-950 font-bold shadow-glow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Layout & Alignment</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB A: COPYRIGHT SETTINGS                                  */}
      {/* ========================================================= */}
      {activeTab === 'copyright' && (
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-400" />
              <span>Copyright Statement Configuration</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Control the single-line copyright statement, owner name, rights notice, and dynamic automatic year calculation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Enable/Disable Copyright */}
            <div className="sm:col-span-2 p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Enable Copyright Statement</h4>
                <p className="text-[11px] text-slate-400">Display the primary copyright notice in the footer.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={footerForm.showCopyright}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, showCopyright: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Displayed Owner Name */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">
                Displayed Owner Name <span className="text-emerald-400 font-semibold">(Highlighted in Emerald)</span>
              </label>
              <input
                type="text"
                value={footerForm.ownerName}
                onChange={(e) => setFooterForm(prev => ({ ...prev, ownerName: e.target.value }))}
                placeholder="Nuwan Pinnaduwage"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Default: Nuwan Pinnaduwage</span>
            </div>

            {/* Rights Reserved Text */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">Rights Reserved Notice</label>
              <input
                type="text"
                value={footerForm.rightsText}
                onChange={(e) => setFooterForm(prev => ({ ...prev, rightsText: e.target.value }))}
                placeholder="All rights reserved."
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Default: All rights reserved.</span>
            </div>

            {/* Prefix Symbol */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">Copyright Prefix</label>
              <input
                type="text"
                value={footerForm.prefixText}
                onChange={(e) => setFooterForm(prev => ({ ...prev, prefixText: e.target.value }))}
                placeholder="©"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Starting Year */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">Custom Starting Year</label>
              <input
                type="text"
                value={footerForm.startYear}
                onChange={(e) => setFooterForm(prev => ({ ...prev, startYear: e.target.value }))}
                placeholder="2026"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Auto Year Toggle */}
            <div className="sm:col-span-2 p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Automatic Current Year Updates</h4>
                <p className="text-[11px] text-slate-400">
                  Automatically calculates <code className="text-emerald-400 font-mono">{new Date().getFullYear()}</code> so you never need to manually update the copyright year.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={footerForm.autoYear}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, autoYear: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB B: APPEARANCE & COLORS                                 */}
      {/* ========================================================= */}
      {activeTab === 'appearance' && (
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              <span>Appearance, Typography & Visual Themes</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize colors, font sizes, vertical padding, and borders to maintain the pure minimalist aesthetic.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Highlight Color */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono text-slate-300 block font-bold">
                Highlighted Name Accent Color (Default: Neon Emerald <span className="text-emerald-400">#22c55e</span>)
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {highlightPresets.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFooterForm(prev => ({ ...prev, highlightColor: preset.value }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
                      footerForm.highlightColor.toLowerCase() === preset.value.toLowerCase()
                        ? 'border-white text-white shadow-sm'
                        : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.value }} />
                    <span>{preset.label}</span>
                  </button>
                ))}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[11px] font-mono text-slate-400">Custom:</span>
                  <input
                    type="color"
                    value={footerForm.highlightColor}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, highlightColor: e.target.value }))}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={footerForm.highlightColor}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, highlightColor: e.target.value }))}
                    className="w-24 px-2 py-1 bg-dark-850 border border-slate-750 rounded text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <label className="text-xs font-mono text-slate-300 block font-bold">
                Footer Background Color (Default: Pure Black / Deep Dark)
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {bgPresets.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFooterForm(prev => ({ ...prev, bgColor: preset.value }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
                      footerForm.bgColor.toLowerCase() === preset.value.toLowerCase()
                        ? 'border-emerald-500 text-white bg-dark-850 shadow-glow-sm'
                        : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: preset.value }} />
                    <span>{preset.label}</span>
                  </button>
                ))}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[11px] font-mono text-slate-400">Custom:</span>
                  <input
                    type="color"
                    value={footerForm.bgColor}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={footerForm.bgColor}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="w-24 px-2 py-1 bg-dark-850 border border-slate-750 rounded text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Text Color */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <label className="text-xs font-mono text-slate-300 block font-bold">
                Secondary Text Color (Subtle Grey)
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {textPresets.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFooterForm(prev => ({ ...prev, textColor: preset.value }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
                      footerForm.textColor.toLowerCase() === preset.value.toLowerCase()
                        ? 'border-emerald-500 text-white bg-dark-850 shadow-glow-sm'
                        : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.value }} />
                    <span>{preset.label}</span>
                  </button>
                ))}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[11px] font-mono text-slate-400">Custom:</span>
                  <input
                    type="color"
                    value={footerForm.textColor}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={footerForm.textColor}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-24 px-2 py-1 bg-dark-850 border border-slate-750 rounded text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            {/* Typography & Spacing Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              
              {/* Font Size */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Font Size</label>
                <select
                  value={footerForm.fontSize}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, fontSize: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
                >
                  <option value="xs">Compact (11px / 12px)</option>
                  <option value="sm">Standard (12px / 14px) - Default</option>
                  <option value="base">Large (14px / 16px)</option>
                </select>
              </div>

              {/* Vertical Padding */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Vertical Padding</label>
                <select
                  value={footerForm.paddingY}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, paddingY: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
                >
                  <option value="compact">Compact (py-4)</option>
                  <option value="normal">Normal (py-6 / py-8) - Default</option>
                  <option value="spacious">Spacious (py-10 / py-12)</option>
                </select>
              </div>

              {/* Top Border Divider */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">Top Border</label>
                <select
                  value={footerForm.showBorderTop ? 'true' : 'false'}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, showBorderTop: e.target.value === 'true' }))}
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
                >
                  <option value="false">None (Clean Minimalist - Default)</option>
                  <option value="true">Subtle Top Divider Line</option>
                </select>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB C: OPTIONAL CONTENT MANAGEMENT                         */}
      {/* ========================================================= */}
      {activeTab === 'optional' && (
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Optional Footer Details</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enable or disable secondary elements. All options remain hidden by default to keep the footer minimal and uncluttered.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* 1. Short Tagline */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Short Tagline</h4>
                  <p className="text-[11px] text-slate-400">Personal technical statement or motto.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerForm.showTagline}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, showTagline: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              {footerForm.showTagline && (
                <input
                  type="text"
                  value={footerForm.tagline}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Designed & engineered with a security-first mindset..."
                  className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                />
              )}
            </div>

            {/* 2. Professional Title */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Professional Title</h4>
                  <p className="text-[11px] text-slate-400">Headline title (e.g. Cybersecurity & AI Specialist).</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerForm.showProfessionalTitle}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, showProfessionalTitle: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              {footerForm.showProfessionalTitle && (
                <input
                  type="text"
                  value={footerForm.professionalTitle}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, professionalTitle: e.target.value }))}
                  placeholder="Cybersecurity, Networking & AI Specialist"
                  className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                />
              )}
            </div>

            {/* 3. Email & Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Direct Email</h4>
                    <p className="text-[10px] text-slate-400">Displays email address in footer.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showEmail}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showEmail: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                {footerForm.showEmail && (
                  <input
                    type="email"
                    value={footerForm.email}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="nuwan.pinnaduwage@example.com"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                )}
              </div>

              {/* Location */}
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Location</h4>
                    <p className="text-[10px] text-slate-400">Displays geographic city/state.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showLocation}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showLocation: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                {footerForm.showLocation && (
                  <input
                    type="text"
                    value={footerForm.location}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                )}
              </div>
            </div>

            {/* 4. Social Links (GitHub & LinkedIn) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GitHub */}
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">GitHub Profile Link</h4>
                    <p className="text-[10px] text-slate-400">Direct link to GitHub repository/profile.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showGithub}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showGithub: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                {footerForm.showGithub && (
                  <input
                    type="url"
                    value={footerForm.githubUrl}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                )}
              </div>

              {/* LinkedIn */}
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">LinkedIn Profile Link</h4>
                    <p className="text-[10px] text-slate-400">Direct link to LinkedIn network.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showLinkedin}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showLinkedin: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                {footerForm.showLinkedin && (
                  <input
                    type="url"
                    value={footerForm.linkedinUrl}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                  />
                )}
              </div>
            </div>

            {/* 5. Navigation Links List */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Portfolio Navigation Links</h4>
                  <p className="text-[11px] text-slate-400">Display quick anchor links to sections.</p>
                </div>
                <div className="flex items-center gap-3">
                  {footerForm.showNavLinks && (
                    <button
                      type="button"
                      onClick={openAddNavModal}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                    >
                      + Add Link
                    </button>
                  )}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showNavLinks}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showNavLinks: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {footerForm.showNavLinks && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {(footerForm.navLinks || []).map((link, idx) => (
                    <div key={link.id || idx} className="flex items-center justify-between p-2.5 rounded-lg bg-dark-900 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{link.name}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{link.href}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditNavModal(link, idx)}
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNavLink(idx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Legal Links (Privacy Policy & Terms) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Privacy Policy */}
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Privacy Policy Link</h4>
                    <p className="text-[10px] text-slate-400">Legal privacy notice link.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showPrivacyPolicy}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showPrivacyPolicy: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                {footerForm.showPrivacyPolicy && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={footerForm.privacyText}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, privacyText: e.target.value }))}
                      placeholder="Privacy Policy"
                      className="w-full px-3 py-1.5 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={footerForm.privacyUrl}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, privacyUrl: e.target.value }))}
                      placeholder="#privacy"
                      className="w-full px-3 py-1.5 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Terms & Conditions Link</h4>
                    <p className="text-[10px] text-slate-400">Legal terms notice link.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showTerms}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showTerms: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                {footerForm.showTerms && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={footerForm.termsText}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, termsText: e.target.value }))}
                      placeholder="Terms & Conditions"
                      className="w-full px-3 py-1.5 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={footerForm.termsUrl}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, termsUrl: e.target.value }))}
                      placeholder="#terms"
                      className="w-full px-3 py-1.5 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 7. Back to Top Button */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Back to Top Button</h4>
                  <p className="text-[11px] text-slate-400">Smooth scroll trigger back to hero section.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerForm.showBackToTop}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, showBackToTop: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              {footerForm.showBackToTop && (
                <input
                  type="text"
                  value={footerForm.backToTopText}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, backToTopText: e.target.value }))}
                  placeholder="Back to top"
                  className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                />
              )}
            </div>

            {/* 8. Custom Extra Text */}
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Additional Custom Text</h4>
                  <p className="text-[11px] text-slate-400">Arbitrary text or status message.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerForm.showCustomText}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, showCustomText: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              {footerForm.showCustomText && (
                <input
                  type="text"
                  value={footerForm.customText}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, customText: e.target.value }))}
                  placeholder="Built with React & Tailwind CSS"
                  className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-lg text-xs text-white"
                />
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB D: LAYOUT & ALIGNMENT                                  */}
      {/* ========================================================= */}
      {activeTab === 'layout' && (
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-emerald-400" />
              <span>Footer Layout Architecture</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select between the pristine minimalist single-line reference layout or an expanded multi-column layout.
            </p>
          </div>

          {/* Layout Mode Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Minimal Mode Card */}
            <div
              onClick={() => setFooterForm(prev => ({ ...prev, layout: 'minimal' }))}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                footerForm.layout === 'minimal'
                  ? 'bg-emerald-950/20 border-emerald-500 shadow-glow-sm'
                  : 'bg-dark-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Minimal Footer (Default)</span>
                  {footerForm.layout === 'minimal' && <Check className="w-4 h-4 text-emerald-400" />}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Closely matches the uploaded reference image: a clean, pure black or dark background with a single-line centered copyright notice and your name in neon emerald.
              </p>
              <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-center font-sans text-xs">
                <span className="text-slate-400">© 2026 </span>
                <span className="text-emerald-400 font-semibold">Nuwan Pinnaduwage</span>
                <span className="text-slate-400">. All rights reserved.</span>
              </div>
            </div>

            {/* Expanded Mode Card */}
            <div
              onClick={() => setFooterForm(prev => ({ ...prev, layout: 'expanded' }))}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                footerForm.layout === 'expanded'
                  ? 'bg-emerald-950/20 border-emerald-500 shadow-glow-sm'
                  : 'bg-dark-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Expanded Multi-tier Footer</span>
                  {footerForm.layout === 'expanded' && <Check className="w-4 h-4 text-emerald-400" />}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Structured layout displaying top branding, navigation links, direct coordinates, social media badges, and copyright statement in tiered rows.
              </p>
              <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                  <span className="font-bold text-white">Nuwan Pinnaduwage.sec</span>
                  <span>About • Projects • Contact</span>
                </div>
                <div className="text-[10px] text-slate-400 text-center">
                  © 2026 <span className="text-emerald-400 font-semibold">Nuwan Pinnaduwage</span>. All rights reserved.
                </div>
              </div>
            </div>

          </div>

          {/* Alignment Selection (for Minimal layout) */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <label className="text-xs font-mono text-slate-300 block font-bold">
              Content Alignment
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'center', label: 'Centered (Default)', desc: 'Center-aligned copyright statement.' },
                { id: 'left', label: 'Left-aligned', desc: 'Flush to the left boundary.' },
                { id: 'between', label: 'Space-between', desc: 'Separated on left and right.' },
              ].map(align => (
                <button
                  key={align.id}
                  type="button"
                  onClick={() => setFooterForm(prev => ({ ...prev, alignment: align.id }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    footerForm.alignment === align.id
                      ? 'bg-emerald-950/20 border-emerald-500 text-white shadow-glow-sm'
                      : 'bg-dark-850 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{align.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{align.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT NAVIGATION LINK                         */}
      {/* ========================================================= */}
      {navModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-400" />
                <span>{editingNavIdx !== null ? 'Edit Link' : 'Add Navigation Link'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setNavModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNavLink} className="p-4 space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Display Label</label>
                <input
                  type="text"
                  required
                  value={navLinkItem.name}
                  onChange={(e) => setNavLinkItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Research, Projects, About"
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Target URL / Section Anchor</label>
                <input
                  type="text"
                  required
                  value={navLinkItem.href}
                  onChange={(e) => setNavLinkItem(prev => ({ ...prev, href: e.target.value }))}
                  placeholder="e.g. #projects or https://..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-lg text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNavModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-dark-850 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RESET CONFIRMATION                                  */}
      {/* ========================================================= */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">Reset Footer to Default?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                This will restore the footer to the clean, minimalist reference design with <span className="text-emerald-400 font-bold">Nuwan Pinnaduwage</span> highlighted in neon emerald and all optional items disabled.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs transition-colors shadow-glow-sm"
              >
                Reset Footer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

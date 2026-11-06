import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  User, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Upload, 
  Share2, 
  FileText, 
  Sparkles, 
  Shield, 
  Network, 
  Cpu, 
  Terminal,
  ExternalLink,
  Edit,
  GraduationCap,
  MapPin,
  Mail,
  FileDown
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AdminAboutPage() {
  const { 
    portfolio, 
    updateProfile, 
    updateAboutIntroduction, 
    updateProfilePhoto, 
    saveSiteSettings,
    uploadAsset 
  } = usePortfolio();

  const { personal = {}, about = {} } = portfolio;

  // Tabs: 'profile' | 'bio' | 'social' | 'resume'
  const [activeTab, setActiveTab] = useState('profile');
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  // Auto-dismiss feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Form State: Personal Profile
  const [profileForm, setProfileForm] = useState({
    name: '',
    preferredName: '',
    role: '',
    degree: '',
    specialization: '',
    university: '',
    expectedGraduation: '',
    location: '',
    email: '',
    bioShort: '',
    statusAvailable: true,
    statusText: '',
  });

  // Form State: About Story & Bio
  const [bioForm, setBioForm] = useState({
    whoIAmHeading: 'Who I Am',
    title: 'About Me',
    subtitle: '',
    paragraphs: '',
    professionalSummary: '',
  });

  // Form State: Highlights
  const [highlights, setHighlights] = useState([]);
  const [newHighlight, setNewHighlight] = useState({ title: '', description: '', icon: 'Shield' });

  // Form State: Social Links
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '', username: '' });

  // Form State: Resume / CV
  const [resumeForm, setResumeForm] = useState({
    cvUrl: '',
    resumeFileName: 'Nuwan_Pinnaduwage_Technical_Resume.pdf',
    avatarUrl: ''
  });

  // Load from portfolio state
  useEffect(() => {
    if (personal) {
      setProfileForm({
        name: personal.name || '',
        preferredName: personal.preferredName || '',
        role: personal.role || '',
        degree: personal.degree || 'Bachelor of Science in Computer Science',
        specialization: personal.specialization || '',
        university: personal.university || '',
        expectedGraduation: personal.expectedGraduation || '',
        location: personal.location || '',
        email: personal.email || '',
        bioShort: personal.bioShort || '',
        statusAvailable: personal.statusBadge?.available ?? true,
        statusText: personal.statusBadge?.text || '',
      });

      setSocialLinks(personal.socialLinks || []);
      setResumeForm({
        cvUrl: personal.cvUrl || '',
        resumeFileName: personal.resumeFileName || 'Nuwan_Pinnaduwage_Technical_Resume.pdf',
        avatarUrl: personal.avatarUrl || ''
      });
    }

    if (about) {
      setBioForm({
        whoIAmHeading: about.whoIAmHeading || 'Who I Am',
        title: about.title || 'About Me',
        subtitle: about.subtitle || '',
        paragraphs: Array.isArray(about.paragraphs) ? about.paragraphs.join('\n\n') : (about.paragraphs || ''),
        professionalSummary: about.professionalSummary || '',
      });

      setHighlights(about.highlights || []);
    }
  }, [personal, about]);

  // Save Personal Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({
      name: profileForm.name,
      preferred_name: profileForm.preferredName,
      role: profileForm.role,
      degree: profileForm.degree,
      specialization: profileForm.specialization,
      university: profileForm.university,
      expected_graduation: profileForm.expectedGraduation,
      location: profileForm.location,
      email: profileForm.email,
      bio_short: profileForm.bioShort,
      status_available: personal.statusBadge?.available ?? true,
      status_text: personal.statusBadge?.text || 'AVAILABLE FOR OPPORTUNITIES.',
    });
    setSaving(false);
    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to update personal profile.' });
    } else {
      setFeedback({ type: 'success', message: 'Personal profile details saved successfully!' });
    }
  };

  // Save About Story & Bio
  const handleSaveBio = async (e) => {
    e.preventDefault();
    setSaving(true);
    const paragraphsArray = bioForm.paragraphs
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean);

    const res = await updateAboutIntroduction({
      whoIAmHeading: bioForm.whoIAmHeading,
      title: bioForm.title,
      subtitle: bioForm.subtitle,
      paragraphs: paragraphsArray,
      professionalSummary: bioForm.professionalSummary,
      about_highlights: highlights
    });
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save biography.' });
    } else {
      setFeedback({ type: 'success', message: 'About biography and highlights updated successfully!' });
    }
  };

  // Add Highlight Card
  const handleAddHighlight = (e) => {
    e.preventDefault();
    if (!newHighlight.title.trim() || !newHighlight.description.trim()) return;
    setHighlights(prev => [...prev, { ...newHighlight }]);
    setNewHighlight({ title: '', description: '', icon: 'Shield' });
    setFeedback({ type: 'success', message: 'Highlight added. Remember to click "Save Bio" below.' });
  };

  const handleRemoveHighlight = (idx) => {
    setHighlights(prev => prev.filter((_, i) => i !== idx));
  };

  // Save Social Links
  const handleSaveSocialLinks = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({
      social_links: socialLinks
    });
    setSaving(false);
    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save social links.' });
    } else {
      setFeedback({ type: 'success', message: 'Social & professional links saved successfully!' });
    }
  };

  const handleAddSocialLink = (e) => {
    e.preventDefault();
    const trimmedUrl = (newSocial.url || '').trim();
    if (!newSocial.platform.trim() || !trimmedUrl) return;

    const lower = trimmedUrl.toLowerCase();
    if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:') || lower.startsWith('file:')) {
      setFeedback({ type: 'error', message: 'Unsafe link scheme detected. Please provide a valid web URL or email link.' });
      return;
    }

    let normalizedUrl = trimmedUrl;
    if (/^https?:\/\//i.test(trimmedUrl)) {
      try {
        const parsed = new URL(trimmedUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          setFeedback({ type: 'error', message: 'Please provide a valid web URL starting with https:// or http://' });
          return;
        }
      } catch {
        setFeedback({ type: 'error', message: 'Invalid URL format.' });
        return;
      }
    } else if (lower.startsWith('mailto:')) {
      const emailRecipient = trimmedUrl.slice(7).split('?')[0].trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRecipient)) {
        setFeedback({ type: 'error', message: 'Please enter a valid email address for mailto: link.' });
        return;
      }
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedUrl)) {
      normalizedUrl = `mailto:${trimmedUrl}`;
    }

    setSocialLinks(prev => [...prev, { ...newSocial, url: normalizedUrl }]);
    setNewSocial({ platform: '', url: '', username: '' });
  };

  const handleRemoveSocialLink = (idx) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== idx));
  };

  // Save Resume / CV
  const handleSaveResume = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({
      cv_url: resumeForm.cvUrl,
      cv_filename: resumeForm.resumeFileName,
      avatar_url: resumeForm.avatarUrl
    });
    setSaving(false);
    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save documents and photo.' });
    } else {
      setFeedback({ type: 'success', message: 'Resume document and photo updated successfully!' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[#2D3748] border border-[#4A5568] text-[#F5F7FA]">
            <UserCheck className="w-6 h-6" />
          </span>
          <span>Profile & About Me Hub</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Unified management of your personal identity, academic background, biography narrative, social links, and CV.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Basic Profile & Hero</span>
        </button>

        <button
          onClick={() => setActiveTab('bio')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'bio'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>About Story & Highlights</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'social'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social & Professional Links ({socialLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'resume'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <FileDown className="w-4 h-4" />
          <span>Resume & Avatar</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: BASIC PROFILE & HERO */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Identity & Academic Positioning</h2>
            <p className="text-xs text-slate-400 mt-0.5">Primary information displayed in the Hero banner and header.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Preferred / Display First Name</label>
              <input
                type="text"
                value={profileForm.preferredName}
                onChange={(e) => setProfileForm(p => ({ ...p, preferredName: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-slate-300 block mb-1">Technical Role / Headline *</label>
              <input
                type="text"
                required
                value={profileForm.role}
                onChange={(e) => setProfileForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Degree Program</label>
              <input
                type="text"
                value={profileForm.degree}
                onChange={(e) => setProfileForm(p => ({ ...p, degree: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Technical Specialization</label>
              <input
                type="text"
                value={profileForm.specialization}
                onChange={(e) => setProfileForm(p => ({ ...p, specialization: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">University / Academic Institution</label>
              <input
                type="text"
                value={profileForm.university}
                onChange={(e) => setProfileForm(p => ({ ...p, university: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Expected Graduation (e.g. May 2026)</label>
              <input
                type="text"
                value={profileForm.expectedGraduation}
                onChange={(e) => setProfileForm(p => ({ ...p, expectedGraduation: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Location</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm(p => ({ ...p, location: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Public Contact Email *</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-slate-300 block mb-1">Short Hero Tagline / Bio</label>
              <textarea
                rows={2}
                value={profileForm.bioShort}
                onChange={(e) => setProfileForm(p => ({ ...p, bioShort: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Hero Section Link */}
          <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-white block">Hero Availability Badge & Headlines</span>
              <span className="text-[11px] text-slate-400">Hero status badge, headline name, and background images are managed in Hero Section Management.</span>
            </div>
            <Link
              to="/admin/hero"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors shrink-0"
            >
              Open Hero Manager →
            </Link>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold text-xs shadow-subtle shadow-subtle"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ABOUT STORY & BIO */}
      {activeTab === 'bio' && (
        <form onSubmit={handleSaveBio} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Narrative Biography & Domain Highlights</h2>
            <p className="text-xs text-slate-400 mt-0.5">Content displayed in the public About Me section.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Section Heading</label>
                <input
                  type="text"
                  value={bioForm.whoIAmHeading}
                  onChange={(e) => setBioForm(b => ({ ...b, whoIAmHeading: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={bioForm.subtitle}
                  onChange={(e) => setBioForm(b => ({ ...b, subtitle: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Biography Narrative (Separate paragraphs with blank lines)
              </label>
              <textarea
                rows={6}
                value={bioForm.paragraphs}
                onChange={(e) => setBioForm(b => ({ ...b, paragraphs: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white font-sans leading-relaxed focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Highlights Cards */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Core Highlight Cards ({highlights.length})</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((h, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-dark-850 border border-slate-800 relative group">
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="absolute right-3 top-3 p-1 rounded text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <h4 className="font-bold text-white text-sm">{h.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{h.description}</p>
                </div>
              ))}
            </div>

            {/* Add Highlight mini form */}
            <div className="p-4 rounded-xl bg-dark-950 border border-dashed border-slate-800 space-y-3">
              <span className="text-xs font-mono text-slate-400 block font-bold">Add New Highlight Card</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newHighlight.title}
                  onChange={(e) => setNewHighlight(h => ({ ...h, title: e.target.value }))}
                  placeholder="Card Title (e.g. Systems & Security Automation)..."
                  className="w-full px-3 py-1.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
                />
                <select
                  value={newHighlight.icon}
                  onChange={(e) => setNewHighlight(h => ({ ...h, icon: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
                >
                  <option value="Shield">Icon: Shield (Security)</option>
                  <option value="Network">Icon: Network (Networking)</option>
                  <option value="Cpu">Icon: Cpu (AI/ML)</option>
                  <option value="Terminal">Icon: Terminal (Systems)</option>
                </select>
                <textarea
                  rows={2}
                  value={newHighlight.description}
                  onChange={(e) => setNewHighlight(h => ({ ...h, description: e.target.value }))}
                  placeholder="Card description..."
                  className="sm:col-span-2 w-full px-3 py-1.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Add Card
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold text-xs shadow-subtle shadow-subtle"
            >
              {saving ? 'Saving...' : 'Save Bio & Highlights'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SOCIAL & PROFESSIONAL LINKS */}
      {activeTab === 'social' && (
        <form onSubmit={handleSaveSocialLinks} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6 max-w-3xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Social & Professional Platforms</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configured links displayed in Hero, Footer, and Contact sections.</p>
          </div>

          <div className="space-y-3">
            {socialLinks.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-dark-850 border border-slate-800">
                <div className="min-w-0 pr-3">
                  <span className="font-bold text-white text-xs block">{s.platform}</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 truncate block hover:underline">
                    {s.url}
                  </a>
                  {s.username && <span className="text-[10px] font-mono text-slate-500 block">{s.username}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(idx)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-dark-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Social mini form */}
          <div className="p-4 rounded-xl bg-dark-950 border border-dashed border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-400 font-bold block">Add New Platform Link</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newSocial.platform}
                onChange={(e) => setNewSocial(s => ({ ...s, platform: e.target.value }))}
                placeholder="Platform (GitHub, LinkedIn)..."
                className="w-full px-3 py-1.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                value={newSocial.url}
                onChange={(e) => setNewSocial(s => ({ ...s, url: e.target.value }))}
                placeholder="Full URL (https://...) or email..."
                className="w-full px-3 py-1.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                value={newSocial.username}
                onChange={(e) => setNewSocial(s => ({ ...s, username: e.target.value }))}
                placeholder="Username / Handle..."
                className="w-full px-3 py-1.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
            >
              Add Platform
            </button>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold text-xs shadow-subtle shadow-subtle"
            >
              {saving ? 'Saving...' : 'Save Social Links'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: RESUME & AVATAR */}
      {activeTab === 'resume' && (
        <form onSubmit={handleSaveResume} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 sm:p-8 space-y-6 max-w-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Resume Document & Avatar Photo</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage your downloadable resume and public avatar.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={resumeForm.avatarUrl}
                onChange={(e) => setResumeForm(r => ({ ...r, avatarUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Resume Download File Name</label>
              <input
                type="text"
                value={resumeForm.resumeFileName}
                onChange={(e) => setResumeForm(r => ({ ...r, resumeFileName: e.target.value }))}
                className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Public CV URL / PDF Link</label>
              <input
                type="url"
                value={resumeForm.cvUrl}
                onChange={(e) => setResumeForm(r => ({ ...r, cvUrl: e.target.value }))}
                placeholder="https://... or /Nuwan_Pinnaduwage_Technical_Resume.pdf"
                className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold text-xs shadow-subtle shadow-subtle"
            >
              {saving ? 'Saving...' : 'Save Document & Avatar'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}

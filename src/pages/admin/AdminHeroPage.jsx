import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  User, 
  GraduationCap, 
  MapPin, 
  Image, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  FileDown, 
  ExternalLink,
  Upload,
  Eye,
  Check
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AdminHeroPage() {
  const { 
    portfolio, 
    updateProfile, 
    saveSiteSettings,
    uploadAsset 
  } = usePortfolio();

  const { personal = {}, settings = {} } = portfolio;

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [uploadingCV, setUploadingCV] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    preferredName: '',
    role: '',
    degree: '',
    specialization: '',
    university: '',
    location: '',
    statusAvailable: true,
    statusText: 'AVAILABLE FOR OPPORTUNITIES.',
    heroBgLight: '',
    heroBgDark: '',
    cvUrl: '',
    resumeFileName: 'Nuwan_Pinnaduwage_Technical_Resume.pdf'
  });

  // Load current values
  useEffect(() => {
    if (personal) {
      setForm({
        name: personal.name || 'Nuwan Pinnaduwage',
        preferredName: personal.preferredName || 'Nuwan',
        role: personal.role || 'Cybersecurity Specialist | Network Engineer | Software & AI Systems Developer',
        degree: personal.degree || 'Bachelor of Science in Computer Science',
        specialization: personal.specialization || 'Software Engineering & Cybersecurity',
        university: personal.university || 'Edith Cowan University',
        location: personal.location || 'Perth, Australia & Colombo, Sri Lanka',
        statusAvailable: personal.statusBadge?.available !== false,
        statusText: personal.statusBadge?.text || 'AVAILABLE FOR OPPORTUNITIES.',
        heroBgLight: settings.heroBgLight || personal.heroBackgrounds?.light || '',
        heroBgDark: settings.heroBgDark || personal.heroBackgrounds?.dark || '',
        cvUrl: personal.cvUrl || '',
        resumeFileName: personal.resumeFileName || 'Nuwan_Pinnaduwage_Technical_Resume.pdf'
      });
    }
  }, [personal, settings]);

  // Auto-dismiss feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Update personal profile (Hero identity, academics, and status badge)
      const profileUpdates = {
        personal: {
          ...personal,
          name: form.name.trim(),
          preferredName: form.preferredName.trim(),
          role: form.role.trim(),
          degree: form.degree.trim(),
          specialization: form.specialization.trim(),
          university: form.university.trim(),
          location: form.location.trim(),
          cvUrl: form.cvUrl.trim(),
          resumeFileName: form.resumeFileName.trim(),
          statusBadge: {
            available: Boolean(form.statusAvailable),
            text: form.statusText.trim() || 'AVAILABLE FOR OPPORTUNITIES.'
          },
          heroBackgrounds: {
            light: form.heroBgLight.trim(),
            dark: form.heroBgDark.trim()
          }
        },
        about: {
          ...(portfolio.about || {})
        }
      };

      const resProfile = await updateProfile(profileUpdates);

      // 2. Also save hero background image paths to site settings
      const settingsUpdates = {
        ...settings,
        heroBgLight: form.heroBgLight.trim(),
        heroBgDark: form.heroBgDark.trim()
      };
      await saveSiteSettings(settingsUpdates);

      setSaving(false);

      if (resProfile?.error) {
        setFeedback({ type: 'error', message: resProfile.error || 'Failed to save hero section.' });
      } else {
        setFeedback({ 
          type: 'success', 
          message: 'Hero section configuration and Availability Status Badge saved successfully!' 
        });
      }
    } catch (err) {
      setSaving(false);
      setFeedback({ type: 'error', message: err.message || 'An error occurred while saving.' });
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCV(true);
    const { publicUrl, fileName, error } = await uploadAsset(file, 'resumes');
    setUploadingCV(false);

    if (error) {
      setFeedback({ type: 'error', message: 'CV file upload failed. Please verify Supabase Storage.' });
    } else {
      setForm(prev => ({
        ...prev,
        cvUrl: publicUrl || prev.cvUrl,
        resumeFileName: fileName || prev.resumeFileName
      }));
      setFeedback({ type: 'success', message: `CV "${file.name}" uploaded successfully! Click "Save Changes" to apply.` });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#2D3748] border border-[#4A5568] text-[#F5F7FA]">
              <Sparkles className="w-6 h-6" />
            </span>
            <span>Hero Section Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Configure the top introduction banner, your primary identity, professional title, academic credentials, background images, and the Availability Status badge.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white disabled:opacity-50 text-[#2D3748] font-semibold text-xs sm:text-sm shadow-subtle flex items-center gap-2 transition-all shrink-0 self-start sm:self-center"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-[#2D3748] text-[#F5F7FA] border border-[#4A5568]'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="flex-1">{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ========================================================================= */}
        {/* CARD 1: AVAILABILITY STATUS BADGE (Hero Banner Top)                        */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Hero Availability Status Badge</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Renders directly above the "Hi, I'm" greeting in the Hero section.
              </p>
            </div>

            {/* Toggle Badge Active / Inactive */}
            <label className="flex items-center gap-2.5 cursor-pointer self-start sm:self-center">
              <input
                type="checkbox"
                checked={form.statusAvailable}
                onChange={(e) => setForm(prev => ({ ...prev, statusAvailable: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 relative"></div>
              <span className="text-xs font-mono text-slate-300 font-semibold">
                {form.statusAvailable ? 'Visible on Hero' : 'Hidden'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Badge Text Label
              </label>
              <input
                type="text"
                value={form.statusText}
                onChange={(e) => setForm(prev => ({ ...prev, statusText: e.target.value }))}
                placeholder="AVAILABLE FOR OPPORTUNITIES."
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors uppercase font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Typically concise uppercase status (e.g., "AVAILABLE FOR OPPORTUNITIES.", "OPEN TO INTERNSHIPS").
              </p>
            </div>

            {/* Live Visual Preview of Badge */}
            <div className="space-y-2">
              <span className="block text-xs font-mono text-slate-400">
                Live Hero Badge Preview
              </span>
              <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800/80 flex items-center justify-start min-h-[56px]">
                {form.statusAvailable ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10.5px] sm:text-xs font-mono font-medium tracking-wide bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-sm backdrop-blur-sm">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-semibold tracking-wider">
                      {(form.statusText || "AVAILABLE FOR OPPORTUNITIES.").toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Badge is currently hidden on the Hero landing section.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: HERO IDENTITY & HEADINGS                                          */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="w-5 h-5 text-emerald-400" />
            <span>Primary Identity & Headlines</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nuwan Pinnaduwage"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Preferred First Name (Navbar Logo)
              </label>
              <input
                type="text"
                value={form.preferredName}
                onChange={(e) => setForm(prev => ({ ...prev, preferredName: e.target.value }))}
                placeholder="Nuwan"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Professional Subtitle / Career Tracks
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Cybersecurity Specialist | Network Engineer | Software & AI Systems Developer"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Displayed prominently in the Hero intro and about summaries.
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3: ACADEMIC CREDENTIALS & LOCATION                                   */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span>Academic Degree & Institution</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Degree Program Title
              </label>
              <input
                type="text"
                value={form.degree}
                onChange={(e) => setForm(prev => ({ ...prev, degree: e.target.value }))}
                placeholder="Bachelor of Science in Computer Science"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Specialization / Major
              </label>
              <input
                type="text"
                value={form.specialization}
                onChange={(e) => setForm(prev => ({ ...prev, specialization: e.target.value }))}
                placeholder="Software Engineering & Cybersecurity"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                University / Institution
              </label>
              <input
                type="text"
                value={form.university}
                onChange={(e) => setForm(prev => ({ ...prev, university: e.target.value }))}
                placeholder="Edith Cowan University"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Perth, Australia & Colombo, Sri Lanka"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 4: HERO BACKGROUND IMAGES (Light & Dark Mode)                        */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Image className="w-5 h-5 text-emerald-400" />
            <span>Hero Background Images (Light & Dark Mode)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Light Mode Background Image Path
              </label>
              <input
                type="text"
                value={form.heroBgLight}
                onChange={(e) => setForm(prev => ({ ...prev, heroBgLight: e.target.value }))}
                placeholder="/hero-light.png"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                Active exclusively when the site is viewed in Light Mode.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Dark Mode Background Image Path
              </label>
              <input
                type="text"
                value={form.heroBgDark}
                onChange={(e) => setForm(prev => ({ ...prev, heroBgDark: e.target.value }))}
                placeholder="/hero-dark.png"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                Active exclusively when the site is viewed in Dark Mode.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 5: RESUME / CV ATTACHMENT                                            */}
        {/* ========================================================================= */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileDown className="w-5 h-5 text-emerald-400" />
            <span>Resume / CV Download Button Attachment</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Downloadable Resume File Name
              </label>
              <input
                type="text"
                value={form.resumeFileName}
                onChange={(e) => setForm(prev => ({ ...prev, resumeFileName: e.target.value }))}
                placeholder="Nuwan_Pinnaduwage_Technical_Resume.pdf"
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Resume Direct Public URL
              </label>
              <input
                type="text"
                value={form.cvUrl}
                onChange={(e) => setForm(prev => ({ ...prev, cvUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-dark-800 hover:bg-dark-750 text-white border border-slate-700 transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>{uploadingCV ? 'Uploading CV...' : 'Upload New Resume PDF'}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
                disabled={uploadingCV}
                className="hidden"
              />
            </label>

            {form.cvUrl && (
              <a
                href={form.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
              >
                <span>View current CV</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[#F5F7FA] hover:bg-white disabled:opacity-50 text-[#2D3748] font-semibold text-sm shadow-subtle flex items-center gap-2 transition-all"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Hero Section Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

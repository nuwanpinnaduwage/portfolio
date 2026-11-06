import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  Palette, 
  FileDown, 
  Upload, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  ShieldCheck, 
  Code2, 
  Eye, 
  Copy, 
  Check, 
  Terminal,
  Layers,
  Image
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { portfolio, saveSiteSettings, uploadAsset, setPreviewMode, previewMode } = usePortfolio();
  const { isConfigured } = useAuth();
  const currentSettings = portfolio.settings || {};

  const [formData, setFormData] = useState({
    defaultTheme: currentSettings.defaultTheme || 'dark',
    accentColor: currentSettings.accentColor || 'clean-slate',
    showStats: currentSettings.showStats ?? true,
    showTerminal: currentSettings.showTerminal ?? true,
    showLeetcode: currentSettings.showLeetcode ?? false,
    footerTagline: currentSettings.footerTagline || portfolio.footer?.tagline || '',
    footerCopyright: currentSettings.footerCopyright || portfolio.footer?.copyrightNotice || '',
    cvFileName: portfolio.personal?.resumeFileName || 'Nuwan_Pinnaduwage_Technical_Resume.pdf',
    cvUrl: portfolio.personal?.cvUrl || '',
    heroBgLight: currentSettings.heroBgLight || portfolio.personal?.heroBackgrounds?.light || '',
    heroBgDark: currentSettings.heroBgDark || portfolio.personal?.heroBackgrounds?.dark || '',
  });

  // Sync state when portfolio loads asynchronously
  useEffect(() => {
    if (portfolio) {
      const s = portfolio.settings || {};
      setFormData(prev => ({
        ...prev,
        defaultTheme: s.defaultTheme || prev.defaultTheme || 'dark',
        accentColor: s.accentColor || prev.accentColor || 'clean-slate',
        showStats: s.showStats ?? prev.showStats ?? true,
        showTerminal: s.showTerminal ?? prev.showTerminal ?? true,
        showLeetcode: s.showLeetcode ?? prev.showLeetcode ?? false,
        footerTagline: s.footerTagline || portfolio.footer?.tagline || prev.footerTagline,
        footerCopyright: s.footerCopyright || portfolio.footer?.copyrightNotice || prev.footerCopyright,
        cvFileName: portfolio.personal?.resumeFileName || prev.cvFileName || 'Nuwan_Pinnaduwage_Technical_Resume.pdf',
        cvUrl: portfolio.personal?.cvUrl || prev.cvUrl || '',
        heroBgLight: s.heroBgLight || portfolio.personal?.heroBackgrounds?.light || prev.heroBgLight,
        heroBgDark: s.heroBgDark || portfolio.personal?.heroBackgrounds?.dark || prev.heroBgDark,
      }));
    }
  }, [portfolio]);

  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const accentOptions = [
    {
      id: 'clean-slate',
      name: 'Clean Slate',
      color: '#2D3748',
      dark: '#F5F7FA',
      bg: '#06070a',
      ring: 'ring-emerald-400',
      badge: 'Preset'
    },
    { id: 'violet', name: 'Electric Violet', color: '#8b5cf6', bg: '#0b0f17', ring: 'ring-violet-500' },
    { id: 'indigo', name: 'Deep Indigo', color: '#6366f1', bg: '#0b0f17', ring: 'ring-indigo-500' },
    { id: 'emerald', name: 'Classic Emerald', color: '#10b981', bg: '#0b0f17', ring: 'ring-emerald-500' },
    { id: 'cyan', name: 'Cyber Cyan', color: '#06b6d4', bg: '#0b0f17', ring: 'ring-cyan-500' },
    { id: 'rose', name: 'Vibrant Rose', color: '#f43f5e', bg: '#0b0f17', ring: 'ring-rose-500' },
    { id: 'amber', name: 'Terminal Amber', color: '#f59e0b', bg: '#0b0f17', ring: 'ring-amber-500' },
  ];

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    const res = await saveSiteSettings(formData);
    setSaving(false);

    if (res.error) {
      setFeedback({ type: 'error', message: 'Failed to update settings.' });
    } else {
      setFeedback({ type: 'success', message: 'Website theme and layout preferences saved!' });
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCV(true);
    const { publicUrl, fileName, error } = await uploadAsset(file, 'resumes');
    setUploadingCV(false);

    if (error) {
      setFeedback({ type: 'error', message: 'CV file upload failed. Please verify Supabase Storage bucket.' });
    } else {
      setFormData(prev => ({
        ...prev,
        cvUrl: publicUrl || prev.cvUrl,
        cvFileName: fileName || prev.cvFileName
      }));
      setFeedback({ type: 'success', message: `Resume file "${file.name}" uploaded successfully! Remember to click "Save Settings".` });
    }
  };

  const handleCopyEnvExample = () => {
    const text = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Settings & System Setup
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure visual themes, layout components, CV attachments, and Supabase database connection.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shadow-subtle transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-3 animate-fade-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Accent Color & Theme Customization */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Theme & Accent Color Branding</span>
          </h2>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-300">
                Theme Presets & Accent Colors
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Swatches display base background + accent core
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {accentOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    setFormData({ ...formData, accentColor: opt.id });
                    if (typeof document !== 'undefined') {
                      document.documentElement.setAttribute('data-theme-preset', opt.id);
                    }
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all relative group ${
                    formData.accentColor === opt.id
                      ? 'bg-dark-900 border-white/40 ring-2 ' + opt.ring
                      : 'bg-dark-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Preview Swatch: Theme Main Background + Accent Color Dot */}
                  <div
                    className="w-8 h-8 rounded-full border border-white/20 shadow-inner flex items-center justify-center p-0.5 shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: opt.bg || '#0b0f17' }}
                    title={`Theme Background: ${opt.bg || '#0b0f17'} | Accent: ${opt.color}`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-sm"
                      style={{
                        backgroundColor: opt.color,
                        boxShadow: `0 0 8px ${opt.neon || opt.color}99`
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 text-center leading-tight">
                    {opt.name}
                  </span>
                  {opt.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {opt.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Default Theme for First-Time Visitors
              </label>
              <select
                value={formData.defaultTheme}
                onChange={(e) => setFormData({ ...formData, defaultTheme: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="dark">Dark Theme (Obsidian & Charcoal)</option>
                <option value="light">Light Theme (Clean Crisp Slate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Live Changes Preview Mode
              </label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                  previewMode
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-subtle'
                    : 'bg-dark-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? 'Live Preview Active (Viewing Drafts)' : 'Enable Live Draft Preview'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout Component Visibility Toggles */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Layout & Section Display Controls</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-dark-900 border border-slate-800/80 cursor-pointer text-xs text-slate-300 hover:border-slate-700">
              <input
                type="checkbox"
                checked={formData.showStats}
                onChange={(e) => setFormData({ ...formData, showStats: e.target.checked })}
                className="rounded bg-dark-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-white block">Display Quick Stats Metrics Grid in Hero</span>
                <span className="text-[11px] text-slate-400">Shows Degree focus, GPA, LeetCode, and Project count pills.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-dark-900 border border-slate-800/80 cursor-pointer text-xs text-slate-300 hover:border-slate-700">
              <input
                type="checkbox"
                checked={formData.showTerminal}
                onChange={(e) => setFormData({ ...formData, showTerminal: e.target.checked })}
                className="rounded bg-dark-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-white block">Display Interactive Terminal Widget in About Section</span>
                <span className="text-[11px] text-slate-400">Renders the bash inspection terminal snippet.</span>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-850 flex items-center justify-between p-3.5 rounded-xl bg-dark-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Footer & Copyright Customization</span>
              <span className="text-[11px] text-slate-400">Footer content, copyright notice, and styles are centralized in the dedicated Footer Customization tab.</span>
            </div>
            <Link
              to="/admin/footer"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors shrink-0"
            >
              Open Footer Manager →
            </Link>
          </div>
        </div>

        {/* Hero Background Images (Light & Dark Mode) */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Image className="w-4 h-4 text-emerald-400" />
            <span>Hero Section Background Images</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Light Mode Background Image (Path or URL)
              </label>
              <input
                type="text"
                value={formData.heroBgLight}
                onChange={(e) => setFormData({ ...formData, heroBgLight: e.target.value })}
                placeholder="e.g. /hero-light.png or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500">
                Active exclusively when the site is viewed in Light Mode.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Dark Mode Background Image (Path or URL)
              </label>
              <input
                type="text"
                value={formData.heroBgDark}
                onChange={(e) => setFormData({ ...formData, heroBgDark: e.target.value })}
                placeholder="e.g. /hero-dark.png or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500">
                Active exclusively when the site is viewed in Dark Mode.
              </p>
            </div>
          </div>
        </div>

        {/* Resume / CV Document Management */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <FileDown className="w-4 h-4 text-emerald-400" />
            <span>Curriculum Vitae / Resume Attachment</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Uploaded Resume Document Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.cvFileName}
                  onChange={(e) => setFormData({ ...formData, cvFileName: e.target.value })}
                  placeholder="Nuwan_Pinnaduwage_Technical_Resume.pdf"
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />

                <label className="px-4 py-2.5 rounded-xl text-xs font-medium bg-dark-800 hover:bg-dark-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>{uploadingCV ? 'Uploading...' : 'Replace File'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleCVUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            When visitors click "Download CV", this file is downloaded directly from your cloud storage.
          </p>
        </div>

      </form>

      {/* Supabase Architecture & Setup Guide */}
      <div className="p-6 sm:p-8 rounded-xl bg-dark-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Supabase Cloud Setup Instructions</h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            RLS Enabled
          </span>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#2D3748] text-[#F5F7FA] border border-[#4A5568] flex items-center justify-center font-mono font-bold shrink-0">1</span>
            <div>
              <strong className="text-white">Create a Supabase Project:</strong>
              <p className="text-slate-400 mt-0.5">Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a>, create an organization, and create a new project.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#2D3748] text-[#F5F7FA] border border-[#4A5568] flex items-center justify-center font-mono font-bold shrink-0">2</span>
            <div>
              <strong className="text-white">Run Database Migration:</strong>
              <p className="text-slate-400 mt-0.5">In Supabase Dashboard, open <strong>SQL Editor</strong>, open the provided file <code className="text-emerald-300">supabase/schema.sql</code>, and click <strong>Run</strong>. (Optionally run <code className="text-emerald-300">supabase/seed.sql</code> to populate initial data).</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#2D3748] text-[#F5F7FA] border border-[#4A5568] flex items-center justify-center font-mono font-bold shrink-0">3</span>
            <div>
              <strong className="text-white">Create Storage Bucket:</strong>
              <p className="text-slate-400 mt-0.5">Under <strong>Storage</strong>, create a new public bucket named <code className="text-emerald-300">portfolio-assets</code> so avatars, project images, and resumes can be stored securely.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#2D3748] text-[#F5F7FA] border border-[#4A5568] flex items-center justify-center font-mono font-bold shrink-0">4</span>
            <div>
              <strong className="text-white">Create Administrator User:</strong>
              <p className="text-slate-400 mt-0.5">Under <strong>Authentication -&gt; Users</strong>, click <strong>Add User -&gt; Create User</strong> and enter your administrator email and a strong password.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#2D3748] text-[#F5F7FA] border border-[#4A5568] flex items-center justify-center font-mono font-bold shrink-0">5</span>
            <div className="w-full">
              <strong className="text-white">Add Environment Variables:</strong>
              <p className="text-slate-400 mt-0.5">Under <strong>Project Settings -&gt; API</strong>, copy your Project URL and anon public key into a <code className="text-emerald-300">.env</code> file:</p>
              
              <div className="mt-2 p-3 rounded-xl bg-dark-950 border border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-300">
                <span>VITE_SUPABASE_URL=...<br/>VITE_SUPABASE_ANON_KEY=...</span>
                <button
                  type="button"
                  onClick={handleCopyEnvExample}
                  className="px-2.5 py-1 rounded bg-dark-800 hover:bg-dark-700 text-slate-300 flex items-center gap-1"
                >
                  {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

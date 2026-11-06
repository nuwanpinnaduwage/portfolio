import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Image as ImageIcon, 
  FileText, 
  Upload, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Trash2,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminMediaLibraryPage() {
  const { portfolio, saveSiteSettings, uploadAsset } = usePortfolio();
  
  const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'avatar', 'diagrams', 'documents'
  const [feedback, setFeedback] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Hero backgrounds
  const [heroLight, setHeroLight] = useState(portfolio.personal?.heroBackgrounds?.light || '/hero-light.png');
  const [heroDark, setHeroDark] = useState(portfolio.personal?.heroBackgrounds?.dark || '/hero-dark.png');

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(portfolio.personal?.avatarUrl || '');

  // CV URL
  const [cvUrl, setCvUrl] = useState(portfolio.personal?.cvUrl || '');
  const [resumeFilename, setResumeFilename] = useState(portfolio.personal?.resumeFileName || 'Nuwan_Pinnaduwage_Technical_Resume.pdf');

  // New diagram item
  const [diagramName, setDiagramName] = useState('');
  const [diagramUrl, setDiagramUrl] = useState('');
  const [diagramsList, setDiagramsList] = useState([
    { name: "3-Tier Enterprise Topology", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800", type: "Network Diagram" },
    { name: "IDS Attack Simulation Architecture", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800", type: "Security Workflow" },
    { name: "Deep Anomaly Detection Pipeline", url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800", type: "ML Architecture" }
  ]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveHeroBackgrounds = async (e) => {
    e.preventDefault();
    const res = await saveSiteSettings({
      hero_backgrounds: {
        light: heroLight.trim(),
        dark: heroDark.trim()
      }
    });
    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save hero backgrounds.' });
    } else {
      setFeedback({ type: 'success', message: 'Hero background images updated successfully!' });
    }
  };

  const handleAddDiagram = (e) => {
    e.preventDefault();
    if (!diagramName.trim() || !diagramUrl.trim()) return;
    setDiagramsList(prev => [...prev, { name: diagramName.trim(), url: diagramUrl.trim(), type: "Diagram" }]);
    setDiagramName('');
    setDiagramUrl('');
    setFeedback({ type: 'success', message: `Diagram "${diagramName.trim()}" added to library.` });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[#2D3748] border border-[#4A5568] text-[#F5F7FA]">
            <ImageIcon className="w-6 h-6" />
          </span>
          <span>Media & Document Library</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage hero background portraits, profile photographs, network architecture diagrams, and downloadable PDFs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Hero Backgrounds</span>
        </button>

        <button
          onClick={() => setActiveTab('avatar')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'avatar'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Profile Photograph</span>
        </button>

        <button
          onClick={() => setActiveTab('diagrams')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'diagrams'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Diagrams & Screenshots</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resumes & Documents</span>
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

      {/* TAB 1: HERO BACKGROUNDS */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveHeroBackgrounds} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Full-Screen Hero Backgrounds</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Independent background portraits for Light Mode and Dark Mode rendering behind the transparent navbar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Light Mode */}
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-400 block">Light Mode Hero Background</span>
                <input
                  type="text"
                  value={heroLight}
                  onChange={(e) => setHeroLight(e.target.value)}
                  placeholder="/hero-light.png or https://..."
                  className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="h-44 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300">
                  <img
                    src={heroLight}
                    alt="Light Hero Preview"
                    className="w-full h-full object-cover object-right"
                    onError={(e) => { e.currentTarget.src = '/hero-light.png'; }}
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white">
                    Preview (Light)
                  </span>
                </div>
              </div>

              {/* Dark Mode */}
              <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-400 block">Dark Mode Hero Background</span>
                <input
                  type="text"
                  value={heroDark}
                  onChange={(e) => setHeroDark(e.target.value)}
                  placeholder="/hero-dark.png or https://..."
                  className="w-full px-3 py-2 bg-dark-900 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="h-44 rounded-xl bg-black overflow-hidden relative border border-slate-800">
                  <img
                    src={heroDark}
                    alt="Dark Hero Preview"
                    className="w-full h-full object-cover object-right"
                    onError={(e) => { e.currentTarget.src = '/hero-dark.png'; }}
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white">
                    Preview (Dark)
                  </span>
                </div>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold text-xs shadow-subtle shadow-subtle"
              >
                Save Hero Backgrounds
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: AVATAR */}
      {activeTab === 'avatar' && (
        <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white">Profile Avatar & Bio Photo</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Avatar used across the About Me section, navigation card, and project credits.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-500/40 shrink-0 bg-dark-850">
              <img
                src={avatarUrl || portfolio.personal?.avatarUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'; }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-mono text-slate-300 block">Photo Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIAGRAMS & SCREENSHOTS */}
      {activeTab === 'diagrams' && (
        <div className="space-y-6">
          
          <form onSubmit={handleAddDiagram} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Register Technical Diagram / Screenshot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  required
                  value={diagramName}
                  onChange={(e) => setDiagramName(e.target.value)}
                  placeholder="Diagram Title (e.g. OSPF Multi-Area Topology)..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="url"
                  required
                  value={diagramUrl}
                  onChange={(e) => setDiagramUrl(e.target.value)}
                  placeholder="Image URL (https://...)..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold text-xs shadow-subtle rounded-xl"
                >
                  Add to Library
                </button>
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {diagramsList.map((d, idx) => (
              <div key={idx} className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl overflow-hidden group">
                <div className="h-40 bg-dark-950 relative overflow-hidden">
                  <img src={d.url} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-white text-sm truncate">{d.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => copyToClipboard(d.url, `diag-${idx}`)}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedKey === `diag-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `diag-${idx}` ? 'Copied URL!' : 'Copy Link'}</span>
                    </button>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white">Technical Resume / CV</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target file delivered when visitors click "Download CV" or "View Resume".
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Resume File Name</label>
              <input
                type="text"
                value={resumeFilename}
                onChange={(e) => setResumeFilename(e.target.value)}
                className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Public Document Link / Storage URL</label>
              <input
                type="url"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                placeholder="https://... or /Nuwan_Pinnaduwage_Technical_Resume.pdf"
                className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

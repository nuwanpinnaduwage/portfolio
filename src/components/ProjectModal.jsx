import React, { useEffect, useState } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Activity,
  Code2,
  Calendar,
  Sparkles,
  Network,
  Shield,
  Cpu,
  Terminal,
  FileText,
  AlertTriangle,
  Lightbulb,
  Maximize2
} from 'lucide-react';
import { GithubIcon } from './BrandIcons';

export default function ProjectModal({ project, onClose, initialTab = 'overview' }) {
  const hasDiagram = Boolean(project?.topologyDiagram || project?.architectureDiagram);

  const resolveTab = (tab) => {
    if (tab === 'architecture' || tab === 'topology' || tab === 'topologies') {
      return hasDiagram ? 'architecture' : 'overview';
    }
    return tab || 'overview';
  };

  const [activeImage, setActiveImage] = useState(project?.image || '');
  const [activeTab, setActiveTab] = useState(() => resolveTab(initialTab));
  const [fullscreenDiagram, setFullscreenDiagram] = useState(null);

  useEffect(() => {
    if (project?.image) {
      setActiveImage(project.image);
    }
    setActiveTab(resolveTab(initialTab));
  }, [project, initialTab, hasDiagram]);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (fullscreenDiagram) {
          setFullscreenDiagram(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow || '';
    };
  }, [project, onClose, fullscreenDiagram]);

  if (!project) return null;

  const galleryImages = (project.gallery && project.gallery.length > 0) 
    ? project.gallery 
    : (project.image ? [project.image] : []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'in progress':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'research':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'planned':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-dark-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-2 sm:my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-dark-850/70 gap-2 shrink-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {project.category}
            </span>
            {project.subcategory && (
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[200px]">
                {project.subcategory}
              </span>
            )}
            {project.status && (
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${getStatusBadge(project.status)}`}>
                {project.status}
              </span>
            )}
            {project.featured && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-dark-950 shadow-glow-sm">
                Flagship Project
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close project details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-6 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`relative py-3 transition-colors whitespace-nowrap cursor-pointer select-none ${
              activeTab === 'overview'
                ? 'text-emerald-500 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            Overview & Gallery
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('problem_solution')}
            className={`relative py-3 transition-colors whitespace-nowrap cursor-pointer select-none ${
              activeTab === 'problem_solution'
                ? 'text-emerald-500 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            Problem & Solution
            {activeTab === 'problem_solution' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>

          {hasDiagram && (
            <button
              onClick={() => setActiveTab('architecture')}
              className={`relative py-3 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer select-none ${
                activeTab === 'architecture'
                  ? 'text-emerald-500 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Topology & Architecture</span>
              {activeTab === 'architecture' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('outcomes')}
            className={`relative py-3 transition-colors whitespace-nowrap cursor-pointer select-none ${
              activeTab === 'outcomes'
                ? 'text-emerald-500 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            Features & Results
            {activeTab === 'outcomes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* Header Title Section */}
          <div>
            <h3 id="modal-project-title" className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
              {project.title}
            </h3>
            {project.tagline && (
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base font-medium font-sans text-emerald-600 dark:text-emerald-400">
                {project.tagline}
              </p>
            )}
            <div className="mt-2 flex items-center gap-3 flex-wrap text-xs font-mono text-slate-400">
              {project.completionDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Timeline: {project.startDate ? `${project.startDate} to ` : ''}{project.completionDate}</span>
                </span>
              )}
              {project.type && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300">
                  {project.type}
                </span>
              )}
            </div>
          </div>

          {/* TAB 1: OVERVIEW & GALLERY */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Project Image Banner */}
              <div className="space-y-2">
                <div className="relative rounded-xl overflow-hidden aspect-video max-h-80 border border-slate-200 dark:border-slate-800 shadow-md bg-slate-900 group">
                  <img 
                    src={activeImage || project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div 
                    aria-hidden="true" 
                    className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent pointer-events-none" 
                  />
                  <button
                    onClick={() => setFullscreenDiagram(activeImage || project.image)}
                    aria-label="View image full size"
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-dark-950/80 text-white hover:text-emerald-400 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Additional gallery thumbnails if available */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          activeImage === img ? 'border-emerald-500 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Full Description & Overview */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5 font-semibold">
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  <span>Technical Overview</span>
                </h4>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {project.fullOverview || project.description}
                </p>
              </div>

              {/* Key Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5 font-semibold">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Performance Metrics & Benchmarks</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          ⚡ {metric}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5 font-semibold">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>Technologies & Tools Employed</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROBLEM & SOLUTION */}
          {activeTab === 'problem_solution' && (
            <div className="space-y-6 animate-fade-in">
              {/* Problem Statement */}
              {project.problemStatement && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Problem Statement</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {project.problemStatement}
                  </p>
                </div>
              )}

              {/* Objectives */}
              {project.objectives && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Project Objectives</span>
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {project.objectives}
                  </div>
                </div>
              )}

              {/* Proposed Solution */}
              {project.proposedSolution && (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2 font-bold">
                    <Lightbulb className="w-4 h-4" />
                    <span>Proposed Solution</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {project.proposedSolution}
                  </p>
                </div>
              )}

              {/* Technical Implementation */}
              {project.technicalImplementation && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5 font-semibold">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <span>Implementation Details & Methodology</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {project.technicalImplementation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ARCHITECTURE & NETWORK TOPOLOGY */}
          {activeTab === 'architecture' && hasDiagram && (
            <div className="space-y-6 animate-fade-in">
              {project.topologyDiagram && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-semibold">
                      <Network className="w-4 h-4 text-emerald-500" />
                      <span>Network Topology Diagram</span>
                    </h4>
                    <button
                      onClick={() => setFullscreenDiagram(project.topologyDiagram)}
                      className="inline-flex items-center gap-1 text-xs font-mono text-emerald-500 hover:text-emerald-400"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Fullscreen</span>
                    </button>
                  </div>
                  <div 
                    onClick={() => setFullscreenDiagram(project.topologyDiagram)}
                    className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video max-h-96 cursor-pointer group"
                  >
                    <img 
                      src={project.topologyDiagram} 
                      alt="Network Topology Diagram" 
                      className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-dark-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-lg bg-dark-950/80 text-white text-xs font-mono font-medium">
                        Click to enlarge diagram
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {project.architectureDiagram && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-semibold">
                      <Cpu className="w-4 h-4 text-emerald-500" />
                      <span>System Architecture Diagram</span>
                    </h4>
                    <button
                      onClick={() => setFullscreenDiagram(project.architectureDiagram)}
                      className="inline-flex items-center gap-1 text-xs font-mono text-emerald-500 hover:text-emerald-400"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Fullscreen</span>
                    </button>
                  </div>
                  <div 
                    onClick={() => setFullscreenDiagram(project.architectureDiagram)}
                    className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video max-h-96 cursor-pointer group"
                  >
                    <img 
                      src={project.architectureDiagram} 
                      alt="System Architecture Diagram" 
                      className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-dark-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-lg bg-dark-950/80 text-white text-xs font-mono font-medium">
                        Click to enlarge diagram
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FEATURES, RESULTS & CHALLENGES */}
          {activeTab === 'outcomes' && (
            <div className="space-y-6 animate-fade-in">
              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Key Architectural Features</span>
                  </h4>
                  <ul className="space-y-2">
                    {project.keyFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Results & Outcomes */}
              {project.results && (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2 font-bold">
                    <Activity className="w-4 h-4" />
                    <span>Results & Verification Outcomes</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {project.results}
                  </p>
                </div>
              )}

              {/* Challenges & Solutions */}
              {project.challenges && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2 font-bold">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Challenges & Engineering Solutions</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {project.challenges}
                  </p>
                </div>
              )}

              {/* Future Improvements */}
              {project.futureImprovements && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Planned Enhancements</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {project.futureImprovements}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-dark-850/50 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-dark-900 hover:bg-dark-800 text-white border border-slate-700 transition-colors touch-manipulation"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-dark-950 shadow-glow-sm transition-all touch-manipulation font-bold"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demonstration</span>
              </a>
            )}

            {project.documentationUrl && (
              <a
                href={project.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-500 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Documentation</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors touch-manipulation"
          >
            Close
          </button>
        </div>

      </div>

      {/* Fullscreen Diagram Overlay */}
      {fullscreenDiagram && (
        <div 
          className="fixed inset-0 z-60 bg-dark-950/95 flex flex-col items-center justify-center p-4"
          onClick={() => setFullscreenDiagram(null)}
        >
          <button
            onClick={() => setFullscreenDiagram(null)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-dark-900 text-white hover:text-emerald-400 border border-white/20"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={fullscreenDiagram} 
            alt="Fullscreen Diagram" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl border border-white/10" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}

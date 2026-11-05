import React, { useEffect, useState } from 'react';
import { 
  X, 
  ExternalLink, 
  FileText, 
  Download, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Sparkles,
  Bookmark,
  Layers,
  Activity
} from 'lucide-react';

export default function ResearchModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow || '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const authorsString = Array.isArray(item.authors) 
    ? item.authors.join(', ') 
    : (item.authors || 'Nuwan Pinnaduwage');

  const bibtexCitation = `@article{${item.slug || 'research'}_${item.publicationYear || '2025'},
  title = {${item.title}},
  author = {${authorsString}},
  journal = {${item.venue || 'Research Publication'}},
  year = {${item.publicationYear || '2025'}},
  doi = {${item.doi || 'N/A'}}
}`;

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(bibtexCitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Failed to copy citation:", e);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'accepted':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'under review':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'preprint':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'in progress':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-research-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-dark-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 sm:my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-dark-850/70 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {item.type || 'Research Publication'}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {item.category}
            </span>
            {item.status && (
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            )}
            {item.featured && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30">
                Flagship Paper
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close research details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* Title & Venue */}
          <div>
            <h3 id="modal-research-title" className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-slate-900 dark:text-white leading-snug">
              {item.title}
            </h3>

            {/* Venue & Authors Metadata */}
            <div className="mt-3.5 space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium">Authors:</span>
                <span>{authorsString}</span>
              </div>

              {item.venue && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">Venue:</span>
                  <span className="italic">{item.venue}</span>
                  {item.publicationYear && (
                    <span className="font-mono text-xs text-slate-500">({item.publicationYear})</span>
                  )}
                </div>
              )}

              {item.doi && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Bookmark className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">DOI:</span>
                  <a 
                    href={`https://doi.org/${item.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{item.doi}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Abstract */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5 font-semibold">
              <FileText className="w-4 h-4" />
              <span>Abstract</span>
            </h4>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {item.abstract || item.description}
            </p>
          </div>

          {/* Detailed Overview / Extended Abstract */}
          {item.fullOverview && item.fullOverview !== item.abstract && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5 font-semibold">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Extended Background & Contribution</span>
              </h4>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.fullOverview}
              </p>
            </div>
          )}

          {/* Methodology */}
          {item.methodology && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Experimental Methodology & Rigor</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.methodology}
              </p>
            </div>
          )}

          {/* Key Contributions / Highlights */}
          {item.highlights && item.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Key Insights & Verified Outcomes</span>
              </h4>
              <ul className="space-y-2">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Metrics */}
          {item.metrics && item.metrics.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5 font-semibold">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Performance & Empirical Metrics</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.metrics.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <span className="text-emerald-500 text-sm">⚡</span>
                    <span className="text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords / Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Keywords & Research Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Citation Generator */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>BibTeX Citation</span>
              </span>
              <button
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-md transition-colors touch-manipulation"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy BibTeX'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-400 overflow-x-auto p-2 bg-dark-950/80 rounded-lg">
              {bibtexCitation}
            </pre>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-dark-850/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {item.paperUrl && (
              <a
                href={item.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-dark-950 shadow-glow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download / Read Paper</span>
              </a>
            )}
            {item.externalUrl && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white dark:bg-dark-900 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>External Publication</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

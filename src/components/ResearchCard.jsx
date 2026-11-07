import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  FileText, 
  ExternalLink, 
  BookOpen, 
  Download, 
  Calendar,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';

export default function ResearchCard({ item, onSelect, variants }) {
  const shouldReduceMotion = useReducedMotion();

  const authorsString = Array.isArray(item.authors) 
    ? item.authors.join(', ') 
    : (item.authors || 'Nuwan Pinnaduwage');

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'bg-[#F5F7FA] dark:bg-[#161616] text-[#2D3748] dark:text-[#F5F7FA] border-emerald-500/30';
      case 'accepted':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
      case 'under review':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'preprint':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30';
    }
  };

  return (
    <motion.article
      variants={variants}
      whileHover={shouldReduceMotion ? {} : { y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="rounded-xl overflow-hidden flex flex-col justify-between group border border-[#A0AEC0]/30 dark:border-[#262626] transition-all duration-200 shadow-subtle hover:shadow-card bg-white dark:bg-[#121212]"
    >
      <div className="p-5 sm:p-6">
        
        {/* Top Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#F5F7FA] dark:bg-[#161616] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626]">
              {item.type || 'Conference Paper'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#262626]">
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {item.status && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getStatusBadge(item.status)}`}>
                {item.status}
              </span>
            )}
            {item.featured && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelect(item)}
          className="text-base sm:text-lg md:text-xl font-bold font-heading text-[#2D3748] dark:text-white group-hover:text-[#1A202C] dark:group-hover:text-white transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {item.title}
        </h3>

        {/* Venue & Metadata */}
        <div className="mt-2.5 space-y-1 text-xs">
          {item.venue && (
            <p className="font-sans italic text-slate-500 dark:text-slate-400 line-clamp-1">
              {item.venue}
            </p>
          )}
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-0.5">
            <span className="line-clamp-1 text-[11px] font-sans">
              By: {authorsString}
            </span>
            {item.publicationYear && (
              <span className="font-mono text-[11px] font-medium shrink-0 ml-2">
                {item.publicationYear}
              </span>
            )}
          </div>
        </div>

        {/* Abstract snippet */}
        <p className="mt-3.5 text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {item.abstract || item.description}
        </p>

        {/* Metric Pill if present */}
        {item.metrics && item.metrics[0] && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#2D3748] dark:text-[#F5F7FA] bg-[#F5F7FA] dark:bg-[#161616] border border-[#A0AEC0]/30 dark:border-[#262626] px-2.5 py-1 rounded-md">
              <Zap className="w-3 h-3 text-[#2D3748] dark:text-[#A0AEC0] shrink-0" aria-hidden="true" />
              <span>{item.metrics[0]}</span>
            </span>
          </div>
        )}

        {/* Keywords / Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-[#262626]"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

      </div>

      {/* Card Footer Actions */}
      <div className="px-5 sm:px-6 py-3.5 flex items-center justify-between border-t border-[#A0AEC0]/20 dark:border-[#222222] bg-[#F5F7FA]/70 dark:bg-[#0A0A0A]/60">
        <button
          onClick={() => onSelect(item)}
          className="btn-rectangular-view touch-manipulation cursor-pointer"
        >
          <span>View</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {item.paperUrl && (
            <a
              href={item.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Download or Read Paper"
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#2D3748] dark:text-[#A0AEC0] dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          {item.externalUrl && (
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="External Publication Link"
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#2D3748] dark:text-[#A0AEC0] dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

    </motion.article>
  );
}

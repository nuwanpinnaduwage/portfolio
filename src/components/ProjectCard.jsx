import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ExternalLink, 
  ArrowUpRight, 
  Calendar,
  Network,
  Cpu,
  Shield,
  FileCode,
  Layers
} from 'lucide-react';
import { GithubIcon } from './BrandIcons';

export default function ProjectCard({ project, onSelect, variants }) {
  const shouldReduceMotion = useReducedMotion();

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

  const getCategoryIcon = (category) => {
    if (category?.toLowerCase().includes('cyber')) {
      return <Shield className="w-3 h-3 text-emerald-400" />;
    }
    if (category?.toLowerCase().includes('network')) {
      return <Network className="w-3 h-3 text-emerald-400" />;
    }
    if (category?.toLowerCase().includes('intelligence') || category?.toLowerCase().includes('ai')) {
      return <Cpu className="w-3 h-3 text-emerald-400" />;
    }
    return <Layers className="w-3 h-3 text-emerald-400" />;
  };

  const hasDiagram = Boolean(project.topologyDiagram || project.architectureDiagram);
  
  // Check if a genuine external demo or tool link exists (not generic root github)
  const hasRealExternalDemo = Boolean(
    (project.demo && project.demo !== 'https://github.com' && !project.demo.endsWith('github.com')) ||
    (project.liveUrl && project.liveUrl !== 'https://github.com' && !project.liveUrl.endsWith('github.com'))
  );
  const externalDemoUrl = hasRealExternalDemo ? (project.demo || project.liveUrl) : null;

  // Primary destination for "View Project":
  // - Network/Topology projects or projects configured with defaultView === 'architecture'/'topology' open directly to 'architecture'.
  // - Other projects open to 'overview' (Details).
  const isTopologyPrimary = project.defaultView === 'architecture' || project.defaultView === 'topology' || (hasDiagram && project.category?.toLowerCase().includes('network'));
  const primaryDestinationTab = isTopologyPrimary ? 'architecture' : 'overview';

  const handleViewProject = (e) => {
    if (e) e.stopPropagation();
    if (externalDemoUrl) {
      window.open(externalDemoUrl, '_blank', 'noopener,noreferrer');
    } else if (onSelect) {
      onSelect(project, primaryDestinationTab);
    }
  };

  return (
    <motion.article
      variants={variants}
      whileHover={shouldReduceMotion ? {} : { y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 hover:shadow-xl hover:border-emerald-500/40 bg-white/70 dark:bg-dark-900/80 backdrop-blur-md"
    >
      {/* Card Top: Image & Overlay */}
      <div>
        <div 
          className="relative aspect-video overflow-hidden bg-slate-900 cursor-pointer" 
          onClick={() => onSelect && onSelect(project, primaryDestinationTab)}
        >
          <img 
            src={project.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900"} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          <div 
            aria-hidden="true" 
            className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" 
          />

          {/* Desktop Hover Action Overlay (Smooth fade-in & upward transition) */}
          <div 
            className="absolute inset-0 hidden md:flex flex-col items-center justify-center gap-2 bg-dark-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto z-20"
          >
            {externalDemoUrl ? (
              <a
                href={externalDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transform translate-y-2.5 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-300 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#22c55e] hover:bg-[#16a34a] text-dark-950 shadow-glow-sm hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-dark-950 cursor-pointer"
              >
                <span>View Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleViewProject}
                className="transform translate-y-2.5 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-300 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#22c55e] hover:bg-[#16a34a] text-dark-950 shadow-glow-sm hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-dark-950 cursor-pointer"
              >
                <span>View Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}

            {/* Direct Topology Action if project has topology diagram */}
            {hasDiagram && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect && onSelect(project, 'architecture');
                }}
                className="transform translate-y-2.5 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-300 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono font-semibold bg-dark-900/90 hover:bg-dark-800 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 shadow-sm cursor-pointer"
              >
                <Network className="w-3 h-3 text-emerald-400" />
                <span>View Topology</span>
              </button>
            )}
          </div>
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-dark-900/90 text-emerald-400 backdrop-blur-md border border-white/10">
                {getCategoryIcon(project.category)}
                <span>{project.category}</span>
              </span>
              {project.type && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-dark-900/80 text-slate-300 backdrop-blur-md border border-white/10 hidden sm:inline-block">
                  {project.type}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {project.status && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold backdrop-blur-md border ${getStatusBadge(project.status)}`}>
                  {project.status}
                </span>
              )}
              {project.featured && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500 text-dark-950 backdrop-blur-md shadow-glow-sm">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Subcategory & Diagram Pills at Bottom of Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            {project.subcategory ? (
              <span className="inline-block text-[10px] font-mono font-medium text-emerald-300 bg-dark-950/90 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/30 truncate max-w-[200px]">
                {project.subcategory}
              </span>
            ) : <span />}

            {hasDiagram && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-slate-300 bg-dark-950/90 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shrink-0">
                <Network className="w-2.5 h-2.5 text-emerald-400" />
                <span>Topology Included</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          
          {/* Date & Subcategory */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400 mb-1.5">
            {project.completionDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-500" />
                <span>{project.completionDate}</span>
              </span>
            )}
            {project.metrics && project.metrics[0] && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[180px]">
                ⚡ {project.metrics[0]}
              </span>
            )}
          </div>

          <h3 
            onClick={() => onSelect && onSelect(project, primaryDestinationTab)}
            className="project-card-title text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
          >
            {project.title}
          </h3>

          {project.tagline && (
            <p className="mt-1 text-xs font-sans text-emerald-600/90 dark:text-emerald-400/90 line-clamp-1 font-medium">
              {project.tagline}
            </p>
          )}

          <p className="mt-2 text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(project.technologies || []).slice(0, 4).map((tech) => (
              <span 
                key={tech}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 4 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-dark-800 text-slate-400">
                +{(project.technologies || []).length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-dark-950/30">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Action 1: View Details */}
          <button
            type="button"
            onClick={() => onSelect && onSelect(project, 'overview')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors touch-manipulation cursor-pointer"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Action 2: Topologies (Connected when project has topology or architecture diagram) */}
          {hasDiagram && (
            <button
              type="button"
              onClick={() => onSelect && onSelect(project, 'architecture')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors touch-manipulation cursor-pointer"
            >
              <Network className="w-3 h-3 text-emerald-500" />
              <span>Topologies</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </button>
          )}

          {/* Mobile & Tablet Accessible View Project Button */}
          {externalDemoUrl ? (
            <a
              href={externalDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="md:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#22c55e] hover:bg-[#16a34a] text-dark-950 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>View Project</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </a>
          ) : (
            <button
              type="button"
              onClick={handleViewProject}
              className="md:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#22c55e] hover:bg-[#16a34a] text-dark-950 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>View Project</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {project.github && project.github !== 'https://github.com' && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub code for ${project.title}`}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {externalDemoUrl && (
            <a
              href={externalDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo for ${project.title}`}
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

    </motion.article>
  );
}

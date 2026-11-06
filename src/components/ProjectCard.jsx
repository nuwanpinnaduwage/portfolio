import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { GithubIcon } from './BrandIcons';

export default function ProjectCard({ 
  project, 
  onSelect, 
  variants, 
  layout = 'standard',
  index = 0 
}) {
  const shouldReduceMotion = useReducedMotion();

  const slug = project?.slug || project?.id || project?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const projectUrl = `/projects/${slug}`;

  // Safe navigation to open project details page in a new browser tab/window
  const handleOpenProject = (e) => {
    // If the click came from a specific external link (GitHub or Demo), don't hijack it
    if (e.target.closest('a[data-external-link]')) {
      return;
    }
    
    // Prevent default anchor navigation if triggered by click to use window.open with safe rel
    e.preventDefault();
    window.open(projectUrl, '_blank', 'noopener,noreferrer');
  };

  const hasRealExternalDemo = Boolean(
    (project?.demo && project.demo !== 'https://github.com' && !project.demo.endsWith('github.com')) ||
    (project?.liveUrl && project.liveUrl !== 'https://github.com' && !project.liveUrl.endsWith('github.com'))
  );
  const externalDemoUrl = hasRealExternalDemo ? (project?.demo || project?.liveUrl) : null;

  // Extract tags / technologies (fallback gracefully)
  const displayTags = (project?.tags && project.tags.length > 0)
    ? project.tags
    : (project?.technologies || []);

  return (
    <motion.article
      variants={variants}
      whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group relative flex flex-col justify-between h-full rounded-2xl overflow-hidden border border-[#A0AEC0]/30 dark:border-[#262626] bg-white dark:bg-[#121212] transition-all duration-300 shadow-subtle hover:shadow-card hover:border-[#2D3748]/50 dark:hover:border-[#383838] focus-within:ring-2 focus-within:ring-[#2D3748] dark:focus-within:ring-[#F5F7FA] cursor-pointer"
      onClick={handleOpenProject}
    >
      {/* Invisible anchor for native browser accessibility (right-click -> open in new tab, SEO, keyboard nav) */}
      <a 
        href={projectUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={`View ${project?.title || 'project'} details`}
        className="absolute inset-0 z-0 pointer-events-none focus:outline-none"
        tabIndex={-1}
      />

      {/* Top Section: Large Landscape Thumbnail + Animated Centered View Button */}
      <div className="relative aspect-[16/10] sm:aspect-video w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={project?.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900"}
          alt={project?.title || 'Project thumbnail'}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Subtle dark image overlay - visible only on hover / keyboard focus */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 bg-black/45 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center"
        >
          {/* Animated Centered "View" Button using Primary Accent Color */}
          <div 
            className="transform translate-y-3 scale-95 opacity-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 transition-all duration-300 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold font-sans bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#0A0A0A] shadow-md pointer-events-auto"
          >
            <span>View</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>

        {/* Featured Tag (if applicable) */}
        {project?.featured && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider bg-black/70 text-slate-100 backdrop-blur-md border border-white/10">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          {/* Small Uppercase Category Label */}
          <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#718096] dark:text-[#A0AEC0] mb-2 flex items-center justify-between gap-2">
            <span>{project?.category || 'Project'}</span>
            {project?.completionYear && (
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-normal normal-case">
                {project.completionYear}
              </span>
            )}
          </div>

          {/* Prominent Project Title */}
          <h3 className="text-base sm:text-lg font-heading font-bold text-slate-900 dark:text-white group-hover:text-[#2D3748] dark:group-hover:text-[#F5F7FA] transition-colors line-clamp-2 leading-snug mb-2.5">
            {project?.title}
          </h3>

          {/* Short Project Description */}
          <p className="text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
            {project?.description || project?.tagline}
          </p>
        </div>

        {/* Footer Area: Technology / Topic chips & External quick links */}
        <div className="mt-auto pt-3 border-t border-[#A0AEC0]/15 dark:border-[#222222]/80 flex flex-col gap-3">
          {/* Small Rounded Outlined Chips */}
          <div className="flex flex-wrap gap-1.5">
            {displayTags.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#262626] bg-slate-50/50 dark:bg-[#161616]/60"
              >
                {tech}
              </span>
            ))}
            {displayTags.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-medium text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-[#222222] bg-slate-50/30 dark:bg-[#121212]">
                +{displayTags.length - 4}
              </span>
            )}
          </div>

          {/* Bottom Bar: Mobile View Action + External Links */}
          <div className="flex items-center justify-between pt-1 text-xs">
            {/* Direct accessible action for mobile & keyboard */}
            <div className="inline-flex items-center gap-1 font-sans font-semibold text-[#2D3748] dark:text-[#F5F7FA] group-hover:underline">
              <span>View Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>

            {/* External Quick Links (GitHub & Live Demo) */}
            <div className="flex items-center gap-1.5 z-10">
              {project?.github && project.github !== 'https://github.com' && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-external-link="true"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`GitHub code for ${project.title}`}
                  title="GitHub Repository"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {externalDemoUrl && (
                <a
                  href={externalDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-external-link="true"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Live demo for ${project.title}`}
                  title="Live Demo"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

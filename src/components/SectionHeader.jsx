import React from 'react';
import { StaggerContainer, StaggerItem } from './animations/MotionWrappers';

/**
 * Standardized Section Header Component
 * Displays clean, prominent section titles directly without eyebrow/badge labels,
 * paired with a subtle neon emerald accent detail and balanced spacing.
 * Enhanced with subtle staggered scroll animation (bidirectional).
 */
export default function SectionHeader({
  id,
  title,
  subtitle,
  className = "text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16",
}) {
  return (
    <StaggerContainer 
      staggerDelay={0.08} 
      amount={0.15} 
      once={false}
      className={className}
    >
      <StaggerItem direction="up" distance={20} duration={0.55}>
        <h2 
          id={id} 
          className="font-heading font-extrabold section-main-heading text-2xl sm:text-4xl lg:text-[2.65rem] text-slate-900 dark:text-white tracking-tight leading-[1.2] break-words"
        >
          {title}
        </h2>
      </StaggerItem>

      <StaggerItem direction="up" distance={12} duration={0.5}>
        <div className="flex items-center justify-center gap-1.5 mt-3.5 mb-4" aria-hidden="true">
          <span className="section-accent-bar h-1 w-10 rounded-full bg-emerald-500"></span>
          <span className="section-accent-dot h-1 w-2.5 rounded-full bg-emerald-400/60"></span>
        </div>
      </StaggerItem>

      {subtitle && (
        <StaggerItem direction="up" distance={16} duration={0.55}>
          <p className="text-sm sm:text-base lg:text-lg font-sans text-slate-600 dark:text-slate-400 leading-[1.75] max-w-2xl mx-auto px-1">
            {subtitle}
          </p>
        </StaggerItem>
      )}
    </StaggerContainer>
  );
}

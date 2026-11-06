import React from 'react';
import { StaggerContainer, StaggerItem } from './animations/MotionWrappers';

/**
 * Standardized Section Header Component — Clean Slate Design System
 * Displays clean, prominent section titles with editorial typographic rhythm
 * and balanced spacing, without generic template decorations.
 */
export default function SectionHeader({
  id,
  title,
  subtitle,
  className = "text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14",
}) {
  return (
    <StaggerContainer 
      staggerDelay={0.08} 
      amount={0.15} 
      once={false}
      className={className}
    >
      <StaggerItem direction="up" distance={16} duration={0.5}>
        <h2 
          id={id} 
          className="font-heading font-bold section-main-heading text-2xl sm:text-4xl lg:text-[2.65rem] text-[#2D3748] dark:text-white tracking-tight leading-[1.2] break-words"
        >
          {title}
        </h2>
      </StaggerItem>

      {subtitle && (
        <StaggerItem direction="up" distance={12} duration={0.5}>
          <p className="mt-3 sm:mt-3.5 text-sm sm:text-base lg:text-lg font-sans text-[#4A5568] dark:text-[#A0AEC0] leading-[1.7] max-w-2xl mx-auto px-1">
            {subtitle}
          </p>
        </StaggerItem>
      )}
    </StaggerContainer>
  );
}

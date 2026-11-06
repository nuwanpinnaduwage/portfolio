import React from 'react';
import { ArrowUp, MapPin, Mail, ExternalLink, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { portfolioData } from '../data/portfolioData';
import { getVisibleNavLinks } from '../utils/sectionVisibilityUtils';
import { ScrollReveal } from './animations/MotionWrappers';

export default function Footer({ data, personalData, visibility, sectionNames }) {
  const personal = personalData || portfolioData.personal;
  const footer = data || portfolioData.footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine active year display
  const currentYear = new Date().getFullYear();
  let displayYear = currentYear;
  if (footer.autoYear === false) {
    displayYear = footer.startYear || currentYear;
  } else if (footer.startYear && Number(footer.startYear) < currentYear) {
    displayYear = `${footer.startYear} - ${currentYear}`;
  } else {
    displayYear = currentYear;
  }

  const ownerName = footer.ownerName || personal.name || 'Nuwan Pinnaduwage';
  const prefix = footer.prefixText !== undefined ? footer.prefixText : '©';
  const rightsText = footer.rightsText !== undefined ? footer.rightsText : 'All rights reserved.';
  const highlightColor = footer.highlightColor && !['#22c55e', '#8EB69B'].includes(footer.highlightColor) ? footer.highlightColor : 'currentColor';
  const textColor = footer.textColor && footer.textColor !== '#94a3b8' ? footer.textColor : undefined;
  const bgColor = footer.bgColor && footer.bgColor !== '#050706' ? footer.bgColor : undefined;

  // Padding classes
  const paddingClasses = {
    compact: 'py-4 sm:py-5',
    normal: 'py-6 sm:py-8',
    spacious: 'py-10 sm:py-12'
  }[footer.paddingY || 'normal'] || 'py-6 sm:py-8';

  // Font size classes
  const fontClasses = {
    xs: 'text-[11px] sm:text-xs',
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base'
  }[footer.fontSize || 'sm'] || 'text-xs sm:text-sm';

  // Alignment classes
  const alignment = footer.alignment || 'center';
  const isCenter = alignment === 'center';
  const isLeft = alignment === 'left';
  const isBetween = alignment === 'between';

  // Navigation links
  const systemNavLinks = getVisibleNavLinks(visibility, sectionNames);
  const activeNavLinks = (footer.navLinks && footer.navLinks.length > 0) ? footer.navLinks : systemNavLinks;

  // Social URLs
  const githubUrl = footer.githubUrl || personal.socialLinks?.find(s => s.platform?.toLowerCase().includes('git'))?.url || 'https://github.com';
  const linkedinUrl = footer.linkedinUrl || personal.socialLinks?.find(s => s.platform?.toLowerCase().includes('linkedin'))?.url || 'https://linkedin.com';
  const emailAddress = footer.email || personal.email || '';
  const locationText = footer.location || personal.location || '';

  const hasOptionalContent = Boolean(
    footer.showTagline ||
    footer.showProfessionalTitle ||
    footer.showEmail ||
    footer.showLocation ||
    footer.showGithub ||
    footer.showLinkedin ||
    footer.showNavLinks ||
    footer.showPrivacyPolicy ||
    footer.showTerms ||
    footer.showBackToTop ||
    footer.showCustomText
  );

  const isExpanded = footer.layout === 'expanded';

  return (
    <footer 
      id="footer" 
      style={{
        backgroundColor: bgColor || undefined,
      }}
      className={`relative transition-colors select-none ${paddingClasses} ${
        footer.showBorderTop 
          ? 'border-t border-slate-200/60 dark:border-[#222222]' 
          : 'border-none'
      }`}
    >
      <ScrollReveal 
        direction="up" 
        distance={16} 
        duration={0.6} 
        once={false} 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        {/* ============================================================== */}
        {/* 1. MINIMAL LAYOUT (DEFAULT - MATCHES UPLOADED REFERENCE IMAGE) */}
        {/* ============================================================== */}
        {!isExpanded ? (
          <div className={`flex flex-col gap-3.5 ${
            isLeft ? 'items-start text-left' : isBetween ? 'sm:flex-row sm:items-center sm:justify-between text-center sm:text-left' : 'items-center text-center'
          }`}>
            
            {/* Optional Header Details (Tagline / Title) */}
            {(footer.showProfessionalTitle || footer.showTagline) && (
              <div className="space-y-1">
                {footer.showProfessionalTitle && (
                  <p className="font-mono text-xs font-semibold text-slate-300 dark:text-slate-200">
                    {footer.professionalTitle}
                  </p>
                )}
                {footer.showTagline && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                    {footer.tagline}
                  </p>
                )}
              </div>
            )}

            {/* Optional Nav Links */}
            {footer.showNavLinks && activeNavLinks.length > 0 && (
              <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-slate-400">
                {activeNavLinks.map((link, idx) => (
                  <a
                    key={link.id || link.href || idx}
                    href={link.href}
                    className="hover:text-[#2D3748] dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            )}

            {/* Optional Coordinates & Social Links */}
            {(footer.showEmail || footer.showLocation || footer.showGithub || footer.showLinkedin) && (
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono">
                {footer.showEmail && emailAddress && (
                  <a href={`mailto:${emailAddress}`} className="hover:text-[#2D3748] dark:hover:text-white transition-colors flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#2D3748] dark:text-[#A0AEC0]" />
                    <span>{emailAddress}</span>
                  </a>
                )}
                {footer.showLocation && locationText && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2D3748] dark:text-[#A0AEC0]" />
                    <span>{locationText}</span>
                  </span>
                )}
                {footer.showGithub && githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#2D3748] dark:hover:text-white transition-colors flex items-center gap-1">
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {footer.showLinkedin && linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#2D3748] dark:hover:text-white transition-colors flex items-center gap-1">
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            )}

            {/* CORE SINGLE-LINE COPYRIGHT STATEMENT (MATCHES REFERENCE IMAGE) */}
            {footer.showCopyright !== false && (
              <p className={`${fontClasses} font-sans tracking-normal leading-relaxed`}>
                <span style={{ color: textColor }}>
                  {prefix ? `${prefix} ` : ''}{displayYear} </span>
                <span 
                  style={{ color: highlightColor }} 
                  className="font-semibold"
                >
                  {ownerName}
                </span>
                <span style={{ color: textColor }}>
                  . {rightsText}
                </span>
              </p>
            )}

            {/* Optional Legal Links, Custom Text, and Back-to-Top */}
            {(footer.showPrivacyPolicy || footer.showTerms || footer.showCustomText || footer.showBackToTop) && (
              <div className="flex flex-wrap items-center justify-center gap-3.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1">
                {footer.showCustomText && footer.customText && (
                  <span>{footer.customText}</span>
                )}
                {footer.showPrivacyPolicy && (
                  <a href={footer.privacyUrl || "#privacy"} className="hover:text-[#2D3748] dark:hover:text-white transition-colors">
                    {footer.privacyText || "Privacy Policy"}
                  </a>
                )}
                {footer.showTerms && (
                  <a href={footer.termsUrl || "#terms"} className="hover:text-[#2D3748] dark:hover:text-white transition-colors">
                    {footer.termsText || "Terms & Conditions"}
                  </a>
                )}
                {footer.showBackToTop && (
                  <button
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="inline-flex items-center gap-1 hover:text-[#2D3748] dark:hover:text-white transition-colors text-slate-400"
                  >
                    <span>{footer.backToTopText || "Top"}</span>
                    <ArrowUp className="w-3 h-3 text-[#2D3748] dark:text-[#A0AEC0]" />
                  </button>
                )}
              </div>
            )}

          </div>
        ) : (

        /* ============================================================== */
        /* 2. EXPANDED LAYOUT (TIERED MULTI-SECTION FOOTER)              */
        /* ============================================================== */
          <div className="space-y-6">
            
            {/* Upper Tier: Brand / Title / Tagline & Nav */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6 border-b border-slate-800/80">
              <div className="text-center md:text-left space-y-1">
                <span className="font-mono font-bold text-lg text-white flex items-center justify-center md:justify-start gap-1">
                  <span>{ownerName}</span>
                  <span style={{ color: highlightColor }}>.sec</span>
                </span>
                {footer.showProfessionalTitle && (
                  <p className="text-xs font-mono text-[#2D3748] dark:text-[#A0AEC0]">
                    {footer.professionalTitle}
                  </p>
                )}
                {footer.showTagline && (
                  <p className="text-xs text-slate-400 max-w-md">
                    {footer.tagline}
                  </p>
                )}
              </div>

              {/* Navigation links */}
              {footer.showNavLinks && activeNavLinks.length > 0 && (
                <nav aria-label="Footer Expanded Navigation" className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
                  {activeNavLinks.map((link, idx) => (
                    <a
                      key={link.id || link.href || idx}
                      href={link.href}
                      className="hover:text-[#2D3748] dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              )}
            </div>

            {/* Middle Tier: Coordinates & Social Channels */}
            {(footer.showEmail || footer.showLocation || footer.showGithub || footer.showLinkedin) && (
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex flex-wrap items-center gap-4 font-mono">
                  {footer.showEmail && emailAddress && (
                    <a href={`mailto:${emailAddress}`} className="hover:text-[#2D3748] dark:hover:text-white transition-colors flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#2D3748] dark:text-[#A0AEC0]" />
                      <span>{emailAddress}</span>
                    </a>
                  )}
                  {footer.showLocation && locationText && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2D3748] dark:text-[#A0AEC0]" />
                      <span>{locationText}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {footer.showGithub && githubUrl && (
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-900 border border-slate-800 hover:border-emerald-500/50 hover:text-[#2D3748] dark:hover:text-white transition-all">
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {footer.showLinkedin && linkedinUrl && (
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-900 border border-slate-800 hover:border-emerald-500/50 hover:text-[#2D3748] dark:hover:text-white transition-all">
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Lower Tier: Copyright statement, legal links, back to top */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/60">
              {footer.showCopyright !== false ? (
                <p className={`${fontClasses} font-sans tracking-normal`}>
                  <span style={{ color: textColor }}>{prefix ? `${prefix} ` : ''}{displayYear} </span>
                  <span style={{ color: highlightColor }} className="font-semibold">{ownerName}</span>
                  <span style={{ color: textColor }}>. {rightsText}</span>
                </p>
              ) : <div />}

              <div className="flex items-center gap-4 text-[11px] sm:text-xs text-slate-500">
                {footer.showPrivacyPolicy && (
                  <a href={footer.privacyUrl || "#privacy"} className="hover:text-[#2D3748] dark:hover:text-white transition-colors">
                    {footer.privacyText || "Privacy"}
                  </a>
                )}
                {footer.showTerms && (
                  <a href={footer.termsUrl || "#terms"} className="hover:text-[#2D3748] dark:hover:text-white transition-colors">
                    {footer.termsText || "Terms"}
                  </a>
                )}
                {footer.showBackToTop && (
                  <button
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-[#2D3748] dark:hover:text-white transition-colors ml-2"
                  >
                    <span>{footer.backToTopText || "Top"}</span>
                    <ArrowUp className="w-3.5 h-3.5 text-[#2D3748] dark:text-[#A0AEC0]" />
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </ScrollReveal>
    </footer>
  );
}

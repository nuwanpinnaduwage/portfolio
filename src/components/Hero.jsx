import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowRight, 
  FileDown, 
  MapPin, 
  Code
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, GmailIcon } from './BrandIcons';
import { portfolioData } from '../data/portfolioData';

import heroDarkImg from '../assets/hero-dark.png';
import heroLightImg from '../assets/hero-light.png';

const defaultEase = [0.22, 1, 0.36, 1];

export default function Hero({ onOpenCV, data, settings, darkMode }) {
  const personal = data || portfolioData.personal;
  const shouldReduceMotion = useReducedMotion();

  // Background images for Light and Dark modes
  // Priority: settings -> personal.heroBackgrounds -> imported bundled images -> fallback public path
  const heroBgLight = settings?.heroBgLight || personal?.heroBackgrounds?.light || heroLightImg || '/hero-light.png';
  const heroBgDark = settings?.heroBgDark || personal?.heroBackgrounds?.dark || heroDarkImg || '/hero-dark.png';

  // Dynamic user data fields with sensible fallbacks
  const degreeProgram = personal.degree || personal.degreeProgram || "Bachelor of Science in Computer Science";
  const careerPath = personal.careerPath || personal.specialization || "Full-Stack Development & Distributed Systems";

  // Visibility tracking for Hero section & "AVAILABLE FOR OPPORTUNITIES" badge
  const heroRef = useRef(null);
  const [isHeroVisible, setIsHeroVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.scrollY < 300;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkVisibility = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const inView = rect.bottom > 80 && rect.top < window.innerHeight - 80;
        setIsHeroVisible(inView);
      } else {
        setIsHeroVisible(window.scrollY < 400);
      }
    };

    // Immediate check on initial page load / direct URL access
    checkVisibility();

    // Use IntersectionObserver with passive scroll fallback for reliable scroll tracking
    if (typeof IntersectionObserver !== 'undefined' && heroRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsHeroVisible(entry.isIntersecting);
        },
        { threshold: [0, 0.05, 0.15] }
      );
      observer.observe(heroRef.current);
      window.addEventListener('scroll', checkVisibility, { passive: true });
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', checkVisibility);
      };
    } else {
      window.addEventListener('scroll', checkVisibility, { passive: true });
      return () => window.removeEventListener('scroll', checkVisibility);
    }
  }, []);

  // Preload both images in memory immediately on mount to prevent any delay during crossfade
  useEffect(() => {
    if (typeof window !== 'undefined') {
      [heroBgLight, heroBgDark].forEach((src) => {
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    }
  }, [heroBgLight, heroBgDark]);

  // Extract contact URLs
  const linkedInUrl = personal.socialLinks?.find(l => l.platform.toLowerCase() === 'linkedin')?.url || 'https://linkedin.com/in/nuwan-pinnaduwage';
  const githubUrl = personal.socialLinks?.find(l => l.platform.toLowerCase() === 'github')?.url || 'https://github.com/nuwan-pinnaduwage';
  const emailRaw = personal.email || personal.directEmail || personal.socialLinks?.find(l => l.platform.toLowerCase() === 'email')?.url?.replace('mailto:', '') || 'nuwan.pinnaduwage@example.com';
  const gmailMailto = emailRaw.startsWith('mailto:') ? emailRaw : `mailto:${emailRaw}`;

  // Consistent transition durations respecting prefers-reduced-motion
  // Crossfade: ~700ms (within requested 500-800ms)
  // Color transitions: ~500ms (within requested 300-500ms)
  const bgTransitionClass = shouldReduceMotion ? 'duration-0' : 'duration-700 ease-in-out';
  const colorTransitionClass = shouldReduceMotion ? 'duration-0' : 'duration-500 ease-in-out';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: defaultEase,
      },
    },
  };

  return (
    <section 
      id="hero"
      ref={heroRef}
      aria-label="Introduction and summary" 
      className={`relative isolate min-h-screen min-h-[100svh] flex flex-col justify-between pb-4 sm:pb-6 overflow-x-clip scroll-mt-28 bg-slate-50 dark:bg-[#060608] transition-colors ${colorTransitionClass}`}
    >
      {/* Hero Background System: Theme-specific Light Mode & Dark Mode layers */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* LIGHT MODE BACKGROUND LAYER (Original Background System Restored) */}
        <div 
          className={`absolute inset-0 transition-opacity ${bgTransitionClass} will-change-[opacity] ${
            darkMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Matching base color fill for Light Mode */}
          <div className="absolute inset-0 bg-slate-50" />

          {/* Right-Aligned Light Mode Hero Image (Positioned slightly towards center) */}
          <div className="hero-light-img-container absolute top-0 right-0 bottom-0 w-full sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-7/12 flex items-center justify-end overflow-hidden">
            <img
              src={heroBgLight}
              alt="Light Mode Hero Background"
              className="hero-light-img h-full w-full object-cover sm:object-contain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          {/* Smooth Blending Gradients: fills left side text area and fades into image */}
          <div className="absolute inset-y-0 left-0 w-full md:w-4/5 lg:w-3/4 bg-gradient-to-r from-slate-50 via-slate-50/95 sm:via-slate-50/85 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-50/90 via-slate-50/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent pointer-events-none" />
        </div>

        {/* DARK MODE BACKGROUND LAYER (Current Cinematic Black-and-White Portrait Preserved) */}
        <div 
          className={`hero-fullscreen-bg hero-fullscreen-bg-dark absolute inset-0 transition-opacity ${bgTransitionClass} will-change-[opacity] ${
            darkMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundImage: `url(${heroBgDark})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
            transform: 'translateZ(0)',
          }}
        >
          {/* Base matching color fill for deep charcoal/black tones */}
          <div className="absolute inset-0 bg-[#060608]/20" />

          {/* Subtle dark gradient overlay: Left side darker for white text readability, fading to reveal portrait on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-[#060608]/75 via-45% to-transparent pointer-events-none" />

          {/* Subtle top & bottom vignette: smooth blend under transparent navbar & above next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/50 via-transparent via-35% to-[#060608]/80 pointer-events-none" />

          {/* Mobile responsive darkening overlay to guarantee text readability without hiding the subject */}
          <div className="absolute inset-0 bg-[#060608]/30 md:hidden pointer-events-none" />
        </div>
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        {/* Main Hero Landing Content - Left-Aligned, vertically centered */}
        <div className="my-auto py-2 sm:py-3 lg:py-4 flex flex-col justify-center">
          <motion.div 
            className="flex flex-col items-start text-left w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl"
            variants={containerVariants}
            initial={isHeroVisible ? "visible" : "hidden"}
            animate={isHeroVisible ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            
            {/* 1. Availability Status Badge: directly above the greeting */}
            {personal.statusBadge?.available && (
              <motion.div 
                variants={itemVariants}
                className="mb-3.5 sm:mb-4 max-w-full"
              >
                <div 
                  className={`inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10.5px] sm:text-xs font-mono font-medium tracking-wide bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-sm backdrop-blur-sm transition-colors ${colorTransitionClass}`}
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    {isHeroVisible && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 bg-[#22c55e] opacity-75"></span>
                    )}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 bg-[#22c55e]"></span>
                  </span>
                  <span className="whitespace-normal sm:whitespace-nowrap font-semibold tracking-wider">
                    {(personal.statusBadge.text || "AVAILABLE FOR OPPORTUNITIES.").toUpperCase()}
                  </span>
                </div>
              </motion.div>
            )}

            {/* 2. Greeting: introductory line in muted text */}
            <motion.div 
              variants={itemVariants}
              className={`text-base sm:text-lg lg:text-xl font-medium text-slate-500 dark:text-slate-400 mb-1.5 sm:mb-2 transition-colors ${colorTransitionClass}`}
            >
              Hi, I'm
            </motion.div>

            {/* 3. Name: displayed with balanced line-height for multi-line viewports */}
            <motion.h1 
              variants={itemVariants}
              className={`font-heading font-bold hero-name-heading text-3xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.18] sm:leading-[1.22] whitespace-normal sm:whitespace-nowrap break-words transition-colors ${colorTransitionClass}`}
            >
              {personal.name || "Nuwan Pinnaduwage"}
            </motion.h1>

            {/* 4. Subtitle / professional role / degree (Balanced 14-16px margin and 1.45 line-height) */}
            <motion.div 
              variants={itemVariants}
              className={`mt-3.5 sm:mt-4 text-sm sm:text-lg lg:text-xl font-medium font-sans text-violet-600 dark:text-violet-400 leading-[1.45] transition-colors ${colorTransitionClass}`}
            >
              {degreeProgram}
            </motion.div>

            {/* 5. University: supporting text */}
            <motion.div 
              variants={itemVariants}
              className={`mt-1 sm:mt-1.5 text-xs sm:text-sm font-sans text-slate-500 dark:text-slate-400 leading-normal transition-colors ${colorTransitionClass}`}
            >
              {personal.university || "State University of Technology"}
            </motion.div>

            {/* 6. Career path */}
            <motion.div 
              variants={itemVariants}
              className={`mt-3 sm:mt-3.5 flex items-start sm:items-center gap-2 text-xs sm:text-sm lg:text-base font-medium text-slate-700 dark:text-slate-300 leading-normal transition-colors ${colorTransitionClass}`}
            >
              <Code className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>{careerPath}</span>
            </motion.div>

            {/* 7. Location */}
            <motion.div 
              variants={itemVariants}
              className={`mt-1.5 sm:mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-normal transition-colors ${colorTransitionClass}`}
            >
              <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
              <span>{personal.location}</span>
            </motion.div>

            {/* 8. Description Paragraph (Comfortable line spacing: 1.75-1.8 with constrained max-width) */}
            {(personal.bioShort || personal.summary || personal.description) && (
              <motion.p 
                variants={itemVariants}
                className={`mt-3.5 sm:mt-4 text-xs sm:text-sm lg:text-base font-sans text-slate-600 dark:text-slate-300 leading-[1.75] sm:leading-[1.8] max-w-xl transition-colors ${colorTransitionClass}`}
              >
                {personal.bioShort || personal.summary || personal.description}
              </motion.p>
            )}

            {/* 9. Call-to-Action Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 sm:mt-7 lg:mt-8 flex flex-wrap items-center gap-2 sm:gap-3.5 w-full sm:w-auto"
            >
              <a
                href="#projects"
                className={`inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-md transition-all ${colorTransitionClass} active:scale-95 group touch-manipulation`}
              >
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenCV}
                className={`inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/80 hover:bg-white dark:bg-dark-850 dark:hover:bg-dark-800 text-slate-900 dark:text-slate-100 font-medium text-xs sm:text-sm border border-slate-200 dark:border-slate-800 transition-all ${colorTransitionClass} active:scale-95 shadow-sm backdrop-blur-sm touch-manipulation`}
              >
                <FileDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500 transition-colors ${colorTransitionClass}`} />
                <span>Download CV</span>
              </button>

              <a
                href="#contact"
                className={`inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium text-xs sm:text-sm hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all ${colorTransitionClass} backdrop-blur-sm touch-manipulation`}
              >
                <span>Contact Me</span>
              </a>
            </motion.div>

          </motion.div>
        </div>

        {/* 9. Centered Social Contact Buttons Group (LinkedIn, GitHub, Gmail) */}
        <motion.div 
          variants={itemVariants}
          initial={isHeroVisible ? "visible" : "hidden"}
          animate={isHeroVisible ? "visible" : "hidden"}
          className={`w-full mt-3 sm:mt-4 lg:mt-5 pt-3 sm:pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center shrink-0 transition-colors ${colorTransitionClass}`}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7">
            {/* LinkedIn */}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-xl text-black dark:text-white hover:opacity-75 transition-all hover:scale-110 active:scale-95"
            >
              <LinkedinIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>

            {/* GitHub */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-xl text-black dark:text-white hover:opacity-75 transition-all hover:scale-110 active:scale-95"
            >
              <GithubIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>

            {/* Gmail */}
            <a
              href={gmailMailto}
              aria-label="Send email via Gmail"
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-xl text-black dark:text-white hover:opacity-75 transition-all hover:scale-110 active:scale-95"
            >
              <GmailIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

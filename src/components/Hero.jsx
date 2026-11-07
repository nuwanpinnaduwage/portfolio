import React, { useEffect, useRef, useState, useMemo } from 'react';
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
import HeroAnimatedText from './animations/HeroAnimatedText';
import heroLightImg from '../assets/hero-light.png';
import { resolveLayerColor } from '../utils/heroTextRange';

const defaultEase = [0.22, 1, 0.36, 1];

export default function Hero({ 
  onOpenCV, 
  data, 
  settings, 
  darkMode, 
  customHero, 
  replayKey = 0,
  isEditorMode = false,
  selectedLayerId = null,
  selectedSegmentId = null,
  onSelectLayer = null,
  onSelectSegment = null,
  isPaused = false,
  viewMode = 'desktop' // 'desktop' | 'tablet' | 'mobile'
}) {
  const personal = data || portfolioData.personal;
  const shouldReduceMotion = useReducedMotion();

  // Active Hero Studio Pro (structured layers) configuration
  const savedDraft = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const rawDraft = localStorage.getItem('portfolio_hero_studio_draft');
      if (rawDraft) return JSON.parse(rawDraft);
      const rawStaged = localStorage.getItem('portfolio_staged_data');
      if (rawStaged) {
        const parsed = JSON.parse(rawStaged);
        return parsed.settings?.heroStudioPro || parsed.personal?.heroStudioPro || null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }, [darkMode]);

  const heroStudioPro = customHero?.heroStudioPro || 
                        (customHero?.layers ? customHero : null) || 
                        savedDraft?.heroStudioPro ||
                        (savedDraft?.layers ? savedDraft : null) ||
                        settings?.heroStudioPro || 
                        settings?.heroDesign?.heroStudioPro || 
                        personal?.heroStudioPro || 
                        personal?.heroDesign?.heroStudioPro || 
                        null;

  // Active Hero Design and Content configuration
  const heroConfig = customHero || savedDraft?.heroDesign || settings?.heroDesign || settings?.heroStudioPro || personal?.heroDesign || heroStudioPro || null;
  const heroContent = heroConfig?.content || {};
  const heroDesign = heroConfig?.design || {};
  const heroAnimations = heroConfig?.animations || {};

  const heroHeading = heroContent.heading || personal.name || "Nuwan Pinnaduwage";
  const heroHighlight = heroContent.highlightedText || "";
  const heroSubtitle = heroContent.subtitle || personal.degree || personal.degreeProgram || "Bachelor of Science in Computer Science";
  const heroCareer = heroContent.careerPath || personal.careerPath || personal.specialization || "Full-Stack Development & Distributed Systems";
  const heroUniversity = heroContent.university || personal.university || "Edith Cowan University";
  const heroLocation = heroContent.location || personal.location || "Perth, Australia & Colombo, Sri Lanka";
  const heroDescription = heroContent.description || personal.bioShort || personal.summary || personal.description || "";
  const heroGreeting = heroContent.greeting || "Hi, I'm";

  const heroDefaultDark = heroDesign.colors?.dark || heroDesign.textColor || '#FFFFFF';
  const heroDefaultLight = heroDesign.colors?.light || heroDesign.lightTextColor || '#0F172A';
  const heroTextColor = darkMode ? heroDefaultDark : heroDefaultLight;

  // Support theme-aware accent colors in fallback mode as well:
  // Dark mode uses accentColor (or #16C96B), Light mode uses lightAccentColor (or #047857)
  const heroAccentDark = heroDesign.colors?.accentDark || heroDesign.accentColor || '#16C96B';
  const heroAccentLight = heroDesign.colors?.accentLight || heroDesign.lightAccentColor || '#047857';
  const heroAccentColor = darkMode ? heroAccentDark : heroAccentLight;
  const heroTextAlign = heroDesign.textAlign || 'left';

  // Background images for Light and Dark modes
  const heroBgLight = settings?.heroBgLight || personal?.heroBackgrounds?.light || heroLightImg || '/hero-light.png';
  const heroBgDark = settings?.heroBgDark || personal?.heroBackgrounds?.dark || heroDarkImg || '/hero-dark.png';

  // Visibility tracking for Hero section
  const heroRef = useRef(null);
  const [isHeroVisible, setIsHeroVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.scrollY < 300;
    }
    return true;
  });

  useEffect(() => {
    if (isEditorMode) {
      setIsHeroVisible(true);
      return;
    }
    if (typeof window === 'undefined') return;

    let active = true;
    if (typeof IntersectionObserver !== 'undefined' && heroRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && active) {
            setIsHeroVisible(true);
            observer.disconnect(); // Play entrance once by default
          }
        },
        { threshold: [0, 0.05, 0.15] }
      );
      observer.observe(heroRef.current);
      return () => {
        active = false;
        observer.disconnect();
      };
    } else {
      setIsHeroVisible(true);
    }
  }, [isEditorMode]);

  // Preload background images
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

  // Social contact URLs
  const linkedInUrl = personal.socialLinks?.find(l => (l.platform || l.label || '').toLowerCase().includes('linkedin'))?.url || 'https://linkedin.com/in/nuwan-pinnaduwage';
  const githubUrl = personal.socialLinks?.find(l => (l.platform || l.label || '').toLowerCase().includes('git'))?.url || 'https://github.com/nuwan-pinnaduwage';
  
  const gmailSocialLink = personal.socialLinks?.find(l => {
    const p = (l.platform || l.label || '').toLowerCase();
    return p.includes('gmail') || p.includes('mail') || p.includes('email');
  });

  const getResolvedEmailUrl = (configuredUrl, fallbackEmail) => {
    const raw = (configuredUrl || '').trim();
    if (raw) {
      if (/^https?:\/\//i.test(raw)) return raw;
      if (raw.toLowerCase().startsWith('mailto:')) return raw;
      return `mailto:${raw}`;
    }
    const fb = (fallbackEmail || '').trim();
    if (fb) {
      if (/^https?:\/\//i.test(fb)) return fb;
      if (fb.toLowerCase().startsWith('mailto:')) return fb;
      return `mailto:${fb}`;
    }
    return 'mailto:nuwan.pinnaduwage@example.com';
  };

  const gmailUrl = getResolvedEmailUrl(
    gmailSocialLink?.url,
    personal.email || personal.directEmail
  );

  const bgTransitionClass = shouldReduceMotion ? 'duration-0' : 'duration-700 ease-in-out';
  const colorTransitionClass = shouldReduceMotion ? 'duration-0' : 'duration-500 ease-in-out';

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: defaultEase,
      },
    },
  }), [shouldReduceMotion]);

  // Helper to resolve responsive font size based on current viewMode
  const resolveResponsiveFontSize = (fontSizeObj, fallback) => {
    if (!fontSizeObj) return fallback;
    if (typeof fontSizeObj === 'string') return fontSizeObj;
    return fontSizeObj[viewMode] || fontSizeObj.desktop || fallback;
  };

  // Helper to render layer wrapper with optional editor selection ring and click handler
  const renderLayerWrapper = (layerId, layerName, content, extraClass = '', extraStyle = {}) => {
    const isSelected = isEditorMode && selectedLayerId === layerId;
    return (
      <motion.div
        key={layerId}
        data-layer-id={layerId}
        variants={itemVariants}
        onClick={(e) => {
          if (isEditorMode && onSelectLayer) {
            e.stopPropagation();
            onSelectLayer(layerId);
          }
        }}
        style={extraStyle}
        className={`relative transition-all select-text ${extraClass} ${
          isEditorMode 
            ? 'cursor-pointer hover:ring-1 hover:ring-emerald-400/60 rounded px-1 -mx-1' 
            : ''
        } ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-500/5 rounded px-1 -mx-1' : ''}`}
      >
        {isEditorMode && isSelected && (
          <span className="absolute -top-3 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500 text-black shadow-xs z-20 pointer-events-none uppercase">
            {layerName}
          </span>
        )}
        {content}
      </motion.div>
    );
  };

  // If Hero Studio Pro structured layers exist, render layer-based architecture
  const hasStudioProLayers = Array.isArray(heroStudioPro?.layers) && heroStudioPro.layers.length > 0;
  const sortedLayers = hasStudioProLayers 
    ? [...heroStudioPro.layers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <section 
      id="hero"
      ref={heroRef}
      aria-label="Introduction and summary" 
      className={`relative isolate min-h-screen min-h-[100svh] flex flex-col justify-between pb-4 sm:pb-6 overflow-x-clip scroll-mt-[var(--navbar-height)] bg-slate-50 dark:bg-[#060608] transition-colors ${colorTransitionClass}`}
    >
      {/* Hero Background System: Theme-specific Light Mode & Dark Mode layers */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* LIGHT MODE BACKGROUND LAYER */}
        <div 
          className={`absolute inset-0 transition-opacity ${bgTransitionClass} will-change-[opacity] ${
            darkMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ transform: 'translateZ(0)' }}
        >
          <div className="absolute inset-0 bg-slate-50" />
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
          <div className="absolute inset-y-0 left-0 w-full md:w-4/5 lg:w-3/4 bg-gradient-to-r from-slate-50 via-slate-50/95 sm:via-slate-50/85 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-50/90 via-slate-50/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent pointer-events-none" />
        </div>

        {/* DARK MODE BACKGROUND LAYER */}
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
          <div className="absolute inset-0 bg-[#060608]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-[#060608]/75 via-45% to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/50 via-transparent via-35% to-[#060608]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-[#060608]/30 md:hidden pointer-events-none" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        {/* Main Hero Landing Content */}
        <div className="my-auto py-2 sm:py-3 lg:py-4 flex flex-col justify-center">
          <motion.div 
            className="flex flex-col items-start text-left w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl"
            variants={containerVariants}
            initial={isHeroVisible ? "visible" : "hidden"}
            animate={isHeroVisible ? "visible" : "hidden"}
            whileInView={isEditorMode ? undefined : "visible"}
            viewport={{ once: true, amount: 0.1 }}
          >
            
            {/* If Studio Pro structured layers are active, render them dynamically */}
            {hasStudioProLayers ? (
              sortedLayers.map((layer) => {
                if (layer.visible === false) return null;

                const layerTypo = layer.typography || {};
                const layerSpacing = layer.spacing || {};
                const layerAnimation = layer.animation || {};
                const layerColor = resolveLayerColor(layer, darkMode, heroTextColor);
                const layerFontSize = resolveResponsiveFontSize(layerTypo.fontSize, undefined);
                const layerTextAlign = layerTypo.textAlign || heroTextAlign;

                const wrapperStyle = {
                  textAlign: layerTextAlign,
                  marginTop: layerSpacing.spaceAbove || undefined,
                  marginBottom: layerSpacing.spaceBelow || undefined,
                  padding: layerSpacing.padding || undefined,
                  maxWidth: layerSpacing.maxWidth || undefined,
                  width: '100%',
                };

                const textStyle = {
                  fontFamily: layerTypo.fontFamily ? `var(--font-${layerTypo.fontFamily.toLowerCase().replace(/\s+/g, '-')}, ${layerTypo.fontFamily}, sans-serif)` : undefined,
                  fontSize: layerFontSize || undefined,
                  fontWeight: layerTypo.fontWeight || undefined,
                  fontStyle: layerTypo.fontStyle || undefined,
                  lineHeight: layerSpacing.lineHeight || layerTypo.lineHeight || undefined,
                  letterSpacing: layerSpacing.letterSpacing || layerTypo.letterSpacing || undefined,
                  wordSpacing: layerSpacing.wordSpacing || layerTypo.wordSpacing || undefined,
                  textTransform: layerTypo.textTransform || undefined,
                  textDecoration: layerTypo.textDecoration || undefined,
                  opacity: layerTypo.textOpacity !== undefined ? layerTypo.textOpacity : undefined,
                };

                // Badge Layer
                if (layer.id === 'badge' || layer.type === 'badge') {
                  const badgeAvailable = personal.statusBadge?.available !== false;
                  if (!badgeAvailable && !isEditorMode) return null;

                  return renderLayerWrapper(
                    layer.id,
                    layer.name || 'Status Badge',
                    <div className="mb-3.5 sm:mb-4 max-w-full">
                      <div 
                        className={`inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md text-[11px] font-mono font-medium tracking-wider bg-[#F5F7FA] dark:bg-[#121212] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/35 dark:border-[#262626] shadow-subtle transition-colors ${colorTransitionClass}`}
                        style={textStyle}
                      >
                        <span className="relative flex h-2 w-2 shrink-0">
                          {isHeroVisible && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"></span>
                          )}
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="whitespace-normal sm:whitespace-nowrap font-semibold">
                          {(personal.statusBadge?.text || layer.rawText || "AVAILABLE FOR OPPORTUNITIES.").toUpperCase()}
                        </span>
                      </div>
                    </div>,
                    'w-auto',
                    wrapperStyle
                  );
                }

                // Heading Layer (H1)
                if (layer.id === 'heading' || layer.type === 'heading') {
                  return renderLayerWrapper(
                    layer.id,
                    layer.name || 'Main Heading',
                    <HeroAnimatedText
                      as="h1"
                      text={layer.rawText || heroHeading}
                      highlight={heroHighlight}
                      segments={layer.segments}
                      animation={layerAnimation}
                      accentColor={heroAccentColor}
                      textColor={layerColor}
                      darkMode={darkMode}
                      replayKey={replayKey}
                      isEditorMode={isEditorMode}
                      selectedSegmentId={selectedSegmentId}
                      onSelectSegment={onSelectSegment}
                      isPaused={isPaused}
                      style={textStyle}
                      className={`font-heading font-bold hero-name-heading text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.18] sm:leading-[1.22] whitespace-normal break-words transition-colors ${colorTransitionClass}`}
                    />,
                    'w-full',
                    wrapperStyle
                  );
                }

                // Subtitle Layer
                if (layer.id === 'subtitle' || layer.type === 'subtitle') {
                  return renderLayerWrapper(
                    layer.id,
                    layer.name || 'Subtitle',
                    <HeroAnimatedText
                      as="div"
                      text={layer.rawText || heroSubtitle}
                      segments={layer.segments}
                      animation={layerAnimation}
                      accentColor={heroAccentColor}
                      textColor={layerColor}
                      darkMode={darkMode}
                      replayKey={replayKey}
                      isEditorMode={isEditorMode}
                      selectedSegmentId={selectedSegmentId}
                      onSelectSegment={onSelectSegment}
                      isPaused={isPaused}
                      style={textStyle}
                      className={`text-sm sm:text-lg lg:text-xl font-medium font-sans leading-[1.45] transition-colors ${colorTransitionClass}`}
                    />,
                    'w-full',
                    wrapperStyle
                  );
                }

                // Description Layer
                if (layer.id === 'description' || layer.type === 'description') {
                  return renderLayerWrapper(
                    layer.id,
                    layer.name || 'Description',
                    <HeroAnimatedText
                      as="p"
                      text={layer.rawText || heroDescription}
                      segments={layer.segments}
                      animation={layerAnimation}
                      accentColor={heroAccentColor}
                      textColor={layerColor}
                      darkMode={darkMode}
                      replayKey={replayKey}
                      isEditorMode={isEditorMode}
                      selectedSegmentId={selectedSegmentId}
                      onSelectSegment={onSelectSegment}
                      isPaused={isPaused}
                      style={textStyle}
                      className={`text-xs sm:text-sm lg:text-base font-sans text-slate-600 dark:text-slate-300 leading-[1.75] sm:leading-[1.8] max-w-xl transition-colors ${colorTransitionClass}`}
                    />,
                    'w-full',
                    wrapperStyle
                  );
                }

                // Greeting Layer
                if (layer.id === 'greeting' || layer.type === 'greeting') {
                  return renderLayerWrapper(
                    layer.id,
                    layer.name || 'Greeting',
                    <HeroAnimatedText
                      as="div"
                      text={layer.rawText || heroGreeting}
                      segments={layer.segments}
                      animation={layerAnimation}
                      accentColor={heroAccentColor}
                      textColor={layerColor}
                      darkMode={darkMode}
                      replayKey={replayKey}
                      isEditorMode={isEditorMode}
                      selectedSegmentId={selectedSegmentId}
                      onSelectSegment={onSelectSegment}
                      isPaused={isPaused}
                      style={textStyle}
                      className={`text-base sm:text-lg lg:text-xl font-medium text-slate-500 dark:text-slate-400 transition-colors ${colorTransitionClass}`}
                    />,
                    'w-full',
                    wrapperStyle
                  );
                }

                // University Layer
                if (layer.id === 'university') {
                  return renderLayerWrapper(
                    layer.id,
                    layer.name || 'University',
                    <HeroAnimatedText
                      as="div"
                      text={layer.rawText || heroUniversity}
                      segments={layer.segments}
                      animation={layerAnimation}
                      accentColor={heroAccentColor}
                      textColor={layerColor}
                      darkMode={darkMode}
                      replayKey={replayKey}
                      isEditorMode={isEditorMode}
                      selectedSegmentId={selectedSegmentId}
                      onSelectSegment={onSelectSegment}
                      isPaused={isPaused}
                      style={textStyle}
                      className={`text-xs sm:text-sm font-sans text-slate-500 dark:text-slate-400 leading-normal transition-colors ${colorTransitionClass}`}
                    />,
                    'w-full',
                    wrapperStyle
                  );
                }

                // Career Layer
                if (layer.id === 'career') {
                  return renderLayerWrapper(
                    layer.id,
                    layer.name || 'Career Path',
                    <div className="flex items-start sm:items-center gap-2">
                      <Code className="w-4 h-4 text-[#2D3748] dark:text-[#A0AEC0] shrink-0 mt-0.5 sm:mt-0" />
                      <HeroAnimatedText
                        as="span"
                        text={layer.rawText || heroCareer}
                        segments={layer.segments}
                        animation={layerAnimation}
                        accentColor={heroAccentColor}
                        textColor={layerColor}
                        darkMode={darkMode}
                        replayKey={replayKey}
                        isEditorMode={isEditorMode}
                        selectedSegmentId={selectedSegmentId}
                        onSelectSegment={onSelectSegment}
                        isPaused={isPaused}
                        style={textStyle}
                        className={`text-xs sm:text-sm lg:text-base font-medium text-slate-700 dark:text-slate-300 leading-normal transition-colors ${colorTransitionClass}`}
                      />
                    </div>,
                    'w-full',
                    wrapperStyle
                  );
                }

                // Location Layer
                if (layer.id === 'location') {
                  return renderLayerWrapper(
                    layer.id,
                    layer.name || 'Location',
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                      <HeroAnimatedText
                        as="span"
                        text={layer.rawText || heroLocation}
                        segments={layer.segments}
                        animation={layerAnimation}
                        accentColor={heroAccentColor}
                        textColor={layerColor}
                        darkMode={darkMode}
                        replayKey={replayKey}
                        isEditorMode={isEditorMode}
                        selectedSegmentId={selectedSegmentId}
                        onSelectSegment={onSelectSegment}
                        isPaused={isPaused}
                        style={textStyle}
                        className={`text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-normal transition-colors ${colorTransitionClass}`}
                      />
                    </div>,
                    'w-full',
                    wrapperStyle
                  );
                }

                // Custom Extra Layer
                return renderLayerWrapper(
                  layer.id,
                  layer.name || 'Custom Layer',
                  <HeroAnimatedText
                    as="div"
                    text={layer.rawText || ''}
                    segments={layer.segments}
                    animation={layerAnimation}
                    accentColor={heroAccentColor}
                    textColor={layerColor}
                    darkMode={darkMode}
                    replayKey={replayKey}
                    isEditorMode={isEditorMode}
                    selectedSegmentId={selectedSegmentId}
                    onSelectSegment={onSelectSegment}
                    isPaused={isPaused}
                    style={textStyle}
                    className={`text-sm sm:text-base transition-colors ${colorTransitionClass}`}
                  />,
                  'w-full',
                  wrapperStyle
                );
              })
            ) : (
              /* Fallback to Standard Hero Elements when no custom layers exist */
              <>
                {/* 1. Status Badge */}
                {personal.statusBadge?.available && (
                  <motion.div 
                    variants={itemVariants}
                    className="mb-3.5 sm:mb-4 max-w-full"
                  >
                    <div 
                      className={`inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md text-[11px] font-mono font-medium tracking-wider bg-[#F5F7FA] dark:bg-[#121212] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/35 dark:border-[#262626] shadow-subtle transition-colors ${colorTransitionClass}`}
                    >
                      <span className="relative flex h-2 w-2 shrink-0">
                        {isHeroVisible && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"></span>
                        )}
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="whitespace-normal sm:whitespace-nowrap font-semibold">
                        {(personal.statusBadge.text || "AVAILABLE FOR OPPORTUNITIES.").toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* 2. Greeting */}
                <motion.div 
                  variants={itemVariants}
                  className={`text-base sm:text-lg lg:text-xl font-medium text-slate-500 dark:text-slate-400 mb-1.5 sm:mb-2 transition-colors ${colorTransitionClass}`}
                >
                  {heroGreeting}
                </motion.div>

                {/* 3. Main Heading */}
                <motion.div 
                  variants={itemVariants} 
                  className="w-full"
                  style={{
                    textAlign: heroTextAlign,
                    marginBottom: heroDesign.headingMarginBottom || undefined,
                  }}
                >
                  <HeroAnimatedText
                    as="h1"
                    text={heroHeading}
                    highlight={heroHighlight}
                    animation={heroAnimations.heading}
                    accentColor={heroAccentColor}
                    textColor={heroTextColor}
                    darkMode={darkMode}
                    replayKey={replayKey}
                    style={{
                      fontWeight: heroDesign.headingFontWeight || '700',
                      letterSpacing: heroDesign.letterSpacing === 'tighter' ? '-0.05em' : heroDesign.letterSpacing === 'tight' ? '-0.025em' : heroDesign.letterSpacing === 'wide' ? '0.05em' : heroDesign.letterSpacing === 'wider' ? '0.1em' : undefined,
                      lineHeight: heroDesign.lineHeight || undefined,
                    }}
                    className={`font-heading font-bold hero-name-heading text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.18] sm:leading-[1.22] whitespace-normal sm:whitespace-nowrap break-words transition-colors ${colorTransitionClass}`}
                  />
                </motion.div>

                {/* 4. Subtitle */}
                <motion.div 
                  variants={itemVariants}
                  className="w-full"
                  style={{
                    textAlign: heroTextAlign,
                    marginBottom: heroDesign.subtitleMarginBottom || undefined,
                  }}
                >
                  <HeroAnimatedText
                    as="div"
                    text={heroSubtitle}
                    animation={heroAnimations.subtitle}
                    accentColor={heroAccentColor}
                    textColor={heroTextColor}
                    darkMode={darkMode}
                    replayKey={replayKey}
                    style={{
                      fontWeight: heroDesign.subtitleFontWeight || '600',
                    }}
                    className={`mt-3 sm:mt-3.5 text-sm sm:text-lg lg:text-xl font-medium font-sans leading-[1.45] transition-colors ${colorTransitionClass}`}
                  />
                </motion.div>

                {/* 5. University */}
                <motion.div 
                  variants={itemVariants}
                  className={`mt-1 sm:mt-1.5 text-xs sm:text-sm font-sans text-slate-500 dark:text-slate-400 leading-normal transition-colors ${colorTransitionClass}`}
                >
                  {heroUniversity}
                </motion.div>

                {/* 6. Career path */}
                <motion.div 
                  variants={itemVariants}
                  className={`mt-3 sm:mt-3.5 flex items-start sm:items-center gap-2 text-xs sm:text-sm lg:text-base font-medium text-slate-700 dark:text-slate-300 leading-normal transition-colors ${colorTransitionClass}`}
                >
                  <Code className="w-4 h-4 text-[#2D3748] dark:text-[#A0AEC0] shrink-0 mt-0.5 sm:mt-0" />
                  <span>{heroCareer}</span>
                </motion.div>

                {/* 7. Location */}
                <motion.div 
                  variants={itemVariants}
                  className={`mt-1.5 sm:mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-normal transition-colors ${colorTransitionClass}`}
                >
                  <MapPin className="w-4 h-4 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                  <span>{heroLocation}</span>
                </motion.div>

                {/* 8. Description */}
                {heroDescription && (
                  <motion.div 
                    variants={itemVariants}
                    className="w-full"
                    style={{
                      textAlign: heroTextAlign,
                      marginBottom: heroDesign.descriptionMarginBottom || undefined,
                    }}
                  >
                    <HeroAnimatedText
                      as="p"
                      text={heroDescription}
                      animation={heroAnimations.description}
                      accentColor={heroAccentColor}
                      textColor={heroTextColor}
                      darkMode={darkMode}
                      replayKey={replayKey}
                      style={{
                        fontWeight: heroDesign.descriptionFontWeight || '400',
                      }}
                      className={`mt-3.5 sm:mt-4 text-xs sm:text-sm lg:text-base font-sans text-slate-600 dark:text-slate-300 leading-[1.75] sm:leading-[1.8] max-w-xl transition-colors ${colorTransitionClass}`}
                    />
                  </motion.div>
                )}
              </>
            )}

            {/* 9. Call-to-Action Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 sm:mt-7 lg:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <a
                href="#projects"
                className="btn-primary-pill touch-manipulation"
              >
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenCV}
                className="btn-secondary-pill cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </button>

              <a
                href="#contact"
                className="btn-text-minimal touch-manipulation"
              >
                <span>Get in Touch</span>
              </a>
            </motion.div>

          </motion.div>
        </div>

        {/* 10. Social Contact Buttons Group */}
        <motion.div 
          variants={itemVariants}
          initial={isHeroVisible ? "visible" : "hidden"}
          animate={isHeroVisible ? "visible" : "hidden"}
          className={`w-full mt-3 sm:mt-4 lg:mt-5 pt-3 sm:pt-4 border-t border-slate-200/60 dark:border-[#222222] flex items-center justify-center shrink-0 transition-colors ${colorTransitionClass}`}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7">
            {/* LinkedIn */}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#121212] transition-colors active:scale-95"
            >
              <LinkedinIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>

            {/* GitHub */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#121212] transition-colors active:scale-95"
            >
              <GithubIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>

            {/* Gmail */}
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send email via Gmail"
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#121212] transition-colors active:scale-95"
            >
              <GmailIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

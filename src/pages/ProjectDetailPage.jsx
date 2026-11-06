import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ExternalLink, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Shield, 
  Network, 
  Cpu, 
  Layers, 
  FileText, 
  Download, 
  Sun, 
  Moon, 
  Share2, 
  Check, 
  Sparkles,
  AlertCircle,
  FileCode,
  FolderArchive,
  Compass,
  Zap,
  Film,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { GithubIcon } from '../components/BrandIcons';
import { portfolioService } from '../services/portfolioService';
import { loadGoogleFont } from '../utils/googleFonts';
import { sanitizeHtml } from '../utils/richTextSanitizer';

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Theme state synced with portfolio_theme_mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('portfolio_theme_mode') || localStorage.getItem('theme');
    return saved !== null ? saved === 'dark' : true;
  });

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    const mode = next ? 'dark' : 'light';
    localStorage.setItem('portfolio_theme_mode', mode);
    localStorage.setItem('cs-portfolio-theme', mode);
    localStorage.setItem('theme', mode);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch project by slug
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadProject() {
      try {
        const { data, error: fetchErr } = await portfolioService.fetchProjectBySlug(slug);
        
        if (!isMounted) return;

        if (fetchErr || !data) {
          setError(fetchErr || 'Project not found');
          setLoading(false);
          return;
        }

        setProject(data);
        setSelectedImage(data.image || (data.gallery && data.gallery[0]) || null);

        // Preload any custom Google Fonts defined in sections & inline spans
        if (Array.isArray(data.sections)) {
          data.sections.forEach(sec => {
            (sec.columns || []).forEach(col => {
              (col.blocks || []).forEach(block => {
                if (block.fontFamily) {
                  loadGoogleFont(block.fontFamily);
                }
                if (block.content && typeof block.content === 'string') {
                  const fontMatches = block.content.matchAll(/font-family:\s*['"]?([^;'"]+)['"]?/gi);
                  for (const match of fontMatches) {
                    if (match[1]) loadGoogleFont(match[1]);
                  }
                }
              });
            });
          });
        }

        // Set document title & meta tags for SEO
        document.title = `${data.title} | Technical Case Study`;

        // Fetch related projects
        const { data: fullPortfolio } = await portfolioService.fetchPortfolio();
        if (fullPortfolio?.projects?.items) {
          const others = fullPortfolio.projects.items.filter(
            p => p.id !== data.id && p.slug !== data.slug && p.is_published !== false
          );
          // Prefer same category first
          const sameCategory = others.filter(p => p.category === data.category);
          const otherCategory = others.filter(p => p.category !== data.category);
          setRelatedProjects([...sameCategory, ...otherCategory].slice(0, 3));
        }

        setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load project');
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // -------------------------------------------------------------
  // CINEMATIC DIRECTION-AWARE SECTION NAVIGATION ENGINE
  // -------------------------------------------------------------
  const [cinematicScrollEnabled, setCinematicScrollEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_portfolio_cinematic_scroll');
      if (saved !== null) return saved === 'true';
      const legacySaved = localStorage.getItem('cs_portfolio_smart_scroll');
      if (legacySaved !== null) return legacySaved === 'true';
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return !prefersReduced;
    } catch {
      return true;
    }
  });

  // Active section tracking state
  const [activeSection, setActiveSection] = useState({
    id: 'section-hero',
    title: 'Project Intro',
    index: 1,
    total: 1
  });

  const isTransitioningRef = useRef(false);
  const lastTransitionTimeRef = useRef(0);
  const transitionTimeoutRef = useRef(null);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);

  // Extract Scroll Effects Settings from project customStyling
  const scrollEffects = {
    enablePremiumScroll: project?.customStyling?.scrollEffects?.enablePremiumScroll ?? (project?.customStyling?.smartScrollEnabled !== false),
    transitionStyle: project?.customStyling?.scrollEffects?.transitionStyle || 'cinematic-fade',
    animationSpeed: project?.customStyling?.scrollEffects?.animationSpeed || 'normal',
    staggerContent: project?.customStyling?.scrollEffects?.staggerContent !== false,
    imageAnimation: project?.customStyling?.scrollEffects?.imageAnimation !== false,
    mobileBehavior: project?.customStyling?.scrollEffects?.mobileBehavior || 'smooth-snap',
    reducedMotionFallback: project?.customStyling?.scrollEffects?.reducedMotionFallback !== false,
  };

  const speedSettings = {
    slow: { duration: 0.9, ms: 900 },
    normal: { duration: 0.75, ms: 750 },
    fast: { duration: 0.55, ms: 550 },
  };
  const activeSpeed = speedSettings[scrollEffects.animationSpeed] || speedSettings.normal;

  // Reduced motion preference detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  const shouldDisableMotion = prefersReducedMotion && scrollEffects.reducedMotionFallback;

  // Framer Motion entrance animation variants
  const sectionVariants = shouldDisableMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  } : scrollEffects.transitionStyle === 'smooth-slide' ? {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: activeSpeed.duration,
        ease: [0.25, 1, 0.5, 1],
        staggerChildren: scrollEffects.staggerContent ? 0.08 : 0,
      }
    }
  } : scrollEffects.transitionStyle === 'minimal' ? {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.45,
        staggerChildren: scrollEffects.staggerContent ? 0.05 : 0,
      }
    }
  } : {
    // 'cinematic-fade'
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: activeSpeed.duration,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: scrollEffects.staggerContent ? 0.08 : 0,
      }
    }
  };

  const itemVariant = shouldDisableMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  } : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  const imageVariant = shouldDisableMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  } : scrollEffects.imageAnimation ? {
    hidden: { opacity: 0, scale: 0.96, y: 18 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: activeSpeed.duration, ease: [0.22, 1, 0.36, 1] } }
  } : itemVariant;

  // Calculates the index of the section currently occupying the majority of the viewport
  const getActiveSectionIndex = (sections, headerOffset = 70) => {
    let bestIdx = 0;
    let bestVisibleHeight = -Infinity;

    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      const visibleTop = Math.max(headerOffset, rect.top);
      const visibleBottom = Math.min(window.innerHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > bestVisibleHeight) {
        bestVisibleHeight = visibleHeight;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  // Navigates smoothly to section by index
  const navigateToSection = (targetIndex, sections, headerOffset = 70) => {
    if (targetIndex < 0 || targetIndex >= sections.length) return false;
    const targetEl = sections[targetIndex];
    if (!targetEl) return false;

    isTransitioningRef.current = true;
    lastTransitionTimeRef.current = Date.now();

    const rect = targetEl.getBoundingClientRect();
    const targetY = Math.round(window.scrollY + rect.top - headerOffset);
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clampedTargetY = Math.max(0, Math.min(targetY, maxScrollY));

    const title = targetEl.getAttribute('data-section-title') || `Section ${targetIndex + 1}`;
    setActiveSection({
      id: targetEl.id,
      title,
      index: targetIndex + 1,
      total: sections.length
    });

    window.scrollTo({
      top: clampedTargetY,
      behavior: 'smooth'
    });

    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
    }, activeSpeed.ms + 100);

    return true;
  };

  // Toggle cinematic scroll on the fly
  const toggleCinematicScroll = () => {
    setCinematicScrollEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('cs_portfolio_cinematic_scroll', String(next));
        localStorage.setItem('cs_portfolio_smart_scroll', String(next));
        if (project?.slug) sessionStorage.setItem(`cinematic_scroll_override_${project.slug}`, String(next));
      } catch {}
      return next;
    });
  };

  // Sync state with project settings when project loads
  useEffect(() => {
    if (!project) return;
    const effects = project.customStyling?.scrollEffects;
    const enabledSetting = effects?.enablePremiumScroll ?? project.customStyling?.smartScrollEnabled;
    if (typeof enabledSetting === 'boolean') {
      const sessionOverride = sessionStorage.getItem(`cinematic_scroll_override_${project.slug}`);
      if (!sessionOverride) {
        setCinematicScrollEnabled(enabledSetting);
      }
    }
  }, [project]);

  // Reset lock and clear timeouts on route changes
  useEffect(() => {
    isTransitioningRef.current = false;
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
  }, [slug]);

  // Master Gesture & Section Navigation Effect
  useEffect(() => {
    const headerOffset = 70;

    // Passive scroll handler keeping active section indicator updated
    const handleScroll = () => {
      const sectionEls = Array.from(document.querySelectorAll('[data-cinematic-section]'));
      if (sectionEls.length === 0) return;

      const currentIdx = getActiveSectionIndex(sectionEls, headerOffset);
      const activeEl = sectionEls[currentIdx];
      if (activeEl) {
        const title = activeEl.getAttribute('data-section-title') || `Section ${currentIdx + 1}`;
        setActiveSection(prev => {
          if (prev.id === activeEl.id && prev.index === currentIdx + 1 && prev.total === sectionEls.length) {
            return prev;
          }
          return {
            id: activeEl.id,
            title,
            index: currentIdx + 1,
            total: sectionEls.length
          };
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (!cinematicScrollEnabled) {
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      };
    }

    // Direction-aware Wheel Handler with Momentum Suppression & Long-Section Protection
    const handleWheel = (e) => {
      if (!cinematicScrollEnabled) return;
      if (isTransitioningRef.current) return;
      if (document.querySelector('[role="dialog"], .modal-open, [data-modal-active="true"]')) return;
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.toString().trim().length > 0) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      // Filter micro-touches and jitter
      if (Math.abs(e.deltaY) < 22) return;

      const now = Date.now();
      if (now - lastTransitionTimeRef.current < activeSpeed.ms + 60) return;

      const sectionEls = Array.from(document.querySelectorAll('[data-cinematic-section]'));
      if (sectionEls.length <= 1) return;

      const currentIdx = getActiveSectionIndex(sectionEls, headerOffset);
      const currentEl = sectionEls[currentIdx];
      if (!currentEl) return;

      const rect = currentEl.getBoundingClientRect();
      const isLongSection = rect.height > (window.innerHeight - headerOffset + 30);
      const direction = e.deltaY > 0 ? 1 : -1;

      if (direction > 0) {
        // Scrolling DOWN
        if (currentIdx >= sectionEls.length - 1) return; // at last section
        if (isLongSection) {
          const isAtBottom = rect.bottom <= window.innerHeight + 25;
          if (!isAtBottom) {
            // Visitor is reading through long section content
            return;
          }
        }
        e.preventDefault();
        navigateToSection(currentIdx + 1, sectionEls, headerOffset);
      } else {
        // Scrolling UP
        if (currentIdx <= 0) return; // at first section
        if (isLongSection) {
          const isAtTop = rect.top >= headerOffset - 25;
          if (!isAtTop) {
            // Visitor is reading upward through long section content
            return;
          }
        }
        e.preventDefault();
        navigateToSection(currentIdx - 1, sectionEls, headerOffset);
      }
    };

    // Keyboard Navigation Handler (ArrowDown, PageDown, Space, ArrowUp, PageUp)
    const handleKeyDown = (e) => {
      if (!cinematicScrollEnabled) return;
      if (isTransitioningRef.current) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (document.activeElement?.isContentEditable) return;
      if (document.querySelector('[role="dialog"], .modal-open, [data-modal-active="true"]')) return;

      const isDownKey = e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
      const isUpKey = e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey);

      if (!isDownKey && !isUpKey) return;

      const sectionEls = Array.from(document.querySelectorAll('[data-cinematic-section]'));
      if (sectionEls.length <= 1) return;

      const currentIdx = getActiveSectionIndex(sectionEls, headerOffset);
      const currentEl = sectionEls[currentIdx];
      if (!currentEl) return;

      const rect = currentEl.getBoundingClientRect();
      const isLongSection = rect.height > (window.innerHeight - headerOffset + 30);

      if (isDownKey) {
        if (currentIdx >= sectionEls.length - 1) return;
        if (isLongSection && rect.bottom > window.innerHeight + 25) return;
        e.preventDefault();
        navigateToSection(currentIdx + 1, sectionEls, headerOffset);
      } else if (isUpKey) {
        if (currentIdx <= 0) return;
        if (isLongSection && rect.top < headerOffset - 25) return;
        e.preventDefault();
        navigateToSection(currentIdx - 1, sectionEls, headerOffset);
      }
    };

    // Mobile Touch Gesture Handler (Swipes)
    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartYRef.current = e.touches[0].clientY;
        touchStartXRef.current = e.touches[0].clientX;
      }
    };

    const onTouchEnd = (e) => {
      if (!cinematicScrollEnabled) return;
      if (scrollEffects.mobileBehavior !== 'smooth-snap') return;
      if (isTransitioningRef.current) return;
      if (!e.changedTouches || !e.changedTouches[0]) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartYRef.current - touchEndY;
      const deltaX = touchStartXRef.current - touchEndX;

      if (Math.abs(deltaY) < 55 || Math.abs(deltaY) < Math.abs(deltaX)) return;

      const sectionEls = Array.from(document.querySelectorAll('[data-cinematic-section]'));
      if (sectionEls.length <= 1) return;

      const currentIdx = getActiveSectionIndex(sectionEls, headerOffset);
      const currentEl = sectionEls[currentIdx];
      if (!currentEl) return;

      const rect = currentEl.getBoundingClientRect();
      const isLongSection = rect.height > (window.innerHeight - headerOffset + 30);

      if (deltaY > 0) { // Swiped UP -> scroll DOWN
        if (currentIdx >= sectionEls.length - 1) return;
        if (isLongSection && rect.bottom > window.innerHeight + 25) return;
        navigateToSection(currentIdx + 1, sectionEls, headerOffset);
      } else { // Swiped DOWN -> scroll UP
        if (currentIdx <= 0) return;
        if (isLongSection && rect.top < headerOffset - 25) return;
        navigateToSection(currentIdx - 1, sectionEls, headerOffset);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [cinematicScrollEnabled, project, slug, activeSpeed, scrollEffects.mobileBehavior]);

  // Helper to get file type icon
  const getFileIcon = (fileType) => {
    const ext = fileType?.toLowerCase() || '';
    if (ext.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (ext.includes('zip') || ext.includes('tar') || ext.includes('gz')) return <FolderArchive className="w-5 h-5 text-amber-500" />;
    if (ext.includes('doc')) return <FileText className="w-5 h-5 text-blue-500" />;
    return <FileCode className="w-5 h-5 text-emerald-500" />;
  };

  // -------------------------------------------------------------
  // LOADING STATE
  // -------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A] text-[#2D3748] dark:text-[#F5F7FA] transition-colors">
        <div className="w-10 h-10 border-2 border-slate-300 dark:border-[#262626] border-t-[#2D3748] dark:border-t-[#F5F7FA] rounded-full animate-spin mb-4" />
        <p className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400">
          Loading technical project case study...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ERROR / NOT FOUND STATE
  // -------------------------------------------------------------
  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-[#0A0A0A] text-[#2D3748] dark:text-[#F5F7FA] transition-colors">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[#A0AEC0]/30 dark:border-[#262626] bg-slate-50 dark:bg-[#121212] text-center shadow-subtle">
          <AlertCircle className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h1 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-xs font-sans text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            The project you are looking for does not exist or may currently be unpublished.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold font-sans bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#0A0A0A] shadow-subtle transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  // Check if custom sections exist from the visual editor
  const hasCustomSections = Array.isArray(project.sections) && project.sections.length > 0;
  const galleryImages = Array.isArray(project.gallery) && project.gallery.length > 0 
    ? project.gallery 
    : (project.image ? [project.image] : []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-[#2D3748] dark:text-[#F5F7FA] font-sans antialiased selection:bg-[#2D3748] selection:text-white dark:selection:bg-[#F5F7FA] dark:selection:text-[#0A0A0A] transition-colors duration-200">
      
      {/* --------------------------------------------------------- */}
      {/* STICKY TOP NAVIGATION BAR                                */}
      {/* --------------------------------------------------------- */}
      <header className="sticky top-0 z-30 w-full border-b border-[#A0AEC0]/20 dark:border-[#222222] bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-semibold text-[#2D3748] dark:text-[#F5F7FA] hover:text-[#1A202C] dark:hover:text-white transition-colors cursor-pointer group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden xs:inline">Back to Portfolio</span>
            <span className="xs:hidden">Back</span>
          </Link>

          {/* ACTIVE SECTION INDICATOR */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-[#141414]/90 border border-slate-200 dark:border-[#262626] text-xs font-sans text-slate-700 dark:text-slate-300 truncate max-w-xs shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-slate-400 font-mono text-[11px] shrink-0">
              {activeSection.total > 1 ? `${activeSection.index}/${activeSection.total}` : 'Section 1'}
            </span>
            <span className="truncate font-medium">{activeSection.title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Cinematic Section Scroll Toggle Button */}
            <button
              type="button"
              onClick={toggleCinematicScroll}
              title={cinematicScrollEnabled 
                ? "Cinematic Scroll: ON (smooth, direction-aware section-to-section navigation). Click to toggle." 
                : "Cinematic Scroll: OFF. Click to enable cinematic section navigation."}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                cinematicScrollEnabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] border border-[#A0AEC0]/30 dark:border-[#262626]'
              }`}
              aria-pressed={cinematicScrollEnabled}
              aria-label="Toggle Cinematic Section Scrolling"
            >
              <Film className={`w-3.5 h-3.5 ${cinematicScrollEnabled ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Cinematic Scroll</span>
              <span className={`text-[10px] px-1 py-0.5 rounded font-mono uppercase ${
                cinematicScrollEnabled ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold' : 'text-slate-400'
              }`}>
                {cinematicScrollEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Share / Copy link button */}
            <button
              type="button"
              onClick={copyShareLink}
              title="Copy shareable link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] border border-[#A0AEC0]/30 dark:border-[#262626] transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] border border-[#A0AEC0]/30 dark:border-[#262626] transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Vertical Section Dots Navigator */}
      <nav 
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-2 p-2 rounded-full bg-white/85 dark:bg-[#121212]/85 backdrop-blur-md border border-[#A0AEC0]/20 dark:border-[#262626] shadow-card"
        aria-label="Section navigation dots"
      >
        {Array.from({ length: activeSection.total || 1 }).map((_, idx) => {
          const isActive = activeSection.index === idx + 1;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const sectionEls = Array.from(document.querySelectorAll('[data-cinematic-section]'));
                navigateToSection(idx, sectionEls, 70);
              }}
              title={`Jump to Section ${idx + 1}`}
              className={`w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive 
                  ? 'h-6 bg-emerald-500 shadow-sm' 
                  : 'h-2.5 bg-slate-300 dark:bg-[#333333] hover:bg-slate-500 dark:hover:bg-slate-400'
              }`}
              aria-current={isActive ? 'true' : undefined}
            />
          );
        })}
      </nav>

      {/* --------------------------------------------------------- */}
      {/* MAIN PROJECT HERO SECTION                                 */}
      {/* --------------------------------------------------------- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-16 sm:space-y-24">
        
        {/* ------------------------------------------------------- */}
        {/* INTRO HERO SECTION: TITLE, META, ACTIONS & MEDIA        */}
        {/* ------------------------------------------------------- */}
        <motion.section 
          id="section-hero"
          data-cinematic-section
          data-section-title="Project Intro"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 space-y-8"
        >
          {/* Title, Category & Action Bar */}
          <motion.div variants={itemVariant} className="space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-md text-xs font-sans font-bold uppercase tracking-wider bg-[#2D3748]/10 dark:bg-[#F5F7FA]/10 text-[#2D3748] dark:text-[#F5F7FA] border border-[#2D3748]/20 dark:border-[#F5F7FA]/20">
                {project.category}
              </span>
              {project.type && (
                <span className="px-2.5 py-1 rounded-md text-xs font-sans font-medium bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#262626]">
                  {project.type}
                </span>
              )}
              {project.status && (
                <span className="px-2.5 py-1 rounded-md text-xs font-sans font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {project.status}
                </span>
              )}
              {project.completionYear && (
                <span className="text-xs font-sans text-slate-500 dark:text-slate-400 flex items-center gap-1 ml-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Completed {project.completionYear}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            {project.tagline && (
              <p className="text-base sm:text-lg font-sans font-medium text-slate-600 dark:text-[#A0AEC0] leading-relaxed max-w-4xl">
                {project.tagline}
              </p>
            )}

            {/* Action Links Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.github && project.github !== 'https://github.com' && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold font-sans bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#0A0A0A] shadow-subtle transition-all cursor-pointer"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </a>
              )}

              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold font-sans bg-slate-100 hover:bg-slate-200/80 text-[#2D3748] dark:bg-[#1A1A1A] dark:hover:bg-[#222222] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626] transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Project / Demo</span>
                </a>
              )}

              {project.documentationUrl && (
                <a
                  href={project.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold font-sans bg-slate-100 hover:bg-slate-200/80 text-[#2D3748] dark:bg-[#1A1A1A] dark:hover:bg-[#222222] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626] transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Documentation</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Hero Media & Gallery */}
          <motion.div variants={imageVariant} className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#A0AEC0]/30 dark:border-[#262626] bg-slate-900 shadow-card">
              <img
                src={selectedImage || project.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Multi-Image Gallery Thumbnails (if > 1 image) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === imgUrl 
                        ? 'border-[#2D3748] dark:border-[#F5F7FA] scale-105' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.section>

        {/* ------------------------------------------------------- */}
        {/* PROJECT CONTENT: CUSTOM SECTIONS OR DYNAMIC FALLBACK    */}
        {/* ------------------------------------------------------- */}
        {hasCustomSections ? (
          /* Render visual-editor customized sections */
          <div className="space-y-16 sm:space-y-24">
            {project.sections.map((sec, secIdx) => (
              <motion.section 
                key={sec.id || secIdx} 
                id={sec.id || `custom-section-${secIdx + 1}`}
                data-cinematic-section
                data-section-title={sec.title || `Section ${secIdx + 1}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={sectionVariants}
                className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20"
              >
                <div
                  className="p-6 sm:p-8 rounded-2xl border border-[#A0AEC0]/20 dark:border-[#222222] bg-slate-50/50 dark:bg-[#121212] space-y-6 w-full"
                  style={{
                    backgroundColor: sec.backgroundColor || undefined,
                    borderColor: sec.borderColor || undefined,
                  }}
                >
                  {sec.title && (
                    <motion.div variants={itemVariant} className="border-b border-[#A0AEC0]/20 dark:border-[#222222] pb-4">
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                        {sec.title}
                      </h2>
                      {sec.subtitle && (
                        <p className="mt-1 text-xs sm:text-sm font-sans text-slate-500 dark:text-slate-400">
                          {sec.subtitle}
                        </p>
                      )}
                    </motion.div>
                  )}

                {/* Column-wise topic layout (1, 2, 3, or 4 columns) */}
                <div 
                  className={`grid grid-cols-1 gap-6 sm:gap-8 ${
                    sec.columnsCount === 2 ? 'md:grid-cols-2' :
                    sec.columnsCount === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
                    sec.columnsCount === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
                    'grid-cols-1'
                  }`}
                >
                  {(sec.columns || []).map((col, colIdx) => (
                    <div key={col.id || colIdx} className="space-y-5">
                      {(col.blocks || []).map((block, bIdx) => {
                        // Render individual content blocks
                        if (block.type === 'heading') {
                          const TagName = block.headingLevel || 'h3';
                          return (
                            <TagName
                              key={bIdx}
                              style={{
                                fontFamily: block.fontFamily || undefined,
                                fontSize: block.fontSize || undefined,
                                fontWeight: block.fontWeight || '700',
                                color: block.textColor || undefined,
                                textAlign: block.textAlign || 'left',
                              }}
                              className="font-heading text-slate-900 dark:text-white mt-2"
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
                            />
                          );
                        }

                        if (block.type === 'image') {
                          return (
                            <div key={bIdx} className="space-y-1.5 my-3">
                              <img
                                src={block.imageUrl}
                                alt={block.altText || 'Project illustration'}
                                style={{
                                  borderRadius: block.borderRadius || '12px',
                                  width: block.imageWidth || '100%',
                                }}
                                className="object-cover max-h-[450px]"
                              />
                              {block.caption && (
                                <p className="text-xs text-center font-sans italic text-slate-500">
                                  {block.caption}
                                </p>
                              )}
                            </div>
                          );
                        }

                        if (block.type === 'callout') {
                          return (
                            <div
                              key={bIdx}
                              className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#161616] border-l-4 border-[#2D3748] dark:border-[#A0AEC0] text-xs sm:text-sm font-sans"
                            >
                              <div
                                className="leading-relaxed text-slate-700 dark:text-slate-300"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
                              />
                            </div>
                          );
                        }

                        if (block.type === 'table' && block.tableData) {
                          const { rows, hasHeader } = block.tableData;
                          return (
                            <div key={bIdx} className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-[#262626]">
                              <table className="min-w-full text-xs font-sans text-left">
                                <tbody>
                                  {rows.map((row, rIdx) => (
                                    <tr 
                                      key={rIdx} 
                                      className={`${rIdx === 0 && hasHeader ? 'bg-slate-100 dark:bg-[#161616] font-bold border-b border-slate-200 dark:border-[#262626]' : 'border-b border-slate-100 dark:border-[#1E1E1E]'}`}
                                    >
                                      {row.map((cell, cIdx) => (
                                        <td 
                                          key={cIdx} 
                                          className="p-3"
                                          style={{
                                            textAlign: cell.align || 'left',
                                            backgroundColor: cell.bgColor || undefined,
                                            color: cell.textColor || undefined,
                                            fontWeight: cell.bold ? '700' : undefined,
                                          }}
                                        >
                                          {cell.text}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        }

                        if (block.type === 'list') {
                          const isNumbered = block.listType === 'numbered';
                          const isChecklist = block.listType === 'checklist';
                          return (
                            <div key={bIdx} className="space-y-2 my-2 text-xs sm:text-sm font-sans">
                              {(block.listItems || []).map((item, iIdx) => (
                                <div key={iIdx} className="flex items-start gap-2.5">
                                  {isChecklist ? (
                                    <input 
                                      type="checkbox" 
                                      checked={Boolean(item.checked)} 
                                      readOnly 
                                      className="mt-0.5 rounded text-[#2D3748]" 
                                    />
                                  ) : isNumbered ? (
                                    <span className="font-bold text-[#2D3748] dark:text-[#A0AEC0]">{iIdx + 1}.</span>
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D3748] dark:bg-[#A0AEC0] mt-2 shrink-0" />
                                  )}
                                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {item.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        if (block.type === 'attachment' && block.attachment) {
                          return (
                            <a
                              key={bIdx}
                              href={block.attachment.url}
                              download={block.attachment.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-[#262626] bg-white dark:bg-[#161616] hover:border-[#2D3748] dark:hover:border-white transition-all w-full max-w-md group"
                            >
                              <div className="flex items-center gap-3">
                                {getFileIcon(block.attachment.fileType || block.attachment.name)}
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:underline">
                                    {block.attachment.name}
                                  </p>
                                  {block.attachment.size && (
                                    <p className="text-[10px] text-slate-400">{block.attachment.size}</p>
                                  )}
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                            </a>
                          );
                        }

                        // Default Text Block
                        return (
                          <div
                            key={bIdx}
                            style={{
                              fontFamily: block.fontFamily || undefined,
                              fontSize: block.fontSize || undefined,
                              fontWeight: block.fontWeight || undefined,
                              fontStyle: block.fontStyle || undefined,
                              lineHeight: block.lineHeight || undefined,
                              letterSpacing: block.letterSpacing || undefined,
                              textTransform: block.textTransform || undefined,
                              textAlign: block.textAlign || 'left',
                              color: block.textColor || undefined,
                              backgroundColor: block.backgroundColor || undefined,
                              marginTop: block.marginTop || undefined,
                              marginBottom: block.marginBottom || undefined,
                            }}
                            className="text-xs sm:text-sm font-sans text-slate-700 dark:text-slate-300 leading-relaxed break-words"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      ) : (
        /* Standard Editorial Case-Study Layout for existing projects */
        <div className="space-y-16 sm:space-y-24">
            
            {/* Overview & Description */}
            <motion.section 
              id="section-overview"
              data-cinematic-section
              data-section-title="Project Overview"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={sectionVariants}
              className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 space-y-4"
            >
              <motion.h2 variants={itemVariant} className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                Project Overview
              </motion.h2>
              <motion.p variants={itemVariant} className="text-sm sm:text-base font-sans text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {project.fullOverview || project.description}
              </motion.p>
            </motion.section>

            {/* Problem Statement Callout */}
            {project.problemStatement && (
              <motion.section 
                id="section-problem"
                data-cinematic-section
                data-section-title="Problem Constraints"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={sectionVariants}
                className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20"
              >
                <motion.div variants={itemVariant} className="p-6 sm:p-7 rounded-2xl bg-[#F5F7FA] dark:bg-[#121212] border-l-4 border-[#2D3748] dark:border-[#A0AEC0] space-y-2">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#2D3748] dark:text-[#A0AEC0]">
                    Core Problem Statement & Constraints
                  </span>
                  <p className="text-sm font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                    {project.problemStatement}
                  </p>
                </motion.div>
              </motion.section>
            )}

            {/* Technical Architecture & Implementation */}
            {(project.proposedSolution || project.technicalImplementation) && (
              <motion.section 
                id="section-architecture"
                data-cinematic-section
                data-section-title="Technical Architecture"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={sectionVariants}
                className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 space-y-4"
              >
                <motion.h2 variants={itemVariant} className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                  Technical Architecture & Implementation
                </motion.h2>
                {project.proposedSolution && (
                  <motion.p variants={itemVariant} className="text-sm font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                    {project.proposedSolution}
                  </motion.p>
                )}
                {project.technicalImplementation && (
                  <motion.p variants={itemVariant} className="text-sm font-sans text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {project.technicalImplementation}
                  </motion.p>
                )}
              </motion.section>
            )}

            {/* Architecture / Topology Diagram */}
            {(project.architectureDiagram || project.topologyDiagram) && (
              <motion.section 
                id="section-topology"
                data-cinematic-section
                data-section-title="Network Topology"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={sectionVariants}
                className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 space-y-4"
              >
                <motion.h2 variants={itemVariant} className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#2D3748] dark:text-[#A0AEC0]" />
                  <span>Architecture & Infrastructure Topology</span>
                </motion.h2>
                <motion.div variants={imageVariant} className="rounded-2xl overflow-hidden border border-[#A0AEC0]/30 dark:border-[#262626] bg-slate-900 max-h-[500px]">
                  <img
                    src={project.architectureDiagram || project.topologyDiagram}
                    alt="Network Architecture Topology Diagram"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </motion.section>
            )}

            {/* Key Outcomes & Metrics Cards */}
            {project.metrics && project.metrics.length > 0 && (
              <motion.section 
                id="section-metrics"
                data-cinematic-section
                data-section-title="Validated Metrics"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={sectionVariants}
                className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 space-y-6"
              >
                <motion.h2 variants={itemVariant} className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                  Benchmark Metrics & Validated Outcomes
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.metrics.map((metric, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariant}
                      className="p-5 rounded-xl border border-[#A0AEC0]/30 dark:border-[#262626] bg-slate-50/70 dark:bg-[#121212] flex items-start gap-3 shadow-subtle"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-400">
                          Metric 0{idx + 1}
                        </span>
                        <p className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                          {metric}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Key Features List */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <motion.section 
                id="section-features"
                data-cinematic-section
                data-section-title="Key Capabilities"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={sectionVariants}
                className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 space-y-4"
              >
                <motion.h2 variants={itemVariant} className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                  Key Capabilities
                </motion.h2>
                <div className="space-y-2.5">
                  {project.keyFeatures.map((feat, idx) => (
                    <motion.div key={idx} variants={itemVariant} className="flex items-start gap-3 text-sm font-sans text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D3748] dark:bg-[#A0AEC0] mt-2 shrink-0" />
                      <span className="leading-relaxed">{feat}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Challenges & Future Scope */}
            {(project.challenges || project.futureImprovements) && (
              <motion.section 
                id="section-challenges"
                data-cinematic-section
                data-section-title="Technical Challenges"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={sectionVariants}
                className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {project.challenges && (
                  <motion.div variants={itemVariant} className="p-6 rounded-xl border border-[#A0AEC0]/30 dark:border-[#262626] bg-slate-50 dark:bg-[#121212] space-y-2">
                    <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                      Technical Challenges
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-300 leading-relaxed">
                      {project.challenges}
                    </p>
                  </motion.div>
                )}
                {project.futureImprovements && (
                  <motion.div variants={itemVariant} className="p-6 rounded-xl border border-[#A0AEC0]/30 dark:border-[#262626] bg-slate-50 dark:bg-[#121212] space-y-2">
                    <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                      Future Improvements & Roadmap
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-300 leading-relaxed">
                      {project.futureImprovements}
                    </p>
                  </motion.div>
                )}
              </motion.section>
            )}

            {/* Technologies Used */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.section 
                id="section-technologies"
                data-cinematic-section
                data-section-title="Technologies & Tools"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={sectionVariants}
                className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 space-y-4 pt-4 border-t border-[#A0AEC0]/20 dark:border-[#222222]"
              >
                <motion.h3 variants={itemVariant} className="text-sm font-heading font-bold text-slate-500 uppercase tracking-wider">
                  Technologies, Protocols & Tools
                </motion.h3>
                <motion.div variants={itemVariant} className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-sans font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262626] bg-slate-100/80 dark:bg-[#1A1A1A]"
                    >
                      {t}
                    </span>
                  ))}
                </motion.div>
              </motion.section>
            )}

          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* DOWNLOADABLE ATTACHMENTS (if configured)                */}
        {/* ------------------------------------------------------- */}
        {Array.isArray(project.attachments) && project.attachments.length > 0 && (
          <motion.section 
            id="section-attachments"
            data-cinematic-section
            data-section-title="Project Artifacts"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={sectionVariants}
            className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 space-y-4 pt-6 border-t border-[#A0AEC0]/20 dark:border-[#222222]"
          >
            <motion.h2 variants={itemVariant} className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-[#2D3748] dark:text-[#A0AEC0]" />
              <span>Project Artifacts & Downloads</span>
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.attachments.map((att, idx) => (
                <motion.a
                  key={idx}
                  variants={itemVariant}
                  href={att.url}
                  download={att.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-slate-200 dark:border-[#262626] bg-slate-50/50 dark:bg-[#121212] hover:border-[#2D3748] dark:hover:border-white transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(att.fileType || att.name)}
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:underline truncate max-w-[180px]">
                        {att.name}
                      </p>
                      {att.size && <p className="text-[10px] text-slate-400">{att.size}</p>}
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white shrink-0" />
                </motion.a>
              ))}
            </div>
          </motion.section>
        )}

        {/* ------------------------------------------------------- */}
        {/* RELATED PROJECTS CAROUSEL / GRID                        */}
        {/* ------------------------------------------------------- */}
        {relatedProjects.length > 0 && (
          <motion.section 
            id="section-related"
            data-cinematic-section
            data-section-title="Related Projects"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={sectionVariants}
            className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-8 sm:py-12 scroll-mt-20 pt-12 border-t border-[#A0AEC0]/20 dark:border-[#222222] space-y-6"
          >
            <div className="flex items-center justify-between">
              <motion.div variants={itemVariant}>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                  Related Technical Projects
                </h2>
                <p className="text-xs sm:text-sm font-sans text-slate-500 dark:text-slate-400 mt-1">
                  Explore other engineering systems in {project.category}
                </p>
              </motion.div>
              <Link
                to="/#projects"
                className="text-xs font-semibold text-[#2D3748] dark:text-[#F5F7FA] hover:underline hidden sm:inline-flex items-center gap-1"
              >
                <span>View All Projects</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((relProj) => (
                <motion.div key={relProj.id} variants={itemVariant}>
                  <Link
                    to={`/projects/${relProj.slug || relProj.id}`}
                    className="group rounded-xl overflow-hidden border border-[#A0AEC0]/30 dark:border-[#262626] bg-white dark:bg-[#121212] hover:border-[#2D3748]/50 dark:hover:border-[#383838] transition-all shadow-subtle hover:shadow-card flex flex-col justify-between h-full"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={relProj.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600"}
                        alt={relProj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
                          {relProj.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-heading font-bold text-slate-900 dark:text-white group-hover:text-[#2D3748] dark:group-hover:text-[#F5F7FA] transition-colors line-clamp-1 mt-1">
                          {relProj.title}
                        </h3>
                        <p className="text-xs font-sans text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {relProj.description || relProj.tagline}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#222222] flex items-center justify-between text-xs font-semibold text-[#2D3748] dark:text-[#F5F7FA]">
                        <span>View Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#A0AEC0]/20 dark:border-[#222222] py-8 text-center text-xs font-sans text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0A0A0A]">
        <p>© {new Date().getFullYear()} Nuwan Pinnaduwage. All technical systems and architectures documented.</p>
      </footer>

    </div>
  );
}

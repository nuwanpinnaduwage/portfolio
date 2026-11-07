import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, FileDown, ChevronRight, Shield } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { defaultEase } from './animations/MotionWrappers';
import { getVisibleNavLinks, isSectionVisible } from '../utils/sectionVisibilityUtils';

export default function Navbar({ darkMode, setDarkMode, onOpenCV, activeSection, onSectionChange, data, visibility, sectionNames, navVisibility }) {
  const personal = data || portfolioData.personal;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  // Measure actual navbar height and sync --navbar-height CSS variable on root
  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        if (height > 0) {
          document.documentElement.style.setProperty('--navbar-height', `${height}px`);
        }
      }
    };

    updateNavbarHeight();

    let observer = null;
    if (typeof ResizeObserver !== 'undefined' && navbarRef.current) {
      observer = new ResizeObserver(updateNavbarHeight);
      observer.observe(navbarRef.current);
    }

    window.addEventListener('resize', updateNavbarHeight, { passive: true });
    window.addEventListener('scroll', updateNavbarHeight, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateNavbarHeight);
      window.removeEventListener('scroll', updateNavbarHeight);
    };
  }, []);

  // Programmatic, pixel-perfect smooth navigation click handler
  const handleNavClick = (e, href, id) => {
    if (e && e.preventDefault) e.preventDefault();
    setMobileMenuOpen(false);

    const targetId = id || (href ? href.replace(/^#/, '') : '');
    if (!targetId) return;

    if (targetId === 'hero' || targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '#hero');
      }
      if (onSectionChange) onSectionChange('hero');
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const navH = navbarRef.current ? navbarRef.current.offsetHeight : 64;
      const elementRect = element.getBoundingClientRect();
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const targetScrollY = elementRect.top + currentScrollY - navH;

      window.scrollTo({
        top: Math.max(0, Math.round(targetScrollY)),
        behavior: 'smooth',
      });

      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', `#${targetId}`);
      }
      if (onSectionChange) onSectionChange(targetId);
    }
  };


  const navLinks = getVisibleNavLinks(visibility, sectionNames, navVisibility);

  // Build the complete list of mobile navigation links
  const mobileNavLinks = useMemo(() => {
    const list = [];
    let hasCertificates = false;

    for (const link of navLinks) {
      if (link.id === 'about') {
        list.push({
          ...link,
          name: link.name === 'About' ? 'About Me' : link.name,
        });
        continue;
      }
      list.push(link);
      if (link.id === 'projects') {
        list.push({
          id: 'certificates',
          name: 'Certificates',
          href: '#certificates',
        });
        hasCertificates = true;
      }
    }

    if (!hasCertificates && isSectionVisible('about', visibility)) {
      const aboutIdx = list.findIndex(l => l.id === 'about');
      const certLink = {
        id: 'certificates',
        name: 'Certificates',
        href: '#certificates',
      };
      if (aboutIdx !== -1) {
        list.splice(aboutIdx + 1, 0, certLink);
      } else {
        list.push(certLink);
      }
    }

    return list;
  }, [navLinks, visibility]);

  // Track window scroll for desktop and mobile navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on window resize to desktop (>= 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll ONLY when mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, [mobileMenuOpen]);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={navbarRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          isScrolled
            ? 'glass-panel shadow-subtle border-b border-[#A0AEC0]/30 dark:border-[#222222]'
            : 'bg-white/90 dark:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-[#A0AEC0]/20 dark:border-transparent md:border-b-0 md:bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero", "hero")}
              aria-label={`${personal.name || "Nuwan Pinnaduwage"} Portfolio Home`}
              className="flex items-center group text-[#2D3748] dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748] dark:focus-visible:ring-[#A0AEC0] rounded-lg shrink-0"
            >
              <span className="font-mono font-bold tracking-tight text-lg sm:text-2xl flex items-center leading-none">
                <span>{personal.preferredName || "Nuwan"}</span>
                <span className="text-[#2D3748] dark:text-[#A0AEC0]">.dev</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-2" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === (link.id || link.href.substring(1));
                return (
                  <a
                    key={link.id || link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href, link.id)}
                    className={`nav-tab-item px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748] dark:focus-visible:ring-[#A0AEC0] rounded-lg shrink-0 ${
                      isActive
                        ? 'active text-[#2D3748] dark:text-white font-semibold'
                        : 'text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white'
                    }`}
                  >
                    <span className="nav-tab-label">
                      {link.name}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Minimal Light/Dark Mode Toggle Button */}
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-lg text-[#2D3748] dark:text-[#F5F7FA] hover:bg-[#F5F7FA] dark:hover:bg-[#3A4659]/50 transition-colors duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748] dark:focus-visible:ring-[#A0AEC0] flex items-center justify-center shrink-0 cursor-pointer"
              >
                <span className="relative flex items-center justify-center transition-transform duration-200 active:scale-95">
                  {darkMode ? (
                    <Moon className="w-4 h-4 text-[#F5F7FA]" />
                  ) : (
                    <Sun className="w-4 h-4 text-[#2D3748]" />
                  )}
                </span>
              </button>

              {/* Minimalist Admin Portal Button */}
              <Link
                to="/admin/login"
                title="Admin Dashboard Portal"
                aria-label="Admin Dashboard Portal"
                className="group flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#3A4659]/50 transition-colors duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748] dark:focus-visible:ring-[#A0AEC0] shrink-0"
              >
                <Shield className="w-4 h-4 text-[#718096] dark:text-[#A0AEC0] group-hover:text-[#2D3748] dark:group-hover:text-white transition-colors duration-200" />
                <span className="hidden sm:inline text-xs font-mono font-medium tracking-tight">Admin</span>
              </Link>

              {/* Resume Button — Clean Slate solid styling */}
              <button
                type="button"
                onClick={onOpenCV}
                className="hidden sm:inline-flex btn-secondary-pill shrink-0 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg text-[#2D3748] dark:text-[#F5F7FA] bg-[#F5F7FA] dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-[#1A1A1A] border border-[#A0AEC0]/30 dark:border-[#262626] transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748] dark:focus-visible:ring-[#A0AEC0]"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#2D3748] dark:text-[#F5F7FA]" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <div
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              className="fixed inset-0 z-50 md:hidden flex flex-col justify-start"
            >
              {/* Semi-transparent backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm"
                aria-hidden="true"
              />

              {/* Slide-down mobile drawer card */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2, ease: defaultEase }}
                className="relative z-10 w-full bg-white dark:bg-[#0A0A0A] border-b border-[#A0AEC0]/30 dark:border-[#262626] shadow-card-hover max-h-[88vh] flex flex-col overflow-hidden"
              >
                {/* Drawer Top Bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#A0AEC0]/20 dark:border-[#262626] bg-[#F5F7FA] dark:bg-[#050505]">
                  <a
                    href="#hero"
                    onClick={(e) => handleNavClick(e, "#hero", "hero")}
                    aria-label={`${personal.name || "Nuwan Pinnaduwage"} Portfolio Home`}
                    className="font-mono font-bold text-lg text-[#2D3748] dark:text-white flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748] rounded-lg"
                  >
                    <span>{personal.preferredName || "Nuwan"}</span>
                    <span className="text-[#2D3748] dark:text-[#A0AEC0]">.dev</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg text-[#718096] hover:text-[#2D3748] dark:text-[#A0AEC0] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#2D3748] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-1">
                  <nav className="flex flex-col gap-1" aria-label="Mobile navigation links">
                    {mobileNavLinks.map((link) => {
                      const isActive = activeSection === (link.id || link.href.substring(1));
                      return (
                        <a
                          key={link.id || link.href}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href, link.id)}
                          className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-[#F5F7FA] dark:bg-[#121212] text-[#2D3748] dark:text-white font-semibold border border-[#A0AEC0]/30 dark:border-[#262626]'
                              : 'text-[#4A5568] dark:text-[#A0AEC0] hover:bg-[#F5F7FA] dark:hover:bg-[#121212]/50 hover:text-[#2D3748] dark:hover:text-white'
                          }`}
                        >
                          <span>{link.name}</span>
                          <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#2D3748] dark:text-white' : 'opacity-40'}`} />
                        </a>
                      );
                    })}
                  </nav>

                  {/* Drawer Footer Actions */}
                  <div className="pt-4 mt-3 border-t border-[#A0AEC0]/20 dark:border-[#222222] flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenCV();
                      }}
                      className="w-full btn-secondary-pill"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>View / Download Resume</span>
                    </button>

                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      title="Admin Dashboard Portal"
                      aria-label="Admin Dashboard Portal"
                      className="min-h-[38px] w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-medium text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#2D3748]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748]"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#718096] dark:text-[#A0AEC0]" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

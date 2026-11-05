import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, FileDown, ChevronRight, Shield } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { defaultEase } from './animations/MotionWrappers';
import { getVisibleNavLinks, isSectionVisible } from '../utils/sectionVisibilityUtils';

export default function Navbar({ darkMode, setDarkMode, onOpenCV, activeSection, data, visibility, sectionNames, navVisibility }) {
  const personal = data || portfolioData.personal;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = getVisibleNavLinks(visibility, sectionNames, navVisibility);

  // Build the complete list of mobile navigation links
  // Including Home, About Me, Skills, Projects, Certificates, Experience, Education, Contact
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

  // Prevent background scroll ONLY when mobile menu is open, restore cleanly when closed
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, [mobileMenuOpen]);

  // Helper to close menu and handle navigation
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-panel shadow-sm py-2.5 sm:py-3 border-b border-slate-200/60 dark:border-slate-800/60'
            : 'bg-white/90 dark:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-slate-200/60 dark:border-transparent md:border-b-0 md:bg-transparent py-2.5 sm:py-3 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#hero"
              aria-label={`${personal.name || "Nuwan Pinnaduwage"} Portfolio Home`}
              className="flex items-center group text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl shrink-0"
            >
              <span className="font-mono font-bold tracking-tight text-lg sm:text-2xl flex items-center leading-none">
                <span>{personal.preferredName || "Nuwan"}</span>
                <span className="text-emerald-500 dark:text-emerald-400" style={{ color: 'var(--portfolio-accent, #22c55e)' }}>.dev</span>
              </span>
            </a>

            {/* Desktop Navigation (Unchanged) */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-2" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === (link.id || link.href.substring(1));
                return (
                  <a
                    key={link.id || link.href}
                    href={link.href}
                    className={`nav-tab-item px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-950 rounded-lg shrink-0 ${
                      isActive
                        ? 'active text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
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
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Minimal Light/Dark Mode Toggle Button */}
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10 transition-colors duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center justify-center shrink-0"
              >
                <span className="relative flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-slate-200 hover:text-emerald-400 transition-transform duration-300 -rotate-12 hover:rotate-0" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500 hover:text-emerald-500 transition-transform duration-300 rotate-0 hover:rotate-45" />
                  )}
                </span>
              </button>

              {/* Minimalist Admin Portal Button */}
              <Link
                to="/admin/login"
                title="Admin Dashboard Portal"
                aria-label="Admin Dashboard Portal"
                className="group flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10 transition-colors duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shrink-0"
              >
                <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors duration-200" />
                <span className="hidden sm:inline text-xs font-mono font-medium tracking-tight">Admin</span>
              </Link>

              {/* Resume Button */}
              <button
                type="button"
                onClick={onOpenCV}
                className="hidden sm:inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95 touch-manipulation shrink-0"
              >
                <FileDown className="w-4 h-4" />
                <span>Resume</span>
              </button>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-dark-850/90 hover:bg-slate-200 dark:hover:bg-dark-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Portaled Directly to document.body to prevent containing block clipping */}
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
              {/* Semi-transparent backdrop overlay - clicking outside closes the menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                aria-hidden="true"
              />

              {/* Slide-down mobile drawer card */}
              <motion.div
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.25, ease: defaultEase }}
                className="relative z-10 w-full bg-white dark:bg-[#0b0f17] border-b border-slate-200/90 dark:border-slate-800 shadow-2xl max-h-[88vh] flex flex-col overflow-hidden"
              >
                {/* Drawer Top Bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#06070a]/70 backdrop-blur-md">
                  <a
                    href="#hero"
                    onClick={handleNavLinkClick}
                    aria-label={`${personal.name || "Nuwan Pinnaduwage"} Portfolio Home`}
                    className="font-mono font-bold text-lg text-slate-900 dark:text-white flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
                  >
                    <span>{personal.preferredName || "Nuwan"}</span>
                    <span className="text-emerald-500 dark:text-emerald-400" style={{ color: 'var(--portfolio-accent, #22c55e)' }}>.dev</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-1">
                  <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation links">
                    {mobileNavLinks.map((link) => {
                      const isActive = activeSection === (link.id || link.href.substring(1));
                      return (
                        <a
                          key={link.id || link.href}
                          href={link.href}
                          onClick={handleNavLinkClick}
                          className={`min-h-[44px] flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-800/80'
                          }`}
                        >
                          <span>{link.name}</span>
                          <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'opacity-40'}`} />
                        </a>
                      );
                    })}
                  </nav>

                  {/* Drawer Footer Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenCV();
                      }}
                      className="min-h-[44px] w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all active:scale-[0.99] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>View / Download Resume</span>
                    </button>

                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      title="Admin Dashboard Portal"
                      aria-label="Admin Dashboard Portal"
                      className="min-h-[40px] w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
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

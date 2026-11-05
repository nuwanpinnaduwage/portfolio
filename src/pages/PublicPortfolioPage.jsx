import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Education from '../components/Education';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ProjectModal from '../components/ProjectModal';
import CVModal from '../components/CVModal';
import Toast from '../components/Toast';
import BackToTop from '../components/BackToTop';
import { Eye, Shield, ArrowRight } from 'lucide-react';
import { generateSectionStylesCSS } from '../utils/appearanceUtils';
import { isSectionVisible } from '../utils/sectionVisibilityUtils';

export default function PublicPortfolioPage() {
  const { portfolio, previewMode, setPreviewMode } = usePortfolio();
  const { user } = useAuth();

  // Dark/Light theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('portfolio_theme_mode') || localStorage.getItem('cs-portfolio-theme') || localStorage.getItem('theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return portfolio.settings?.defaultTheme === 'light' ? false : true;
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalInitialTab, setModalInitialTab] = useState('overview');
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const handleOpenProject = (project, tab = 'overview') => {
    setSelectedProject(project);
    setModalInitialTab(tab || 'overview');
  };

  // Sync dark mode class to <html> and across all unified theme storage keys
  useEffect(() => {
    const root = document.documentElement;
    const mode = darkMode ? 'dark' : 'light';
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio_theme_mode', mode);
    localStorage.setItem('cs-portfolio-theme', mode);
    localStorage.setItem('theme', mode);
  }, [darkMode]);

  // Sync custom appearance settings (Font Family, Font Size, Line Spacing, Accent Color)
  useEffect(() => {
    const settings = portfolio.settings || {};
    const root = document.documentElement;

    // Font Family
    const fontMap = {
      inter: "'Inter', system-ui, -apple-system, sans-serif",
      'plus-jakarta': "'Plus Jakarta Sans', 'Inter', sans-serif",
      outfit: "'Outfit', 'Inter', sans-serif",
      roboto: "'Roboto', -apple-system, sans-serif",
      'fira-code': "'Fira Code', 'JetBrains Mono', monospace",
      system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    };
    if (settings.fontFamily && fontMap[settings.fontFamily]) {
      root.style.setProperty('--portfolio-font-family', fontMap[settings.fontFamily]);
    } else {
      root.style.setProperty('--portfolio-font-family', fontMap.inter);
    }

    // Font Size (Base font scale)
    const sizeMap = {
      sm: '15px',
      md: '16px',
      lg: '17.5px',
      xl: '19px'
    };
    if (settings.fontSize && sizeMap[settings.fontSize]) {
      root.style.setProperty('--portfolio-font-size', sizeMap[settings.fontSize]);
    } else {
      root.style.setProperty('--portfolio-font-size', '16px');
    }

    // Line Spacing / Line Height
    const lineMap = {
      compact: '1.4',
      normal: '1.6',
      relaxed: '1.75',
      loose: '1.9'
    };
    if (settings.lineHeight && lineMap[settings.lineHeight]) {
      root.style.setProperty('--portfolio-line-height', lineMap[settings.lineHeight]);
    } else {
      root.style.setProperty('--portfolio-line-height', '1.6');
    }

    // Colors / Accent
    const colorMap = {
      'neon-emerald': {
        light: '#16a34a',
        dark: '#39ff88',
        primary: '#22c55e',
        glow: 'rgba(57, 255, 136, 0.35)',
        neon: '#39ff88',
        soft: '#86efac',
        deep: '#064e3b',
        bg: '#06070a',
        secondaryBg: '#0b0f17',
        cardBg: '#101623',
        border: '#1e293b',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8'
      },
      violet: { light: '#7c3aed', dark: '#a78bfa', primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.35)' },
      indigo: { light: '#4f46e5', dark: '#818cf8', primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.35)' },
      emerald: { light: '#059669', dark: '#34d399', primary: '#10b981', glow: 'rgba(16, 185, 129, 0.35)' },
      cyan: { light: '#0891b2', dark: '#22d3ee', primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.35)' },
      blue: { light: '#2563eb', dark: '#60a5fa', primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.35)' },
      rose: { light: '#e11d48', dark: '#fb7185', primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.35)' },
      orange: { light: '#ea580c', dark: '#fb923c', primary: '#f97316', glow: 'rgba(249, 115, 22, 0.35)' },
      amber: { light: '#d97706', dark: '#fbbf24', primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)' },
      fuchsia: { light: '#c026d3', dark: '#e879f9', primary: '#d946ef', glow: 'rgba(217, 70, 239, 0.35)' },
    };

    const accentKey = settings.accentColor || 'neon-emerald';
    let chosen = colorMap[accentKey] || colorMap['neon-emerald'];

    if (settings.customAccentColor && settings.customAccentColor.startsWith('#')) {
      chosen = {
        light: settings.customAccentColor,
        dark: settings.customAccentColor,
        primary: settings.customAccentColor,
        glow: `${settings.customAccentColor}55`
      };
    }

    // Set theme preset attribute on html tag
    root.setAttribute('data-theme-preset', accentKey);

    root.style.setProperty('--portfolio-accent', chosen.primary);
    root.style.setProperty('--portfolio-accent-light', chosen.light);
    root.style.setProperty('--portfolio-accent-dark', chosen.dark);
    root.style.setProperty('--portfolio-accent-glow', chosen.glow);
    if (chosen.neon) root.style.setProperty('--portfolio-neon', chosen.neon);
    if (chosen.soft) root.style.setProperty('--portfolio-soft', chosen.soft);
    if (chosen.deep) root.style.setProperty('--portfolio-deep', chosen.deep);
    if (chosen.bg) root.style.setProperty('--portfolio-bg-dark', chosen.bg);
    if (chosen.cardBg) root.style.setProperty('--portfolio-card-bg', chosen.cardBg);
    if (chosen.border) root.style.setProperty('--portfolio-border', chosen.border);

    // Generate and inject section-specific overrides (font, linespace, font-size, accent colors)
    const sectionCss = generateSectionStylesCSS(settings);
    let styleTag = document.getElementById('section-appearance-overrides');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'section-appearance-overrides';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = sectionCss;
  }, [portfolio.settings]);

  // Track active section for navbar highlighting
  useEffect(() => {
    const allSections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];
    const activeVisibility = portfolio.settings?.sectionVisibility;
    const visibleSections = allSections.filter(s => isSectionVisible(s, activeVisibility));

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of visibleSections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [portfolio.settings?.sectionVisibility]);

  const showToast = ({ type = 'info', message }) => {
    setToast({ type, message });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 public-portfolio">
      
      {/* Administrator Live Preview Banner */}
      {user && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 sticky top-0 z-50 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono">
              <strong>Admin Mode:</strong> {previewMode ? 'Live Draft Preview Active' : 'Public Visitor View'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-2.5 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-[11px] font-semibold transition-colors"
            >
              {previewMode ? 'Switch to Public Filter' : 'Show Drafts'}
            </button>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1 text-[11px] font-mono hover:underline text-emerald-100"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenCV={() => setIsCVModalOpen(true)}
        activeSection={activeSection}
        data={portfolio.personal}
        visibility={portfolio.settings?.sectionVisibility}
        sectionNames={portfolio.settings?.sectionNames}
        navVisibility={portfolio.settings?.navVisibility}
      />

      {/* Main Content Landmarks */}
      <main id="main-content">
        <Hero 
          onOpenCV={() => setIsCVModalOpen(true)} 
          data={portfolio.personal}
          settings={portfolio.settings}
          darkMode={darkMode}
        />
        {isSectionVisible('about', portfolio.settings?.sectionVisibility) && (
          <About 
            data={{
              ...portfolio.about,
              whoIAmHeading: portfolio.about?.whoIAmHeading || portfolio.settings?.sectionContent?.about_who_i_am || "Who I Am",
              profilePhotoUrl: portfolio.about?.profilePhotoUrl || portfolio.personal?.avatarUrl,
              title: portfolio.settings?.sectionContent?.about_title || portfolio.about.title,
              subtitle: portfolio.settings?.sectionContent?.about_subtitle || portfolio.about.subtitle,
            }} 
            settings={portfolio.settings}
            personalData={portfolio.personal}
            educationData={portfolio.education}
            skillsData={portfolio.skills}
            achievementsData={portfolio.achievements}
          />
        )}
        {isSectionVisible('skills', portfolio.settings?.sectionVisibility) && (
          <Skills 
            data={{
              ...portfolio.skills,
              title: portfolio.settings?.sectionContent?.skills_title || portfolio.skills.title,
              subtitle: portfolio.settings?.sectionContent?.skills_subtitle || portfolio.skills.subtitle,
            }} 
          />
        )}
        {isSectionVisible('projects', portfolio.settings?.sectionVisibility) && (
          <Projects 
            onSelectProject={handleOpenProject} 
            data={{
              ...portfolio.projects,
              title: portfolio.settings?.sectionContent?.projects_title || portfolio.projects.title,
              subtitle: portfolio.settings?.sectionContent?.projects_subtitle || portfolio.projects.subtitle,
            }}
          />
        )}
        {isSectionVisible('experience', portfolio.settings?.sectionVisibility) && (
          <Experience 
            experienceData={{
              ...portfolio.experience,
              title: portfolio.settings?.sectionContent?.experience_title || portfolio.experience.title,
              subtitle: portfolio.settings?.sectionContent?.experience_subtitle || portfolio.experience.subtitle,
            }}
            achievementsData={portfolio.achievements}
          />
        )}
        {isSectionVisible('education', portfolio.settings?.sectionVisibility) && (
          <Education 
            data={{
              ...portfolio.education,
              title: portfolio.settings?.sectionContent?.education_title || portfolio.education.title,
              subtitle: portfolio.settings?.sectionContent?.education_subtitle || portfolio.education.subtitle,
            }} 
          />
        )}
        {isSectionVisible('contact', portfolio.settings?.sectionVisibility) && (
          <Contact 
            onShowToast={showToast} 
            data={{
              ...portfolio.contact,
              title: portfolio.settings?.sectionContent?.contact_title || portfolio.contact.title,
              subtitle: portfolio.settings?.sectionContent?.contact_subtitle || portfolio.contact.subtitle,
            }}
            personalData={portfolio.personal}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        data={portfolio.footer}
        personalData={portfolio.personal}
        visibility={portfolio.settings?.sectionVisibility}
        sectionNames={portfolio.settings?.sectionNames}
      />

      {/* Modals & Popups */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          initialTab={modalInitialTab}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {isCVModalOpen && (
        <CVModal
          isOpen={isCVModalOpen}
          onClose={() => setIsCVModalOpen(false)}
          onShowToast={showToast}
          data={portfolio}
        />
      )}

      {/* Toast Alert */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

      {/* Fixed Floating Back to Top Button */}
      <BackToTop />

    </div>
  );
}

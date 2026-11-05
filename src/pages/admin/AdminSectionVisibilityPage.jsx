import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Home, 
  User, 
  Wrench, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  ExternalLink,
  Layers,
  Compass,
  Pencil,
  Check,
  X,
  Info,
  Layout,
  Navigation
} from 'lucide-react';
import { 
  MANAGED_SECTIONS, 
  DEFAULT_SECTION_VISIBILITY, 
  DEFAULT_NAV_VISIBILITY,
  DEFAULT_SECTION_NAMES,
  isSectionVisible,
  isNavVisible,
  getSectionDisplayName,
  validateSectionName
} from '../../utils/sectionVisibilityUtils';

const ICON_MAP = {
  Home: Home,
  User: User,
  Wrench: Wrench,
  FolderGit2: FolderGit2,
  Briefcase: Briefcase,
  GraduationCap: GraduationCap,
  Mail: Mail,
};

export default function AdminSectionVisibilityPage() {
  const { 
    portfolio, 
    updateSectionVisibility, 
    setAllSectionVisibility,
    updateNavVisibility,
    setAllNavVisibility,
    renameSection 
  } = usePortfolio();

  const visibilitySettings = portfolio.settings?.sectionVisibility || DEFAULT_SECTION_VISIBILITY;
  const navVisibilitySettings = portfolio.settings?.navVisibility || DEFAULT_NAV_VISIBILITY;
  const sectionNames = portfolio.settings?.sectionNames || DEFAULT_SECTION_NAMES;

  // Rename editing state
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editInputValue, setEditInputValue] = useState('');
  const [editInputError, setEditInputError] = useState(null);
  const [savingRename, setSavingRename] = useState(false);

  // Toggle saving & feedback state
  const [savingSection, setSavingSection] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Metrics
  const visibleOnPageCount = MANAGED_SECTIONS.filter(s => isSectionVisible(s.id, visibilitySettings)).length;
  const visibleInNavCount = MANAGED_SECTIONS.filter(s => isNavVisible(s.id, navVisibilitySettings, visibilitySettings)).length;
  const totalManaged = MANAGED_SECTIONS.length;

  // Toggle Section on Page
  const handleToggleSection = async (sectionId) => {
    const currentStatus = isSectionVisible(sectionId, visibilitySettings);
    const nextStatus = !currentStatus;
    const currentDisplayName = getSectionDisplayName(sectionId, sectionNames);

    setSavingSection(`page-${sectionId}`);
    setFeedback(null);

    const res = await updateSectionVisibility(sectionId, nextStatus);
    setSavingSection(null);

    if (res && res.error) {
      setFeedback({
        type: 'error',
        message: `Failed to update page visibility for "${currentDisplayName}". Changes rolled back.`,
      });
    } else {
      setFeedback({
        type: 'success',
        message: `"${currentDisplayName}" section is now ${nextStatus ? 'displayed on' : 'hidden from'} the public portfolio page.`,
      });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Toggle Navigation Tab Visibility
  const handleToggleNav = async (sectionId) => {
    const currentStatus = isNavVisible(sectionId, navVisibilitySettings, visibilitySettings);
    const nextStatus = !currentStatus;
    const currentDisplayName = getSectionDisplayName(sectionId, sectionNames);

    setSavingSection(`nav-${sectionId}`);
    setFeedback(null);

    const res = await updateNavVisibility(sectionId, nextStatus);
    setSavingSection(null);

    if (res && res.error) {
      setFeedback({
        type: 'error',
        message: `Failed to update navigation tab for "${currentDisplayName}". Changes rolled back.`,
      });
    } else {
      setFeedback({
        type: 'success',
        message: `"${currentDisplayName}" navigation tab is now ${nextStatus ? 'shown in' : 'hidden from'} header and mobile menus.`,
      });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Start Rename inline editing
  const handleStartRename = (sec) => {
    const currentDisplayName = getSectionDisplayName(sec.id, sectionNames);
    setEditingSectionId(sec.id);
    setEditInputValue(currentDisplayName);
    setEditInputError(null);
  };

  // Cancel Rename inline editing
  const handleCancelRename = () => {
    setEditingSectionId(null);
    setEditInputValue('');
    setEditInputError(null);
  };

  // Save Rename inline editing
  const handleSaveRename = async (sectionId) => {
    const validation = validateSectionName(sectionId, editInputValue, sectionNames);

    if (!validation.valid) {
      setEditInputError(validation.error);
      return;
    }

    setSavingRename(true);
    setEditInputError(null);
    setFeedback(null);

    const trimmedName = validation.trimmedName;
    const res = await renameSection(sectionId, trimmedName);
    setSavingRename(false);

    if (res && res.error) {
      setEditInputError('Failed to save to database. Please try again.');
    } else {
      setEditingSectionId(null);
      setFeedback({
        type: 'success',
        message: `Menu tab label successfully updated to "${trimmedName}". Public navigation synchronized.`,
      });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Reset a single section to its default navigation label
  const handleResetSingleName = async (sec) => {
    setSavingRename(true);
    const res = await renameSection(sec.id, sec.navLabel);
    setSavingRename(false);
    if (!res?.error) {
      setFeedback({
        type: 'success',
        message: `Menu tab label reset to default ("${sec.navLabel}").`,
      });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Bulk: Show all sections and nav tabs
  const handleShowAll = async () => {
    setSavingSection('all');
    setFeedback(null);

    const allVisible = {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: true,
      contact: true,
    };

    const res1 = await setAllSectionVisibility(allVisible);
    const res2 = await setAllNavVisibility(allVisible);
    setSavingSection(null);

    if ((res1 && res1.error) || (res2 && res2.error)) {
      setFeedback({ type: 'error', message: 'Failed to show all sections.' });
    } else {
      setFeedback({ type: 'success', message: 'All sections and navigation menu tabs are now visible!' });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Bulk: Reset visibility defaults
  const handleResetDefaults = async () => {
    setSavingSection('all');
    setFeedback(null);

    const res1 = await setAllSectionVisibility(DEFAULT_SECTION_VISIBILITY);
    const res2 = await setAllNavVisibility(DEFAULT_NAV_VISIBILITY);
    setSavingSection(null);

    if ((res1 && res1.error) || (res2 && res2.error)) {
      setFeedback({ type: 'error', message: 'Failed to reset visibility settings.' });
    } else {
      setFeedback({ type: 'success', message: 'Section & navigation visibility reset to default state.' });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Section & Navigation Visibility
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Control
            </span>
          </div>
          <p className="text-xs sm:text-sm font-sans text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Manage section visibility on the live portfolio page and configure navigation menu tabs independently. Rename tabs to custom labels while preserving system IDs, scroll anchors, and project data.
          </p>
        </div>

        {/* Top Actions & Quick Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-dark-900 hover:bg-dark-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm"
            title="Open Public Website in new tab"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>Preview Website</span>
          </Link>
        </div>
      </div>

      {/* Live Interactive Navigation Bar Preview */}
      <div className="p-4 sm:p-5 rounded-2xl bg-dark-900/90 border border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Live Public Navigation Bar Preview
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click any tab below to rename
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-dark-950/90 border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          {/* Logo representation */}
          <div className="flex items-center font-mono font-bold text-sm tracking-tight text-white shrink-0">
            <span>{portfolio.personal?.preferredName || "Nuwan"}</span>
            <span className="text-emerald-400">.dev</span>
          </div>

          {/* Rendered navigation tabs matching public website */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Home Tab */}
            <div 
              className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 cursor-default select-none shadow-sm"
              title="Home (Hero) - permanently active root tab"
            >
              <Home className="w-3 h-3 text-emerald-400" />
              <span>Home</span>
            </div>

            {/* Managed Section Tabs */}
            {MANAGED_SECTIONS.map((sec) => {
              const isNavVis = isNavVisible(sec.id, navVisibilitySettings, visibilitySettings);
              const displayName = getSectionDisplayName(sec.id, sectionNames);
              const isCustom = displayName !== sec.navLabel;

              if (!isNavVis) return null;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleStartRename(sec)}
                  title={`Click to rename menu tab "${displayName}"`}
                  className={`group px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 ${
                    isCustom
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 shadow-sm'
                      : 'bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span>{displayName}</span>
                  <Pencil className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 text-emerald-400 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics & Bulk Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-10 h-10 rounded-xl bg-dark-850 border border-slate-700/60 flex items-center justify-center text-emerald-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Visibility Status Overview
            </span>
            <div className="flex items-center gap-3 text-xs sm:text-sm font-sans flex-wrap">
              <span className="text-slate-300">
                Page Sections: <strong className="text-white font-semibold">{visibleOnPageCount}</strong> of {totalManaged} Active
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">
                Navbar Tabs: <strong className="text-white font-semibold">{visibleInNavCount}</strong> of {totalManaged} Active
              </span>
              <span className="text-slate-500 text-xs">(+ Home fixed)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleShowAll}
            disabled={savingSection !== null || savingRename}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors disabled:opacity-50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Show All</span>
          </button>

          <button
            onClick={handleResetDefaults}
            disabled={savingSection !== null || savingRename}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 animate-fade-in ${
            feedback.type === 'error'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100 font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sections Management List */}
      <div className="space-y-4">
        
        {/* 1. Permanent Home Section Anchor Card (Fixed & Non-renameable) */}
        <div className="rounded-2xl p-5 bg-dark-900/90 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-dark-850 border border-slate-700/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-base sm:text-lg font-heading font-bold text-white tracking-tight">
                  Hero / Landing Page
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-dark-950 text-slate-400 border border-slate-800">
                  Target: #hero
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Permanently Visible</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
                Introduction greeting, full name, professional degrees, career focus, call-to-action buttons, and social links. The landing hero section and its "Home" navigation route are permanently anchored.
              </p>
            </div>
          </div>

          {/* Dual Status for Home */}
          <div className="flex items-center gap-6 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t border-slate-800 md:border-t-0 md:pl-4 md:border-l">
            {/* Page Status */}
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">Page</span>
              <span className="text-xs font-semibold text-emerald-400">Fixed ON</span>
            </div>
            {/* Nav Status */}
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">Navbar</span>
              <span className="text-xs font-semibold text-emerald-400">Fixed ON</span>
            </div>
          </div>
        </div>

        {/* 2. Managed Website Sections with Dual Controls & Inline Rename */}
        {MANAGED_SECTIONS.map((sec) => {
          const Icon = ICON_MAP[sec.icon] || Layers;
          const isPageVis = isSectionVisible(sec.id, visibilitySettings);
          const isNavVis = isNavVisible(sec.id, navVisibilitySettings, visibilitySettings);
          const isEditing = editingSectionId === sec.id;
          const currentDisplayName = getSectionDisplayName(sec.id, sectionNames);
          const isCustomizedName = currentDisplayName !== sec.navLabel;

          const isPageTogglePending = savingSection === `page-${sec.id}` || savingSection === 'all';
          const isNavTogglePending = savingSection === `nav-${sec.id}` || savingSection === 'all';

          return (
            <div
              key={sec.id}
              className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col gap-4 ${
                isPageVis
                  ? 'bg-dark-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-dark-950/70 border-slate-850 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                
                {/* Left: Icon & Section Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isPageVis
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-dark-850 border border-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header Row: Section Name & Target */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-base sm:text-lg font-heading font-bold text-white tracking-tight">
                        {sec.defaultName}
                      </span>

                      {/* Target Anchor Badge */}
                      <span 
                        className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-dark-950 text-slate-400 border border-slate-800"
                        title={`Internal Target Anchor: ${sec.href}`}
                      >
                        Target: {sec.href}
                      </span>

                      {/* Page Status Pill */}
                      {isPageVis ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Eye className="w-3 h-3" />
                          <span>On Page</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden on Page</span>
                        </span>
                      )}

                      {/* Nav Tab Status Pill */}
                      {isNavVis ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Navigation className="w-3 h-3" />
                          <span>In Navbar</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden in Navbar</span>
                        </span>
                      )}
                    </div>

                    {/* Section Description */}
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {sec.desc}
                    </p>

                    {/* Menu Tab Row & Rename Editor */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      {!isEditing ? (
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-mono text-slate-400">
                            Menu Tab:
                          </span>
                          
                          <span className="text-xs font-semibold text-white px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 font-sans">
                            "{currentDisplayName}"
                          </span>

                          <button
                            type="button"
                            onClick={() => handleStartRename(sec)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-emerald-400 bg-dark-850 hover:bg-dark-800 border border-slate-700/60 hover:border-emerald-500/30 transition-all"
                            title={`Rename "${currentDisplayName}" menu tab`}
                          >
                            <Pencil className="w-3 h-3 text-emerald-400" />
                            <span>Rename Tab</span>
                          </button>

                          {isCustomizedName && (
                            <>
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                Custom Label
                              </span>
                              <button
                                type="button"
                                onClick={() => handleResetSingleName(sec)}
                                className="text-xs font-mono text-slate-400 hover:text-slate-200 underline transition-colors"
                                title={`Reset label to default "${sec.navLabel}"`}
                              >
                                Reset to "{sec.navLabel}"
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        /* Inline Rename Input Form */
                        <div className="space-y-2 py-1 max-w-md animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                              <Pencil className="w-3 h-3" />
                              Rename Tab for {sec.defaultName}
                            </span>
                            <span className={`text-[11px] font-mono ${
                              editInputValue.trim().length > 30 ? 'text-rose-400' : 'text-slate-400'
                            }`}>
                              {editInputValue.trim().length}/30
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editInputValue}
                              onChange={(e) => {
                                setEditInputValue(e.target.value);
                                setEditInputError(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveRename(sec.id);
                                }
                                if (e.key === 'Escape') {
                                  e.preventDefault();
                                  handleCancelRename();
                                }
                              }}
                              maxLength={30}
                              autoFocus
                              placeholder={sec.navLabel}
                              disabled={savingRename}
                              className={`flex-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-sans bg-dark-950 border text-white placeholder-slate-500 focus:outline-none transition-colors ${
                                editInputError
                                  ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/30'
                                  : 'border-emerald-500/50 focus:border-emerald-400 ring-1 ring-emerald-500/30'
                              }`}
                            />

                            <button
                              type="button"
                              onClick={() => handleSaveRename(sec.id)}
                              disabled={savingRename}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleCancelRename}
                              disabled={savingRename}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {editInputError && (
                            <p className="text-xs text-rose-400">{editInputError}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Dual Independent Controls (Page Visibility & Navbar Tab Visibility) */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-56 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-5">
                  
                  {/* Control 1: Section on Page Toggle */}
                  <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-dark-950/80 border border-slate-800/80">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-semibold text-white block">
                          On Page
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block">
                        {isPageVis ? 'Displayed' : 'Hidden'}
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isPageVis}
                      aria-label={`Toggle page visibility of ${sec.defaultName}`}
                      disabled={isPageTogglePending}
                      onClick={() => handleToggleSection(sec.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isPageVis ? 'bg-emerald-500' : 'bg-slate-700'
                      } ${isPageTogglePending ? 'opacity-60 cursor-wait' : ''}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isPageVis ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Control 2: Navbar Tab Toggle */}
                  <div className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-colors ${
                    !isPageVis 
                      ? 'bg-dark-950/40 border-slate-850 opacity-60'
                      : 'bg-dark-950/80 border-slate-800/80'
                  }`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-semibold text-white block">
                          In Navbar
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block truncate">
                        {!isPageVis 
                          ? 'Disabled (Page off)'
                          : isNavVis ? 'Visible in Menu' : 'Hidden in Menu'
                        }
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isNavVis}
                      aria-label={`Toggle navbar menu tab of ${sec.defaultName}`}
                      disabled={isNavTogglePending || !isPageVis}
                      onClick={() => handleToggleNav(sec.id)}
                      title={!isPageVis ? 'Enable "On Page" first to show in navbar' : 'Toggle navbar link'}
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        !isPageVis
                          ? 'bg-slate-800 cursor-not-allowed opacity-50'
                          : isNavVis ? 'bg-emerald-500 cursor-pointer' : 'bg-slate-700 cursor-pointer'
                      } ${isNavTogglePending ? 'opacity-60 cursor-wait' : ''}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isNavVis && isPageVis ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Guidance Callout */}
      <div className="p-4 rounded-2xl bg-dark-900/90 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-white">How Page Visibility & Navigation Tabs Interact</p>
          <p className="text-slate-400 leading-relaxed">
            <strong>On Page</strong> controls whether the section renders on the public portfolio page when scrolling. <strong>In Navbar</strong> controls whether its menu tab link appears in the desktop navigation bar and mobile drawer. If you hide a section from the page, its menu tab is automatically hidden as well so visitors never encounter broken anchor links.
          </p>
        </div>
      </div>

    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, FolderGit2, SlidersHorizontal } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioData } from '../data/portfolioData';
import { defaultEase } from './animations/MotionWrappers';
import SectionHeader from './SectionHeader';
import ProjectCard from './ProjectCard';
import ResearchCard from './ResearchCard';
import ResearchModal from './ResearchModal';
import ShowcaseFilterBar from './ShowcaseFilterBar';

export default function Projects({ onSelectProject, data }) {
  const { portfolio } = usePortfolio();
  const shouldReduceMotion = useReducedMotion();

  // Active Main Tab: 'projects' | 'research' (default to projects showcase)
  const [activeTab, setActiveTab] = useState('projects');

  // Independent Research Filters (Search & Dropdowns, NO subcategory tabs)
  const [researchCategory, setResearchCategory] = useState('All');
  const [researchType, setResearchType] = useState('All');
  const [researchStatus, setResearchStatus] = useState('All');
  const [researchYear, setResearchYear] = useState('All');
  const [researchTag, setResearchTag] = useState('All');
  const [researchSearch, setResearchSearch] = useState('');

  // Independent Projects Filters (Search & Dropdowns, NO subcategory tabs)
  const [projectCategory, setProjectCategory] = useState('All');
  const [projectType, setProjectType] = useState('All');
  const [projectStatus, setProjectStatus] = useState('All');
  const [projectTag, setProjectTag] = useState('All');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectSortBy, setProjectSortBy] = useState('newest'); // 'newest' | 'oldest'

  // Selected research modal state
  const [selectedResearch, setSelectedResearch] = useState(null);

  // Resolved Data Sources
  const projectsSection = data || portfolio?.projects || portfolioData.projects;
  const researchSection = portfolio?.research || portfolioData.research;

  const rawProjectItems = projectsSection?.items || [];
  const rawResearchItems = researchSection?.items || [];

  // ================= RESEARCH TAXONOMIES & FILTERING =================
  const researchCategories = useMemo(() => {
    const fromData = researchSection?.categories || [];
    const fromItems = rawResearchItems.map(r => r.category).filter(Boolean);
    const merged = ['All', ...fromData.map(c => typeof c === 'string' ? c : c.name).filter(c => c !== 'All'), ...fromItems];
    return Array.from(new Set(merged));
  }, [researchSection, rawResearchItems]);

  const researchCategoryCounts = useMemo(() => {
    const counts = { All: rawResearchItems.length };
    researchCategories.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = rawResearchItems.filter(r => r.category === cat).length;
      }
    });
    return counts;
  }, [researchCategories, rawResearchItems]);

  const researchTypes = useMemo(() => {
    const fromData = researchSection?.types || [];
    const fromItems = rawResearchItems.map(r => r.type).filter(Boolean);
    const merged = ['All', ...fromData.filter(t => t !== 'All'), ...fromItems];
    return Array.from(new Set(merged));
  }, [researchSection, rawResearchItems]);

  const researchStatuses = useMemo(() => {
    const fromData = researchSection?.statuses || [];
    const fromItems = rawResearchItems.map(r => r.status).filter(Boolean);
    const merged = ['All', ...fromData.filter(s => s !== 'All'), ...fromItems];
    return Array.from(new Set(merged));
  }, [researchSection, rawResearchItems]);

  const researchYears = useMemo(() => {
    const years = rawResearchItems
      .map(r => r.publicationYear || (r.publicationDate ? r.publicationDate.split('-')[0] : ''))
      .filter(Boolean);
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [rawResearchItems]);

  const researchTags = useMemo(() => {
    const fromData = researchSection?.tags || [];
    const fromItems = rawResearchItems.flatMap(r => r.tags || []);
    return Array.from(new Set([...fromData, ...fromItems])).filter(Boolean);
  }, [researchSection, rawResearchItems]);

  const filteredResearch = useMemo(() => {
    return rawResearchItems.filter((item) => {
      if (item.is_published === false) return false;

      const matchCat = researchCategory === 'All' || item.category === researchCategory;
      const matchType = researchType === 'All' || item.type === researchType;
      const matchStatus = researchStatus === 'All' || item.status === researchStatus;
      const itemYear = item.publicationYear || (item.publicationDate ? item.publicationDate.split('-')[0] : '');
      const matchYear = researchYear === 'All' || itemYear === researchYear;
      const matchTag = researchTag === 'All' || (item.tags && item.tags.includes(researchTag));

      const query = researchSearch.toLowerCase().trim();
      const matchSearch = !query || (
        item.title?.toLowerCase().includes(query) ||
        item.abstract?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.venue?.toLowerCase().includes(query) ||
        (Array.isArray(item.authors) ? item.authors.some(a => a.toLowerCase().includes(query)) : item.authors?.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(query)))
      );

      return matchCat && matchType && matchStatus && matchYear && matchTag && matchSearch;
    });
  }, [rawResearchItems, researchCategory, researchType, researchStatus, researchYear, researchTag, researchSearch]);

  const handleResetResearchFilters = () => {
    setResearchCategory('All');
    setResearchType('All');
    setResearchStatus('All');
    setResearchYear('All');
    setResearchTag('All');
    setResearchSearch('');
  };

  // ================= PROJECTS TAXONOMIES & FILTERING =================
  const projectCategories = useMemo(() => {
    const fromData = projectsSection?.categories || [];
    const fromItems = rawProjectItems.map(p => p.category).filter(Boolean);
    const merged = ['All', ...fromData.map(c => typeof c === 'string' ? c : c.name).filter(c => c !== 'All'), ...fromItems];
    return Array.from(new Set(merged));
  }, [projectsSection, rawProjectItems]);

  const projectCategoryCounts = useMemo(() => {
    const counts = { All: rawProjectItems.length };
    projectCategories.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = rawProjectItems.filter(p => p.category === cat).length;
      }
    });
    return counts;
  }, [projectCategories, rawProjectItems]);

  const projectTypes = useMemo(() => {
    const types = rawProjectItems.map(p => p.type).filter(Boolean);
    return ['All', ...Array.from(new Set(types))];
  }, [rawProjectItems]);

  const projectStatuses = useMemo(() => {
    const statuses = rawProjectItems.map(p => p.status).filter(Boolean);
    return ['All', ...Array.from(new Set(statuses))];
  }, [rawProjectItems]);

  const projectTags = useMemo(() => {
    const fromData = projectsSection?.tags || [];
    const fromItems = rawProjectItems.flatMap(p => [...(p.tags || []), ...(p.technologies || [])]);
    return Array.from(new Set([...fromData, ...fromItems])).filter(Boolean);
  }, [projectsSection, rawProjectItems]);

  const filteredProjects = useMemo(() => {
    const filtered = rawProjectItems.filter((item) => {
      if (item.is_published === false) return false;

      const matchCat = projectCategory === 'All' || item.category === projectCategory;
      const matchType = projectType === 'All' || item.type === projectType;
      const matchStatus = projectStatus === 'All' || item.status === projectStatus;
      const matchTag = projectTag === 'All' || (
        (item.tags && item.tags.includes(projectTag)) ||
        (item.technologies && item.technologies.includes(projectTag))
      );

      const query = projectSearch.toLowerCase().trim();
      const matchSearch = !query || (
        item.title?.toLowerCase().includes(query) ||
        item.tagline?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.problemStatement?.toLowerCase().includes(query) ||
        (item.technologies && item.technologies.some(t => t.toLowerCase().includes(query))) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(query)))
      );

      return matchCat && matchType && matchStatus && matchTag && matchSearch;
    });

    return filtered.sort((a, b) => {
      const dateA = a.completionDate || a.completionYear || '1970';
      const dateB = b.completionDate || b.completionYear || '1970';
      if (projectSortBy === 'oldest') {
        return dateA.localeCompare(dateB);
      }
      return dateB.localeCompare(dateA);
    });
  }, [rawProjectItems, projectCategory, projectType, projectStatus, projectTag, projectSearch, projectSortBy]);

  const handleResetProjectFilters = () => {
    setProjectCategory('All');
    setProjectType('All');
    setProjectStatus('All');
    setProjectTag('All');
    setProjectSearch('');
    setProjectSortBy('newest');
  };

  // Animation variants
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

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: defaultEase,
      },
    },
  };

  return (
    <section 
      id="projects" 
      aria-labelledby="projects-heading"
      className="min-h-[calc(100dvh-var(--navbar-height))] flex flex-col justify-start pt-7 sm:pt-9 md:pt-10 pb-12 sm:pb-16 md:pb-20 relative overflow-hidden scroll-mt-[var(--navbar-height)] bg-white dark:bg-[#0A0A0A] border-t border-[#A0AEC0]/20 dark:border-[#222222] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <SectionHeader 
          id="projects-heading"
          title={projectsSection.title || "Research & Projects"}
          subtitle={
            activeTab === 'projects'
              ? (projectsSection.subtitle || "A showcase of offensive & defensive security frameworks, enterprise network infrastructures, and artificial intelligence models.")
              : (researchSection.subtitle || "Peer-reviewed publications, technical reports, and experimental investigations into network security, distributed systems, and machine intelligence.")
          }
        />

        {/* Main Tab Navigation: [ Projects (N) | Research (M) ] */}
        <div className="flex justify-center mb-8 sm:mb-10 border-b border-slate-200/60 dark:border-[#222222]">
          <div 
            role="tablist"
            aria-label="Showcase category switcher"
            className="flex items-center gap-8 sm:gap-12"
          >
            {/* Projects Tab */}
            <button
              role="tab"
              aria-selected={activeTab === 'projects'}
              aria-controls="projects-panel"
              id="tab-projects"
              onClick={() => setActiveTab('projects')}
              className={`relative pb-3.5 pt-2 px-1 text-sm sm:text-base font-semibold transition-colors flex items-center gap-2 sm:gap-2.5 cursor-pointer touch-manipulation select-none ${
                activeTab === 'projects'
                  ? 'text-[#2D3748] dark:text-white font-bold'
                  : 'text-[#718096] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white font-medium'
              }`}
            >
              <FolderGit2 className={`w-4 h-4 shrink-0 ${activeTab === 'projects' ? 'text-[#2D3748] dark:text-white' : 'text-[#718096] dark:text-[#A0AEC0]'}`} />
              <span>Projects</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                activeTab === 'projects' 
                  ? 'bg-[#F5F7FA] text-[#2D3748] dark:bg-[#161616] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626]' 
                  : 'bg-slate-100 dark:bg-[#121212] text-[#718096] dark:text-[#A0AEC0]'
              }`}>
                {rawProjectItems.length}
              </span>
              {activeTab === 'projects' && (
                <motion.div
                  layoutId="activeShowcaseTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D3748] dark:bg-[#F5F7FA]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>

            {/* Research Tab */}
            <button
              role="tab"
              aria-selected={activeTab === 'research'}
              aria-controls="research-panel"
              id="tab-research"
              onClick={() => setActiveTab('research')}
              className={`relative pb-3.5 pt-2 px-1 text-sm sm:text-base font-semibold transition-colors flex items-center gap-2 sm:gap-2.5 cursor-pointer touch-manipulation select-none ${
                activeTab === 'research'
                  ? 'text-[#2D3748] dark:text-white font-bold'
                  : 'text-[#718096] dark:text-[#A0AEC0] hover:text-[#2D3748] dark:hover:text-white font-medium'
              }`}
            >
              <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'research' ? 'text-[#2D3748] dark:text-white' : 'text-[#718096] dark:text-[#A0AEC0]'}`} />
              <span>Research</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                activeTab === 'research' 
                  ? 'bg-[#F5F7FA] text-[#2D3748] dark:bg-[#161616] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626]' 
                  : 'bg-slate-100 dark:bg-[#121212] text-[#718096] dark:text-[#A0AEC0]'
              }`}>
                {rawResearchItems.length}
              </span>
              {activeTab === 'research' && (
                <motion.div
                  layoutId="activeShowcaseTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D3748] dark:bg-[#F5F7FA]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Panel: PROJECTS */}
        {activeTab === 'projects' && (
          <div id="projects-panel" role="tabpanel" aria-labelledby="tab-projects" className="animate-fade-in">
            {/* Preserved Search & Filter Bar (WITHOUT Subcategory Tabs) */}
            <ShowcaseFilterBar
              activeTab="projects"
              categories={projectCategories}
              activeCategory={projectCategory}
              onSelectCategory={setProjectCategory}
              categoryCounts={projectCategoryCounts}
              types={projectTypes}
              activeType={projectType}
              onSelectType={setProjectType}
              statuses={projectStatuses}
              activeStatus={projectStatus}
              onSelectStatus={setProjectStatus}
              tags={projectTags}
              activeTag={projectTag}
              onSelectTag={setProjectTag}
              sortBy={projectSortBy}
              onSelectSortBy={setProjectSortBy}
              searchQuery={projectSearch}
              onSearchChange={setProjectSearch}
              onResetFilters={handleResetProjectFilters}
              totalCount={rawProjectItems.length}
              filteredCount={filteredProjects.length}
              filterConfig={projectsSection?.filterConfig || {}}
            />

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 p-8 glass-card rounded-xl max-w-md mx-auto">
                <SlidersHorizontal className="w-10 h-10 text-[#2D3748] dark:text-[#A0AEC0] mx-auto mb-3" />
                <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-200">No matching projects found</h3>
                <p className="text-xs font-sans text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                <button
                  onClick={handleResetProjectFilters}
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-sans font-semibold bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#2D3748] shadow-subtle transition-all active:scale-98 cursor-pointer"
                >
                  Reset Project Filters
                </button>
              </div>
            ) : (
              <motion.div 
                key={`proj-${projectCategory}-${projectType}-${projectStatus}-${projectTag}-${projectSearch}-${projectSortBy}`}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.08, margin: "-20px 0px -20px 0px" }}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    layout={project.featured ? 'featured' : 'standard'}
                    onSelect={(p, tab) => onSelectProject(p, tab)}
                    variants={cardVariants}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Tab Panel: RESEARCH */}
        {activeTab === 'research' && (
          <div id="research-panel" role="tabpanel" aria-labelledby="tab-research" className="animate-fade-in">
            {/* Preserved Search & Filter Bar (WITHOUT Subcategory Tabs) */}
            <ShowcaseFilterBar
              activeTab="research"
              categories={researchCategories}
              activeCategory={researchCategory}
              onSelectCategory={setResearchCategory}
              categoryCounts={researchCategoryCounts}
              types={researchTypes}
              activeType={researchType}
              onSelectType={setResearchType}
              statuses={researchStatuses}
              activeStatus={researchStatus}
              onSelectStatus={setResearchStatus}
              years={researchYears}
              activeYear={researchYear}
              onSelectYear={setResearchYear}
              tags={researchTags}
              activeTag={researchTag}
              onSelectTag={setResearchTag}
              searchQuery={researchSearch}
              onSearchChange={setResearchSearch}
              onResetFilters={handleResetResearchFilters}
              totalCount={rawResearchItems.length}
              filteredCount={filteredResearch.length}
              filterConfig={researchSection?.filterConfig || {}}
            />

            {/* Research Grid */}
            {filteredResearch.length === 0 ? (
              <div className="text-center py-16 p-8 glass-card rounded-xl max-w-md mx-auto">
                <SlidersHorizontal className="w-10 h-10 text-[#2D3748] dark:text-[#A0AEC0] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No matching publications found</h3>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your research filters or search terms.</p>
                <button
                  onClick={handleResetResearchFilters}
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-sans font-semibold bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#2D3748] shadow-subtle transition-all active:scale-98 cursor-pointer"
                >
                  Reset Research Filters
                </button>
              </div>
            ) : (
              <motion.div 
                key={`research-${researchCategory}-${researchType}-${researchStatus}-${researchYear}-${researchTag}-${researchSearch}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.08, margin: "-20px 0px -20px 0px" }}
              >
                {filteredResearch.map((item) => (
                  <ResearchCard
                    key={item.id}
                    item={item}
                    onSelect={(r) => setSelectedResearch(r)}
                    variants={cardVariants}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )}

      </div>

      {/* Dedicated Research Paper Modal */}
      {selectedResearch && (
        <ResearchModal
          item={selectedResearch}
          onClose={() => setSelectedResearch(null)}
        />
      )}

    </section>
  );
}

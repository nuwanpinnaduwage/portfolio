import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../services/portfolioService';
import { portfolioData as initialStaticData } from '../data/portfolioData';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const { user } = useAuth();
  const isAdmin = Boolean(user);
  
  // Synchronously initialize with staged data if present to prevent any flash of hidden sections on initial load
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const raw = typeof window !== 'undefined'
        ? (localStorage.getItem('portfolio_staged_data') || sessionStorage.getItem('portfolio_staged_data'))
        : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) return parsed;
      }
    } catch (e) {
      // fallback to initial static data
    }
    return initialStaticData;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchErr } = await portfolioService.fetchPortfolio(isAdmin || previewMode);
      if (fetchErr) setError(fetchErr);
      if (data) setPortfolio(data);
    } catch (e) {
      console.error("Error loading portfolio data:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, previewMode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Synchronize document data-theme-preset attribute with active accentColor setting
  useEffect(() => {
    const accentKey = portfolio?.settings?.accentColor || 'neon-emerald';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme-preset', accentKey);
    }
  }, [portfolio?.settings?.accentColor]);

  // Real-time synchronization across browser tabs and devices
  useEffect(() => {
    // 1. Cross-tab synchronization within the same browser session
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_staged_data') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 2. Supabase Realtime subscription for cross-device updates across all content tables
    let channel = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('portfolio_realtime_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'research' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'education' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'experience' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'achievements' }, () => loadData())
        .subscribe();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadData]);

  // Wrapper handlers that persist to Supabase and reload
  const updateProfile = async (profileData) => {
    const res = await portfolioService.updateProfile(profileData);
    if (res.success) await loadData();
    return res;
  };

  const saveProject = async (project) => {
    const res = await portfolioService.saveProject(project);
    if (res.success) await loadData();
    return res;
  };

  const deleteProject = async (id) => {
    const res = await portfolioService.deleteProject(id);
    if (res.success) await loadData();
    return res;
  };

  const toggleProjectVisibility = async (id) => {
    const res = await portfolioService.toggleProjectVisibility(id);
    if (res.success) await loadData();
    return res;
  };

  const duplicateProject = async (id) => {
    const res = await portfolioService.duplicateProject(id);
    if (res.success) await loadData();
    return res;
  };

  const toggleProjectFeatured = async (id) => {
    const res = await portfolioService.toggleProjectFeatured(id);
    if (res.success) await loadData();
    return res;
  };

  const reorderProjects = async (orderedIds) => {
    const res = await portfolioService.reorderProjects(orderedIds);
    if (res.success) await loadData();
    return res;
  };

  const getProjectBySlug = async (slug) => {
    const inMemory = portfolio.projects?.items?.find(
      (p) => p.slug === slug || p.id === slug || p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );
    if (inMemory) return { data: inMemory, error: null };
    return await portfolioService.fetchProjectBySlug(slug);
  };

  const saveSubcategory = async (categoryName, subcategoryName) => {
    const res = await portfolioService.saveSubcategory(categoryName, subcategoryName);
    if (res.success) await loadData();
    return res;
  };

  const deleteSubcategory = async (categoryName, subcategoryName) => {
    const res = await portfolioService.deleteSubcategory(categoryName, subcategoryName);
    if (res.success) await loadData();
    return res;
  };

  const saveResearch = async (item) => {
    const res = await portfolioService.saveResearch(item);
    if (res.success) await loadData();
    return res;
  };

  const deleteResearch = async (id) => {
    const res = await portfolioService.deleteResearch(id);
    if (res.success) await loadData();
    return res;
  };

  const toggleResearchVisibility = async (id) => {
    const res = await portfolioService.toggleResearchVisibility(id);
    if (res.success) await loadData();
    return res;
  };

  const addTag = async (tagName, context) => {
    const res = await portfolioService.addTag(tagName, context);
    if (res.success) await loadData();
    return res;
  };

  const renameTag = async (oldTag, newTag, context) => {
    const res = await portfolioService.renameTag(oldTag, newTag, context);
    if (res.success) await loadData();
    return res;
  };

  const deleteTag = async (tagName, context) => {
    const res = await portfolioService.deleteTag(tagName, context);
    if (res.success) await loadData();
    return res;
  };

  const saveType = async (typeData, context) => {
    const res = await portfolioService.saveType(typeData, context);
    if (res.success) await loadData();
    return res;
  };

  const deleteType = async (typeName, context) => {
    const res = await portfolioService.deleteType(typeName, context);
    if (res.success) await loadData();
    return res;
  };

  const saveCategory = async (categoryData, context) => {
    const res = await portfolioService.saveCategory(categoryData, context);
    if (res.success) await loadData();
    return res;
  };

  const deleteCategory = async (categoryName, context) => {
    const res = await portfolioService.deleteCategory(categoryName, context);
    if (res.success) await loadData();
    return res;
  };

  const updateFilterConfig = async (context, newConfig) => {
    const res = await portfolioService.updateFilterConfig(context, newConfig);
    if (res.success) await loadData();
    return res;
  };

  const reorderItems = async (context, orderedIds) => {
    const res = await portfolioService.reorderItems(context, orderedIds);
    if (res.success) await loadData();
    return res;
  };

  const saveSkill = async (skill) => {
    const res = await portfolioService.saveSkill(skill);
    if (res.success) await loadData();
    return res;
  };

  const deleteSkill = async (id, name) => {
    const res = await portfolioService.deleteSkill(id, name);
    if (res.success) await loadData();
    return res;
  };

  const duplicateSkill = async (id) => {
    const res = await portfolioService.duplicateSkill(id);
    if (res.success) await loadData();
    return res;
  };

  const toggleSkillVisibility = async (id) => {
    const res = await portfolioService.toggleSkillVisibility(id);
    if (res.success) await loadData();
    return res;
  };

  const toggleSkillFeatured = async (id) => {
    const res = await portfolioService.toggleSkillFeatured(id);
    if (res.success) await loadData();
    return res;
  };

  const reorderSkills = async (categoryId, orderedIds) => {
    const res = await portfolioService.reorderSkills(categoryId, orderedIds);
    if (res.success) await loadData();
    return res;
  };

  const moveSkillToCatalog = async (skillId, targetCatalogId) => {
    const res = await portfolioService.moveSkillToCatalog(skillId, targetCatalogId);
    if (res.success) await loadData();
    return res;
  };

  const saveSkillCatalog = async (cat) => {
    const res = await portfolioService.saveSkillCatalog(cat);
    if (res.success) await loadData();
    return res;
  };

  const deleteSkillCatalog = async (catId) => {
    const res = await portfolioService.deleteSkillCatalog(catId);
    if (res.success) await loadData();
    return res;
  };

  const toggleSkillCatalogVisibility = async (catId) => {
    const res = await portfolioService.toggleSkillCatalogVisibility(catId);
    if (res.success) await loadData();
    return res;
  };

  const reorderSkillCatalogs = async (orderedCatalogIds) => {
    const res = await portfolioService.reorderSkillCatalogs(orderedCatalogIds);
    if (res.success) await loadData();
    return res;
  };

  const saveSkillCategory = async (cat) => {
    const res = await portfolioService.saveSkillCategory(cat);
    if (res.success) await loadData();
    return res;
  };

  const deleteSkillCategory = async (catId) => {
    const res = await portfolioService.deleteSkillCategory(catId);
    if (res.success) await loadData();
    return res;
  };

  const saveSkillSubcategory = async (catId, subName) => {
    const res = await portfolioService.saveSkillSubcategory(catId, subName);
    if (res.success) await loadData();
    return res;
  };

  const deleteSkillSubcategory = async (catId, subName) => {
    const res = await portfolioService.deleteSkillSubcategory(catId, subName);
    if (res.success) await loadData();
    return res;
  };

  const saveTechnologyTag = async (oldTag, newTag) => {
    const res = await portfolioService.saveTechnologyTag(oldTag, newTag);
    if (res.success) await loadData();
    return res;
  };

  const deleteTechnologyTag = async (tag) => {
    const res = await portfolioService.deleteTechnologyTag(tag);
    if (res.success) await loadData();
    return res;
  };

  const saveEducation = async (edu) => {
    const res = await portfolioService.saveEducation(edu);
    if (res.success) await loadData();
    return res;
  };

  const deleteEducation = async (id) => {
    const res = await portfolioService.deleteEducation(id);
    if (res.success) await loadData();
    return res;
  };

  const reorderEducation = async (orderedDegrees) => {
    const res = await portfolioService.reorderEducation(orderedDegrees);
    if (res.success) await loadData();
    return res;
  };

  const updateAboutIntroduction = async (introData) => {
    const res = await portfolioService.updateAboutIntroduction(introData);
    if (res.success) await loadData();
    return res;
  };

  const updateProfilePhoto = async (avatarUrl) => {
    const res = await portfolioService.updateProfilePhoto(avatarUrl);
    if (res.success) await loadData();
    return res;
  };

  const saveTechStackItem = async (item) => {
    const res = await portfolioService.saveTechStackItem(item);
    if (res.success) await loadData();
    return res;
  };

  const deleteTechStackItem = async (idOrName) => {
    const res = await portfolioService.deleteTechStackItem(idOrName);
    if (res.success) await loadData();
    return res;
  };

  const reorderTechStack = async (orderedItems) => {
    const res = await portfolioService.reorderTechStack(orderedItems);
    if (res.success) await loadData();
    return res;
  };

  const saveCertificate = async (cert) => {
    const res = await portfolioService.saveCertificate(cert);
    if (res.success) await loadData();
    return res;
  };

  const deleteCertificate = async (id) => {
    const res = await portfolioService.deleteCertificate(id);
    if (res.success) await loadData();
    return res;
  };

  const reorderCertificates = async (orderedCerts) => {
    const res = await portfolioService.reorderCertificates(orderedCerts);
    if (res.success) await loadData();
    return res;
  };

  const saveExperience = async (exp) => {
    const res = await portfolioService.saveExperience(exp);
    if (res.success) await loadData();
    return res;
  };

  const deleteExperience = async (id) => {
    const res = await portfolioService.deleteExperience(id);
    if (res.success) await loadData();
    return res;
  };

  const saveAchievement = async (ach) => {
    const res = await portfolioService.saveAchievement(ach);
    if (res.success) await loadData();
    return res;
  };

  const deleteAchievement = async (id) => {
    const res = await portfolioService.deleteAchievement(id);
    if (res.success) await loadData();
    return res;
  };

  const saveSiteSettings = async (settings) => {
    const res = await portfolioService.saveSiteSettings(settings);
    if (res.success) await loadData();
    return res;
  };

  // Specific high-performance handler for toggling a single section's visibility with optimistic UI
  const updateSectionVisibility = async (sectionId, isVisible) => {
    const currentVis = portfolio.settings?.sectionVisibility || {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: true,
      contact: true,
    };
    const updatedVis = {
      ...currentVis,
      [sectionId]: isVisible,
    };

    const previousPortfolio = portfolio;

    // 1. Instant optimistic update so UI re-renders immediately
    setPortfolio(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        sectionVisibility: updatedVis,
      }
    }));

    const payload = {
      ...portfolio.settings,
      sectionVisibility: updatedVis,
    };

    // 2. Persist to storage and Supabase
    try {
      const res = await portfolioService.saveSiteSettings(payload);
      if (res && res.error) {
        // Rollback state if server update failed
        setPortfolio(previousPortfolio);
        return { success: false, error: res.error };
      }
      return { success: true, error: null };
    } catch (err) {
      setPortfolio(previousPortfolio);
      return { success: false, error: err };
    }
  };

  // High-performance bulk handler for showing all or resetting visibility
  const setAllSectionVisibility = async (newVisibilityMap) => {
    const previousPortfolio = portfolio;

    // 1. Instant optimistic update
    setPortfolio(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        sectionVisibility: newVisibilityMap,
      }
    }));

    const payload = {
      ...portfolio.settings,
      sectionVisibility: newVisibilityMap,
    };

    try {
      const res = await portfolioService.saveSiteSettings(payload);
      if (res && res.error) {
        setPortfolio(previousPortfolio);
        return { success: false, error: res.error };
      }
      return { success: true, error: null };
    } catch (err) {
      setPortfolio(previousPortfolio);
      return { success: false, error: err };
    }
  };

  // Specific high-performance handler for toggling a single navigation tab's visibility with optimistic UI
  const updateNavVisibility = async (sectionId, isVisible) => {
    const currentNavVis = portfolio.settings?.navVisibility || {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: true,
      contact: true,
    };
    const updatedNavVis = {
      ...currentNavVis,
      [sectionId]: isVisible,
    };

    const previousPortfolio = portfolio;

    // 1. Instant optimistic update so UI re-renders immediately
    setPortfolio(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        navVisibility: updatedNavVis,
      }
    }));

    const payload = {
      ...portfolio.settings,
      navVisibility: updatedNavVis,
    };

    // 2. Persist to storage and Supabase
    try {
      const res = await portfolioService.saveSiteSettings(payload);
      if (res && res.error) {
        setPortfolio(previousPortfolio);
        return { success: false, error: res.error };
      }
      return { success: true, error: null };
    } catch (err) {
      setPortfolio(previousPortfolio);
      return { success: false, error: err };
    }
  };

  // High-performance bulk handler for updating all navigation tabs visibility
  const setAllNavVisibility = async (newNavVisibilityMap) => {
    const previousPortfolio = portfolio;

    setPortfolio(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        navVisibility: newNavVisibilityMap,
      }
    }));

    const payload = {
      ...portfolio.settings,
      navVisibility: newNavVisibilityMap,
    };

    try {
      const res = await portfolioService.saveSiteSettings(payload);
      if (res && res.error) {
        setPortfolio(previousPortfolio);
        return { success: false, error: res.error };
      }
      return { success: true, error: null };
    } catch (err) {
      setPortfolio(previousPortfolio);
      return { success: false, error: err };
    }
  };

  // Handler for renaming a section's visible navigation label with optimistic UI
  const renameSection = async (sectionId, newName) => {
    const trimmed = (newName || '').trim();
    const currentNames = portfolio.settings?.sectionNames || {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      experience: 'Experience',
      education: 'Education',
      contact: 'Contact',
    };

    const updatedNames = {
      ...currentNames,
      [sectionId]: trimmed,
    };

    const previousPortfolio = portfolio;

    // 1. Instant optimistic update
    setPortfolio(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        sectionNames: updatedNames,
      }
    }));

    const payload = {
      ...portfolio.settings,
      sectionNames: updatedNames,
    };

    try {
      const res = await portfolioService.saveSiteSettings(payload);
      if (res && res.error) {
        setPortfolio(previousPortfolio);
        return { success: false, error: res.error };
      }
      return { success: true, error: null };
    } catch (err) {
      setPortfolio(previousPortfolio);
      return { success: false, error: err };
    }
  };

  const uploadAsset = async (file, folder) => {
    return await portfolioService.uploadAsset(file, folder);
  };

  const saveHero = async (heroData) => {
    const res = await portfolioService.saveHero(heroData);
    if (res.success) await loadData();
    return res;
  };

  const saveContact = async (contactData) => {
    const res = await portfolioService.saveContact(contactData);
    if (res.success) await loadData();
    return res;
  };

  const saveFooter = async (footerData) => {
    const res = await portfolioService.saveFooter(footerData);
    if (res.success) await loadData();
    return res;
  };

  const resetFooterToDefault = async () => {
    const res = await portfolioService.resetFooterToDefault();
    if (res.success) await loadData();
    return res;
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        loading,
        error,
        previewMode,
        setPreviewMode,
        refreshData: loadData,
        updateProfile,
        saveHero,
    saveContact,
        saveFooter,
        resetFooterToDefault,
        saveProject,
        deleteProject,
        duplicateProject,
        toggleProjectFeatured,
        reorderProjects,
        saveSubcategory,
        deleteSubcategory,
        toggleProjectVisibility,
        saveResearch,
        deleteResearch,
        toggleResearchVisibility,
        addTag,
        renameTag,
        deleteTag,
        saveType,
        deleteType,
        saveCategory,
        deleteCategory,
        updateFilterConfig,
        reorderItems,
        saveSkill,
        deleteSkill,
        duplicateSkill,
        toggleSkillVisibility,
        toggleSkillFeatured,
        reorderSkills,
        moveSkillToCatalog,
        saveSkillCatalog,
        deleteSkillCatalog,
        toggleSkillCatalogVisibility,
        reorderSkillCatalogs,
        saveSkillCategory,
        deleteSkillCategory,
        saveSkillSubcategory,
        deleteSkillSubcategory,
        saveTechnologyTag,
        deleteTechnologyTag,
        saveEducation,
        deleteEducation,
        reorderEducation,
        updateAboutIntroduction,
        updateProfilePhoto,
        saveTechStackItem,
        deleteTechStackItem,
        reorderTechStack,
        saveCertificate,
        deleteCertificate,
        reorderCertificates,
        saveExperience,
        deleteExperience,
        saveAchievement,
        deleteAchievement,
        saveSiteSettings,
        updateSectionVisibility,
        setAllSectionVisibility,
        updateNavVisibility,
        setAllNavVisibility,
        renameSection,
        uploadAsset,
        getProjectBySlug,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

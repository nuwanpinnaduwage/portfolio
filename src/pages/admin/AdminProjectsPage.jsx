import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  FolderGit2, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles,
  Layers,
  Search,
  SlidersHorizontal,
  Tag,
  FolderPlus,
  Calendar,
  Code2,
  Copy,
  ArrowUp,
  ArrowDown,
  Shield,
  Network,
  Cpu,
  Terminal,
  FileText,
  Lightbulb,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { GithubIcon } from '../../components/BrandIcons';
import ProjectCard from '../../components/ProjectCard';
import AdvancedProjectVisualEditor from '../../components/admin/AdvancedProjectVisualEditor';

export default function AdminProjectsPage() {
  const { 
    portfolio, 
    saveProject, 
    deleteProject, 
    duplicateProject,
    toggleProjectFeatured,
    reorderProjects,
    saveSubcategory,
    deleteSubcategory,
    toggleProjectVisibility,
    addTag,
    renameTag,
    deleteTag,
    saveType,
    deleteType,
    saveCategory,
    deleteCategory,
    updateFilterConfig,
    uploadAsset 
  } = usePortfolio();

  const projectsSection = portfolio?.projects || { items: [], types: [], categories: [], subcategories: {}, tags: [], filterConfig: {} };
  const items = projectsSection.items || [];
  const types = projectsSection.types || [];
  const categories = projectsSection.categories || [];
  const subcategoriesMap = projectsSection.subcategories || {};
  const tags = projectsSection.tags || [];
  const filterConfig = projectsSection.filterConfig || {};

  // Active Management Tab: 'projects' | 'categories' | 'tags' | 'media' | 'filters'
  const [activeTab, setActiveTab] = useState('projects');

  // Search & Filtering in Projects Table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedPublishFilter, setSelectedPublishFilter] = useState('All'); // 'All' | 'published' | 'draft'

  // Modals & State
  const [modalOpen, setModalOpen] = useState(false);
  const [editorTab, setEditorTab] = useState('basic'); // 'basic' | 'technical' | 'media' | 'in_depth' | 'preview'
  const [editingProject, setEditingProject] = useState(null);
  const [visualStudioProject, setVisualStudioProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category & Subcategory Management State
  const [selectedCatForSubs, setSelectedCatForSubs] = useState(categories[1] || 'Cybersecurity');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [renamingCategory, setRenamingCategory] = useState(null);
  const [renameCategoryValue, setRenameCategoryValue] = useState('');

  // Tag Management State
  const [newTagName, setNewTagName] = useState('');
  const [renamingTag, setRenamingTag] = useState(null);
  const [renameTagValue, setRenameTagValue] = useState('');

  // Media Library Upload State
  const [mediaList, setMediaList] = useState([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaAltText, setMediaAltText] = useState('');

  // Advanced Project Editor Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    tagline: '',
    description: '',
    fullOverview: '',
    type: 'Security Tool',
    category: 'Cybersecurity',
    subcategory: '',
    status: 'Completed',
    startDate: '2024-01',
    completionYear: '2024',
    completionDate: '2024-06',
    problemStatement: '',
    objectives: '',
    proposedSolution: '',
    methodology: '',
    technicalImplementation: '',
    technologies: '',
    tags: '',
    highlights: '',
    metrics: '',
    results: '',
    challenges: '',
    futureImprovements: '',
    github: '',
    demo: '',
    documentationUrl: '',
    paperUrl: '',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
    architectureDiagram: '',
    topologyDiagram: '',
    gallery: '',
    featured: false,
    is_published: true,
  });

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const cyber = items.filter(p => p.category?.toLowerCase().includes('cyber')).length;
    const net = items.filter(p => p.category?.toLowerCase().includes('network')).length;
    const ai = items.filter(p => p.category?.toLowerCase().includes('intelligence') || p.category?.toLowerCase().includes('ai')).length;
    const completed = items.filter(p => p.status?.toLowerCase() === 'completed').length;
    const inProgress = items.filter(p => p.status?.toLowerCase() === 'in progress').length;
    const published = items.filter(p => p.is_published !== false).length;
    const drafts = total - published;
    return { total, cyber, net, ai, completed, inProgress, published, drafts };
  }, [items]);

  // Filtered projects for management table
  const filteredProjects = useMemo(() => {
    return items.filter(proj => {
      const matchCat = selectedCategoryFilter === 'All' || proj.category === selectedCategoryFilter;
      const matchSub = selectedSubcategoryFilter === 'All' || proj.subcategory === selectedSubcategoryFilter;
      const matchStatus = selectedStatusFilter === 'All' || proj.status === selectedStatusFilter;
      const matchPub = selectedPublishFilter === 'All' || 
        (selectedPublishFilter === 'published' && proj.is_published !== false) ||
        (selectedPublishFilter === 'draft' && proj.is_published === false);

      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || (
        proj.title?.toLowerCase().includes(query) ||
        proj.tagline?.toLowerCase().includes(query) ||
        proj.description?.toLowerCase().includes(query) ||
        proj.subcategory?.toLowerCase().includes(query) ||
        (Array.isArray(proj.technologies) && proj.technologies.some(t => t.toLowerCase().includes(query))) ||
        (Array.isArray(proj.tags) && proj.tags.some(t => t.toLowerCase().includes(query)))
      );
      return matchCat && matchSub && matchStatus && matchPub && matchSearch;
    });
  }, [items, selectedCategoryFilter, selectedSubcategoryFilter, selectedStatusFilter, selectedPublishFilter, searchQuery]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProject(null);
    const initialCategory = categories.find(c => c !== 'All') || 'Cybersecurity';
    const subList = subcategoriesMap[initialCategory] || [];

    setFormData({
      id: '',
      title: '',
      slug: '',
      tagline: '',
      description: '',
      fullOverview: '',
      type: types.find(t => t !== 'All') || 'Security Tool',
      category: initialCategory,
      subcategory: subList[0] || '',
      status: 'Completed',
      startDate: `${new Date().getFullYear()}-01`,
      completionYear: new Date().getFullYear().toString(),
      completionDate: `${new Date().getFullYear()}-06`,
      problemStatement: '',
      objectives: '',
      proposedSolution: '',
      methodology: '',
      technicalImplementation: '',
      technologies: '',
      tags: '',
      highlights: '',
      metrics: '',
      results: '',
      challenges: '',
      futureImprovements: '',
      github: '',
      demo: '',
      documentationUrl: '',
      paperUrl: '',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
      architectureDiagram: '',
      topologyDiagram: '',
      gallery: '',
      featured: false,
      is_published: true,
    });
    setEditorTab('basic');
    setFeedback(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      id: proj.id || '',
      title: proj.title || '',
      slug: proj.slug || '',
      tagline: proj.tagline || '',
      description: proj.description || '',
      fullOverview: proj.fullOverview || proj.description || '',
      type: proj.type || 'Security Tool',
      category: proj.category || 'Cybersecurity',
      subcategory: proj.subcategory || '',
      status: proj.status || 'Completed',
      startDate: proj.startDate || `${proj.completionYear || '2024'}-01`,
      completionYear: proj.completionYear || (proj.completionDate ? proj.completionDate.split('-')[0] : '2024'),
      completionDate: proj.completionDate || `${proj.completionYear || '2024'}-06`,
      problemStatement: proj.problemStatement || '',
      objectives: proj.objectives || '',
      proposedSolution: proj.proposedSolution || '',
      methodology: proj.methodology || '',
      technicalImplementation: proj.technicalImplementation || '',
      technologies: (proj.technologies || []).join(', '),
      tags: (proj.tags || []).join(', '),
      highlights: (proj.keyFeatures || proj.highlights || []).join('\n'),
      metrics: (proj.metrics || []).join('\n'),
      results: proj.results || '',
      challenges: proj.challenges || '',
      futureImprovements: proj.futureImprovements || '',
      github: proj.github || '',
      demo: proj.demo || '',
      documentationUrl: proj.documentationUrl || '',
      paperUrl: proj.paperUrl || '',
      image: proj.image || '',
      architectureDiagram: proj.architectureDiagram || '',
      topologyDiagram: proj.topologyDiagram || '',
      gallery: (proj.gallery || []).join('\n'),
      featured: Boolean(proj.featured),
      is_published: proj.is_published !== undefined ? Boolean(proj.is_published) : true,
    });
    setEditorTab('basic');
    setFeedback(null);
    setModalOpen(true);
  };

  // Helper: validate HTTP / HTTPS URL format
  const isValidUrl = (str) => {
    if (!str || !str.trim()) return true;
    try {
      const parsed = new URL(str);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  // Save Project
  const handleSave = async (e, publishOverride = null) => {
    if (e) e.preventDefault();
    if (saving) return;

    if (!formData.title.trim()) {
      setFeedback({ type: 'error', message: 'Project title is required.' });
      return;
    }
    if (!formData.description.trim()) {
      setFeedback({ type: 'error', message: 'Project description is required.' });
      return;
    }

    // Comprehensive URL validation
    const urlFields = [
      { val: formData.github, name: 'GitHub Repository URL' },
      { val: formData.demo, name: 'Live Demonstration URL' },
      { val: formData.documentationUrl, name: 'Documentation URL' },
      { val: formData.paperUrl, name: 'Research Paper URL' },
      { val: formData.image, name: 'Project Thumbnail URL' },
      { val: formData.architectureDiagram, name: 'Architecture Diagram URL' },
      { val: formData.topologyDiagram, name: 'Topology Diagram URL' },
    ];

    for (const field of urlFields) {
      if (field.val && field.val.trim() && !isValidUrl(field.val.trim()) && !field.val.startsWith('data:')) {
        setFeedback({ 
          type: 'error', 
          message: `Invalid ${field.name}. Please enter a valid URL starting with http:// or https://` 
        });
        return;
      }
    }

    setSaving(true);
    const techArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const metricsArray = formData.metrics
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const keyFeaturesArray = formData.highlights
      .split('\n')
      .map(h => h.trim())
      .filter(Boolean);

    const galleryArray = formData.gallery
      .split('\n')
      .map(g => g.trim())
      .filter(Boolean);

    const isPublishedFinal = publishOverride !== null 
      ? Boolean(publishOverride) 
      : Boolean(formData.is_published);

    const projectPayload = {
      id: formData.id || undefined,
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: formData.tagline.trim(),
      description: formData.description.trim(),
      fullOverview: formData.fullOverview.trim() || formData.description.trim(),
      type: formData.type,
      category: formData.category,
      subcategory: formData.subcategory.trim(),
      status: formData.status,
      startDate: formData.startDate.trim(),
      completionYear: formData.completionYear.trim(),
      completionDate: formData.completionDate || `${formData.completionYear}-06`,
      problemStatement: formData.problemStatement.trim(),
      objectives: formData.objectives.trim(),
      proposedSolution: formData.proposedSolution.trim(),
      methodology: formData.methodology.trim(),
      technicalImplementation: formData.technicalImplementation.trim() || formData.fullOverview.trim(),
      technologies: techArray,
      tags: tagsArray.length > 0 ? tagsArray : techArray,
      metrics: metricsArray,
      keyFeatures: keyFeaturesArray,
      highlights: keyFeaturesArray,
      results: formData.results.trim(),
      challenges: formData.challenges.trim(),
      futureImprovements: formData.futureImprovements.trim(),
      github: formData.github.trim(),
      demo: formData.demo.trim(),
      documentationUrl: formData.documentationUrl.trim(),
      paperUrl: formData.paperUrl.trim(),
      image: formData.image.trim(),
      architectureDiagram: formData.architectureDiagram.trim(),
      topologyDiagram: formData.topologyDiagram.trim(),
      gallery: galleryArray.length > 0 ? galleryArray : (formData.image ? [formData.image] : []),
      featured: Boolean(formData.featured),
      is_published: isPublishedFinal,
    };

    const res = await saveProject(projectPayload);
    setSaving(false);

    if (res.success) {
      setModalOpen(false);
      setFeedback({ 
        type: 'success', 
        message: editingProject ? 'Project updated successfully!' : 'New project created successfully!' 
      });
    } else {
      setFeedback({ type: 'error', message: res.error?.message || 'Failed to save project.' });
    }
  };

  // Duplicate Project
  const handleDuplicate = async (id) => {
    const res = await duplicateProject(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Project duplicated as a draft copy.' });
    } else {
      setFeedback({ type: 'error', message: 'Failed to duplicate project.' });
    }
  };

  // Reorder Item (Move up/down)
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    await reorderProjects(newItems.map(p => p.id));
    setFeedback({ type: 'success', message: 'Project order updated.' });
  };

  // Delete Item
  const handleDelete = async (id) => {
    const res = await deleteProject(id);
    if (res.success) {
      setDeleteConfirmId(null);
      setFeedback({ type: 'success', message: 'Project deleted successfully.' });
    } else {
      setFeedback({ type: 'error', message: 'Failed to delete project.' });
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (id) => {
    await toggleProjectVisibility(id);
  };

  // Toggle Featured
  const handleToggleFeatured = async (id) => {
    await toggleProjectFeatured(id);
  };

  // File Upload Helper
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadAsset(file, 'projects');
      if (res.publicUrl) {
        setFormData(prev => ({ ...prev, [fieldName]: res.publicUrl }));
        setFeedback({ type: 'success', message: 'Image uploaded successfully!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Upload error: ' + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  // Subcategory management handlers
  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategoryName.trim()) return;
    await saveSubcategory(selectedCatForSubs, newSubcategoryName.trim());
    setNewSubcategoryName('');
    setFeedback({ type: 'success', message: `Subcategory "${newSubcategoryName}" added to ${selectedCatForSubs}.` });
  };

  const handleDeleteSubcategory = async (catName, subName) => {
    await deleteSubcategory(catName, subName);
    setFeedback({ type: 'success', message: `Subcategory "${subName}" removed.` });
  };

  // Category management handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await saveCategory({ newName: newCategoryName.trim() }, 'projects');
    setNewCategoryName('');
    setFeedback({ type: 'success', message: `Category "${newCategoryName}" added.` });
  };

  const handleRenameCategory = async (oldName) => {
    if (!renameCategoryValue.trim() || renameCategoryValue === oldName) {
      setRenamingCategory(null);
      return;
    }
    await saveCategory({ oldName, newName: renameCategoryValue.trim() }, 'projects');
    setRenamingCategory(null);
    setRenameCategoryValue('');
    setFeedback({ type: 'success', message: `Category renamed to "${renameCategoryValue}".` });
  };

  const handleDeleteCategory = async (catName) => {
    await deleteCategory(catName, 'projects');
    setFeedback({ type: 'success', message: `Category "${catName}" removed.` });
  };

  // Tag Handlers
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    await addTag(newTagName.trim(), 'projects');
    setNewTagName('');
    setFeedback({ type: 'success', message: `Tag "${newTagName}" added.` });
  };

  const handleRenameTag = async (oldName) => {
    if (!renameTagValue.trim() || renameTagValue === oldName) {
      setRenamingTag(null);
      return;
    }
    await renameTag(oldName, renameTagValue.trim(), 'projects');
    setRenamingTag(null);
    setRenameTagValue('');
    setFeedback({ type: 'success', message: `Tag renamed to "${renameTagValue}".` });
  };

  const handleDeleteTag = async (tagName) => {
    await deleteTag(tagName, 'projects');
    setFeedback({ type: 'success', message: `Tag "${tagName}" removed.` });
  };

  // Mock object for live preview
  const previewProjectObject = useMemo(() => {
    return {
      id: formData.id || 'preview-proj',
      title: formData.title || 'Untitled Project',
      tagline: formData.tagline || 'Project tagline preview',
      description: formData.description || 'Project description preview text goes here...',
      fullOverview: formData.fullOverview || formData.description || '',
      type: formData.type,
      category: formData.category,
      subcategory: formData.subcategory,
      status: formData.status,
      completionYear: formData.completionYear,
      completionDate: formData.completionDate,
      startDate: formData.startDate,
      problemStatement: formData.problemStatement,
      objectives: formData.objectives,
      proposedSolution: formData.proposedSolution,
      technicalImplementation: formData.technicalImplementation,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      metrics: formData.metrics.split('\n').map(m => m.trim()).filter(Boolean),
      keyFeatures: formData.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      results: formData.results,
      challenges: formData.challenges,
      futureImprovements: formData.futureImprovements,
      github: formData.github,
      demo: formData.demo,
      documentationUrl: formData.documentationUrl,
      image: formData.image,
      architectureDiagram: formData.architectureDiagram,
      topologyDiagram: formData.topologyDiagram,
      gallery: formData.gallery.split('\n').map(g => g.trim()).filter(Boolean),
      featured: formData.featured,
      is_published: formData.is_published,
    };
  }, [formData]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
              Cybersecurity, Networking & AI Projects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {items.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm font-sans text-slate-400 mt-1">
            Manage your technical project showcase, network topologies, vulnerability assessments, AI models, and taxonomy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setVisualStudioProject({
              id: '',
              title: 'New Engineering Project',
              slug: '',
              category: 'Cybersecurity',
              type: 'Security Tool',
              status: 'Completed',
              completionYear: new Date().getFullYear().toString(),
              is_published: true,
              sections: [],
              attachments: [],
            })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#0A0A0A] shadow-subtle transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>New in Visual Studio</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-dark-950 shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>

          <a
            href="/#projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-dark-900 hover:bg-dark-800 text-slate-200 border border-slate-800 transition-colors"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Public Showcase</span>
          </a>
        </div>
      </div>

      {/* SUMMARY DASHBOARD METRICS BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Total</span>
          <span className="text-xl font-bold font-mono text-white mt-0.5 block">{metrics.total}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-900 border border-emerald-500/20 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">Cybersecurity</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">{metrics.cyber}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-900 border border-blue-500/20 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">Networking</span>
          <span className="text-xl font-bold font-mono text-blue-400 mt-0.5 block">{metrics.net}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-900 border border-purple-500/20 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block">AI & ML</span>
          <span className="text-xl font-bold font-mono text-purple-400 mt-0.5 block">{metrics.ai}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Completed</span>
          <span className="text-xl font-bold font-mono text-white mt-0.5 block">{metrics.completed}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">In Progress</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">{metrics.inProgress}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">Published</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">{metrics.published}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Drafts</span>
          <span className="text-xl font-bold font-mono text-slate-400 mt-0.5 block">{metrics.drafts}</span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div 
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'error'
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-none gap-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 font-mono transition-colors whitespace-nowrap ${
            activeTab === 'projects'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 font-mono transition-colors whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories & Subcategories</span>
        </button>

        <button
          onClick={() => setActiveTab('tags')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 font-mono transition-colors whitespace-nowrap ${
            activeTab === 'tags'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Technology Tags ({tags.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 font-mono transition-colors whitespace-nowrap ${
            activeTab === 'media'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Media & Uploads</span>
        </button>

        <button
          onClick={() => setActiveTab('filters')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 font-mono transition-colors whitespace-nowrap ${
            activeTab === 'filters'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Public Filters</span>
        </button>
      </div>

      {/* ================= TAB 1: PROJECTS LIST & TABLE ================= */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          
          {/* Filter Bar for Table */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title, subcategory, tech..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => {
                  setSelectedCategoryFilter(e.target.value);
                  setSelectedSubcategoryFilter('All');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-slate-200 font-mono"
              >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-slate-200 font-mono"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Research">Research</option>
                <option value="Planned">Planned</option>
              </select>

              {/* Published Filter */}
              <select
                value={selectedPublishFilter}
                onChange={(e) => setSelectedPublishFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-slate-200 font-mono"
              >
                <option value="All">All Visibility</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>

          {/* Projects Table */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-2xl bg-dark-900 border border-slate-800">
              <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No projects match the selected criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing filters or adding a new project.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-dark-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-dark-850 text-slate-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Category & Subcategory</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Visibility</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProjects.map((proj, idx) => {
                      const isPublished = proj.is_published !== false;
                      const hasTopology = Boolean(proj.topologyDiagram || proj.architectureDiagram);

                      return (
                        <tr key={proj.id} className="hover:bg-dark-850/50 transition-colors">
                          {/* Order Reorder */}
                          <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMove(idx, -1)}
                                disabled={idx === 0}
                                title="Move up"
                                className="p-1 hover:text-emerald-400 disabled:opacity-20"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMove(idx, 1)}
                                disabled={idx === items.length - 1}
                                title="Move down"
                                className="p-1 hover:text-emerald-400 disabled:opacity-20"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Title & Thumbnail */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={proj.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900"}
                                alt={proj.title}
                                className="w-12 h-9 object-cover rounded-md bg-dark-800 border border-slate-700 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-white block truncate max-w-xs">{proj.title}</span>
                                <span className="text-[11px] text-slate-400 truncate block max-w-xs">{proj.tagline || proj.description}</span>
                                {hasTopology && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 mt-0.5">
                                    <Network className="w-2.5 h-2.5" />
                                    <span>Topology Included</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category & Subcategory */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block w-fit mb-1">
                              {proj.category}
                            </span>
                            {proj.subcategory && (
                              <span className="text-[11px] font-mono text-slate-400 block truncate max-w-[160px]">
                                {proj.subcategory}
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-dark-800 text-slate-300 border border-slate-700">
                              {proj.status || 'Completed'}
                            </span>
                          </td>

                          {/* Visibility & Featured */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleVisibility(proj.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                                  isPublished 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {isPublished ? 'Published' : 'Draft'}
                              </button>

                              <button
                                onClick={() => handleToggleFeatured(proj.id)}
                                title={proj.featured ? 'Remove from flagship' : 'Mark as flagship'}
                                className={`p-1 rounded transition-colors ${
                                  proj.featured ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                                }`}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleDuplicate(proj.id)}
                                title="Duplicate project"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setVisualStudioProject(proj)}
                                title="Open Visual Studio CMS Editor"
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2D3748] hover:bg-[#1A202C] text-white dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#0A0A0A] inline-flex items-center gap-1 shadow-sm transition-all"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden sm:inline">Visual Studio</span>
                              </button>

                              <button
                                onClick={() => openEditModal(proj)}
                                title="Edit project"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-dark-800 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setDeleteConfirmId(proj.id)}
                                title="Delete project"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-dark-800 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 2: CATEGORIES & SUBCATEGORIES ================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Add Category Form */}
          <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Add Project Category</h3>
            <p className="text-xs text-slate-400 mb-3">
              Categories group projects into primary domains (e.g. Cybersecurity, Computer Networking, AI/ML).
            </p>
            <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-dark-950 shrink-0"
              >
                Add Category
              </button>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.filter(c => c !== 'All').map((cat) => {
              const usageCount = items.filter(i => i.category === cat).length;
              const isRenaming = renamingCategory === cat;
              const isSelected = selectedCatForSubs === cat;

              return (
                <div 
                  key={cat} 
                  className={`p-3.5 rounded-xl bg-dark-900 border transition-all cursor-pointer ${
                    isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedCatForSubs(cat)}
                >
                  {isRenaming ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={renameCategoryValue}
                        onChange={(e) => setRenameCategoryValue(e.target.value)}
                        className="px-2 py-1 text-xs rounded bg-dark-800 border border-slate-600 text-white w-full"
                      />
                      <button
                        onClick={() => handleRenameCategory(cat)}
                        className="px-2 py-1 text-[11px] bg-emerald-500 text-dark-950 font-bold rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setRenamingCategory(null)}
                        className="px-2 py-1 text-[11px] bg-slate-700 text-slate-300 rounded"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-white block">{cat}</span>
                        <span className="text-[10px] font-mono text-slate-400">{usageCount} project(s)</span>
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setRenamingCategory(cat);
                            setRenameCategoryValue(cat);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white"
                          title="Rename category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-rose-400 hover:text-rose-300"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: TECHNOLOGY TAGS ================= */}
      {activeTab === 'tags' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Add Technology / Tool Tag</h3>
            <p className="text-xs text-slate-400 mb-3">
              Tags are used for filtering by specific tools (e.g. Wireshark, Snort, GNS3, PyTorch, Kali Linux).
            </p>
            <form onSubmit={handleAddTag} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g. Suricata, eBPF, BGP..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-dark-950 shrink-0"
              >
                Add Tag
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {tags.map((tag) => {
              const usageCount = items.filter(i => 
                (i.tags && i.tags.includes(tag)) || 
                (i.technologies && i.technologies.includes(tag))
              ).length;
              const isRenaming = renamingTag === tag;

              return (
                <div key={tag} className="p-3 rounded-xl bg-dark-900 border border-slate-800 flex items-center justify-between gap-1.5">
                  {isRenaming ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        value={renameTagValue}
                        onChange={(e) => setRenameTagValue(e.target.value)}
                        className="px-2 py-0.5 text-xs rounded bg-dark-800 border border-slate-600 text-white w-full"
                      />
                      <button
                        onClick={() => handleRenameTag(tag)}
                        className="px-1.5 py-0.5 text-[10px] bg-emerald-500 text-dark-950 font-bold rounded"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setRenamingTag(null)}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-700 text-slate-300 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-xs font-mono font-medium text-emerald-400 block">{tag}</span>
                        <span className="text-[10px] font-mono text-slate-500">{usageCount} project(s)</span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => {
                            setRenamingTag(tag);
                            setRenameTagValue(tag);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Rename tag"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                          title="Delete tag"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: MEDIA & UPLOADS ================= */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-dark-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Upload Media Asset</h3>
            <p className="text-xs text-slate-400 mb-4">
              Upload project thumbnails, network topology diagrams, and system architecture screenshots. Files are stored persistently.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-dark-950 font-semibold cursor-pointer hover:bg-emerald-600 transition-colors shrink-0">
                <Upload className="w-4 h-4" />
                <span>Select File & Upload</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setMediaUploading(true);
                    try {
                      const res = await uploadAsset(file, 'projects');
                      if (res.publicUrl) {
                        setMediaList(prev => [{ url: res.publicUrl, name: file.name, date: new Date().toLocaleDateString() }, ...prev]);
                        setFeedback({ type: 'success', message: 'Asset uploaded successfully! URL copied to preview below.' });
                      }
                    } catch (err) {
                      setFeedback({ type: 'error', message: err.message });
                    } finally {
                      setMediaUploading(false);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Uploaded Media Gallery */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Recent Project Media Assets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Combine items images + uploaded */}
              {items.flatMap(p => [
                p.image && { url: p.image, label: `${p.title} (Thumbnail)` },
                p.topologyDiagram && { url: p.topologyDiagram, label: `${p.title} (Topology)` },
                p.architectureDiagram && { url: p.architectureDiagram, label: `${p.title} (Architecture)` },
                ...(p.gallery || []).map((g, i) => ({ url: g, label: `${p.title} (Screenshot ${i+1})` }))
              ]).filter(Boolean).slice(0, 9).map((asset, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden bg-dark-900 border border-slate-800">
                  <div className="aspect-video bg-dark-950 overflow-hidden relative group">
                    <img src={asset.url} alt={asset.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(asset.url);
                          setFeedback({ type: 'success', message: 'Asset URL copied to clipboard!' });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-dark-950 text-xs font-bold"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <span className="text-xs font-mono text-slate-300 block truncate">{asset.label}</span>
                    <span className="text-[10px] font-mono text-slate-500 truncate block">{asset.url}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 5: FILTER CONTROLS ================= */}
      {activeTab === 'filters' && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Public Filter Visibility</h3>
            <p className="text-xs text-slate-400 mb-4">
              Toggle which filter controls appear for visitors in the Projects showcase on the public website.
            </p>

            <div className="space-y-3">
              {[
                { key: 'enableCategory', label: 'Filter by Primary Domain', desc: 'Allows filtering by Cybersecurity, Networking, AI/ML.' },
                { key: 'enableStatus', label: 'Filter by Status', desc: 'Allows filtering by Completed, In Progress, Research, Planned.' },
                { key: 'enableTags', label: 'Filter by Technology Tags', desc: 'Allows filtering by individual tools (Wireshark, Snort, PyTorch, etc.).' },
                { key: 'enableType', label: 'Filter by Project Type', desc: 'Allows filtering by Security Tool, Network Infrastructure, AI Model, etc.' },
              ].map(({ key, label, desc }) => {
                const isEnabled = filterConfig[key] !== false;

                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-dark-850 border border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">{label}</span>
                      <span className="text-[11px] text-slate-400">{desc}</span>
                    </div>

                    <button
                      onClick={async () => {
                        const current = filterConfig[key] !== false;
                        await updateFilterConfig('projects', { [key]: !current });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                        isEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-dark-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= ADVANCED PROJECT EDITOR MODAL ================= */}
      {modalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-dark-950/85 backdrop-blur-md animate-fade-in"
        >
          <div 
            className="relative w-full max-w-4xl rounded-2xl bg-dark-900 border border-slate-800 shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-dark-850 shrink-0">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {editingProject ? 'Edit Technical Project' : 'Create New Technical Project'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-slate-800 bg-dark-950/60 px-4 sm:px-6 overflow-x-auto scrollbar-none gap-2 text-xs font-medium shrink-0">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'technical', label: '2. Tech Stack' },
                { id: 'media', label: '3. Media & Diagrams' },
                { id: 'in_depth', label: '4. In-Depth Details' },
                { id: 'preview', label: '5. Live Preview' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setEditorTab(tab.id)}
                  className={`py-3 px-2 border-b-2 font-mono whitespace-nowrap transition-colors ${
                    editorTab === tab.id
                      ? 'border-emerald-500 text-emerald-400 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
              
              {/* TAB 1: BASIC INFO */}
              {editorTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. SentinelIDS: Deep Packet Inspection & AI-Driven IPS"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Tagline / Short Hook</label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="Hybrid intrusion prevention system fusing Snort 3..."
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="sentinel-ids-deep-packet-inspection"
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Brief Summary Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Concise overview of what this security tool, network architecture, or AI system achieves..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Detailed Technical Overview</label>
                    <textarea
                      rows={3}
                      value={formData.fullOverview}
                      onChange={(e) => setFormData({ ...formData, fullOverview: e.target.value })}
                      placeholder="Comprehensive overview of architecture, packet flow, model design..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  {/* Classification Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Main Domain Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          const subs = subcategoriesMap[newCat] || [];
                          setFormData({ 
                            ...formData, 
                            category: newCat,
                            subcategory: subs[0] || ''
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      >
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Subcategory</label>
                      <input
                        type="text"
                        list="subcategory-suggestions"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        placeholder="e.g. Intrusion Detection Systems (IDS)"
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                      <datalist id="subcategory-suggestions">
                        {(subcategoriesMap[formData.category] || []).map(s => (
                          <option key={s} value={s} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Project Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Research">Research</option>
                        <option value="Planned">Planned</option>
                      </select>
                    </div>
                  </div>

                  {/* Dates & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Project Type</label>
                      <input
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="Security Tool / Network Infrastructure"
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        placeholder="2024-01"
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Completion Date</label>
                      <input
                        type="text"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({ ...formData, completionDate: e.target.value, completionYear: e.target.value.split('-')[0] })}
                        placeholder="2024-06"
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Status Toggles */}
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-500 bg-dark-800 border-slate-700"
                      />
                      <span className="text-slate-200 font-semibold">Publish project publicly</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-500 bg-dark-800 border-slate-700"
                      />
                      <span className="text-slate-200 font-semibold">Flagship / Featured showcase</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: TECH STACK */}
              {editorTab === 'technical' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Primary Technologies & Tools (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="e.g. Python, Snort, Wireshark, Kali Linux, Docker, iptables, Redis, TCP/IP"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Quick tags for card display (e.g. Python, Cisco IOS, PyTorch, Nmap).
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Filter Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. Python, Snort, Wireshark, Kali Linux"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Key Performance Metrics & Benchmarks (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.metrics}
                      onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                      placeholder="< 4.2ms end-to-end drop latency&#10;98.9% exploit detection rate&#10;10Gbps line rate bench"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & DIAGRAMS */}
              {editorTab === 'media' && (
                <div className="space-y-4">
                  {/* Thumbnail */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Project Thumbnail / Banner URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                      <label className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-slate-700 cursor-pointer text-slate-300 hover:text-white shrink-0">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Network Topology Diagram */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Network Topology Diagram URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.topologyDiagram}
                        onChange={(e) => setFormData({ ...formData, topologyDiagram: e.target.value })}
                        placeholder="https://... (Network diagram image or upload)"
                        className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                      <label className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-slate-700 cursor-pointer text-slate-300 hover:text-white shrink-0">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'topologyDiagram')} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Architecture Diagram */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">System Architecture Diagram URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.architectureDiagram}
                        onChange={(e) => setFormData({ ...formData, architectureDiagram: e.target.value })}
                        placeholder="https://... (Architecture diagram image or upload)"
                        className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                      <label className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-slate-700 cursor-pointer text-slate-300 hover:text-white shrink-0">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'architectureDiagram')} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Gallery Screenshots */}
                  <div>
                    <label className="block text-slate-300 mb-1">Additional Gallery Screenshots (one URL per line)</label>
                    <textarea
                      rows={2}
                      value={formData.gallery}
                      onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none font-mono"
                    />
                  </div>

                  {/* Resource URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-300 mb-1">GitHub Repository URL</label>
                      <input
                        type="text"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Live Demonstration URL</label>
                      <input
                        type="text"
                        value={formData.demo}
                        onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                        placeholder="https://example.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Documentation URL</label>
                      <input
                        type="text"
                        value={formData.documentationUrl}
                        onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                        placeholder="https://docs.example.com or repo wiki"
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Research Paper / PDF URL</label>
                      <input
                        type="text"
                        value={formData.paperUrl}
                        onChange={(e) => setFormData({ ...formData, paperUrl: e.target.value })}
                        placeholder="https://arxiv.org/abs/..."
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: IN-DEPTH TECHNICAL DETAILS */}
              {editorTab === 'in_depth' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Problem Statement</label>
                    <textarea
                      rows={2}
                      value={formData.problemStatement}
                      onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                      placeholder="What engineering or security challenge does this project solve?"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Project Objectives</label>
                    <textarea
                      rows={2}
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      placeholder="Specific architectural and performance goals..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Proposed Solution</label>
                    <textarea
                      rows={2}
                      value={formData.proposedSolution}
                      onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                      placeholder="How the technical architecture addresses the problem statement..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Technical Implementation Details</label>
                    <textarea
                      rows={3}
                      value={formData.technicalImplementation}
                      onChange={(e) => setFormData({ ...formData, technicalImplementation: e.target.value })}
                      placeholder="Low-level socket programming, protocol configuration, neural inference pipeline..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Key Architectural Features (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.highlights}
                      onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                      placeholder="Zero-copy socket capture pipeline...&#10;Hybrid Snort 3 rule evaluation...&#10;Automated iptables IP quarantine..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Results & Verification Outcomes</label>
                      <textarea
                        rows={2}
                        value={formData.results}
                        onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                        placeholder="Measured detection rates, latency numbers, stress test findings..."
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Challenges & Engineering Solutions</label>
                      <textarea
                        rows={2}
                        value={formData.challenges}
                        onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                        placeholder="Difficult obstacles encountered and how they were overcome..."
                        className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Planned Future Enhancements</label>
                    <textarea
                      rows={2}
                      value={formData.futureImprovements}
                      onChange={(e) => setFormData({ ...formData, futureImprovements: e.target.value })}
                      placeholder="e.g. eBPF / XDP hardware offloading, Cisco SD-WAN migration..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: LIVE PREVIEW */}
              {editorTab === 'preview' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Live preview of how this project card will appear on the public portfolio.
                  </p>
                  <div className="max-w-md mx-auto">
                    <ProjectCard
                      project={previewProjectObject}
                      onSelect={() => {}}
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleSave(e, false)}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-dark-950 shadow-glow-sm transition-all disabled:opacity-50 font-bold"
                  >
                    {saving ? 'Saving...' : (editingProject ? 'Save & Update' : 'Publish Project')}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteConfirmId && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 max-w-sm w-full text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Delete Project?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently delete this project? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    
      {/* Advanced Visual Project Editor (Phase 3 & 4) */}
      {visualStudioProject && (
        <AdvancedProjectVisualEditor
          initialProject={visualStudioProject}
          onSave={async (payload) => {
            const res = await saveProject(payload);
            if (res.success) {
              setVisualStudioProject(payload);
            }
            return res;
          }}
          onClose={() => setVisualStudioProject(null)}
          uploadAsset={uploadAsset}
        />
      )}
</div>
  );
}

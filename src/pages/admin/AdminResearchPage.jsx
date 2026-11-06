import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Check,
  Eye, 
  EyeOff, 
  Sparkles,
  Layers,
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Users,
  Calendar,
  FileText,
  Tag,
  FolderPlus,
  RefreshCw,
  Download
} from 'lucide-react';

export default function AdminResearchPage() {
  const { 
    portfolio, 
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
    uploadAsset 
  } = usePortfolio();

  const researchSection = portfolio?.research || { items: [], types: [], categories: [], tags: [], filterConfig: {} };
  const items = researchSection.items || [];
  const types = researchSection.types || [];
  const categories = researchSection.categories || [];
  const tags = researchSection.tags || [];
  const filterConfig = researchSection.filterConfig || {};

  // Active Tab
  const [activeTab, setActiveTab] = useState('publications'); // 'publications' | 'types' | 'categories' | 'tags' | 'filters'

  // Search & Filtering for publications table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Taxonomy action modals/inputs
  const [newTypeName, setNewTypeName] = useState('');
  const [renamingType, setRenamingType] = useState(null);
  const [renameTypeValue, setRenameTypeValue] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [renamingCategory, setRenamingCategory] = useState(null);
  const [renameCategoryValue, setRenameCategoryValue] = useState('');

  const [newTagName, setNewTagName] = useState('');
  const [renamingTag, setRenamingTag] = useState(null);
  const [renameTagValue, setRenameTagValue] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    type: 'Conference Paper',
    category: 'Distributed Systems',
    status: 'Published',
    publicationYear: '2025',
    publicationDate: '2025-01',
    venue: '',
    authors: 'Nuwan Pinnaduwage',
    doi: '',
    abstract: '',
    fullOverview: '',
    methodology: '',
    highlights: '',
    metrics: '',
    tags: '',
    paperUrl: '',
    externalUrl: '',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
    featured: false,
    is_published: true,
  });

  // Filtered publications
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchType = selectedTypeFilter === 'All' || item.type === selectedTypeFilter;
      const matchStatus = selectedStatusFilter === 'All' || item.status === selectedStatusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || (
        item.title?.toLowerCase().includes(query) ||
        item.venue?.toLowerCase().includes(query) ||
        (Array.isArray(item.authors) ? item.authors.join(' ').toLowerCase().includes(query) : item.authors?.toLowerCase().includes(query)) ||
        item.abstract?.toLowerCase().includes(query) ||
        item.doi?.toLowerCase().includes(query)
      );
      return matchType && matchStatus && matchSearch;
    });
  }, [items, selectedTypeFilter, selectedStatusFilter, searchQuery]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      id: '',
      title: '',
      slug: '',
      type: types.find(t => t !== 'All') || 'Conference Paper',
      category: categories.find(c => c !== 'All') || 'Distributed Systems',
      status: 'Published',
      publicationYear: new Date().getFullYear().toString(),
      publicationDate: `${new Date().getFullYear()}-01`,
      venue: '',
      authors: 'Nuwan Pinnaduwage',
      doi: '',
      abstract: '',
      fullOverview: '',
      methodology: '',
      highlights: '',
      metrics: '',
      tags: '',
      paperUrl: '',
      externalUrl: '',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
      featured: false,
      is_published: true,
    });
    setFeedback(null);
    setEditorOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id || '',
      title: item.title || '',
      slug: item.slug || '',
      type: item.type || 'Conference Paper',
      category: item.category || 'Distributed Systems',
      status: item.status || 'Published',
      publicationYear: item.publicationYear || (item.publicationDate ? item.publicationDate.split('-')[0] : '2025'),
      publicationDate: item.publicationDate || `${item.publicationYear || '2025'}-01`,
      venue: item.venue || '',
      authors: Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || ''),
      doi: item.doi || '',
      abstract: item.abstract || item.description || '',
      fullOverview: item.fullOverview || '',
      methodology: item.methodology || '',
      highlights: Array.isArray(item.highlights) ? item.highlights.join('\n') : (item.highlights || ''),
      metrics: Array.isArray(item.metrics) ? item.metrics.join('\n') : (item.metrics || ''),
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      paperUrl: item.paperUrl || '',
      externalUrl: item.externalUrl || '',
      image: item.image || '',
      featured: Boolean(item.featured),
      is_published: item.is_published !== undefined ? Boolean(item.is_published) : true,
    });
    setFeedback(null);
    setEditorOpen(true);
  };

  // File Upload Handlers
  const handlePaperUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const { publicUrl, error } = await uploadAsset(file, 'research-papers');
    setUploadingDoc(false);

    if (error) {
      setFeedback({ type: 'error', message: 'Document upload failed. You can paste an external URL instead.' });
    } else if (publicUrl) {
      setFormData(prev => ({ ...prev, paperUrl: publicUrl }));
      setFeedback({ type: 'success', message: 'Research document uploaded successfully!' });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const { publicUrl, error } = await uploadAsset(file, 'research-covers');
    setUploadingImage(false);

    if (error) {
      setFeedback({ type: 'error', message: 'Cover image upload failed. You can paste an image URL instead.' });
    } else if (publicUrl) {
      setFormData(prev => ({ ...prev, image: publicUrl }));
      setFeedback({ type: 'success', message: 'Cover image uploaded successfully!' });
    }
  };

  // Save Research Item
  const handleSavePublication = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ type: 'error', message: 'Research title is required.' });
      return;
    }
    if (!formData.abstract.trim()) {
      setFeedback({ type: 'error', message: 'Research abstract / short summary is required.' });
      return;
    }

    setSaving(true);
    const authorsArr = formData.authors
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const tagsArr = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const highlightsArr = formData.highlights
      .split('\n')
      .map(h => h.trim())
      .filter(Boolean);

    const metricsArr = formData.metrics
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const payload = {
      id: formData.id || undefined,
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: formData.type,
      category: formData.category,
      status: formData.status,
      publicationYear: formData.publicationYear.trim(),
      publicationDate: formData.publicationDate || `${formData.publicationYear}-01`,
      venue: formData.venue.trim(),
      authors: authorsArr.length > 0 ? authorsArr : ['Nuwan Pinnaduwage'],
      doi: formData.doi.trim(),
      abstract: formData.abstract.trim(),
      fullOverview: formData.fullOverview.trim() || formData.abstract.trim(),
      methodology: formData.methodology.trim(),
      highlights: highlightsArr,
      metrics: metricsArr,
      tags: tagsArr,
      paperUrl: formData.paperUrl.trim(),
      externalUrl: formData.externalUrl.trim(),
      image: formData.image.trim(),
      featured: Boolean(formData.featured),
      is_published: Boolean(formData.is_published),
    };

    const res = await saveResearch(payload);
    setSaving(false);

    if (res.success) {
      setEditorOpen(false);
      setFeedback({ type: 'success', message: editingItem ? 'Research publication updated successfully!' : 'New research publication added successfully!' });
    } else {
      setFeedback({ type: 'error', message: res.error?.message || 'Failed to save publication.' });
    }
  };

  // Delete Research Item
  const handleDeleteItem = async (id) => {
    const res = await deleteResearch(id);
    if (res.success) {
      setDeleteConfirmId(null);
      setFeedback({ type: 'success', message: 'Research publication deleted.' });
    } else {
      setFeedback({ type: 'error', message: 'Failed to delete publication.' });
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (id) => {
    await toggleResearchVisibility(id);
  };

  // Taxonomy Handlers
  const handleAddType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    await saveType({ newName: newTypeName.trim() }, 'research');
    setNewTypeName('');
    setFeedback({ type: 'success', message: `Type "${newTypeName}" added.` });
  };

  const handleRenameType = async (oldName) => {
    if (!renameTypeValue.trim() || renameTypeValue === oldName) {
      setRenamingType(null);
      return;
    }
    await saveType({ oldName, newName: renameTypeValue.trim() }, 'research');
    setRenamingType(null);
    setRenameTypeValue('');
    setFeedback({ type: 'success', message: `Type renamed to "${renameTypeValue}". References updated.` });
  };

  const handleDeleteType = async (typeName) => {
    await deleteType(typeName, 'research');
    setFeedback({ type: 'success', message: `Type "${typeName}" removed.` });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await saveCategory({ newName: newCategoryName.trim() }, 'research');
    setNewCategoryName('');
    setFeedback({ type: 'success', message: `Category "${newCategoryName}" added.` });
  };

  const handleRenameCategory = async (oldName) => {
    if (!renameCategoryValue.trim() || renameCategoryValue === oldName) {
      setRenamingCategory(null);
      return;
    }
    await saveCategory({ oldName, newName: renameCategoryValue.trim() }, 'research');
    setRenamingCategory(null);
    setRenameCategoryValue('');
    setFeedback({ type: 'success', message: `Category renamed to "${renameCategoryValue}". References updated.` });
  };

  const handleDeleteCategory = async (catName) => {
    await deleteCategory(catName, 'research');
    setFeedback({ type: 'success', message: `Category "${catName}" removed.` });
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    await addTag(newTagName.trim(), 'research');
    setNewTagName('');
    setFeedback({ type: 'success', message: `Tag "${newTagName}" added.` });
  };

  const handleRenameTag = async (oldName) => {
    if (!renameTagValue.trim() || renameTagValue === oldName) {
      setRenamingTag(null);
      return;
    }
    await renameTag(oldName, renameTagValue.trim(), 'research');
    setRenamingTag(null);
    setRenameTagValue('');
    setFeedback({ type: 'success', message: `Tag renamed to "${renameTagValue}". Cascaded across publications.` });
  };

  const handleDeleteTag = async (tagName) => {
    await deleteTag(tagName, 'research');
    setFeedback({ type: 'success', message: `Tag "${tagName}" removed.` });
  };

  const handleToggleFilterConfig = async (filterKey) => {
    const current = filterConfig[filterKey] !== false;
    await updateFilterConfig('research', {
      [filterKey]: !current
    });
  };

  // Helper counts
  const publishedCount = items.filter(i => i.is_published !== false).length;
  const preprintCount = items.filter(i => i.status === 'Preprint').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
              Research & Publications
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {items.length} Papers
            </span>
          </div>
          <p className="text-xs sm:text-sm font-sans text-slate-400 mt-1">
            Manage peer-reviewed publications, academic research papers, preprints, conference venues, and filter options.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Publication</span>
          </button>

          <a
            href="/#projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-dark-900 hover:bg-dark-800 text-slate-200 border border-slate-800 transition-colors"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Public View</span>
          </a>
        </div>
      </div>

      {/* Feedback banner */}
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

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-none gap-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('publications')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 font-mono transition-colors whitespace-nowrap ${
            activeTab === 'publications'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Publications ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('types')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 font-mono transition-colors whitespace-nowrap ${
            activeTab === 'types'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Research Types ({types.filter(t => t !== 'All').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 font-mono transition-colors whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Categories ({categories.filter(c => c !== 'All').length})</span>
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
          <span>Keywords & Tags ({tags.length})</span>
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
          <span>Filter Settings</span>
        </button>
      </div>

      {/* ================= TAB 1: PUBLICATIONS LIST ================= */}
      {activeTab === 'publications' && (
        <div className="space-y-4">
          
          {/* Controls: Search & Dropdown Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-dark-900/60 p-3.5 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publications by title, venue, author, DOI..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg text-xs font-mono bg-dark-800 border border-slate-700 text-slate-200 focus:outline-none"
              >
                <option value="All">All Types</option>
                {types.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg text-xs font-mono bg-dark-800 border border-slate-700 text-slate-200 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Accepted">Accepted</option>
                <option value="Preprint">Preprint</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
              </select>

              {(searchQuery || selectedTypeFilter !== 'All' || selectedStatusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTypeFilter('All');
                    setSelectedStatusFilter('All');
                  }}
                  className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Publications Cards / Table */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-xl bg-dark-900/40 border border-slate-800">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">No research publications found</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or add a new publication.</p>
              <button
                onClick={openCreateModal}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#F5F7FA] text-[#2D3748]"
              >
                Create First Publication
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    item.is_published === false 
                      ? 'bg-dark-900/40 border-slate-800/60 opacity-75' 
                      : 'bg-dark-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Main Content Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#2D3748] text-[#F5F7FA] border border-[#4A5568]">
                          {item.type || 'Publication'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-800 text-slate-300 border border-slate-700">
                          {item.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          item.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          item.status === 'Preprint' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {item.status || 'Published'}
                        </span>
                        {item.publicationYear && (
                          <span className="text-[11px] font-mono text-slate-400">
                            ({item.publicationYear})
                          </span>
                        )}
                        {item.is_published === false && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            Hidden / Draft
                          </span>
                        )}
                        {item.featured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Flagship
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                        {item.title}
                      </h3>

                      {item.venue && (
                        <p className="text-xs text-slate-400 italic">
                          {item.venue}
                        </p>
                      )}

                      <p className="text-xs text-slate-300 line-clamp-2">
                        {item.abstract || item.description}
                      </p>

                      {/* Tags & DOI */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                        {item.doi && <span>DOI: {item.doi}</span>}
                        {item.tags && item.tags.slice(0, 4).map(t => (
                          <span key={t} className="text-emerald-400/80">#{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                      
                      {/* Show / Hide Toggle */}
                      <button
                        onClick={() => handleToggleVisibility(item.id)}
                        title={item.is_published === false ? "Publish on public site" : "Hide from public site"}
                        className={`p-2 rounded-xl border text-xs font-mono transition-colors ${
                          item.is_published === false
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {item.is_published === false ? (
                          <span className="flex items-center gap-1.5">
                            <EyeOff className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hidden</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Visible</span>
                          </span>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="Edit publication details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                        title="Delete publication"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 2: RESEARCH TYPES ================= */}
      {activeTab === 'types' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Add New Research Type</h3>
            <p className="text-xs text-slate-400 mb-3">
              Define types of publications such as Conference Paper, Journal Article, Preprint, Ongoing Research, etc.
            </p>
            <form onSubmit={handleAddType} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="e.g. Workshop Paper, Book Chapter..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shrink-0"
              >
                Add Type
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {types.filter(t => t !== 'All').map((type) => {
              const usageCount = items.filter(i => i.type === type).length;
              const isRenaming = renamingType === type;

              return (
                <div key={type} className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 flex items-center justify-between gap-2">
                  {isRenaming ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={renameTypeValue}
                        onChange={(e) => setRenameTypeValue(e.target.value)}
                        className="px-2 py-1 text-xs rounded bg-dark-800 border border-slate-600 text-white w-full"
                      />
                      <button
                        onClick={() => handleRenameType(type)}
                        className="px-2 py-1 text-[11px] bg-[#F5F7FA] text-[#2D3748] font-semibold rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setRenamingType(null)}
                        className="px-2 py-1 text-[11px] bg-slate-700 text-slate-300 rounded"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-xs font-bold text-white block">{type}</span>
                        <span className="text-[10px] font-mono text-slate-400">{usageCount} publication(s)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setRenamingType(type);
                            setRenameTypeValue(type);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white"
                          title="Rename type (cascades to all items)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteType(type)}
                          className="p-1.5 text-rose-400 hover:text-rose-300"
                          title="Delete type"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ================= TAB 3: CATEGORIES ================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Add Research Category</h3>
            <p className="text-xs text-slate-400 mb-3">
              Categories group research domains like Distributed Systems, AI & Machine Learning, Cloud Computing, etc.
            </p>
            <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Cryptography, Quantum Computing..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shrink-0"
              >
                Add Category
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.filter(c => c !== 'All').map((cat) => {
              const usageCount = items.filter(i => i.category === cat).length;
              const isRenaming = renamingCategory === cat;

              return (
                <div key={cat} className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 flex items-center justify-between gap-2">
                  {isRenaming ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={renameCategoryValue}
                        onChange={(e) => setRenameCategoryValue(e.target.value)}
                        className="px-2 py-1 text-xs rounded bg-dark-800 border border-slate-600 text-white w-full"
                      />
                      <button
                        onClick={() => handleRenameCategory(cat)}
                        className="px-2 py-1 text-[11px] bg-[#F5F7FA] text-[#2D3748] font-semibold rounded"
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
                    <>
                      <div>
                        <span className="text-xs font-bold text-white block">{cat}</span>
                        <span className="text-[10px] font-mono text-slate-400">{usageCount} publication(s)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setRenamingCategory(cat);
                            setRenameCategoryValue(cat);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white"
                          title="Rename category (cascades to all items)"
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
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: TAGS ================= */}
      {activeTab === 'tags' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Add Research Keyword / Tag</h3>
            <p className="text-xs text-slate-400 mb-3">
              Tags allow granular filtering by concepts (e.g., Consensus Protocols, Raft, Fault Tolerance, LoRA).
            </p>
            <form onSubmit={handleAddTag} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g. Model Compression, Zero-Knowledge..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shrink-0"
              >
                Add Tag
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {tags.map((tag) => {
              const usageCount = items.filter(i => i.tags && i.tags.includes(tag)).length;
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
                        type="button"
                        onClick={() => handleRenameTag(tag)}
                        aria-label="Confirm rename tag"
                        title="Confirm rename"
                        className="p-1 text-white bg-[#2D3748] hover:bg-[#1A202C] dark:bg-[#F5F7FA] dark:hover:bg-white dark:text-[#2D3748] rounded transition-colors inline-flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRenamingTag(null)}
                        aria-label="Cancel rename tag"
                        title="Cancel rename"
                        className="p-1 bg-dark-800 hover:bg-dark-700 text-slate-300 border border-slate-700 rounded transition-colors inline-flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-xs font-mono font-medium text-emerald-400 block">#{tag}</span>
                        <span className="text-[10px] font-mono text-slate-500">{usageCount} paper(s)</span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => {
                            setRenamingTag(tag);
                            setRenameTagValue(tag);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Rename tag across all items"
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

      {/* ================= TAB 5: FILTER SETTINGS ================= */}
      {activeTab === 'filters' && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Public Filter Visibility</h3>
            <p className="text-xs text-slate-400 mb-4">
              Toggle which filter controls appear for visitors in the Research showcase tab on the public website.
            </p>

            <div className="space-y-3">
              {[
                { key: 'enableType', label: 'Filter by Research Type', desc: 'Allows filtering by Conference, Journal, Preprint, etc.' },
                { key: 'enableCategory', label: 'Filter by Category', desc: 'Allows filtering by research domain pills.' },
                { key: 'enableStatus', label: 'Filter by Status', desc: 'Allows filtering by Published, Accepted, Preprint, etc.' },
                { key: 'enableYear', label: 'Filter by Publication Year', desc: 'Allows filtering by publication year dropdown.' },
                { key: 'enableTags', label: 'Filter by Keywords / Tags', desc: 'Allows filtering by specific research tag chips.' },
              ].map(({ key, label, desc }) => {
                const isEnabled = filterConfig[key] !== false;

                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-dark-850 border border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">{label}</span>
                      <span className="text-[11px] text-slate-400">{desc}</span>
                    </div>

                    <button
                      onClick={() => handleToggleFilterConfig(key)}
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

      {/* ================= RESEARCH PUBLICATION EDITOR MODAL ================= */}
      {editorOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-dark-950/85 backdrop-blur-md animate-fade-in"
        >
          <div 
            className="relative w-full max-w-3xl rounded-xl bg-dark-900 border border-slate-800 shadow-2xl overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-dark-850">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {editingItem ? 'Edit Research Publication' : 'Add New Research Publication'}
                </h3>
              </div>

              <button
                onClick={() => setEditorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePublication} className="p-4 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto text-xs">
              
              {/* Group 1: Core Title & Identifiers */}
              <div className="space-y-3">
                <h4 className="font-mono text-emerald-400 uppercase tracking-wider font-bold">1. Publication Overview</h4>
                
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Research Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Adaptive Consensus Optimization in Geo-Distributed Raft Clusters"
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="adaptive-consensus-raft (auto-generated if empty)"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Venue / Conference / Journal</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g. IEEE ICDCS, ACM TOCS, arXiv:2506.14820"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Abstract / Short Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    placeholder="Provide a concise abstract outlining the problem, contribution, and findings..."
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Extended Overview / Architecture</label>
                  <textarea
                    rows={3}
                    value={formData.fullOverview}
                    onChange={(e) => setFormData({ ...formData, fullOverview: e.target.value })}
                    placeholder="Detailed technical context, architecture, or background..."
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Group 2: Taxonomy & Classification */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="font-mono text-emerald-400 uppercase tracking-wider font-bold">2. Classification & Status</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Research Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    >
                      {types.filter(t => t !== 'All').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Publication Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    >
                      <option value="Published">Published</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Preprint">Preprint</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Publication Year</label>
                    <input
                      type="text"
                      value={formData.publicationYear}
                      onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                      placeholder="2025"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Authors (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.authors}
                      onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                      placeholder="Nuwan Pinnaduwage, Dr. Chen..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">DOI / Reference Identifier</label>
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                      placeholder="10.1109/ICDCS.2025.1049281"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Technical Rigor & Empirical Highlights */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="font-mono text-emerald-400 uppercase tracking-wider font-bold">3. Empirical Rigor & Metrics</h4>

                <div>
                  <label className="block text-slate-300 mb-1">Methodology & Experimental Rigor</label>
                  <input
                    type="text"
                    value={formData.methodology}
                    onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                    placeholder="e.g. Tested on 15 geo-distributed AWS nodes across 5 regions with TLA+ verified invariant safety..."
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Key Contributions (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.highlights}
                      onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                      placeholder="Pipelined log synchronization...&#10;Latency-predictive heartbeat scheduling...&#10;Zero split-brain verified..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Empirical Metrics (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.metrics}
                      onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                      placeholder="38% tail latency reduction&#10;42% lower heartbeat overhead&#10;5 global AWS regions evaluated"
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Keywords / Research Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Consensus Protocols, Raft, Fault Tolerance, Edge AI..."
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Group 4: Links, Media & Documents */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="font-mono text-emerald-400 uppercase tracking-wider font-bold">4. Documents & Media</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">PDF / Paper Document URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.paperUrl}
                        onChange={(e) => setFormData({ ...formData, paperUrl: e.target.value })}
                        placeholder="https://arxiv.org/pdf/... or upload"
                        className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                      />
                      <label className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-slate-700 cursor-pointer text-slate-300 hover:text-white shrink-0">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handlePaperUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">External Publication URL</label>
                    <input
                      type="text"
                      value={formData.externalUrl}
                      onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                      placeholder="https://ieeexplore.ieee.org/... or https://dl.acm.org/..."
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Thumbnail / Cover Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-slate-700 text-white focus:outline-none"
                    />
                    <label className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-slate-700 cursor-pointer text-slate-300 hover:text-white shrink-0">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Group 5: Visibility & Publishing */}
              <div className="flex items-center gap-6 pt-3 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-dark-800 border-slate-700 focus:ring-0"
                  />
                  <span className="text-slate-200 font-medium">Publish on website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-dark-800 border-slate-700 focus:ring-0"
                  />
                  <span className="text-slate-200 font-medium">Flagship / Featured paper</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shadow-subtle transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingItem ? 'Save Changes' : 'Create Publication')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="p-6 rounded-xl bg-dark-900 border border-slate-800 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-white">Delete Research Publication?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete this publication? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(deleteConfirmId)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Delete Paper
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

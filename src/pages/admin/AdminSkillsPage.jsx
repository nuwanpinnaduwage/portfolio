import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Edit, 
  Copy, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Network, 
  Shield, 
  Cpu, 
  Layers, 
  FolderInput,
  Check,
  RotateCcw,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function AdminSkillsPage() {
  const { 
    portfolio, 
    saveSkill, 
    deleteSkill, 
    moveSkillToCatalog,
    reorderSkills, 
    toggleSkillVisibility,
    saveSkillCatalog, 
    deleteSkillCatalog, 
    toggleSkillCatalogVisibility, 
    reorderSkillCatalogs 
  } = usePortfolio();

  const categories = portfolio.skills?.categories || [];

  // Feedback banner state: { type: 'success' | 'error', message: string }
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  // Active filter tab ('all' or catalogId)
  const [selectedCatalogId, setSelectedCatalogId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);

  // Delete confirmation keys
  const [deleteSkillConfirmKey, setDeleteSkillConfirmKey] = useState(null);
  const [deleteCatalogConfirmKey, setDeleteCatalogConfirmKey] = useState(null);

  // Skill Form State
  const [skillFormData, setSkillFormData] = useState({
    id: '',
    name: '',
    catalog_id: 'network',
    level: 85,
    description: '',
    is_published: true,
    order_index: 0
  });

  // Catalog Form State
  const [catalogFormData, setCatalogFormData] = useState({
    id: '',
    name: '',
    description: '',
    order_index: 1,
    is_published: true
  });

  // Move Skill State
  const [skillToMove, setSkillToMove] = useState(null);
  const [targetCatalogId, setTargetCatalogId] = useState('');

  // Helper for catalog icons
  const getCatalogIcon = (catId) => {
    switch (catId) {
      case 'network':
      case 'networking':
        return <Network className="w-4 h-4 text-emerald-400" />;
      case 'cyber_security':
      case 'cybersecurity':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'cs_fundamentals':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Open Skill Modal
  const handleOpenAddSkill = (catId = 'network') => {
    const targetCat = categories.find(c => c.id === catId) || categories[0];
    const targetId = targetCat?.id || 'network';
    const nextOrder = (targetCat?.skills?.length || 0) + 1;

    setSkillFormData({
      id: '',
      name: '',
      catalog_id: targetId,
      level: 85,
      description: '',
      is_published: true,
      order_index: nextOrder
    });
    setFeedback(null);
    setSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill, catId) => {
    setSkillFormData({
      id: skill.id,
      name: skill.name,
      catalog_id: skill.catalog_id || skill.category_id || catId,
      level: skill.level !== undefined ? skill.level : 85,
      description: skill.description || '',
      is_published: skill.is_published !== false,
      order_index: skill.order_index || 0
    });
    setFeedback(null);
    setSkillModalOpen(true);
  };

  // Open Catalog Modal
  const handleOpenAddCatalog = () => {
    setCatalogFormData({
      id: '',
      name: '',
      description: '',
      order_index: categories.length + 1,
      is_published: true
    });
    setFeedback(null);
    setCatalogModalOpen(true);
  };

  const handleOpenEditCatalog = (cat) => {
    setCatalogFormData({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      order_index: cat.order_index || 1,
      is_published: cat.is_published !== false
    });
    setFeedback(null);
    setCatalogModalOpen(true);
  };

  // Open Move Modal
  const handleOpenMoveModal = (skill, currentCatId) => {
    setSkillToMove({ ...skill, currentCatId });
    const availableTargets = categories.filter(c => c.id !== currentCatId);
    setTargetCatalogId(availableTargets[0]?.id || '');
    setMoveModalOpen(true);
  };

  // Save Skill
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!skillFormData.name.trim()) {
      setFeedback({ type: 'error', message: 'Skill name is required.' });
      return;
    }

    const level = Math.min(100, Math.max(0, Number(skillFormData.level) || 0));

    setSaving(true);
    const res = await saveSkill({
      ...skillFormData,
      name: skillFormData.name.trim(),
      level,
      catalog_id: skillFormData.catalog_id,
      category_id: skillFormData.catalog_id
    });
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setFeedback({ type: 'success', message: `Skill "${skillFormData.name.trim()}" saved successfully!` });
      setSkillModalOpen(false);
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (id, name) => {
    setSaving(true);
    const res = await deleteSkill(id, name);
    setSaving(false);
    setDeleteSkillConfirmKey(null);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to delete skill.' });
    } else {
      setFeedback({ type: 'success', message: `Skill "${name}" removed.` });
    }
  };

  // Save Catalog
  const handleSaveCatalog = async (e) => {
    e.preventDefault();
    if (!catalogFormData.name.trim()) {
      setFeedback({ type: 'error', message: 'Catalog name is required.' });
      return;
    }

    setSaving(true);
    const res = await saveSkillCatalog({
      ...catalogFormData,
      name: catalogFormData.name.trim(),
      description: catalogFormData.description.trim()
    });
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setFeedback({ type: 'success', message: `Catalog "${catalogFormData.name.trim()}" saved successfully!` });
      setCatalogModalOpen(false);
    }
  };

  // Delete Catalog
  const handleDeleteCatalog = async (catId, catName) => {
    setSaving(true);
    const res = await deleteSkillCatalog(catId);
    setSaving(false);
    setDeleteCatalogConfirmKey(null);

    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setFeedback({ type: 'success', message: `Catalog "${catName}" and its skills have been removed.` });
    }
  };

  // Move Skill Execution
  const handleExecuteMoveSkill = async () => {
    if (!skillToMove || !targetCatalogId) return;

    setSaving(true);
    const res = await moveSkillToCatalog(skillToMove.id, targetCatalogId);
    setSaving(false);
    setMoveModalOpen(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      const targetCat = categories.find(c => c.id === targetCatalogId);
      setFeedback({ 
        type: 'success', 
        message: `Moved "${skillToMove.name}" to "${targetCat?.name || targetCatalogId}".` 
      });
    }
  };

  // Reorder Skill within catalog (up or down)
  const handleMoveSkillOrder = async (catalogId, skillId, direction) => {
    const cat = categories.find(c => c.id === catalogId);
    if (!cat || !cat.skills) return;

    const list = [...cat.skills];
    const idx = list.findIndex(s => s.id === skillId);
    if (idx < 0) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    const orderedIds = list.map(s => s.id);
    await reorderSkills(catalogId, orderedIds);
  };

  // Reorder Catalog (up or down)
  const handleMoveCatalogOrder = async (catalogId, direction) => {
    const list = [...categories];
    const idx = list.findIndex(c => c.id === catalogId);
    if (idx < 0) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    const orderedIds = list.map(c => c.id);
    await reorderSkillCatalogs(orderedIds);
  };

  // Filtered Catalogs to display
  const displayedCatalogs = useMemo(() => {
    let result = categories;
    if (selectedCatalogId !== 'all') {
      result = result.filter(c => c.id === selectedCatalogId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.map(c => ({
        ...c,
        skills: (c.skills || []).filter(s => 
          s.name.toLowerCase().includes(q) || 
          (s.description && s.description.toLowerCase().includes(q))
        )
      })).filter(c => c.skills.length > 0 || c.name.toLowerCase().includes(q));
    }
    return result;
  }, [categories, selectedCatalogId, searchQuery]);

  // Total counts
  const totalSkills = useMemo(() => {
    return categories.reduce((acc, c) => acc + (c.skills?.length || 0), 0);
  }, [categories]);

  const publishedSkills = useMemo(() => {
    return categories.reduce((acc, c) => acc + (c.skills || []).filter(s => s.is_published !== false).length, 0);
  }, [categories]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#2D3748] border border-[#4A5568] text-[#F5F7FA]">
              <Wrench className="w-6 h-6" />
            </span>
            <span>Skills & Technologies Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your three main skill catalogs (Network, Cyber Security, CS Fundamentals), skill proficiency percentages, order, and visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleOpenAddCatalog}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Catalog</span>
          </button>

          <button
            onClick={() => handleOpenAddSkill(selectedCatalogId !== 'all' ? selectedCatalogId : 'network')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-semibold shadow-subtle transition-all active:scale-95 cursor-pointer font-bold"
          >
            <Plus className="w-4 h-4 font-bold" />
            <span>Add New Skill</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block">Total Catalogs</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">{categories.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
          <span className="text-[11px] font-mono text-emerald-400 block">Total Skills</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{totalSkills}</span>
        </div>
        <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
          <span className="text-[11px] font-mono text-teal-400 block">Published Skills</span>
          <span className="text-xl font-bold font-mono text-teal-400 mt-1 block">{publishedSkills}</span>
        </div>
        <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block">Draft / Hidden</span>
          <span className="text-xl font-bold font-mono text-slate-400 mt-1 block">{totalSkills - publishedSkills}</span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls & Catalog Filters */}
      <div className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Catalog Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCatalogId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCatalogId === 'all'
                ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
                : 'text-slate-400 hover:text-white hover:bg-dark-850'
            }`}
          >
            All Catalogs ({categories.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCatalogId(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCatalogId === c.id
                  ? 'bg-[#2D3748] text-white border border-[#4A5568] font-semibold shadow-subtle'
                  : 'text-slate-400 hover:text-white hover:bg-dark-850'
              }`}
            >
              <span>{c.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                selectedCatalogId === c.id ? 'bg-dark-950/20 text-dark-950' : 'bg-dark-800 text-slate-400'
              }`}>
                {c.skills?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-9 pr-3 py-1.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Catalogs & Skills Display */}
      <div className="space-y-8">
        {displayedCatalogs.length === 0 ? (
          <div className="text-center py-16 bg-dark-900 border border-dashed border-slate-800 rounded-xl p-6">
            <Wrench className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-semibold text-slate-300">No skills or catalogs match</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search query or adding a new skill.</p>
          </div>
        ) : (
          displayedCatalogs.map((catalog, cIdx) => (
            <div 
              key={catalog.id}
              className="bg-[#1E2530] border border-[#4A5568]/60 rounded-xl overflow-hidden shadow-xl"
            >
              {/* Catalog Card Header */}
              <div className="p-5 bg-dark-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    {getCatalogIcon(catalog.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white tracking-tight">{catalog.name}</h2>
                      <button
                        onClick={() => toggleSkillCatalogVisibility(catalog.id)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                          catalog.is_published !== false
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                        title="Click to toggle catalog visibility on public site"
                      >
                        {catalog.is_published !== false ? 'Catalog Visible' : 'Catalog Hidden'}
                      </button>
                    </div>
                    {catalog.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{catalog.description}</p>
                    )}
                  </div>
                </div>

                {/* Catalog Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {/* Reorder Catalog */}
                  <button
                    onClick={() => handleMoveCatalogOrder(catalog.id, 'up')}
                    disabled={cIdx === 0}
                    title="Move catalog up"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveCatalogOrder(catalog.id, 'down')}
                    disabled={cIdx === displayedCatalogs.length - 1}
                    title="Move catalog down"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Add Skill to this catalog */}
                  <button
                    onClick={() => handleOpenAddSkill(catalog.id)}
                    title="Add skill to this catalog"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>

                  {/* Edit Catalog */}
                  <button
                    onClick={() => handleOpenEditCatalog(catalog)}
                    title="Edit catalog details"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-dark-800 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Catalog */}
                  {deleteCatalogConfirmKey === catalog.id ? (
                    <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded-lg border border-red-500/40">
                      <button
                        onClick={() => handleDeleteCatalog(catalog.id, catalog.name)}
                        className="text-[10px] font-bold text-red-400 px-1 hover:underline cursor-pointer"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteCatalogConfirmKey(null)}
                        className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteCatalogConfirmKey(catalog.id)}
                      title="Delete catalog"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-dark-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Skills List in Catalog */}
              <div className="p-4 sm:p-5">
                {(catalog.skills || []).length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    No skills in this catalog yet. Click "Add Skill" above to add one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {catalog.skills.map((skill, sIdx) => (
                      <div 
                        key={skill.id || skill.name}
                        className="p-3 sm:p-4 rounded-xl bg-dark-850/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col gap-2.5 group"
                      >
                        {/* Skill Row Info & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-xs sm:text-sm group-hover:text-emerald-400 transition-colors truncate">
                                {skill.name}
                              </span>
                              <button
                                onClick={() => toggleSkillVisibility(skill.id)}
                                title={skill.is_published !== false ? "Visible on public site" : "Hidden from public site"}
                                className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold cursor-pointer ${
                                  skill.is_published !== false
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                              >
                                {skill.is_published !== false ? 'Published' : 'Hidden'}
                              </button>
                            </div>
                            {skill.description && (
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{skill.description}</p>
                            )}
                          </div>

                          {/* Level Badge & Action Buttons */}
                          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                              {skill.level}%
                            </span>

                            <div className="flex items-center gap-1">
                              {/* Reorder Up/Down */}
                              <button
                                onClick={() => handleMoveSkillOrder(catalog.id, skill.id, 'up')}
                                disabled={sIdx === 0}
                                title="Move skill up"
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveSkillOrder(catalog.id, skill.id, 'down')}
                                disabled={sIdx === catalog.skills.length - 1}
                                title="Move skill down"
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Move to another catalog */}
                              <button
                                onClick={() => handleOpenMoveModal(skill, catalog.id)}
                                title="Move to another catalog"
                                className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-dark-800 cursor-pointer"
                              >
                                <FolderInput className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Skill */}
                              <button
                                onClick={() => handleOpenEditSkill(skill, catalog.id)}
                                title="Edit skill"
                                className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-dark-800 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Skill */}
                              {deleteSkillConfirmKey === skill.id ? (
                                <div className="flex items-center gap-1 bg-red-950/80 p-0.5 rounded-lg border border-red-500/40">
                                  <button
                                    onClick={() => handleDeleteSkill(skill.id, skill.name)}
                                    className="text-[10px] font-bold text-red-400 px-1 hover:underline cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteSkillConfirmKey(null)}
                                    className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteSkillConfirmKey(skill.id)}
                                  title="Delete skill"
                                  className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-dark-800 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Horizontal Progress Bar Visualization */}
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* SKILL EDITOR MODAL */}
      {skillModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div 
            className="w-full max-w-lg bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                <span>{skillFormData.id ? 'Edit Skill' : 'Add New Skill'}</span>
              </h3>
              <button onClick={() => setSkillModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Skill Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={skillFormData.name}
                  onChange={(e) => setSkillFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. TCP/IP and OSI Models, Linux Security, OOP..."
                  className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Catalog Assignment
                </label>
                <select
                  value={skillFormData.catalog_id}
                  onChange={(e) => setSkillFormData(prev => ({ ...prev, catalog_id: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Proficiency Percentage Slider & Input */}
              <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300">Proficiency Percentage (0–100%)</span>
                  <span className="font-mono font-bold text-emerald-400">{skillFormData.level}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillFormData.level}
                    onChange={(e) => setSkillFormData(prev => ({ ...prev, level: Number(e.target.value) }))}
                    className="flex-1 accent-emerald-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skillFormData.level}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      setSkillFormData(prev => ({ ...prev, level: val }));
                    }}
                    className="w-16 px-2 py-1 bg-dark-900 border border-slate-750 rounded-lg text-xs font-mono text-right text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Live horizontal bar preview */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-1">
                  <div 
                    className="h-full rounded-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${skillFormData.level}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Short Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={skillFormData.description}
                  onChange={(e) => setSkillFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Summary of practical application or theoretical grounding..."
                  className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={skillFormData.is_published}
                    onChange={(e) => setSkillFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                  <span>Published on public website</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSkillModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] text-xs font-semibold shadow-subtle shadow-subtle cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save Skill'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATALOG EDITOR MODAL */}
      {catalogModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div 
            className="w-full max-w-md bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>{catalogFormData.id ? 'Edit Catalog' : 'Add New Catalog'}</span>
              </h3>
              <button onClick={() => setCatalogModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCatalog} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Catalog Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={catalogFormData.name}
                  onChange={(e) => setCatalogFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Network, Cyber Security, CS Fundamentals..."
                  className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catalogFormData.description}
                  onChange={(e) => setCatalogFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Overview of this catalog's technologies and scope..."
                  className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={catalogFormData.is_published}
                    onChange={(e) => setCatalogFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                  <span>Visible on public website</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCatalogModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] text-xs font-semibold shadow-subtle shadow-subtle cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save Catalog'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVE SKILL MODAL */}
      {moveModalOpen && skillToMove && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div 
            className="w-full max-w-md bg-[#1E2530] border border-[#4A5568]/60 rounded-xl p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderInput className="w-5 h-5 text-emerald-400" />
                <span>Move Skill to Another Catalog</span>
              </h3>
              <button onClick={() => setMoveModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Select the destination catalog for skill: <strong className="text-emerald-400 font-bold">{skillToMove.name}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Target Catalog</label>
                <select
                  value={targetCatalogId}
                  onChange={(e) => setTargetCatalogId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id} disabled={c.id === skillToMove.currentCatId}>
                      {c.name} {c.id === skillToMove.currentCatId ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMoveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving || !targetCatalogId || targetCatalogId === skillToMove.currentCatId}
                  onClick={handleExecuteMoveSkill}
                  className="px-5 py-2 rounded-xl bg-[#F5F7FA] hover:bg-white text-[#2D3748] text-xs font-semibold shadow-subtle cursor-pointer disabled:opacity-40"
                >
                  {saving ? 'Moving...' : 'Move Skill'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  FolderTree, 
  Tag, 
  Layers, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Search, 
  Check, 
  ArrowRight,
  Shield,
  Network,
  Cpu,
  Binary
} from 'lucide-react';

export default function AdminOrganizationPage() {
  const { 
    portfolio, 
    saveSkillCategory, 
    deleteSkillCategory,
    saveSkillSubcategory, 
    deleteSkillSubcategory,
    saveCategory,
    deleteCategory,
    saveTechnologyTag,
    deleteTechnologyTag
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'projects', 'tags'
  const [feedback, setFeedback] = useState(null);

  // Skill categories & all skills
  const skillCategories = portfolio.skills?.categories || [];
  const allSkills = portfolio.skills?.items || [];

  // Project categories & items
  const projectCategories = portfolio.projects?.categories || [];
  const allProjects = portfolio.projects?.items || [];

  // Centralized Tags across skills, projects, research
  const aggregatedTags = useMemo(() => {
    const counts = {};
    allSkills.forEach(s => {
      (s.relatedTools || []).forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    allProjects.forEach(p => {
      (p.tags || []).forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [allSkills, allProjects]);

  // Skill Subcategory State
  const [newSkillSubcat, setNewSkillSubcat] = useState('');
  const [selectedSkillCat, setSelectedSkillCat] = useState(skillCategories[0]?.id || 'network');

  // Tag Rename State
  const [tagToRename, setTagToRename] = useState(null);
  const [renamedTagValue, setRenamedTagValue] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  // Project Category State
  const [newProjectCat, setNewProjectCat] = useState('');

  const handleAddSkillSubcat = async (e) => {
    e.preventDefault();
    if (!newSkillSubcat.trim()) return;
    const res = await saveSkillSubcategory(selectedSkillCat, newSkillSubcat.trim());
    if (res?.success) {
      setNewSkillSubcat('');
      setFeedback({ type: 'success', message: `Subcategory "${newSkillSubcat.trim()}" created successfully.` });
    }
  };

  const handleDeleteSkillSubcat = async (catId, subName) => {
    const res = await deleteSkillSubcategory(catId, subName);
    if (res?.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setFeedback({ type: 'success', message: `Subcategory "${subName}" removed.` });
    }
  };

  const handleRenameTag = async () => {
    if (!tagToRename || !renamedTagValue.trim()) return;
    await saveTechnologyTag(tagToRename, renamedTagValue.trim());
    setFeedback({ type: 'success', message: `Tag "${tagToRename}" renamed to "${renamedTagValue.trim()}".` });
    setTagToRename(null);
    setRenamedTagValue('');
  };

  const handleDeleteTag = async (tag) => {
    if (window.confirm(`Are you sure you want to delete tag "${tag}" from all items?`)) {
      await deleteTechnologyTag(tag);
      setFeedback({ type: 'success', message: `Tag "${tag}" deleted.` });
    }
  };

  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return aggregatedTags;
    const q = tagSearch.toLowerCase().trim();
    return aggregatedTags.filter(t => t.name.toLowerCase().includes(q));
  }, [aggregatedTags, tagSearch]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FolderTree className="w-6 h-6" />
          </span>
          <span>Taxonomy & Organization Hub</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Centralized management of Skill Domains, Project Categories, Subcategories, and Global Technology Tags.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'skills'
              ? 'bg-emerald-500 text-dark-950 font-bold shadow-glow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Skill Domains & Subcategories</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'bg-emerald-500 text-dark-950 font-bold shadow-glow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Project Categories</span>
        </button>

        <button
          onClick={() => setActiveTab('tags')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'tags'
              ? 'bg-emerald-500 text-dark-950 font-bold shadow-glow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-850'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Centralized Technology Tags ({aggregatedTags.length})</span>
        </button>
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

      {/* TAB 1: SKILL DOMAINS & SUBCATEGORIES */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          
          {/* Create Subcategory */}
          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Subcategory to Skill Domain</span>
            </h3>
            <form onSubmit={handleAddSkillSubcat} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <select
                  value={selectedSkillCat}
                  onChange={(e) => setSelectedSkillCat(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {skillCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={newSkillSubcat}
                  onChange={(e) => setNewSkillSubcat(e.target.value)}
                  placeholder="e.g. Applied Machine Learning, Cryptography..."
                  className="w-full px-3 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs"
                >
                  Add
                </button>
              </div>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skillCategories.map((cat) => {
              const catSkills = allSkills.filter(s => s.category_id === cat.id);
              return (
                <div key={cat.id} className="bg-dark-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-base font-bold text-white">{cat.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{cat.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">
                      {catSkills.length} skills
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
                      Configured Subcategories ({cat.subcategories?.length || 0})
                    </span>
                    <div className="space-y-1.5">
                      {(cat.subcategories || []).map((sub) => {
                        const count = catSkills.filter(s => s.subcategory === sub).length;
                        return (
                          <div 
                            key={sub}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-xs"
                          >
                            <span className="text-slate-200 font-medium">{sub}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-500">{count} skills</span>
                              <button
                                onClick={() => handleDeleteSkillSubcat(cat.id, sub)}
                                disabled={count > 0}
                                title={count > 0 ? "Cannot delete: skills assigned" : "Delete"}
                                className={`p-1 rounded text-slate-500 hover:text-red-400 ${count > 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: PROJECT CATEGORIES */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Project Categories & Taxonomies</h3>
            <p className="text-xs text-slate-400 mb-4">
              Configured categories for organizing technical software engineering and cybersecurity projects.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {projectCategories.map(cat => {
                const count = allProjects.filter(p => p.category === cat || p.category_id === cat).length;
                return (
                  <div key={cat} className="p-4 rounded-xl bg-dark-850 border border-slate-800">
                    <h4 className="font-bold text-white text-sm">{cat}</h4>
                    <span className="text-xs font-mono text-emerald-400 mt-1 block">
                      {count} {count === 1 ? 'project' : 'projects'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CENTRALIZED TECHNOLOGY TAGS */}
      {activeTab === 'tags' && (
        <div className="space-y-6">
          
          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Centralized Technology Tags</h3>
              <p className="text-xs text-slate-400">Total unique tags used across projects and competencies: {aggregatedTags.length}</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Search tags..."
                className="w-full pl-9 pr-3 py-1.5 bg-dark-850 border border-slate-750 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Rename Box */}
          {tagToRename && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-300">
                Renaming: <strong className="text-white font-mono">{tagToRename}</strong>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={renamedTagValue}
                  onChange={(e) => setRenamedTagValue(e.target.value)}
                  className="px-3 py-1.5 bg-dark-850 border border-slate-700 rounded-lg text-xs text-white"
                />
                <button
                  onClick={handleRenameTag}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setTagToRename(null)}
                  className="px-2 py-1.5 text-slate-400 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tags Grid */}
          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredTags.map(({ name, count }) => (
                <div 
                  key={name} 
                  className="p-3 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between text-xs group hover:border-slate-700"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-200 truncate block">{name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{count} {count === 1 ? 'use' : 'uses'}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setTagToRename(name);
                        setRenamedTagValue(name);
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Rename"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(name)}
                      className="p-1 text-slate-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

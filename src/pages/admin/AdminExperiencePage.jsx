import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Layers
} from 'lucide-react';

export default function AdminExperiencePage() {
  const { portfolio, saveExperience, deleteExperience } = usePortfolio();
  const roles = portfolio.experience.roles;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    role: '',
    organization: '',
    location: '',
    period: '',
    type: 'Internship',
    responsibilities: '',
    technologies: '',
  });

  const openAddModal = () => {
    setEditingRole(null);
    setFormData({
      id: '',
      role: '',
      organization: '',
      location: '',
      period: '',
      type: 'Internship',
      responsibilities: '',
      technologies: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setFormData({
      id: role.id || '',
      role: role.role || '',
      organization: role.organization || '',
      location: role.location || '',
      period: role.period || '',
      type: role.type || 'Internship',
      responsibilities: (role.responsibilities || []).join('\n'),
      technologies: (role.technologies || []).join(', '),
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.role.trim() || !formData.organization.trim()) {
      setFeedback({ type: 'error', message: 'Role title and Organization are required.' });
      return;
    }

    setSaving(true);
    const respArray = formData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean);
    const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      id: formData.id || undefined,
      role: formData.role,
      organization: formData.organization,
      location: formData.location,
      period: formData.period,
      type: formData.type,
      responsibilities: respArray,
      technologies: techArray,
    };

    const res = await saveExperience(payload);
    setSaving(false);

    if (res.error) {
      setFeedback({ type: 'error', message: 'Failed to save experience.' });
    } else {
      setFeedback({ type: 'success', message: `Experience role "${formData.role}" saved successfully!` });
      setModalOpen(false);
    }
  };

  const handleDelete = async (id, roleTitle) => {
    const res = await deleteExperience(id);
    setDeleteConfirmId(null);
    if (res.error) {
      setFeedback({ type: 'error', message: 'Failed to delete experience.' });
    } else {
      setFeedback({ type: 'success', message: `Role "${roleTitle}" deleted.` });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Work Experience & Leadership
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your software engineering internships, academic roles, and team contributions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shadow-subtle transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-3 animate-fade-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((item) => (
          <div
            key={item.id || item.role}
            className="glass-card rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {item.type}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {item.role}
                </h3>
                <span className="text-slate-400 font-normal text-xs sm:text-sm">
                  @ {item.organization}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.period}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.location}</span>
                </span>
              </div>

              {/* Responsibilities */}
              <ul className="mt-3 space-y-1 text-xs text-slate-300">
                {(item.responsibilities || []).map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {(item.technologies || []).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-900 text-slate-300 border border-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => openEditModal(item)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-dark-800 hover:bg-dark-700 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              {deleteConfirmId === (item.id || item.role) ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(item.id, item.role)}
                    className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-600 text-white"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-2 py-1 rounded text-[10px] text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(item.id || item.role)}
                  aria-label={`Delete ${item.role}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Experience Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-xl rounded-xl bg-dark-900 border border-slate-800 shadow-2xl p-6 sm:p-7 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>{editingRole ? 'Edit Experience Role' : 'Add Experience Role'}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="Software Engineering Intern"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Organization / Company *
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    required
                    placeholder="TechNova Solutions"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Academic">Academic / TA</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Timeline Period
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="June 2024 - Aug 2024"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Jose, CA (Hybrid)"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Responsibilities & Achievements (1 bullet point per line)
                </label>
                <textarea
                  rows="4"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="Engineered 6 new responsive dashboards in React and TypeScript...&#10;Designed RESTful API endpoints in Node.js/Express..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, TypeScript, Node.js, Express, Docker"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shadow-subtle disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

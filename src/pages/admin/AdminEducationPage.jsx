import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  GraduationCap, 
  Trophy, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Award,
  BookOpen
} from 'lucide-react';

export default function AdminEducationPage() {
  const { portfolio, saveEducation, saveAchievement, deleteAchievement } = usePortfolio();
  const currentDegree = portfolio.education?.degrees?.[0] || {};
  const achievements = portfolio.achievements?.items || [];

  const [degreeData, setDegreeData] = useState({
    id: currentDegree.id || '',
    degree: currentDegree.degree || '',
    institution: currentDegree.institution || '',
    location: currentDegree.location || '',
    period: currentDegree.period || '',
    gpa: currentDegree.gpa || '',
    honors: (currentDegree.honors || []).join('\n'),
    coursework: (currentDegree.coursework || []).join(', '),
    extracurriculars: (currentDegree.extracurriculars || []).join('\n'),
  });

  // Sync degree data when portfolio finishes loading asynchronously from Supabase
  useEffect(() => {
    const cur = portfolio.education?.degrees?.[0] || {};
    setDegreeData({
      id: cur.id || '',
      degree: cur.degree || '',
      institution: cur.institution || '',
      location: cur.location || '',
      period: cur.period || '',
      gpa: cur.gpa || '',
      honors: (cur.honors || []).join('\n'),
      coursework: (cur.coursework || []).join(', '),
      extracurriculars: (cur.extracurriculars || []).join('\n'),
    });
  }, [portfolio.education]);

  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [achFormData, setAchFormData] = useState({
    id: '',
    title: '',
    issuer: '',
    date: '',
    description: '',
    badge: '',
  });

  const [savingDegree, setSavingDegree] = useState(false);
  const [savingAch, setSavingAch] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [deleteAchId, setDeleteAchId] = useState(null);

  const handleSaveDegree = async (e) => {
    e.preventDefault();
    if (!degreeData.degree.trim() || !degreeData.institution.trim()) {
      setFeedback({ type: 'error', message: 'Degree and Institution are required.' });
      return;
    }

    setSavingDegree(true);
    const honorsArray = degreeData.honors.split('\n').map(h => h.trim()).filter(Boolean);
    const courseworkArray = degreeData.coursework.split(',').map(c => c.trim()).filter(Boolean);
    const extracurricularsArray = degreeData.extracurriculars.split('\n').map(e => e.trim()).filter(Boolean);

    const payload = {
      id: degreeData.id || undefined,
      degree: degreeData.degree,
      institution: degreeData.institution,
      location: degreeData.location,
      period: degreeData.period,
      gpa: degreeData.gpa,
      honors: honorsArray,
      coursework: courseworkArray,
      extracurriculars: extracurricularsArray,
    };

    const res = await saveEducation(payload);
    setSavingDegree(false);

    if (res.error) {
      setFeedback({ type: 'error', message: 'Failed to update degree.' });
    } else {
      setFeedback({ type: 'success', message: 'Academic degree and coursework updated successfully!' });
    }
  };

  const openAddAch = () => {
    setEditingAch(null);
    setAchFormData({
      id: '',
      title: '',
      issuer: '',
      date: '',
      description: '',
      badge: '',
    });
    setAchievementModalOpen(true);
  };

  const openEditAch = (ach) => {
    setEditingAch(ach);
    setAchFormData({
      id: ach.id || '',
      title: ach.title || '',
      issuer: ach.issuer || '',
      date: ach.date || '',
      description: ach.description || '',
      badge: ach.badge || '',
    });
    setAchievementModalOpen(true);
  };

  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    if (!achFormData.title.trim()) {
      setFeedback({ type: 'error', message: 'Achievement title is required.' });
      return;
    }

    setSavingAch(true);
    const res = await saveAchievement(achFormData);
    setSavingAch(false);

    if (res.error) {
      setFeedback({ type: 'error', message: 'Failed to save achievement.' });
    } else {
      setFeedback({ type: 'success', message: `Honor "${achFormData.title}" saved successfully!` });
      setAchievementModalOpen(false);
    }
  };

  const handleDeleteAchievement = async (id, title) => {
    const res = await deleteAchievement(id);
    setDeleteAchId(null);
    if (res.error) {
      setFeedback({ type: 'error', message: 'Failed to remove achievement.' });
    } else {
      setFeedback({ type: 'success', message: `Achievement "${title}" removed.` });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Education & Honors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your undergraduate degree, coursework tags, and collegiate awards.
          </p>
        </div>
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

      {/* Degree Information Form */}
      <form onSubmit={handleSaveDegree} className="glass-card rounded-xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Undergraduate Degree Program</h2>
          </div>
          <button
            type="submit"
            disabled={savingDegree}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shadow-subtle disabled:opacity-50 flex items-center gap-1.5 font-bold cursor-pointer"
          >
            {savingDegree ? <div className="w-3.5 h-3.5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Degree</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Degree Title *
            </label>
            <input
              type="text"
              value={degreeData.degree}
              onChange={(e) => setDegreeData({ ...degreeData, degree: e.target.value })}
              required
              placeholder="Bachelor of Science in Computer Science"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Institution / University *
            </label>
            <input
              type="text"
              value={degreeData.institution}
              onChange={(e) => setDegreeData({ ...degreeData, institution: e.target.value })}
              required
              placeholder="State University of Technology"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Time Period & Expected Graduation
            </label>
            <input
              type="text"
              value={degreeData.period}
              onChange={(e) => setDegreeData({ ...degreeData, period: e.target.value })}
              placeholder="August 2022 - Expected May 2026"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Cumulative GPA
            </label>
            <input
              type="text"
              value={degreeData.gpa}
              onChange={(e) => setDegreeData({ ...degreeData, gpa: e.target.value })}
              placeholder="3.85 / 4.00"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Key CS Coursework (comma separated)
          </label>
          <input
            type="text"
            value={degreeData.coursework}
            onChange={(e) => setDegreeData({ ...degreeData, coursework: e.target.value })}
            placeholder="Data Structures & Algorithms, Operating Systems, Computer Networks, DBMS"
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Academic Honors (1 per line)
            </label>
            <textarea
              rows="3"
              value={degreeData.honors}
              onChange={(e) => setDegreeData({ ...degreeData, honors: e.target.value })}
              placeholder="Dean's Honors List&#10;Academic STEM Scholarship"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Campus Activities & Leadership (1 per line)
            </label>
            <textarea
              rows="3"
              value={degreeData.extracurriculars}
              onChange={(e) => setDegreeData({ ...degreeData, extracurriculars: e.target.value })}
              placeholder="ACM Student Chapter - Workshop Lead&#10;Undergraduate Peer Tutor for CS 201"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-dark-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
          </div>
        </div>
      </form>

      {/* Collegiate Honors & Achievements Grid */}
      <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Honors, Hackathons & Certifications</h2>
          </div>
          <button
            onClick={openAddAch}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Honor</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((item) => (
            <div
              key={item.id || item.title}
              className="p-4 rounded-xl bg-dark-900 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {item.issuer} • {item.date}
                </div>
                <p className="text-xs text-slate-300 pt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openEditAch(item)}
                  aria-label="Edit honor"
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {deleteAchId === (item.id || item.title) ? (
                  <button
                    onClick={() => handleDeleteAchievement(item.id, item.title)}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleteAchId(item.id || item.title)}
                    aria-label="Delete honor"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Achievement Modal */}
      {achievementModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-lg rounded-xl bg-dark-900 border border-slate-800 shadow-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{editingAch ? 'Edit Honor / Achievement' : 'Add New Honor'}</span>
              </h2>
              <button
                onClick={() => setAchievementModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Honor Title *
                </label>
                <input
                  type="text"
                  value={achFormData.title}
                  onChange={(e) => setAchFormData({ ...achFormData, title: e.target.value })}
                  placeholder="e.g. 1st Place Winner - HackTech Collegiate Hackathon"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={achFormData.issuer}
                    onChange={(e) => setAchFormData({ ...achFormData, issuer: e.target.value })}
                    placeholder="Annual University Hackathon"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Date / Academic Semester
                  </label>
                  <input
                    type="text"
                    value={achFormData.date}
                    onChange={(e) => setAchFormData({ ...achFormData, date: e.target.value })}
                    placeholder="October 2024"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Short Tag Badge
                </label>
                <input
                  type="text"
                  value={achFormData.badge}
                  onChange={(e) => setAchFormData({ ...achFormData, badge: e.target.value })}
                  placeholder="1st / 85 Teams, Certified, Top 15%"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={achFormData.description}
                  onChange={(e) => setAchFormData({ ...achFormData, description: e.target.value })}
                  placeholder="Details regarding your performance, algorithm solutions, or project..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAchievementModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAch}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] font-bold shadow-subtle disabled:opacity-50"
                >
                  {savingAch ? 'Saving...' : 'Save Honor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

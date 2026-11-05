import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink, 
  Edit, 
  Copy, 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  EyeOff,
  Check,
  RotateCcw,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminCertificatesPage() {
  const { portfolio, saveCertificate, deleteCertificate, reorderCertificates, uploadAsset } = usePortfolio();

  // Certificates list from portfolio (supporting both about.certificates and root certificates)
  const certificates = useMemo(() => {
    return portfolio.about?.certificates || portfolio.certificates || [];
  }, [portfolio]);

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    badge_url: '',
    description: '',
    skills: '',
    is_published: true
  });

  const filteredCerts = useMemo(() => {
    return certificates.filter(cert => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (cert.name || cert.title || '').toLowerCase().includes(q);
        const matchesIssuer = (cert.issuer || '').toLowerCase().includes(q);
        if (!matchesName && !matchesIssuer) return false;
      }
      return true;
    });
  }, [certificates, searchQuery]);

  const handleOpenAdd = () => {
    setEditingCertId(null);
    setFormData({
      id: '',
      name: '',
      issuer: '',
      issue_date: new Date().toISOString().slice(0, 7),
      expiry_date: '',
      credential_id: '',
      credential_url: '',
      badge_url: '',
      description: '',
      skills: '',
      is_published: true
    });
    setFeedback(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCertId(cert.id);
    setFormData({
      id: cert.id,
      name: cert.name || cert.title || '',
      issuer: cert.issuer || cert.issuing_organization || '',
      issue_date: cert.issue_date || cert.date || cert.year || '',
      expiry_date: cert.expiry_date || '',
      credential_id: cert.credential_id || cert.credentialId || '',
      credential_url: cert.credential_url || cert.verification_url || cert.url || '',
      badge_url: cert.badge_url || cert.image_url || cert.image || '',
      description: cert.description || '',
      skills: Array.isArray(cert.skills) 
        ? cert.skills.join(', ') 
        : (cert.skills || (Array.isArray(cert.tags) ? cert.tags.join(', ') : '')),
      is_published: cert.is_published !== false
    });
    setFeedback(null);
    setModalOpen(true);
  };

  const handleBadgeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (PNG, JPG, SVG, WebP).' });
      return;
    }

    setUploadingBadge(true);
    try {
      const res = await uploadAsset(file, 'certificates');
      if (res?.publicUrl) {
        setFormData(prev => ({ ...prev, badge_url: res.publicUrl }));
        setFeedback({ type: 'success', message: 'Certificate badge image uploaded successfully!' });
      } else if (res?.error) {
        setFeedback({ type: 'error', message: 'Upload error: ' + res.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Upload failed: ' + err.message });
    } finally {
      setUploadingBadge(false);
    }
  };

  const isValidUrl = (str) => {
    if (!str || !str.trim()) return true;
    try {
      const parsed = new URL(str);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'Certificate Title is required.' });
      return;
    }
    if (!formData.issuer.trim()) {
      setFeedback({ type: 'error', message: 'Issuing Organization is required.' });
      return;
    }

    if (formData.credential_url.trim() && !isValidUrl(formData.credential_url.trim())) {
      setFeedback({ type: 'error', message: 'Please enter a valid credential verification URL (starting with http:// or https://).' });
      return;
    }

    if (formData.badge_url.trim() && !isValidUrl(formData.badge_url.trim()) && !formData.badge_url.startsWith('data:')) {
      setFeedback({ type: 'error', message: 'Please enter a valid image URL for the certificate badge.' });
      return;
    }

    setSaving(true);
    const skillsList = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      id: formData.id || `cert-${Date.now()}`,
      name: formData.name.trim(),
      title: formData.name.trim(),
      issuer: formData.issuer.trim(),
      issuing_organization: formData.issuer.trim(),
      issue_date: formData.issue_date.trim(),
      year: formData.issue_date.trim(),
      date: formData.issue_date.trim(),
      expiry_date: formData.expiry_date.trim(),
      credential_id: formData.credential_id.trim(),
      credential_url: formData.credential_url.trim(),
      verification_url: formData.credential_url.trim(),
      badge_url: formData.badge_url.trim(),
      image: formData.badge_url.trim(),
      description: formData.description.trim(),
      skills: skillsList,
      tags: skillsList,
      is_published: formData.is_published
    };

    const res = await saveCertificate(payload);
    setSaving(false);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to save certificate: ' + res.error });
    } else {
      setFeedback({ type: 'success', message: `Certificate "${payload.name}" saved successfully!` });
      setModalOpen(false);
    }
  };

  const handleDelete = async (id, name) => {
    setSaving(true);
    const res = await deleteCertificate(id);
    setSaving(false);
    setDeleteConfirmKey(null);

    if (res?.error) {
      setFeedback({ type: 'error', message: 'Failed to delete certificate.' });
    } else {
      setFeedback({ type: 'success', message: `Certificate "${name}" removed.` });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Award className="w-6 h-6" />
            </span>
            <span>Certificates & Honors</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage industry certifications, academic awards, verification URLs, and credential badges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-dark-950 shadow-glow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 font-bold" />
          <span>Add New Certificate</span>
        </button>
      </div>

      {/* Feedback Banner */}
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

      {/* Search & Overview */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates by title or issuer..."
            className="w-full pl-9 pr-3 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total: <strong className="text-emerald-400 font-bold">{certificates.length}</strong> Credentials
        </span>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCerts.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-dark-900 border border-dashed border-slate-800 rounded-2xl">
            <Award className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-semibold text-slate-300">No certificates found</h3>
            <p className="text-xs text-slate-500 mt-1">Click "Add New Certificate" above to record your credentials.</p>
          </div>
        ) : (
          filteredCerts.map((cert) => (
            <div 
              key={cert.id}
              className="bg-dark-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-slate-700 transition-colors group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base truncate group-hover:text-emerald-400 transition-colors">
                      {cert.name || cert.title}
                    </h3>
                    <p className="text-xs text-emerald-400/90 font-mono mt-0.5">{cert.issuer}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    cert.is_published !== false
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {cert.is_published !== false ? 'Published' : 'Hidden'}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-400 font-sans">
                  {cert.issue_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Issued: {cert.issue_date}</span>
                    </div>
                  )}
                  {cert.credential_id && (
                    <div className="font-mono text-[11px] text-slate-500">
                      ID: {cert.credential_id}
                    </div>
                  )}
                  {cert.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2">
                      {cert.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div>
                  {(cert.credential_url || cert.verification_url) && (
                    <a
                      href={cert.credential_url || cert.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-dark-850 transition-colors"
                    title="Edit certificate"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {deleteConfirmKey === cert.id ? (
                    <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded-lg border border-red-500/40">
                      <button
                        onClick={() => handleDelete(cert.id, cert.name || cert.title)}
                        className="text-[10px] font-bold text-red-400 px-1 hover:underline"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmKey(null)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmKey(cert.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-dark-850 transition-colors"
                      title="Delete certificate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div 
            className="w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>{editingCertId ? 'Edit Certificate' : 'Add New Certificate'}</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-slate-300 block mb-1">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. CompTIA Security+, Cisco CCNA, AWS Solutions Architect..."
                    className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="e.g. Cisco, CompTIA, Stanford Online..."
                    className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Issue Date (YYYY-MM)</label>
                  <input
                    type="text"
                    value={formData.issue_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                    placeholder="2024-05"
                    className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.credential_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, credential_id: e.target.value }))}
                    placeholder="e.g. CS-982341 or badge code"
                    className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Credential Verification URL</label>
                  <input
                    type="url"
                    value={formData.credential_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, credential_url: e.target.value }))}
                    placeholder="https://credly.com/badges/..."
                    className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-slate-300 block mb-1">Badge Image or Certificate Thumbnail</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.badge_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, badge_url: e.target.value }))}
                      placeholder="https://... or upload image"
                      className="flex-1 px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                    <label className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{uploadingBadge ? 'Uploading...' : 'Upload'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleBadgeUpload} 
                        disabled={uploadingBadge} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  {formData.badge_url && (
                    <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-dark-850/80 border border-slate-800 w-fit">
                      <img 
                        src={formData.badge_url} 
                        alt="Badge Preview" 
                        className="w-8 h-8 rounded object-contain border border-slate-700" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <span className="text-[11px] text-slate-400 font-mono">Image preview</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-slate-300 block mb-1">Skills & Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="e.g. Cryptography, Network Security, Packet Analysis, Vulnerability Scanning"
                    className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-slate-300 block mb-1">Description / Key Competencies</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of skills validated by this certification..."
                    className="w-full px-3.5 py-2 bg-dark-850 border border-slate-750 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <span>Published on public portfolio</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 text-xs font-bold shadow-glow-sm"
                  >
                    {saving ? 'Saving...' : 'Save Certificate'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

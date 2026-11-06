import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FolderGit2, 
  BookOpen,
  Wrench, 
  GraduationCap, 
  Briefcase, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  User, 
  UserCheck, 
  Eye,
  Database,
  ShieldCheck,
  FileDown,
  Share2,
  Palette,
  FileText,
  Mail,
  PanelBottom,
  Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { portfolio, loading } = usePortfolio();
  const { isConfigured, user } = useAuth();

  const projectList = portfolio.projects?.items || [];
  const projectCount = projectList.length;
  const publishedProjects = projectList.filter(p => p.is_published !== false).length;

  const researchList = portfolio.research?.items || [];
  const researchCount = researchList.length;
  const publishedResearch = researchList.filter(r => r.is_published !== false).length;

  const skillsCount = (portfolio.skills?.categories || []).reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const experienceCount = portfolio.experience?.roles?.length || 0;
  const degrees = portfolio.education?.degrees || [];
  const honors = portfolio.achievements?.items || [];
  const educationCount = degrees.length + honors.length;
  const quickStats = portfolio.personal?.quickStats || [];
  const gpaStat = quickStats.find(s => s.label?.toLowerCase().includes('gpa'))?.value || quickStats[1]?.value || '3.9+';

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm font-sans text-slate-400 mt-1">
            Manage research publications, software projects, skills, and preview your live portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/research"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#F5F7FA] hover:bg-white text-[#2D3748] shadow-subtle transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Publication</span>
          </Link>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#121212] hover:bg-[#1A1A1A] text-[#F5F7FA] border border-[#262626] shadow-subtle transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#0E0E0E] hover:bg-[#1A1A1A] text-[#F5F7FA] border border-[#262626] transition-colors"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Live View</span>
          </Link>
        </div>
      </div>

      {/* Database Connection Notice Banner */}
      {!isConfigured && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-amber-300">
                Supabase Environment Variables Pending
              </h2>
              <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                You are currently running in local interactive sandbox mode. Saved changes will be preserved in your browser session. To connect to your real Supabase cloud database, add <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-amber-200">VITE_SUPABASE_URL</code> and <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-amber-200">VITE_SUPABASE_ANON_KEY</code> to your <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-amber-200">.env</code> file.
              </p>
            </div>
          </div>
          <Link
            to="/admin/settings"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 shrink-0"
          >
            Setup Guide
          </Link>
        </div>
      )}

      {/* Metrics Stat Cards (5 Cards evenly distributed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        
        {/* Research */}
        <Link 
          to="/admin/research"
          className="rounded-xl p-5 bg-[#121212] border border-[#262626] hover:border-[#383838] shadow-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Research</span>
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#222222] flex items-center justify-center text-[#F5F7FA]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">{researchCount}</span>
            <span className="text-xs text-[#A0AEC0] font-mono">({publishedResearch} published)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Papers, Preprints, Conferences</span>
        </Link>

        {/* Projects */}
        <Link 
          to="/admin/projects"
          className="rounded-xl p-5 bg-[#121212] border border-[#262626] hover:border-[#383838] shadow-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Projects</span>
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#222222] flex items-center justify-center text-[#F5F7FA]">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">{projectCount}</span>
            <span className="text-xs text-[#A0AEC0] font-mono">({publishedProjects} published)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Full-Stack, Systems, AI tools</span>
        </Link>

        {/* Skills */}
        <Link 
          to="/admin/skills"
          className="rounded-xl p-5 bg-[#121212] border border-[#262626] hover:border-[#383838] shadow-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Skills</span>
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#222222] flex items-center justify-center text-[#F5F7FA]">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">{skillsCount}</span>
            <span className="text-xs text-[#A0AEC0] font-mono">technical items</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Networking, Cyber, CS, AI/ML</span>
        </Link>

        {/* Experience */}
        <Link 
          to="/admin/experience"
          className="rounded-xl p-5 bg-[#121212] border border-[#262626] hover:border-[#383838] shadow-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Experience</span>
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#222222] flex items-center justify-center text-[#F5F7FA]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">{experienceCount}</span>
            <span className="text-xs text-[#A0AEC0] font-mono">work & leadership</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Internships, TA roles</span>
        </Link>

        {/* Education & Honors */}
        <Link 
          to="/admin/education"
          className="rounded-xl p-5 bg-[#121212] border border-[#262626] hover:border-[#383838] shadow-subtle transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Education</span>
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#222222] flex items-center justify-center text-[#F5F7FA]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">{degrees.length}</span>
            <span className="text-xs text-[#A0AEC0] font-mono">+{honors.length} honors</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">GPA: {gpaStat}</span>
        </Link>

      </div>

      {/* Main Grid: Recent Projects + Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Recent Projects Table */}
        <div className="lg:col-span-8 rounded-xl p-6 bg-[#121212] border border-[#262626] shadow-subtle">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#A0AEC0]" />
              <h2 className="text-base font-bold font-heading text-white">Project Catalog</h2>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-[#F5F7FA] hover:text-white flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {projectList.length === 0 ? (
              <div className="py-12 text-center bg-dark-950/40 border border-dashed border-slate-800 rounded-xl">
                <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No projects found in catalog.</p>
                <Link to="/admin/projects" className="text-xs text-emerald-400 font-bold mt-1 inline-block hover:underline">
                  Add Your First Project
                </Link>
              </div>
            ) : (
              projectList.slice(0, 6).map((proj) => (
                <div 
                  key={proj.id}
                  className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#222222] flex items-center justify-between gap-3 hover:border-[#383838] transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={proj.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900'}
                      alt={proj.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900'; }}
                    />
                    <div className="truncate">
                      <h3 className="text-xs sm:text-sm font-semibold font-heading text-white truncate">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span className="text-emerald-400">{proj.category}</span>
                        <span>•</span>
                        <span className="truncate">{(proj.technologies || []).slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                      proj.is_published !== false 
                        ? 'bg-[#1A1A1A] text-[#F5F7FA] border border-[#262626]' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {proj.is_published !== false ? 'Published' : 'Draft'}
                    </span>
                    <Link
                      to="/admin/projects"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                      title="Edit in Projects section"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick Action Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Management Shortcuts */}
          <div className="rounded-xl p-6 bg-[#121212] border border-[#262626] shadow-subtle space-y-2.5">
            <h2 className="text-sm font-bold font-heading text-white flex items-center gap-2 pb-2 border-b border-slate-800/80">
              <Settings className="w-4 h-4 text-[#A0AEC0]" />
              <span>Quick Management</span>
            </h2>

            <Link
              to="/admin/hero"
              className="flex items-center justify-between p-3 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#383838] text-xs font-semibold text-[#F5F7FA] hover:text-white transition-all shadow-subtle"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#F5F7FA]" />
                <span>Hero Section & Availability</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#F5F7FA]" />
            </Link>

            <Link
              to="/admin/about"
              className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>About Me & Bio Narrative</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              to="/admin/certificates"
              className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Certificates & Honors</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              to="/admin/skills"
              className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>Skills & Competencies</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              to="/admin/contact"
              className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Contact & Social Platforms</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              to="/admin/section-visibility"
              className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Menu Tabs & Section Visibility</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              to="/admin/footer"
              className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <PanelBottom className="w-4 h-4 text-emerald-400" />
                <span>Footer Customization</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-[#A0AEC0]" />
                <span>Backend Database & Settings</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>

          {/* Security & RLS Compliance Card */}
          <div className="p-5 rounded-xl bg-[#121212] border border-[#222222] text-xs space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Security Architecture</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Row Level Security (RLS) guarantees that public visitors can only read published records. Administrative mutations require valid Supabase JWT tokens. Service-role secrets are never included in client code.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

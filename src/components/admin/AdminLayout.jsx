import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  FolderGit2, 
  BookOpen,
  Wrench, 
  Award,
  GraduationCap, 
  Briefcase, 
  FolderTree,
  Image as ImageIcon,
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Terminal, 
  Eye, 
  Database,
  AlertCircle,
  Mail,
  PanelBottom,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AdminLayout() {
  const { user, signOut, isConfigured } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Enforce consistent dark developer studio theme for all admin pages
  useEffect(() => {
    const html = document.documentElement;
    const previouslyHadDark = html.classList.contains('dark');
    html.classList.add('dark');

    return () => {
      const stored = localStorage.getItem('portfolio_theme_mode') || localStorage.getItem('cs-portfolio-theme') || localStorage.getItem('theme');
      if (stored === 'light' || (!stored && !previouslyHadDark)) {
        html.classList.remove('dark');
      }
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  // Structured, consolidated navigation groups matching recommendations
  const navGroups = [
    {
      group: 'Dashboard',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Content Management',
      items: [
        { name: 'Hero Section', path: '/admin/hero', icon: Sparkles },
        { name: 'Profile & About Me', path: '/admin/about', icon: UserCheck },
        { name: 'Skills & Technologies', path: '/admin/skills', icon: Wrench },
        { name: 'Projects Showcase', path: '/admin/projects', icon: FolderGit2 },
        { name: 'Research & Publications', path: '/admin/research', icon: BookOpen },
        { name: 'Certificates & Honors', path: '/admin/certificates', icon: Award },
        { name: 'Work Experience', path: '/admin/experience', icon: Briefcase },
        { name: 'Education', path: '/admin/education', icon: GraduationCap },
        { name: 'Contact Section', path: '/admin/contact', icon: Mail }
      ]
    },
    {
      group: 'Organization',
      items: [
        { name: 'Categories & Tags', path: '/admin/organization', icon: FolderTree }
      ]
    },
    {
      group: 'Media Library',
      items: [
        { name: 'Media & Documents', path: '/admin/media', icon: ImageIcon }
      ]
    },
    {
      group: 'Website Settings',
      items: [
        { name: 'Section & Nav Visibility', path: '/admin/section-visibility', icon: Eye },
        { name: 'Footer Customization', path: '/admin/footer', icon: PanelBottom },
        { name: 'Website & Theme Settings', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className="admin-scope min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col md:flex-row antialiased font-sans">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#050505] border-b border-[#222222] z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-[#F5F7FA]" />
          </div>
          <span className="font-mono font-bold text-sm tracking-tight text-white">
            Admin<span className="text-[#A0AEC0]">Suite</span>
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle admin sidebar"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Admin Sidebar Navigation */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#050505] border-r border-[#222222] p-4 flex flex-col justify-between z-40 transition-transform duration-300 overflow-y-auto ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#121212] border border-[#262626] flex items-center justify-center text-[#F5F7FA] font-mono font-bold text-base shadow-subtle">
                <Terminal className="w-5 h-5 text-[#F5F7FA]" />
              </div>
              <div>
                <h1 className="font-mono font-bold text-sm text-white tracking-tight leading-none">
                  Admin<span className="text-[#A0AEC0]">Suite</span>
                </h1>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  Portfolio CMS
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Status Pill */}
          <div className="mb-4 p-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222] flex items-center gap-2.5 text-xs shadow-inner-subtle">
            <Database className="w-3.5 h-3.5 text-[#A0AEC0] shrink-0" />
            <div className="flex-1 truncate">
              <span className="block font-medium text-slate-300 text-[10px]">Database Status</span>
              {isConfigured ? (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Supabase Live
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                  Staged Local Storage
                </span>
              )}
            </div>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-4" aria-label="Admin Navigation">
            {navGroups.map((group) => (
              <div key={group.group}>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider px-3 block mb-1.5">
                  {group.group}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) => `
                          flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[#171717] text-[#F5F7FA] border border-[#2E2E2E] font-semibold shadow-subtle'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-[#121212]'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User Actions */}
        <div className="pt-4 mt-4 border-t border-[#222222] space-y-2 shrink-0">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#121212] hover:bg-[#1A1A1A] border border-[#262626] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[#A0AEC0]" />
              <span>Public Website</span>
            </span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {user?.email || 'Administrator'}
              </span>
              <span className="text-[10px] font-mono text-[#A0AEC0]">Authenticated</span>
            </div>
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto">
        
        {/* Top Ribbon */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-[#0A0A0A]/95 border-b border-[#222222] backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Signed in as:</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#121212] text-[#F5F7FA] border border-[#262626]">
              {user?.email || 'admin@portfolio.dev'}
            </span>
            {!isConfigured && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Local Staged Mode</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#F5F7FA] hover:text-white bg-[#121212] hover:bg-[#1A1A1A] border border-[#262626] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#A0AEC0]" />
              <span>Preview Portfolio</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content Outlet for Nested Admin Pages */}
        <div className="p-4 sm:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

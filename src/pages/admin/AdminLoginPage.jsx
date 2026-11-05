import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Terminal, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Database,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminLoginPage() {
  const { signIn, isConfigured, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Enforce consistent dark developer studio theme for admin login
  useEffect(() => {
    const html = document.documentElement;
    const previouslyHadDark = html.classList.contains('dark');
    html.classList.add('dark');

    return () => {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || (!stored && !previouslyHadDark)) {
        html.classList.remove('dark');
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your administrator email.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setFormError(error.message || 'Login failed. Please check your credentials.');
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@portfolio.dev');
    setPassword('admin123456');
    setFormError('');
  };

  return (
    <div className="admin-scope min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-[#07090e] selection:bg-emerald-500 selection:text-dark-950">
      {/* Modern Matching Ambient Atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep, diffused radial gradient from top - matching portfolio Neon Emerald accent */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.14)_0%,rgba(16,185,129,0.05)_40%,transparent_75%)] pointer-events-none" />

        {/* Bottom ambient slate depth */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(15,23,42,0.6)_0%,transparent_70%)] pointer-events-none" />

        {/* Modern developer grid pattern with radial vignette mask so it fades gently towards the edges */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_50%,transparent_100%)] pointer-events-none" 
        />

        {/* Subtle vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e]/80 pointer-events-none" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20 transition-all shadow-glow-sm">
              <Terminal className="w-6 h-6 text-emerald-400" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-heading font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>Administrator</span>
            <span className="text-emerald-400">Portal</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Authenticate to manage portfolio projects, skills, and configuration.
          </p>
        </div>

        {/* Login Card */}
        <div className="relative rounded-2xl bg-dark-900/90 border border-slate-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl p-6 sm:p-8 overflow-hidden">
          {/* Subtle top edge border glow highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />
          
          {/* Supabase Status Pill */}
          <div className="mb-5 flex items-center justify-between text-xs font-mono p-2.5 rounded-xl bg-dark-950 border border-slate-800">
            <span className="flex items-center gap-2 text-slate-400">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auth Backend:</span>
            </span>
            {isConfigured ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase Live
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Local Sandbox Mode
              </span>
            )}
          </div>

          {/* Form Error Banner */}
          {(formError || authError) && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError || authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-dark-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-dark-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-dark-950 font-bold text-sm shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          {!isConfigured && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-400 mb-2">
                Need to test without Supabase configured yet?
              </p>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
              >
                Auto-fill Sandbox Demo Credentials (admin@portfolio.dev)
              </button>
            </div>
          )}

        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Public Portfolio
          </Link>
        </div>

      </div>
    </div>
  );
}

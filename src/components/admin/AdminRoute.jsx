import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Terminal } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, isAuthorizedAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center animate-pulse mb-4">
          <Terminal className="w-6 h-6 text-violet-400" />
        </div>
        <p className="font-mono text-xs text-slate-400">Verifying administrator authorization...</p>
      </div>
    );
  }

  // Only explicitly authorized administrators may enter
  if (!user || !isAuthorizedAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

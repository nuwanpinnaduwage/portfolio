import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#2D3748] dark:text-[#F5F7FA] shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 dark:border-emerald-500/30',
    error: 'border-rose-500/30 dark:border-rose-500/30',
    info: 'border-[#A0AEC0]/40 dark:border-[#262626]'
  };

  return (
    <aside 
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in"
    >
      <div 
        role="status"
        aria-live="polite"
        className={`flex items-start gap-3 p-4 rounded-xl shadow-xl glass-panel ${borders[toast.type || 'info']} bg-white dark:bg-[#121212] backdrop-blur-md transition-all duration-300`}
      >
        {icons[toast.type || 'info']}
        <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

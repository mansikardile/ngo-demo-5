import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-900',
    error: 'border-rose-200 bg-rose-50/90 text-rose-900',
    info: 'border-indigo-200 bg-indigo-50/90 text-indigo-900',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border ${borderColors[type]} backdrop-blur-md shadow-xl max-w-sm w-full animate-in slide-in-from-top-2 duration-200`}
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && <p className="text-xs opacity-90 mt-0.5">{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="opacity-60 hover:opacity-100 p-1 rounded-md hover:bg-black/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'indigo' | 'amber' | 'sky' | 'rose' | 'slate' | 'purple' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'indigo', size = 'sm', className }) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border tracking-wide';

  const variants = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    sky: 'bg-sky-50 text-sky-700 border-sky-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>{children}</span>;
};

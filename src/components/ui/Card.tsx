import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'interactive';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ variant = 'solid', children, className, ...props }) => {
  const baseStyles = 'rounded-2xl p-5 border transition-all duration-200';

  const variants = {
    solid: 'bg-white border-slate-200/80 text-slate-900 shadow-sm shadow-slate-200/50',
    glass: 'bg-white/90 backdrop-blur-md border-slate-200/90 text-slate-900 shadow-md shadow-slate-200/40',
    interactive: 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-indigo-300 text-slate-900 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-indigo-500/10 cursor-pointer',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </div>
  );
};

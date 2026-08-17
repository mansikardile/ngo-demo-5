import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items matching your current filters or search criteria.',
  icon = <FolderOpen className="w-12 h-12 text-slate-400" />,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-white/60">
      <div className="p-4 rounded-2xl bg-slate-100 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

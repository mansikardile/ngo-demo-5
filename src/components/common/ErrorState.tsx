import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to fetch the requested records. Please check your network or try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-rose-200 rounded-2xl bg-rose-50/50">
      <div className="p-4 rounded-2xl bg-rose-100 text-rose-600 mb-4">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-semibold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};

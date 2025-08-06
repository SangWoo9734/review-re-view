import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'github-open' | 'github-merged' | 'github-closed';
  size?: 'sm' | 'md';
  className?: string;
}

const chipVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
  info: 'bg-info/10 text-info border-info/20',
  'github-open': 'bg-github-open/10 text-github-open border-github-open/20',
  'github-merged': 'bg-github-merged/10 text-github-merged border-github-merged/20',
  'github-closed': 'bg-github-closed/10 text-github-closed border-github-closed/20',
};

const chipSizes = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-caption',
};

export function Chip({ 
  children, 
  variant = 'default', 
  size = 'sm', 
  className 
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium border',
        chipVariants[variant],
        chipSizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
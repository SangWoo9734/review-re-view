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
  'github-open': 'bg-blue-50 text-blue-700 border-blue-200',
  'github-merged': 'bg-purple-50 text-purple-700 border-purple-200',
  'github-closed': 'bg-red-50 text-red-700 border-red-200',
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
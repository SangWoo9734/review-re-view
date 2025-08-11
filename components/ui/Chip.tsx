import React from 'react';
import { cn } from '@/lib/utils';

export type ChipVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'github-open' | 'github-merged' | 'github-closed';

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const chipVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
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
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300 shadow-sm hover:shadow-md',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 shadow-sm hover:shadow-md',
  outline: 'border-2 border-primary-200 bg-white text-primary-600 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-300 shadow-sm',
  ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300',
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm font-medium',
  md: 'px-6 py-2.5 text-base font-medium',
  lg: 'px-8 py-3 text-lg font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-xl transition-all duration-300 transform',
        'focus:outline-none focus:ring-3 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95',
        
        // Variants
        buttonVariants[variant],
        
        // Sizes
        buttonSizes[size],
        
        // Loading state
        loading && 'cursor-wait',
        
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
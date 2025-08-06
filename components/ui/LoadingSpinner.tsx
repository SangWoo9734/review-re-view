import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary-500',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingStateProps {
  children?: React.ReactNode;
  className?: string;
}

export function LoadingState({ children, className }: LoadingStateProps) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {children && (
          <p className="text-body2 text-gray-600">{children}</p>
        )}
      </div>
    </div>
  );
}
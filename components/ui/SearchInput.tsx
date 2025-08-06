import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onSearch: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({ 
  placeholder = '검색...',
  value: externalValue,
  onSearch,
  onClear,
  debounceMs = 300,
  className 
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(externalValue || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, onSearch, debounceMs]);

  // External value가 변경되면 internal value 동기화
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== internalValue) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  const handleClear = () => {
    setInternalValue('');
    onClear?.();
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-400">🔍</span>
      </div>
      
      <input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        className={cn(
          'block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'placeholder-gray-400 text-body1'
        )}
      />
      
      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <span>❌</span>
        </button>
      )}
    </div>
  );
}
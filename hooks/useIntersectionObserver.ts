import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentTarget = targetRef.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [threshold, rootMargin, enabled]);

  return {
    ref: targetRef,
    isIntersecting,
    entry,
  };
}

// 무한 스크롤 전용 훅
export function useInfiniteScroll(
  fetchNextPage: () => void,
  hasNextPage?: boolean,
  isFetchingNextPage?: boolean
) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px',
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ref };
}
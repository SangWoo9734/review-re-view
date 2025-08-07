import { useMemo, useState } from 'react';
import { AnalysisResult } from '@/lib/textAnalysis';
import { generateActionItems, getActionItemStats, ActionItem, ActionPriority } from '@/lib/actionItems';

export interface UseActionItemsResult {
  actionItems: ActionItem[];
  stats: ReturnType<typeof getActionItemStats>;
  filteredItems: ActionItem[];
  expandedItems: Set<string>;
  filters: {
    priority: ActionPriority | 'all';
    category: string | 'all';
  };
  toggleExpanded: (id: string) => void;
  setFilter: (type: 'priority' | 'category', value: string) => void;
  clearFilters: () => void;
}

export function useActionItems(analysisResult: AnalysisResult | null): UseActionItemsResult {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<{
    priority: ActionPriority | 'all';
    category: string | 'all';
  }>({
    priority: 'all',
    category: 'all'
  });

  // 액션 아이템 생성
  const actionItems = useMemo(() => {
    if (!analysisResult) return [];
    return generateActionItems(analysisResult);
  }, [analysisResult]);

  // 통계 계산
  const stats = useMemo(() => {
    return getActionItemStats(actionItems);
  }, [actionItems]);

  // 필터링된 아이템
  const filteredItems = useMemo(() => {
    return actionItems.filter(item => {
      // 우선순위 필터
      if (filters.priority !== 'all' && item.priority !== filters.priority) {
        return false;
      }
      
      // 카테고리 필터
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }
      
      return true;
    });
  }, [actionItems, filters]);

  // 확장/축소 토글
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 필터 설정
  const setFilter = (type: 'priority' | 'category', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // 필터 초기화
  const clearFilters = () => {
    setFilters({
      priority: 'all',
      category: 'all'
    });
  };

  return {
    actionItems,
    stats,
    filteredItems,
    expandedItems,
    filters,
    toggleExpanded,
    setFilter,
    clearFilters
  };
}
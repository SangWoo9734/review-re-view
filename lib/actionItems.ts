// 액션 아이템 자동 생성 엔진
// Phase 8: Action Items Generation

import { AnalysisResult } from './textAnalysis';
import { ACTION_PATTERNS } from '@/lib/constants/actionPatterns';

export type ActionPriority = 'P1' | 'P2' | 'P3';
export type ActionCategory = 'immediate' | 'improvement' | 'consideration';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: ActionPriority;
  category: ActionCategory;
  keywordCategory: string;
  relatedKeywords: string[];
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  examples?: string[];
}


/**
 * 분석 결과를 바탕으로 액션 아이템 생성
 */
export function generateActionItems(analysisResult: AnalysisResult): ActionItem[] {
  const actionItems: ActionItem[] = [];
  const processedCategories = new Set<string>();

  // 카테고리별 키워드 분석
  Object.entries(analysisResult.categories).forEach(([category, keywords]) => {
    if (keywords.length === 0 || processedCategories.has(category)) return;
    
    const pattern = ACTION_PATTERNS[category];
    if (!pattern) return;

    // 해당 카테고리의 키워드들
    const relevantKeywords = keywords.map(k => k.keyword);
    const totalFrequency = keywords.reduce((sum, k) => sum + k.frequency, 0);
    
    // 빈도에 따른 우선순위 조정
    const adjustPriority = (basePriority: ActionPriority, frequency: number): ActionPriority => {
      if (frequency >= 10) return 'P1'; // 높은 빈도
      if (frequency >= 5) return basePriority === 'P3' ? 'P2' : basePriority;
      return basePriority;
    };

    // 패턴에서 액션 아이템 생성
    pattern.actions.forEach((actionTemplate, index) => {
      const actionItem: ActionItem = {
        ...actionTemplate,
        id: `${category}-${index}`,
        relatedKeywords: relevantKeywords.slice(0, 5), // 상위 5개 키워드
        priority: adjustPriority(actionTemplate.priority, totalFrequency)
      };

      actionItems.push(actionItem);
    });

    processedCategories.add(category);
  });

  // 우선순위별 정렬 (P1 > P2 > P3)
  return actionItems.sort((a, b) => {
    const priorityOrder = { 'P1': 1, 'P2': 2, 'P3': 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * 액션 아이템 통계 생성
 */
export function getActionItemStats(actionItems: ActionItem[]) {
  const totalItems = actionItems.length;
  const byPriority = {
    P1: actionItems.filter(item => item.priority === 'P1').length,
    P2: actionItems.filter(item => item.priority === 'P2').length,
    P3: actionItems.filter(item => item.priority === 'P3').length,
  };
  
  const byCategory = {
    immediate: actionItems.filter(item => item.category === 'immediate').length,
    improvement: actionItems.filter(item => item.category === 'improvement').length,
    consideration: actionItems.filter(item => item.category === 'consideration').length,
  };

  const byImpact = {
    high: actionItems.filter(item => item.impact === 'high').length,
    medium: actionItems.filter(item => item.impact === 'medium').length,
    low: actionItems.filter(item => item.impact === 'low').length,
  };

  return {
    totalItems,
    byPriority,
    byCategory,
    byImpact,
  };
}
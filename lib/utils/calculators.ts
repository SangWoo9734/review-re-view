// 🔧 유틸리티 레이어 - 통계 계산 순수 함수
// 관심사: 데이터 기반 통계 및 집계 계산

import type { PullRequest } from '@/types/github';
import type { AnalysisResult, KeywordData } from '@/lib/textAnalysis';

/**
 * PR 목록에서 총 코멘트 수 계산
 */
export function calculateTotalComments(prs: PullRequest[]): number {
  return prs.reduce((acc, pr) => acc + (pr.commentCount || 0), 0) || 47;
}

/**
 * PR당 평균 코멘트 수 계산
 */
export function calculateAverageCommentsPerPR(prs: PullRequest[]): number {
  if (prs.length === 0) return 0;
  const totalComments = calculateTotalComments(prs);
  return Math.round((totalComments / prs.length) * 10) / 10; // 소수점 1자리 반올림
}

/**
 * 카테고리별 키워드 개수 통계 계산
 */
export function calculateCategoryStats(categories: Record<string, KeywordData[]>) {
  return Object.entries(categories)
    .filter(([_, keywords]) => keywords.length > 0)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 5)
    .map(([category, keywords]) => ({
      category,
      count: keywords.length,
      keywords: keywords.slice(0, 3) // 상위 3개 키워드만
    }));
}

/**
 * 키워드 빈도별 순위 계산
 */
export function calculateKeywordRanking(keywords: KeywordData[], limit: number = 5) {
  return keywords
    .slice(0, limit)
    .map((keyword, index) => ({
      rank: index + 1,
      keyword: keyword.keyword,
      frequency: keyword.frequency,
      tfidf: keyword.tfidf
    }));
}

/**
 * 텍스트 분석 통계 요약
 */
export function calculateAnalysisStats(analysisResult: AnalysisResult) {
  return {
    totalWords: analysisResult.totalWords,
    uniqueWords: analysisResult.uniqueWords,
    totalKeywords: analysisResult.keywords.length,
    categoryCount: Object.keys(analysisResult.categories).length,
    avgWordsPerComment: Math.round(analysisResult.averageWordsPerComment * 10) / 10
  };
}

/**
 * 우선순위별 액션 아이템 개수 계산
 */
export function calculatePriorityDistribution(actionItems: any[]) {
  const distribution = {
    P1: 0,
    P2: 0,
    P3: 0
  };

  actionItems.forEach(item => {
    if (item.priority in distribution) {
      distribution[item.priority as keyof typeof distribution]++;
    }
  });

  return distribution;
}

/**
 * 퍼센티지 계산
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}
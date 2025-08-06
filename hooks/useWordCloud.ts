import { useMemo } from 'react';
import { AnalysisResult, KeywordData } from '@/lib/textAnalysis';

export interface WordCloudData {
  text: string;
  size: number;
  color: string;
  category: string;
  frequency: number;
  tfidf: number;
}

// 카테고리별 색상 매핑 (Tailwind config와 일치)
const CATEGORY_COLORS: Record<string, string> = {
  'code-quality': '#45b7d1',
  'performance': '#ff6b6b', 
  'bug-fix': '#ef4444',
  'architecture': '#4ecdc4',
  'testing': '#10b981',
  'documentation': '#6b7280',
  'security': '#8b5cf6',
  'ui-ux': '#f59e0b',
  'general': '#94a3b8',
};

// 키워드를 워드클라우드 데이터로 변환
export function useWordCloud(analysisResult: AnalysisResult | null): {
  wordCloudData: WordCloudData[];
  maxFrequency: number;
  totalKeywords: number;
} {
  return useMemo(() => {
    if (!analysisResult) {
      return {
        wordCloudData: [],
        maxFrequency: 0,
        totalKeywords: 0,
      };
    }

    const keywords = analysisResult.keywords;
    const maxFrequency = Math.max(...keywords.map(k => k.frequency));
    
    // TF-IDF 점수를 기준으로 폰트 크기 계산 (10px ~ 40px)
    const maxTFIDF = Math.max(...keywords.map(k => k.tfidf));
    const minTFIDF = Math.min(...keywords.map(k => k.tfidf));
    
    const wordCloudData: WordCloudData[] = keywords.map((keyword: KeywordData) => {
      // TF-IDF 기준으로 크기 계산 (정규화)
      const normalizedTFIDF = maxTFIDF > minTFIDF 
        ? (keyword.tfidf - minTFIDF) / (maxTFIDF - minTFIDF)
        : 0.5;
      
      // 크기 범위: 12px ~ 48px
      const size = Math.max(12, Math.min(48, 12 + (normalizedTFIDF * 36)));
      
      return {
        text: keyword.keyword,
        size: Math.round(size),
        color: CATEGORY_COLORS[keyword.category] || CATEGORY_COLORS.general,
        category: keyword.category,
        frequency: keyword.frequency,
        tfidf: keyword.tfidf,
      };
    });

    return {
      wordCloudData,
      maxFrequency,
      totalKeywords: keywords.length,
    };
  }, [analysisResult]);
}

// 카테고리 필터링을 위한 훅
export function useFilteredWordCloud(
  analysisResult: AnalysisResult | null, 
  selectedCategories: string[]
): {
  wordCloudData: WordCloudData[];
  availableCategories: string[];
} {
  return useMemo(() => {
    const { wordCloudData } = useWordCloud(analysisResult);
    
    // 사용 가능한 카테고리 목록
    const availableCategories = Array.from(
      new Set(wordCloudData.map(item => item.category))
    );

    // 선택된 카테고리로 필터링 (선택이 없으면 모두 표시)
    const filteredData = selectedCategories.length > 0
      ? wordCloudData.filter(item => selectedCategories.includes(item.category))
      : wordCloudData;

    return {
      wordCloudData: filteredData,
      availableCategories,
    };
  }, [analysisResult, selectedCategories]);
}
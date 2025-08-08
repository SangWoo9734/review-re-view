import { useMemo } from 'react';
import { AnalysisResult } from '@/lib/textAnalysis';
import { WordCloudService, type WordCloudData } from '@/lib/services/wordCloudService';

// 키워드를 워드클라우드 데이터로 변환
export function useWordCloud(analysisResult: AnalysisResult | null): {
  wordCloudData: WordCloudData[];
  maxFrequency: number;
  totalKeywords: number;
} {
  return useMemo(() => {
    const result = WordCloudService.transformAnalysisToWordCloud(analysisResult);
    
    return {
      wordCloudData: result.wordCloudData,
      maxFrequency: result.maxFrequency,
      totalKeywords: result.totalKeywords,
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
    const result = WordCloudService.filterWordCloudByCategories(wordCloudData, selectedCategories);
    
    return {
      wordCloudData: result.wordCloudData,
      availableCategories: result.availableCategories,
    };
  }, [analysisResult, selectedCategories]);
}

// WordCloudData 타입을 re-export
export type { WordCloudData };
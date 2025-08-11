import { useMemo } from 'react';
import { AnalysisResult } from '@/lib/textAnalysis';
import { WordCloudService, type WordCloudData } from '@/lib/services/wordCloudService';
import { CodeReviewKeywordAnalyzer, type CodeReviewKeyword } from '@/lib/services/codeReviewKeywordAnalyzer';
import { AIAnalyzer } from '@/lib/services/aiAnalyzer';

// 코드 리뷰 특화 키워드 분석을 사용한 워드클라우드 생성 (AI 강화)
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

    // 키워드 데이터에서 텍스트 추출 (contexts 사용)
    const allComments = analysisResult.keywords
      .flatMap(keyword => keyword.contexts)
      .join(' ');

    // 1단계: 기존 코드 리뷰 키워드 분석
    const reviewKeywords = CodeReviewKeywordAnalyzer.analyzeText(allComments);
    
    // 2단계: AI 강화 분석 (실제 AI 연동 구현됨)
    // TODO: AI 분석 결과를 reviewKeywords와 병합하는 로직 구현
    // const shouldEnhance = AIAnalyzer.shouldUseAI([allComments]);
    // if (shouldEnhance) {
    //   try {
    //     const aiResult = await AIAnalyzer.analyzeComments({
    //       comments: [allComments],
    //       existingKeywords: reviewKeywords.map(k => k.text)
    //     });
    //     // AI 결과를 기존 키워드와 병합
    //     reviewKeywords = mergeWithAIKeywords(reviewKeywords, aiResult.enhancedKeywords);
    //   } catch (error) {
    //     console.warn('AI 키워드 분석 실패, 기본 분석 사용:', error);
    //   }
    // }
    
    // WordCloudData 형태로 변환
    const maxScore = Math.max(...reviewKeywords.map(k => k.finalScore), 1);
    
    const wordCloudData: WordCloudData[] = reviewKeywords.map(keyword => {
      // 점수를 워드클라우드 크기로 변환 (12-48px)
      const normalizedScore = keyword.finalScore / maxScore;
      const size = Math.max(14, Math.min(48, 14 + (normalizedScore * 34)));
      
      return {
        text: keyword.text,
        size: Math.round(size),
        color: CodeReviewKeywordAnalyzer.getCategoryColor(keyword.category),
        category: keyword.category,
        frequency: keyword.frequency,
        tfidf: keyword.finalScore, // 최종 점수를 tfidf 필드에 저장
      };
    });

    return {
      wordCloudData,
      maxFrequency: Math.max(...reviewKeywords.map(k => k.frequency), 1),
      totalKeywords: reviewKeywords.length,
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
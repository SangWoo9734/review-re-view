/**
 * 스마트 분석기 - 단계별 AI 도입
 * Phase 1: 하이브리드 접근법
 */

import { CodeReviewKeywordAnalyzer, CodeReviewKeyword } from './codeReviewKeywordAnalyzer';

export interface SmartAnalysisOptions {
  useAI: boolean;
  confidence: number;
  maxTokens?: number;
}

export class SmartAnalyzer {
  
  /**
   * Phase 1: 즉시 적용 가능한 개선
   * AI 없이도 크게 향상시킬 수 있는 부분들
   */
  static enhanceTraditionalAnalysis(text: string): CodeReviewKeyword[] {
    const results = CodeReviewKeywordAnalyzer.analyzeText(text);
    
    // 1. 감정 분석 (간단한 규칙 기반)
    const sentiment = this.detectSentiment(text);
    
    // 2. 의도 파악 (패턴 매칭)
    const intent = this.detectIntent(text);
    
    // 3. 맥락 가중치 적용
    return results.map(keyword => ({
      ...keyword,
      sentiment,
      intent,
      finalScore: this.adjustScoreByContext(keyword, text, sentiment, intent)
    }));
  }

  private static detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positivePatterns = [
      /좋(다|네|아요|습니다)/,
      /잘.{1,10}(했|됐|되었|만들)/,
      /훌륭|멋지|완벽|훌륭/,
      /개선.*됐|나아졌|향상/
    ];
    
    const negativePatterns = [
      /문제|이슈|버그|에러/,
      /어려[워울]|복잡|힘들/,
      /않.*좋|별로|안.*좋/,
      /개선.*필요|수정.*필요/
    ];
    
    const positiveScore = positivePatterns.reduce((score, pattern) => 
      score + (pattern.test(text) ? 1 : 0), 0);
    const negativeScore = negativePatterns.reduce((score, pattern) => 
      score + (pattern.test(text) ? 1 : 0), 0);
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  private static detectIntent(text: string): 'praise' | 'concern' | 'suggestion' | 'question' {
    if (/\?/.test(text)) return 'question';
    if (/(하면|하는게|권장|제안|추천)/.test(text)) return 'suggestion';
    if (/(문제|이슈|우려|걱정)/.test(text)) return 'concern';
    if (/(좋|잘|훌륭|멋지)/.test(text)) return 'praise';
    return 'suggestion';
  }

  private static adjustScoreByContext(
    keyword: CodeReviewKeyword,
    text: string, 
    sentiment: string,
    intent: string
  ): number {
    let multiplier = 1.0;
    
    // 부정적 감정일 때 중요도 증가
    if (sentiment === 'negative') multiplier += 0.3;
    
    // 우려사항일 때 중요도 증가
    if (intent === 'concern') multiplier += 0.5;
    
    // 질문일 때는 중요도 감소
    if (intent === 'question') multiplier -= 0.2;
    
    // 강조 표현 검사
    if (/!!|매우|정말|너무|꼭/.test(text)) multiplier += 0.2;
    
    return keyword.finalScore * Math.max(0.5, multiplier);
  }

  /**
   * Phase 2: 선택적 AI 활용
   * 복잡한 경우만 AI 사용하여 비용 최적화
   */
  static async smartAnalyze(
    text: string, 
    options: SmartAnalysisOptions = { useAI: false, confidence: 0.7 }
  ): Promise<CodeReviewKeyword[]> {
    
    // 1단계: 전통적 분석
    const basicResult = this.enhanceTraditionalAnalysis(text);
    
    // AI 사용 여부 판단
    if (!options.useAI || !this.shouldUseAI(text, basicResult, options.confidence)) {
      return basicResult;
    }
    
    // 2단계: AI 보강 분석 (구현 시)
    try {
      // const aiResult = await AIEnhancedAnalyzer.analyzeWithAI({
      //   comments: [text]
      // });
      // return this.mergeResults(basicResult, aiResult);
      
      // 임시: AI 시뮬레이션
      return this.simulateAIEnhancement(basicResult, text);
    } catch (error) {
      console.warn('AI analysis failed, falling back to traditional:', error);
      return basicResult;
    }
  }

  private static shouldUseAI(text: string, basicResult: CodeReviewKeyword[], confidence: number): boolean {
    // AI 사용 조건
    const conditions = [
      text.length > 300,                    // 긴 텍스트
      basicResult.length === 0,             // 키워드 미발견  
      /하지만|그런데|근데|그러나/.test(text), // 복합 의견
      /질문|문의/.test(text),                // 질문 포함
      basicResult.some(k => k.finalScore < confidence) // 낮은 신뢰도
    ];
    
    return conditions.filter(Boolean).length >= 2; // 2개 이상 조건 만족시
  }

  private static simulateAIEnhancement(
    basicResult: CodeReviewKeyword[], 
    text: string
  ): CodeReviewKeyword[] {
    // AI 효과 시뮬레이션
    return basicResult.map(keyword => ({
      ...keyword,
      finalScore: keyword.finalScore * 1.2, // AI로 더 정확한 점수
      sentiment: 'suggestion' as const,      // 더 정확한 감정 분석
    }));
  }
}

// 사용 예시
export async function analyzeCodeReview(comments: string[]): Promise<CodeReviewKeyword[]> {
  const allKeywords: CodeReviewKeyword[] = [];
  
  for (const comment of comments) {
    const keywords = await SmartAnalyzer.smartAnalyze(comment, {
      useAI: process.env.NODE_ENV === 'production', // 프로덕션에서만 AI 사용
      confidence: 0.8,
      maxTokens: 1000
    });
    
    allKeywords.push(...keywords);
  }
  
  return allKeywords;
}
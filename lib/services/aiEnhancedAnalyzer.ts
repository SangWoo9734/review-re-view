/**
 * AI 기반 코드 리뷰 분석 서비스
 * GPT API를 활용한 고도화된 분석
 */

import { CodeReviewKeywordAnalyzer, type CodeReviewKeyword } from './codeReviewKeywordAnalyzer';

interface AIAnalysisRequest {
  comments: string[];
  techStack?: string[];
  projectType?: string;
}

interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  intent: 'praise' | 'concern' | 'suggestion' | 'question' | 'instruction';
  keywords: {
    text: string;
    importance: number; // 0-1
    context: string;
    category: string;
  }[];
  summary: string;
  actionItems: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    reasoning: string;
  }[];
}

export class AIEnhancedAnalyzer {
  
  /**
   * GPT를 활용한 지능형 코드 리뷰 분석
   */
  static async analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(request);
    
    // OpenAI API 호출 (실제 구현 시)
    const response = await fetch('/api/openai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, comments: request.comments })
    });
    
    return await response.json();
  }

  private static buildAnalysisPrompt(request: AIAnalysisRequest): string {
    const techStackContext = request.techStack ? 
      `기술 스택: ${request.techStack.join(', ')}` : '';
    
    return `
당신은 코드 리뷰 전문가입니다. 다음 코드 리뷰 댓글들을 분석해주세요.

${techStackContext}

분석할 댓글들:
${request.comments.join('\n---\n')}

다음 형식으로 JSON 응답해주세요:
{
  "sentiment": "positive|negative|neutral|mixed",
  "intent": "praise|concern|suggestion|question|instruction", 
  "keywords": [
    {
      "text": "키워드",
      "importance": 0.8,
      "context": "이 키워드가 사용된 맥락 설명",
      "category": "performance|security|quality|architecture"
    }
  ],
  "summary": "전체 리뷰의 핵심 요약",
  "actionItems": [
    {
      "priority": "high",
      "action": "구체적인 액션",
      "reasoning": "왜 이 액션이 필요한지"
    }
  ]
}
    `.trim();
  }

  /**
   * 하이브리드 분석: 기존 + AI 결합
   */
  static async hybridAnalysis(text: string): Promise<EnhancedAnalysisResult> {
    // 1. 기존 키워드 분석 (빠름)
    const traditionalResult = CodeReviewKeywordAnalyzer.analyzeText(text);
    
    // 2. AI 분석 (정확함) - 복잡한 경우만
    const needsAIAnalysis = this.shouldUseAI(text, traditionalResult);
    
    if (needsAIAnalysis) {
      const aiResult = await this.analyzeWithAI({
        comments: [text]
      });
      
      return this.mergeResults(traditionalResult, aiResult);
    }
    
    return this.enhanceTraditionalResult(traditionalResult);
  }

  private static shouldUseAI(text: string, basicResult: unknown[]): boolean {
    // AI 분석이 필요한 경우 판단
    return (
      text.length > 500 || // 긴 텍스트
      basicResult.length === 0 || // 키워드 미발견
      text.includes('?') || // 질문 포함
      /하지만|그런데|근데/.test(text) // 복합적 의견
    );
  }

  private static async callAIAPI(request: AIAnalysisRequest): Promise<AIAnalysisResult> {
    // TODO: 실제 AI API 호출
    console.log('AI API 호출:', request);
    
    return {
      sentiment: 'neutral',
      intent: 'suggestion',
      keywords: [],
      actionItems: [],
      summary: 'AI 분석 결과 요약'
    };
  }

  private static mergeResults(traditional: CodeReviewKeyword[], ai: AIAnalysisResult): EnhancedAnalysisResult {
    // 전통적 분석 결과와 AI 결과 병합
    return {
      keywords: traditional.map(k => ({
        ...k,
        sentiment: this.mapAISentiment(ai.sentiment),
        intent: ai.intent,
        confidence: 0.8
      })),
      sentiment: ai.sentiment,
      intent: ai.intent,
      summary: ai.summary,
      confidence: 0.8
    };
  }

  private static enhanceTraditionalResult(traditional: CodeReviewKeyword[]): EnhancedAnalysisResult {
    // 전통적 분석 결과를 강화된 형태로 변환
    return {
      keywords: traditional.map(k => ({
        ...k,
        intent: 'suggestion' as const,
        confidence: 0.6
      })),
      sentiment: 'neutral',
      intent: 'suggestion',
      confidence: 0.6
    };
  }

  private static mapAISentiment(aiSentiment: AIAnalysisResult['sentiment']): CodeReviewKeyword['sentiment'] {
    switch (aiSentiment) {
      case 'positive': return 'positive';
      case 'negative': return 'negative';
      case 'neutral': return 'neutral';
      case 'mixed': return 'suggestion';
      default: return 'neutral';
    }
  }
}

interface EnhancedAnalysisResult {
  keywords: Array<CodeReviewKeyword & {
    intent: AIAnalysisResult['intent'];
    confidence: number;
  }>;
  sentiment: AIAnalysisResult['sentiment'];
  intent: AIAnalysisResult['intent'];
  summary?: string;
  confidence: number; // AI 분석 신뢰도
}
/**
 * Google Gemini 기반 코드 리뷰 댓글 분석 서비스
 * 기존 키워드 분석을 AI로 보강하여 정확도 향상
 */

interface AIAnalysisRequest {
  comments: string[];
  existingKeywords?: string[];
}

interface AIAnalysisResult {
  enhancedKeywords: {
    text: string;
    importance: number; // 0-1
    sentiment: 'positive' | 'negative' | 'neutral' | 'concern';
    intent: 'praise' | 'suggestion' | 'question' | 'issue';
    category: 'performance' | 'security' | 'quality' | 'architecture' | 'testing' | 'documentation';
  }[];
  actionItems: {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    reasoning: string;
  }[];
  summary: string;
}

export class AIAnalyzer {
  
  /**
   * Google Gemini API를 사용한 리뷰 댓글 분석
   */
  static async analyzeComments(request: AIAnalysisRequest): Promise<AIAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(request);
    
    // TODO: npm install @google/generative-ai 필요 (완료)
    // TODO: .env.local에 GEMINI_API_KEY 추가 필요
    
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          comments: request.comments,
          model: 'gemini-1.5-flash' // 무료 티어 사용 가능
        })
      });
      
      if (!response.ok) {
        throw new Error(`AI 분석 실패: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('AI 분석 실패, 기존 분석 방식 사용:', error);
      // 폴백: 기존 분석 방식
      return this.fallbackAnalysis(request);
    }
  }

  private static buildAnalysisPrompt(request: AIAnalysisRequest): string {
    const commentsText = request.comments.join('\n---\n');
    const existingKeywords = request.existingKeywords?.join(', ') || '없음';
    
    return `
당신은 코드 리뷰 분석 전문가입니다. 다음 GitHub PR 리뷰 댓글들을 분석해주세요.

리뷰 댓글들:
${commentsText}

기존 시스템이 찾은 키워드들: ${existingKeywords}

중요: 다른 설명 없이 오직 아래 JSON 형식으로만 응답해주세요. 마크다운 코드 블록이나 추가 텍스트는 포함하지 마세요:
{
  "enhancedKeywords": [
    {
      "text": "키워드",
      "importance": 0.8,
      "sentiment": "positive|negative|neutral|concern", 
      "intent": "praise|suggestion|question|issue",
      "category": "performance|security|quality|architecture|testing|documentation"
    }
  ],
  "actionItems": [
    {
      "priority": "high|medium|low",
      "title": "구체적인 액션 제목",
      "description": "상세한 설명과 해결 방법",
      "reasoning": "왜 이 액션이 필요한지"
    }
  ],
  "summary": "전체 리뷰의 핵심 요약 (1-2문장)"
}

분석 시 고려사항:
1. 한국어와 영어 모두 고려
2. 문맥을 파악하여 감정과 의도 정확히 분류
3. 기존 키워드 외에 놓친 중요한 키워드가 있으면 추가
4. 액션 아이템은 실행 가능하고 구체적으로 작성
5. 우선순위는 보안/성능 이슈는 high, 코드 품질은 medium, 문서화는 low
`.trim();
  }

  /**
   * AI 분석 실패 시 폴백 로직
   */
  private static fallbackAnalysis(request: AIAnalysisRequest): AIAnalysisResult {
    return {
      enhancedKeywords: request.existingKeywords?.map(keyword => ({
        text: keyword,
        importance: 0.5,
        sentiment: 'neutral' as const,
        intent: 'suggestion' as const,
        category: 'quality' as const
      })) || [],
      actionItems: [{
        priority: 'medium',
        title: '코드 리뷰 내용 검토',
        description: 'AI 분석을 사용할 수 없어 기본 분석 결과입니다.',
        reasoning: 'AI 서비스 연결 실패'
      }],
      summary: '코드 리뷰 댓글들을 검토해보세요.'
    };
  }

  /**
   * 선택적 AI 사용 - 복잡한 댓글만 AI 분석
   */
  static shouldUseAI(comments: string[]): boolean {
    const text = comments.join(' ');
    
    // AI 사용 조건들
    const conditions = [
      text.length > 200,                        // 긴 텍스트
      comments.some(c => c.includes('?')),      // 질문 포함
      /하지만|그런데|근데|그러나|다만/.test(text), // 복합 의견
      /심각|중요|문제|이슈|버그/.test(text),      // 중요 키워드
      comments.length > 10                      // 많은 댓글
    ];
    
    return conditions.filter(Boolean).length >= 2;
  }
}

// 사용 예시
export async function enhancedAnalysis(comments: string[], existingKeywords: string[]) {
  // 1. AI 사용 여부 판단
  if (!AIAnalyzer.shouldUseAI(comments)) {
    console.log('간단한 댓글 - 기존 분석 사용');
    return null;
  }
  
  // 2. AI 분석 실행
  console.log('복잡한 댓글 - AI 분석 사용');
  return await AIAnalyzer.analyzeComments({
    comments,
    existingKeywords
  });
}
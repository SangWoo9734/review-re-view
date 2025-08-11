import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

function getMockAnalysis() {
  return {
    enhancedKeywords: [
      {
        text: "성능 최적화",
        importance: 0.9,
        sentiment: "concern",
        intent: "suggestion", 
        category: "performance"
      },
      {
        text: "코드 가독성",
        importance: 0.7,
        sentiment: "neutral",
        intent: "suggestion",
        category: "quality"
      }
    ],
    actionItems: [
      {
        priority: "high",
        title: "성능 병목 지점 분석",
        description: "댓글에서 언급된 성능 이슈를 분석하고 최적화 방안을 검토하세요. 특히 데이터베이스 쿼리와 메모리 사용량을 중점적으로 확인해보세요.",
        reasoning: "여러 리뷰어가 성능에 대한 우려를 표명했습니다."
      },
      {
        priority: "medium", 
        title: "코드 가독성 개선",
        description: "복잡한 로직을 더 작은 함수로 분리하고 명확한 변수명을 사용하여 가독성을 향상시키세요.",
        reasoning: "코드 리뷰에서 가독성 개선 제안이 있었습니다."
      }
    ],
    summary: "성능 최적화와 코드 가독성 개선이 주요 개선점으로 식별되었습니다."
  };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, comments, model = 'gemini-1.5-flash' } = await request.json();
    
    // API 키 확인
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.warn('GEMINI_API_KEY not configured, using mock analysis');
      return NextResponse.json(getMockAnalysis());
    }
    
    console.log('🚀 Gemini API 호출 시작 - 키 길이:', process.env.GEMINI_API_KEY.length);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const geminiModel = genAI.getGenerativeModel({ model: model });
    
    console.log('📤 Gemini에게 전송할 프롬프트:', prompt.substring(0, 100) + '...');
    
    const result = await geminiModel.generateContent([
      {
        text: prompt + '\n\n응답은 반드시 유효한 JSON 형식으로만 답변해주세요. 다른 텍스트는 포함하지 마세요.'
      }
    ]);
    
    const response = await result.response;
    const content = response.text();
    
    if (!content) {
      throw new Error('Gemini 응답에서 텍스트를 찾을 수 없습니다');
    }
    
    console.log('📥 Gemini 응답 받음:', content.substring(0, 200) + '...');
    console.log('💰 사용량 정보:', response.usageMetadata);
    
    // JSON만 추출 (Gemini는 종종 추가 텍스트를 포함함)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? jsonMatch[0] : content;
    
    const analysisResult = JSON.parse(jsonContent);
    return NextResponse.json(analysisResult);
    
  } catch (error) {
    console.error('Gemini API 에러:', error);
    console.warn('AI 분석 실패, 모의 분석으로 대체');
    return NextResponse.json(getMockAnalysis());
  }
}
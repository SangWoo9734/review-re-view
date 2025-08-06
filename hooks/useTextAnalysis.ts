import { useState, useCallback } from 'react';
import { analyzeText, AnalysisResult, KeywordData } from '@/lib/textAnalysis';
import { PullRequest } from '@/types/github';

export interface AnalysisProgress {
  step: number;
  total: number;
  currentStepName: string;
  progress: number; // 0-100
}

export interface UseTextAnalysisResult {
  isAnalyzing: boolean;
  progress: AnalysisProgress | null;
  result: AnalysisResult | null;
  error: string | null;
  startAnalysis: (prs: PullRequest[]) => Promise<void>;
  reset: () => void;
}

// 시뮬레이션용 더미 코멘트 데이터
const generateDummyComments = (prCount: number): string[] => {
  const sampleComments = [
    "이 함수의 성능을 개선할 필요가 있습니다. 특히 반복문 부분에서 O(n²) 복잡도가 발생하고 있어요.",
    "props의 타입 정의가 명확하지 않네요. TypeScript interface를 사용해서 더 명확하게 정의하면 좋을 것 같습니다.",
    "useMemo를 사용해서 불필요한 재계산을 방지하는 것이 좋겠습니다.",
    "이 컴포넌트는 너무 많은 책임을 가지고 있는 것 같아요. 단일 책임 원칙에 따라 분리하면 어떨까요?",
    "에러 핸들링이 부족합니다. try-catch 블록을 추가해주세요.",
    "이 부분은 보안상 취약점이 있을 수 있습니다. input validation을 추가해야 합니다.",
    "테스트 코드가 부족합니다. 이 함수에 대한 단위 테스트를 추가해주세요.",
    "코드 주석이 부족합니다. 복잡한 로직에 대한 설명을 추가해주세요.",
    "CSS 스타일링이 반응형이 아닙니다. 모바일 지원을 위해 media query를 추가해주세요.",
    "이 hook은 재사용 가능하도록 더 범용적으로 만들 수 있을 것 같습니다.",
    "변수명이 명확하지 않습니다. getUserData보다는 fetchUserProfile이 더 적절할 것 같아요.",
    "memory leak이 발생할 수 있는 코드입니다. useEffect cleanup을 추가해주세요.",
    "이 API 호출은 debouncing이 필요합니다. 너무 자주 호출되고 있어요.",
    "코드가 DRY 원칙을 위반하고 있습니다. 공통 함수로 추출하면 좋겠습니다.",
    "접근성(a11y) 고려가 필요합니다. aria-label을 추가해주세요.",
    "번들 사이즈를 줄이기 위해 tree shaking을 고려해보세요.",
    "이 상태 관리는 Redux보다 Context API가 더 적절할 것 같습니다.",
    "SQL injection 공격을 방지하기 위해 prepared statement를 사용해주세요.",
    "로딩 상태 처리가 부족합니다. 사용자 경험을 위해 스켈레톤 UI를 추가하면 좋겠어요.",
    "이 컴포넌트는 memoization을 통해 불필요한 리렌더링을 방지할 수 있습니다.",
  ];
  
  const comments: string[] = [];
  const commentsPerPR = Math.floor(50 / prCount); // 총 50개 정도의 코멘트를 PR 개수로 나눔
  
  for (let i = 0; i < prCount; i++) {
    for (let j = 0; j < commentsPerPR; j++) {
      const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      comments.push(randomComment);
    }
  }
  
  return comments;
};

export function useTextAnalysis(): UseTextAnalysisResult {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateAnalysisStep = (stepNumber: number, stepName: string, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const stepProgress = ((stepNumber - 1) / 4) * 100;
      
      setProgress({
        step: stepNumber,
        total: 4,
        currentStepName: stepName,
        progress: stepProgress
      });

      setTimeout(() => {
        resolve();
      }, duration);
    });
  };

  const startAnalysis = useCallback(async (prs: PullRequest[]): Promise<void> => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setResult(null);

      // Step 1: 코멘트 수집
      await simulateAnalysisStep(1, '📥 코멘트 수집', 3000);
      
      // 더미 코멘트 생성 (실제로는 GitHub API에서 수집)
      const comments = generateDummyComments(prs.length);

      // Step 2: 텍스트 전처리
      await simulateAnalysisStep(2, '🔤 텍스트 전처리', 2000);

      // Step 3: 키워드 분석
      await simulateAnalysisStep(3, '🔍 키워드 분석', 4000);

      // Step 4: 결과 생성
      await simulateAnalysisStep(4, '📊 결과 생성', 2000);

      // 실제 분석 실행
      const analysisResult = analyzeText(comments);
      
      // 최종 진행률 업데이트
      setProgress({
        step: 4,
        total: 4,
        currentStepName: '📊 결과 생성',
        progress: 100
      });

      setResult(analysisResult);
      
      // 잠깐 대기 후 완료
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      setIsAnalyzing(false);
      setProgress(null);
    }
  }, []);

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setProgress(null);
    setResult(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    progress,
    result,
    error,
    startAnalysis,
    reset
  };
}
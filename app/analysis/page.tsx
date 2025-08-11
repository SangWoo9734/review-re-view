'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PullRequest } from '@/types/github';
import { useTextAnalysis } from '@/hooks/useTextAnalysis';

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'error';
}

const analysisSteps: AnalysisStep[] = [
  {
    id: 'collect-comments',
    title: '📥 코멘트 수집',
    description: 'GitHub API에서 PR 코멘트를 수집하는 중...',
    progress: 25,
    status: 'pending',
  },
  {
    id: 'preprocess-text',
    title: '🔤 텍스트 전처리',
    description: '마크다운 제거, 토큰화, 불용어 제거 중...',
    progress: 50,
    status: 'pending',
  },
  {
    id: 'analyze-keywords',
    title: '🔍 키워드 분석',
    description: 'TF-IDF 계산 및 카테고리 분류 중...',
    progress: 75,
    status: 'pending',
  },
  {
    id: 'generate-results',
    title: '📊 결과 생성',
    description: '워드클라우드 데이터 및 액션 아이템 생성 중...',
    progress: 100,
    status: 'pending',
  },
];

function AnalysisPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPRs, setSelectedPRs] = useState<PullRequest[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  
  const { 
    isAnalyzing, 
    progress, 
    result, 
    error, 
    startAnalysis 
  } = useTextAnalysis();

  // URL에서 선택된 PR 정보 파싱
  useEffect(() => {
    const prsParam = searchParams.get('prs');
    if (prsParam) {
      try {
        const parsedPRs = JSON.parse(decodeURIComponent(prsParam));
        setSelectedPRs(parsedPRs);
        setTotalComments(parsedPRs.reduce((acc: number, pr: PullRequest) => acc + pr.commentCount, 0));
      } catch (error) {
        console.error('Failed to parse PRs:', error);
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  // 분석 시작
  useEffect(() => {
    if (selectedPRs.length > 0 && !isAnalyzing && !result && !error) {
      startAnalysis(selectedPRs);
    }
  }, [selectedPRs, isAnalyzing, result, error, startAnalysis]);

  // 분석 완료 후 결과 페이지로 이동
  useEffect(() => {
    if (result && !isAnalyzing) {
      // 분석 결과를 sessionStorage에 저장
      sessionStorage.setItem('analysisResult', JSON.stringify(result));
      sessionStorage.setItem('analyzedPRs', JSON.stringify(selectedPRs));
      
      setTimeout(() => {
        router.push('/results');
      }, 1500);
    }
  }, [result, isAnalyzing, selectedPRs, router]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      console.error('Analysis error:', error);
    }
  }, [error]);

  // 진행 상황에 따른 단계 상태 업데이트
  const currentSteps = analysisSteps.map((step, index) => {
    if (!progress) return { ...step, status: 'pending' as const };
    
    // 에러가 있으면 현재 단계를 에러로 표시
    if (error && index + 1 === progress.step) {
      return { ...step, status: 'error' as const };
    }
    
    if (index + 1 < progress.step) {
      return { ...step, status: 'completed' as const };
    } else if (index + 1 === progress.step) {
      return { ...step, status: 'running' as const };
    } else {
      return { ...step, status: 'pending' as const };
    }
  });

  const overallProgress = progress?.progress || 0;
  const currentStep = progress ? analysisSteps[progress.step - 1] : null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-h1 text-gray-900 mb-2">
              🔍 PR 코멘트 분석 중...
            </h1>
            <p className="text-gray-600">
              {selectedPRs.length}개 PR, 총 {totalComments}개 코멘트 분석 중
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">분석 진행 상황</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Overall Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-body2 text-gray-600">전체 진행률</span>
                  <span className="text-body2 font-medium text-gray-900">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-error font-medium">❌ 분석 오류</span>
                  </div>
                  <p className="text-body2 text-error">
                    {error}
                  </p>
                </div>
              )}

              {/* Steps */}
              <div className="space-y-6">
                {currentSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    {/* Step Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {step.status === 'completed' ? (
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      ) : step.status === 'running' ? (
                        <LoadingSpinner size="sm" />
                      ) : step.status === 'error' ? (
                        <div className="w-6 h-6 bg-error rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✕</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{index + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-body2 text-gray-600">
                        {step.status === 'running' ? step.description : 
                         step.status === 'completed' ? '완료됨' :
                         step.status === 'error' ? '오류 발생' : '대기 중'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Step Info */}
              {isAnalyzing && currentStep && (
                <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <LoadingSpinner size="sm" />
                    <span className="font-medium text-primary-900">
                      현재 진행 중
                    </span>
                  </div>
                  <p className="text-body2 text-primary-800">
                    {progress?.currentStepName || currentStep.description}
                  </p>
                  <p className="text-caption text-primary-700 mt-1">
                    진행률: {progress?.step || 0} / {progress?.total || 4} 단계
                  </p>
                </div>
              )}

              {/* Completion Message */}
              {result && !isAnalyzing && (
                <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-success font-medium">✅ 분석 완료</span>
                  </div>
                  <p className="text-body2 text-success-dark">
                    총 {result.keywords.length}개의 키워드와 {result.commonPhrases.length}개의 공통 구문을 분석했습니다.<br />
                    잠시 후 결과 페이지로 이동합니다...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalysisPageContent />
    </Suspense>
  );
}
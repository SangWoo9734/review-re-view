'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PullRequest } from '@/types/github';

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
    progress: 20,
    status: 'pending',
  },
  {
    id: 'preprocess-text',
    title: '🔤 텍스트 전처리',
    description: '마크다운 제거, 토큰화, 불용어 제거 중...',
    progress: 40,
    status: 'pending',
  },
  {
    id: 'analyze-keywords',
    title: '🔍 키워드 분석',
    description: 'TF-IDF 계산 및 카테고리 분류 중...',
    progress: 70,
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

export default function AnalysisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [steps, setSteps] = useState<AnalysisStep[]>(analysisSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedPRs, setSelectedPRs] = useState<PullRequest[]>([]);
  const [totalComments, setTotalComments] = useState(0);

  // URL에서 선택된 PR 정보 파싱 (실제로는 서버에서 받아와야 함)
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

  // 분석 시뮬레이션
  useEffect(() => {
    if (selectedPRs.length === 0) return;

    const runAnalysis = async () => {
      for (let i = 0; i < steps.length; i++) {
        // 현재 단계를 running으로 변경
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === i ? 'running' : index < i ? 'completed' : 'pending'
        })));
        setCurrentStepIndex(i);

        // 각 단계별 대기 시간 (실제로는 API 호출)
        const delay = i === 0 ? 3000 : i === 1 ? 2000 : i === 2 ? 4000 : 2000;
        await new Promise(resolve => setTimeout(resolve, delay));

        // 단계 완료
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index <= i ? 'completed' : 'pending'
        })));
      }

      // 분석 완료 후 결과 페이지로 이동
      setTimeout(() => {
        router.push('/results');
      }, 1000);
    };

    runAnalysis();
  }, [selectedPRs, router]);

  const currentStep = steps[currentStepIndex];
  const overallProgress = currentStepIndex > 0 ? steps[currentStepIndex - 1].progress : 0;

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

              {/* Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => (
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
              {currentStep && (
                <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <LoadingSpinner size="sm" />
                    <span className="font-medium text-primary-900">
                      현재 진행 중
                    </span>
                  </div>
                  <p className="text-body2 text-primary-800">
                    {currentStep.description}
                  </p>
                  <p className="text-caption text-primary-700 mt-1">
                    예상 소요 시간: 약 {currentStepIndex === 2 ? '30' : '10'}초
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
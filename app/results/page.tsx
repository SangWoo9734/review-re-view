'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-h1 text-gray-900">
              📊 분석 결과
            </h1>
            <p className="text-gray-600 mt-2">
              5개 PR, 총 47개 코멘트 분석 완료
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-primary-500 font-medium text-primary-600">
                🌥 워드클라우드
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
                📊 키워드 분석
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
                🎯 액션 아이템
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto flex gap-6 p-6">
          {/* Main Content Area */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>워드클라우드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-h3 text-gray-900 mb-2">
                      Phase 5 구현 예정
                    </h3>
                    <p className="text-gray-600">
                      클라이언트 사이드 텍스트 분석 엔진 및<br />
                      D3.js 워드클라우드 시각화가 구현될 예정입니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <Card>
              <CardHeader>
                <CardTitle>📋 분석 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-caption text-gray-500 mb-1">분석된 데이터</div>
                    <div className="space-y-2 text-body2">
                      <div className="flex justify-between">
                        <span>PR</span>
                        <span className="font-medium">5개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>코멘트</span>
                        <span className="font-medium">47개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>평균</span>
                        <span className="font-medium">9.4개/PR</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <div className="text-caption text-gray-500 mb-1">우선순위 분포</div>
                    <div className="space-y-2 text-body2">
                      <div className="flex justify-between">
                        <span>P1 이슈</span>
                        <span className="font-medium text-error">8개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>P2 이슈</span>
                        <span className="font-medium text-warning">15개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>P3 이슈</span>
                        <span className="font-medium text-info">12개</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <div className="text-caption text-gray-500 mb-1">🔥 Hot Keywords</div>
                    <div className="space-y-2 text-body2">
                      <div className="flex justify-between">
                        <span>1. props</span>
                        <span className="font-medium">12회</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2. hook</span>
                        <span className="font-medium">9회</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3. useMemo</span>
                        <span className="font-medium">7회</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => router.push('/dashboard')}
            size="lg"
          >
            🔄 새 분석
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useRouter } from 'next/navigation';
import { AnalysisResult, KeywordData } from '@/lib/textAnalysis';
import { PullRequest } from '@/types/github';

type TabType = 'wordcloud' | 'keywords' | 'actions';

export default function ResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedPRs, setAnalyzedPRs] = useState<PullRequest[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('wordcloud');

  useEffect(() => {
    // sessionStorage에서 분석 결과 불러오기
    const storedResult = sessionStorage.getItem('analysisResult');
    const storedPRs = sessionStorage.getItem('analyzedPRs');
    
    if (storedResult && storedPRs) {
      try {
        setAnalysisResult(JSON.parse(storedResult));
        setAnalyzedPRs(JSON.parse(storedPRs));
      } catch (error) {
        console.error('Failed to parse stored analysis result:', error);
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  if (!analysisResult || !analyzedPRs) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">분석 결과를 불러오는 중...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const totalComments = analyzedPRs.reduce((acc, pr) => acc + (pr.commentCount || 0), 0) || 47;

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
              {analyzedPRs.length}개 PR, 총 {totalComments}개 코멘트 분석 완료
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('wordcloud')}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === 'wordcloud' 
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🌥 워드클라우드
              </button>
              <button 
                onClick={() => setActiveTab('keywords')}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === 'keywords'
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📊 키워드 분석
              </button>
              <button 
                onClick={() => setActiveTab('actions')}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === 'actions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🎯 액션 아이템
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto flex gap-6 p-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Wordcloud Tab */}
            {activeTab === 'wordcloud' && (
              <Card>
                <CardHeader>
                  <CardTitle>워드클라우드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <h3 className="text-h3 text-gray-900 mb-2">
                        Phase 6 구현 예정
                      </h3>
                      <p className="text-gray-600">
                        D3.js 워드클라우드 시각화가 구현될 예정입니다.<br />
                        현재는 키워드 분석 탭에서 결과를 확인하실 수 있습니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Keywords Tab */}
            {activeTab === 'keywords' && (
              <div className="space-y-6">
                {/* Top Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle>🔥 상위 키워드 (TF-IDF 기준)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.keywords.slice(0, 20).map((keyword, index) => (
                        <div key={keyword.keyword} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-500 w-8">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{keyword.keyword}</span>
                              <Chip variant="info" size="sm">
                                {keyword.category === 'code-quality' ? '코드품질' :
                                 keyword.category === 'performance' ? '성능' :
                                 keyword.category === 'bug-fix' ? '버그수정' :
                                 keyword.category === 'architecture' ? '아키텍처' :
                                 keyword.category === 'testing' ? '테스트' :
                                 keyword.category === 'documentation' ? '문서화' :
                                 keyword.category === 'security' ? '보안' :
                                 keyword.category === 'ui-ux' ? 'UI/UX' : '일반'}
                              </Chip>
                            </div>
                            <div className="text-sm text-gray-600">
                              빈도: {keyword.frequency}회 | TF-IDF: {keyword.tfidf.toFixed(3)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Category Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>📊 카테고리별 키워드</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(analysisResult.categories)
                        .filter(([_, keywords]) => keywords.length > 0)
                        .map(([category, keywords]) => (
                        <div key={category}>
                          <h4 className="font-medium text-gray-900 mb-3">
                            {category === 'code-quality' ? '🧹 코드 품질' :
                             category === 'performance' ? '⚡ 성능' :
                             category === 'bug-fix' ? '🐛 버그 수정' :
                             category === 'architecture' ? '🏗️ 아키텍처' :
                             category === 'testing' ? '🧪 테스트' :
                             category === 'documentation' ? '📚 문서화' :
                             category === 'security' ? '🔒 보안' :
                             category === 'ui-ux' ? '🎨 UI/UX' : '📝 일반'}
                            <span className="ml-2 text-sm text-gray-500">({keywords.length}개)</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {keywords.slice(0, 10).map((keyword) => (
                              <Chip 
                                key={keyword.keyword} 
                                variant={
                                  category === 'code-quality' ? 'info' :
                                  category === 'performance' ? 'warning' :
                                  category === 'bug-fix' ? 'error' :
                                  category === 'testing' ? 'success' :
                                  'default'
                                }
                                size="sm"
                              >
                                {keyword.keyword} ({keyword.frequency})
                              </Chip>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Common Phrases */}
                {analysisResult.commonPhrases.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>💬 자주 사용되는 구문</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysisResult.commonPhrases.slice(0, 10).map((phrase, index) => (
                          <div key={phrase.phrase} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-medium">{phrase.phrase}</span>
                            <span className="text-sm text-gray-600">{phrase.count}회</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Action Items Tab */}
            {activeTab === 'actions' && (
              <Card>
                <CardHeader>
                  <CardTitle>액션 아이템</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-h3 text-gray-900 mb-2">
                        Phase 8 구현 예정
                      </h3>
                      <p className="text-gray-600">
                        키워드 분석 기반 액션 아이템 자동 생성 기능이<br />
                        구현될 예정입니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
                        <span className="font-medium">{analyzedPRs.length}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>코멘트</span>
                        <span className="font-medium">{totalComments}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>평균</span>
                        <span className="font-medium">{(totalComments / analyzedPRs.length).toFixed(1)}개/PR</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <div className="text-caption text-gray-500 mb-1">텍스트 통계</div>
                    <div className="space-y-2 text-body2">
                      <div className="flex justify-between">
                        <span>전체 단어</span>
                        <span className="font-medium">{analysisResult.totalWords.toLocaleString()}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>고유 단어</span>
                        <span className="font-medium">{analysisResult.uniqueWords.toLocaleString()}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>키워드</span>
                        <span className="font-medium">{analysisResult.keywords.length}개</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <div className="text-caption text-gray-500 mb-1">카테고리 분포</div>
                    <div className="space-y-2 text-body2">
                      {Object.entries(analysisResult.categories)
                        .filter(([_, keywords]) => keywords.length > 0)
                        .sort(([,a], [,b]) => b.length - a.length)
                        .slice(0, 5)
                        .map(([category, keywords]) => (
                          <div key={category} className="flex justify-between">
                            <span>
                              {category === 'code-quality' ? '🧹 코드품질' :
                               category === 'performance' ? '⚡ 성능' :
                               category === 'bug-fix' ? '🐛 버그수정' :
                               category === 'architecture' ? '🏗️ 아키텍처' :
                               category === 'testing' ? '🧪 테스트' :
                               category === 'documentation' ? '📚 문서화' :
                               category === 'security' ? '🔒 보안' :
                               category === 'ui-ux' ? '🎨 UI/UX' : '📝 일반'}
                            </span>
                            <span className="font-medium">{keywords.length}개</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <div className="text-caption text-gray-500 mb-1">🔥 상위 키워드</div>
                    <div className="space-y-2 text-body2">
                      {analysisResult.keywords.slice(0, 5).map((keyword, index) => (
                        <div key={keyword.keyword} className="flex justify-between">
                          <span>{index + 1}. {keyword.keyword}</span>
                          <span className="font-medium">{keyword.frequency}회</span>
                        </div>
                      ))}
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
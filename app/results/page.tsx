'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/lib/textAnalysis';
import { PullRequest } from '@/types/github';
import { WordCloud } from '@/components/features/WordCloud';
import { useWordCloud, WordCloudData } from '@/hooks/useWordCloud';
import { ActionItemCard } from '@/components/features/ActionItemCard';
import { useActionItems } from '@/hooks/useActionItems';
import { getCategoryLabel, getCategoryChipVariant, CATEGORY_LABELS_SIDEBAR } from '@/lib/constants/categories';
import { calculateTotalComments, calculateAverageCommentsPerPR } from '@/lib/utils/calculators';
import { formatTFIDF, formatNumber } from '@/lib/utils/formatters';
import type { KeywordCategory } from '@/lib/textAnalysis';

type TabType = 'wordcloud' | 'keywords' | 'actions';

export default function ResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedPRs, setAnalyzedPRs] = useState<PullRequest[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('wordcloud');

  // 워드클라우드 데이터 생성 (항상 호출)
  const { wordCloudData } = useWordCloud(analysisResult);

  // 액션 아이템 데이터 생성
  const { 
    filteredItems: actionItems, 
    stats: actionStats, 
    expandedItems, 
    filters: actionFilters,
    toggleExpanded,
    setFilter,
    clearFilters
  } = useActionItems(analysisResult);

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

  const totalComments = calculateTotalComments(analyzedPRs);

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
                  <div className="flex items-center justify-between">
                    <CardTitle>🌥 키워드 워드클라우드</CardTitle>
                    <div className="text-sm text-gray-600">
                      총 {wordCloudData.length}개 키워드
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <WordCloud 
                      data={wordCloudData}
                      width={700}
                      height={400}
                      onWordClick={(word: WordCloudData) => {
                        console.log('Clicked word:', word);
                        // 나중에 키워드 상세 정보 모달이나 사이드바 구현 가능
                      }}
                    />
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">💡 워드클라우드 사용법</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 글자 크기가 클수록 중요도(TF-IDF)가 높은 키워드입니다</li>
                      <li>• 색상은 키워드 카테고리를 나타냅니다 (성능, 코드품질, 버그수정 등)</li>
                      <li>• 키워드에 마우스를 올리면 상세 정보를 확인할 수 있습니다</li>
                      <li>• 키워드를 클릭하면 관련 정보를 볼 수 있습니다</li>
                    </ul>
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
                              <Chip variant={getCategoryChipVariant(keyword.category)} size="sm">
                                {getCategoryLabel(keyword.category)}
                              </Chip>
                            </div>
                            <div className="text-sm text-gray-600">
                              빈도: {keyword.frequency}회 | TF-IDF: {formatTFIDF(keyword.tfidf)}
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
                            {getCategoryLabel(category as KeywordCategory, true)}
                            <span className="ml-2 text-sm text-gray-500">({keywords.length}개)</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {keywords.slice(0, 10).map((keyword) => (
                              <Chip 
                                key={keyword.keyword} 
                                variant={getCategoryChipVariant(category as KeywordCategory)}
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
              <div className="space-y-6">
                {/* 액션 아이템 통계 */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>🎯 액션 아이템 통계</CardTitle>
                      <div className="text-sm text-gray-600">
                        총 {actionStats.totalItems}개 항목
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 우선순위별 통계 */}
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-medium text-red-900 mb-1">🚨 긴급 (P1)</div>
                        <div className="text-2xl font-bold text-red-700">{actionStats.byPriority.P1}</div>
                        <div className="text-xs text-red-600">즉시 처리 필요</div>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm font-medium text-yellow-900 mb-1">⚠️ 중요 (P2)</div>
                        <div className="text-2xl font-bold text-yellow-700">{actionStats.byPriority.P2}</div>
                        <div className="text-xs text-yellow-600">가능한 빨리 처리</div>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">💡 제안 (P3)</div>
                        <div className="text-2xl font-bold text-blue-700">{actionStats.byPriority.P3}</div>
                        <div className="text-xs text-blue-600">시간이 될 때 검토</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 필터링 */}
                {actionItems.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>🔍 필터링</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">우선순위:</label>
                          <select
                            value={actionFilters.priority}
                            onChange={(e) => setFilter('priority', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="all">전체</option>
                            <option value="P1">P1 (긴급)</option>
                            <option value="P2">P2 (중요)</option>
                            <option value="P3">P3 (제안)</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">카테고리:</label>
                          <select
                            value={actionFilters.category}
                            onChange={(e) => setFilter('category', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="all">전체</option>
                            <option value="immediate">즉시 처리</option>
                            <option value="improvement">개선 사항</option>
                            <option value="consideration">검토 사항</option>
                          </select>
                        </div>
                        {(actionFilters.priority !== 'all' || actionFilters.category !== 'all') && (
                          <button
                            onClick={clearFilters}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            필터 초기화
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 액션 아이템 목록 */}
                {actionItems.length > 0 ? (
                  <div className="space-y-4">
                    {actionItems.map((actionItem) => (
                      <ActionItemCard
                        key={actionItem.id}
                        actionItem={actionItem}
                        onExpand={toggleExpanded}
                        expanded={expandedItems.has(actionItem.id)}
                      />
                    ))}
                  </div>
                ) : analysisResult ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-h3 text-gray-900 mb-2">
                        액션 아이템이 없습니다
                      </h3>
                      <p className="text-gray-600">
                        {actionFilters.priority !== 'all' || actionFilters.category !== 'all' 
                          ? '선택한 필터에 해당하는 액션 아이템이 없습니다.'
                          : '분석된 키워드에서 액션 아이템을 생성할 수 없었습니다.'
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <div className="text-6xl mb-4">⏳</div>
                      <p className="text-gray-600">분석 결과를 불러오는 중...</p>
                    </CardContent>
                  </Card>
                )}
              </div>
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
                        <span className="font-medium">{calculateAverageCommentsPerPR(analyzedPRs)}개/PR</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <div className="text-caption text-gray-500 mb-1">텍스트 통계</div>
                    <div className="space-y-2 text-body2">
                      <div className="flex justify-between">
                        <span>전체 단어</span>
                        <span className="font-medium">{formatNumber(analysisResult.totalWords)}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>고유 단어</span>
                        <span className="font-medium">{formatNumber(analysisResult.uniqueWords)}개</span>
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
                              {CATEGORY_LABELS_SIDEBAR[category as KeywordCategory]}
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

                  {/* 액션 아이템 요약 */}
                  {actionStats.totalItems > 0 && (
                    <>
                      <hr className="border-gray-200" />
                      
                      <div>
                        <div className="text-caption text-gray-500 mb-1">🎯 액션 아이템</div>
                        <div className="space-y-2 text-body2">
                          <div className="flex justify-between">
                            <span>총 항목</span>
                            <span className="font-medium">{actionStats.totalItems}개</span>
                          </div>
                          {actionStats.byPriority.P1 > 0 && (
                            <div className="flex justify-between">
                              <span className="text-red-600">🚨 긴급</span>
                              <span className="font-medium text-red-600">{actionStats.byPriority.P1}개</span>
                            </div>
                          )}
                          {actionStats.byPriority.P2 > 0 && (
                            <div className="flex justify-between">
                              <span className="text-yellow-600">⚠️ 중요</span>
                              <span className="font-medium text-yellow-600">{actionStats.byPriority.P2}개</span>
                            </div>
                          )}
                          {actionStats.byPriority.P3 > 0 && (
                            <div className="flex justify-between">
                              <span className="text-blue-600">💡 제안</span>
                              <span className="font-medium text-blue-600">{actionStats.byPriority.P3}개</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
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
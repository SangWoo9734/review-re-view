'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRepositories, usePullRequests } from '@/hooks/useGitHub';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import { ErrorState, EmptyState } from '@/components/ui/ErrorState';
import { RepositoryCard } from '@/components/features/RepositoryCard';
import { PullRequestCard } from '@/components/features/PullRequestCard';
import { Repository, PullRequest } from '@/types/github';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPRs, setSelectedPRs] = useState<PullRequest[]>([]);

  const { 
    data: repositoriesData, 
    isLoading: reposLoading, 
    error: reposError, 
    refetch: refetchRepos 
  } = useRepositories({
    search: searchTerm || undefined,
    enabled: !!user,
  });

  const { 
    data: pullRequestsData, 
    isLoading: prsLoading, 
    error: prsError, 
    refetch: refetchPRs 
  } = usePullRequests(
    selectedRepo?.owner.login || '',
    selectedRepo?.name || '',
    {
      enabled: !!selectedRepo,
      state: 'all',
    }
  );

  const repositories = repositoriesData?.repositories || [];
  const pullRequests = pullRequestsData?.pulls || [];

  const handleRepositorySelect = (repo: Repository) => {
    setSelectedRepo(repo);
    setSelectedPRs([]); // 레포 변경시 선택된 PR들 초기화
  };

  const handlePRSelect = (pr: PullRequest, selected: boolean) => {
    if (selected) {
      // 최대 5개 제한
      if (selectedPRs.length >= 5) {
        return;
      }
      setSelectedPRs([...selectedPRs, pr]);
    } else {
      setSelectedPRs(selectedPRs.filter(selectedPR => selectedPR.id !== pr.id));
    }
  };

  const isPRSelected = (pr: PullRequest) => {
    return selectedPRs.some(selectedPR => selectedPR.id === pr.id);
  };

  const canSelectMore = selectedPRs.length < 5;

  const handleStartAnalysis = () => {
    if (selectedPRs.length === 0) return;
    
    // 선택된 PR 정보를 URL 파라미터로 전달
    const prsParam = encodeURIComponent(JSON.stringify(selectedPRs));
    router.push(`/analysis?prs=${prsParam}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-h3 text-gray-900">
                🏠 Review-Review
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-8 h-8 rounded-full ring-2 ring-primary-100"
                  />
                  <span className="text-body2 font-medium text-gray-700">
                    {user.login}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                로그아웃
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto flex h-[calc(100vh-152px)] relative">
          {/* Sidebar - Repository List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-h3 mb-4">📁 레포지토리</h2>
              <SearchInput
                placeholder="레포지토리 검색..."
                onSearch={setSearchTerm}
                onClear={() => setSearchTerm('')}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {reposLoading && (
                <LoadingState>레포지토리를 불러오는 중...</LoadingState>
              )}

              {reposError && (
                <ErrorState
                  title="불러오기 실패"
                  message={reposError.message}
                  onRetry={() => refetchRepos()}
                />
              )}

              {!reposLoading && !reposError && repositories.length === 0 && (
                <EmptyState
                  title={searchTerm ? "검색 결과 없음" : "레포지토리 없음"}
                  message={searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : "접근 가능한 레포지토리가 없습니다."}
                  icon="📂"
                />
              )}

              {!reposLoading && !reposError && repositories.length > 0 && (
                <div className="space-y-3">
                  {repositories.map((repo) => (
                    <RepositoryCard
                      key={repo.id}
                      repository={repo}
                      onClick={() => handleRepositorySelect(repo)}
                      selected={selectedRepo?.id === repo.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - PR List */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedRepo ? (
              <div className="flex flex-col h-full">
                {/* PR List Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="mb-4">
                    <h2 className="text-h2 text-gray-900 mb-2">
                      📋 {selectedRepo.name}
                    </h2>
                    <p className="text-gray-600">
                      분석할 PR을 선택하세요 (최대 5개)
                    </p>
                  </div>
                </div>

                {/* PR List Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {prsLoading && (
                    <LoadingState>PR 목록을 불러오는 중...</LoadingState>
                  )}

                  {prsError && (
                    <ErrorState
                      title="PR 목록 불러오기 실패"
                      message={prsError.message}
                      onRetry={() => refetchPRs()}
                    />
                  )}

                  {!prsLoading && !prsError && pullRequests.length === 0 && (
                    <EmptyState
                      title="PR이 없습니다"
                      message="이 레포지토리에는 분석할 수 있는 PR이 없습니다."
                      icon="📝"
                    />
                  )}

                  {!prsLoading && !prsError && pullRequests.length > 0 && (
                    <div className="space-y-4">
                      {pullRequests.map((pr) => (
                        <PullRequestCard
                          key={pr.id}
                          pullRequest={pr}
                          onSelect={(selected) => handlePRSelect(pr, selected)}
                          selected={isPRSelected(pr)}
                          disabled={!canSelectMore && !isPRSelected(pr)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <EmptyState
                  title="레포지토리를 선택하세요"
                  message="왼쪽에서 레포지토리를 선택하면 PR 목록을 확인할 수 있습니다."
                  icon="👈"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        {selectedPRs.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-body1 font-medium text-gray-900">
                    선택됨: {selectedPRs.length}개 PR
                  </span>
                  <span className="text-body2 text-gray-500">
                    (최대 5개)
                  </span>
                </div>
                
                <Button
                  size="lg"
                  onClick={handleStartAnalysis}
                  disabled={selectedPRs.length === 0}
                >
                  📊 분석 시작하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
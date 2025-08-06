'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRepositories } from '@/hooks/useGitHub';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import { ErrorState, EmptyState } from '@/components/ui/ErrorState';
import { RepositoryCard } from '@/components/features/RepositoryCard';
import { Repository } from '@/types/github';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { 
    data: repositoriesData, 
    isLoading, 
    error, 
    refetch 
  } = useRepositories({
    search: searchTerm || undefined,
    enabled: !!user,
  });

  const repositories = repositoriesData?.repositories || [];

  const handleRepositorySelect = (repo: Repository) => {
    setSelectedRepo(repo);
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
        <div className="max-w-7xl mx-auto flex h-[calc(100vh-80px)]">
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
              {isLoading && (
                <LoadingState>레포지토리를 불러오는 중...</LoadingState>
              )}

              {error && (
                <ErrorState
                  title="불러오기 실패"
                  message={error.message}
                  onRetry={() => refetch()}
                />
              )}

              {!isLoading && !error && repositories.length === 0 && (
                <EmptyState
                  title={searchTerm ? "검색 결과 없음" : "레포지토리 없음"}
                  message={searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : "접근 가능한 레포지토리가 없습니다."}
                  icon="📂"
                />
              )}

              {!isLoading && !error && repositories.length > 0 && (
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
          <div className="flex-1 flex flex-col">
            {selectedRepo ? (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-h2 text-gray-900 mb-2">
                    📋 {selectedRepo.name}
                  </h2>
                  <p className="text-gray-600">
                    PR 목록을 조회하여 분석할 PR을 선택하세요.
                  </p>
                </div>
                
                <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                  <h3 className="font-semibold text-info mb-2">개발 진행 중</h3>
                  <p className="text-body2 text-info/80">
                    PR 목록 조회 기능을 구현 중입니다. 곧 완성될 예정입니다!
                  </p>
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
      </div>
    </ProtectedRoute>
  );
}
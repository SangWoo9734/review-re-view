"use client";

import { PullRequestCard } from "@/components/features/PullRequestCard";
import { RepositoryCard } from "@/components/features/RepositoryCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingSpinner";
import { SearchInput } from "@/components/ui/SearchInput";
import { AIToggle, useAISettings } from "@/components/ui/AIToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useInfinitePullRequests, useInfiniteRepositories } from "@/hooks/useGitHub";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";
import { PRSelectionService } from "@/lib/services/prSelectionService";
import { PullRequest, Repository } from "@/types/github";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { enabled: aiEnabled, toggle: toggleAI } = useAISettings();
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPRs, setSelectedPRs] = useState<PullRequest[]>([]);
  const [showOnlyMyPRs, setShowOnlyMyPRs] = useState(true); // 기본값을 내 PR만 보기로 설정

  const {
    data: repositoriesData,
    isLoading: reposLoading,
    error: reposError,
    fetchNextPage: fetchNextRepos,
    hasNextPage: hasNextRepos,
    isFetchingNextPage: isFetchingNextRepos,
    refetch: refetchRepos,
  } = useInfiniteRepositories({
    search: searchTerm || undefined,
    enabled: !!user,
  });

  const {
    data: pullRequestsData,
    isLoading: prsLoading,
    error: prsError,
    fetchNextPage: fetchNextPRs,
    hasNextPage: hasNextPRs,
    isFetchingNextPage: isFetchingNextPRs,
    refetch: refetchPRs,
  } = useInfinitePullRequests(
    selectedRepo?.owner.login || "",
    selectedRepo?.name || "",
    {
      enabled: !!selectedRepo,
      state: "all",
    }
  );

  // 무한 스크롤 데이터 병합
  const repositories = repositoriesData?.pages.flatMap(page => page.repositories) || [];
  const allPullRequests = pullRequestsData?.pages.flatMap(page => page.pulls) || [];

  // 내 PR만 필터링하거나 모든 PR 표시 (비즈니스 로직 서비스 사용)
  const pullRequests = PRSelectionService.filterPRsByOwnership(
    allPullRequests,
    user?.login || "",
    showOnlyMyPRs
  );

  const handleRepositorySelect = (repo: Repository) => {
    setSelectedRepo(repo);
    setSelectedPRs([]); // 레포 변경시 선택된 PR들 초기화
  };

  const handlePRSelect = (pr: PullRequest, selected: boolean) => {
    if (selected) {
      const newSelection = PRSelectionService.addPRToSelection(selectedPRs, pr);
      if (newSelection) {
        setSelectedPRs(newSelection);
      }
    } else {
      const newSelection = PRSelectionService.removePRFromSelection(
        selectedPRs,
        pr
      );
      setSelectedPRs(newSelection);
    }
  };

  const isPRSelected = (pr: PullRequest) => {
    return selectedPRs.some((selectedPR) => selectedPR.id === pr.id);
  };

  const selectionStats = PRSelectionService.getSelectionStats(selectedPRs);
  const canSelectMore = selectionStats.canSelectMore;

  // 무한 스크롤 관찰자
  const { ref: reposScrollRef } = useInfiniteScroll(
    fetchNextRepos,
    hasNextRepos,
    isFetchingNextRepos
  );
  
  const { ref: prsScrollRef } = useInfiniteScroll(
    fetchNextPRs,
    hasNextPRs,
    isFetchingNextPRs
  );

  const handleStartAnalysis = () => {
    if (selectedPRs.length === 0) return;

    // 선택된 PR 정보를 URL 파라미터로 전달
    const prsParam = encodeURIComponent(JSON.stringify(selectedPRs));
    router.push(`/analysis?prs=${prsParam}`);
  };

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      >
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-h3 text-gray-900">🏠 Review-Review</h1>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <Image
                    width={32}
                    height={32}
                    src={user.avatar_url}
                    alt={user.login}
                    className="rounded-full ring-2 ring-primary-100"
                  />
                  <span className="text-body2 font-medium text-gray-700">
                    {user.login}
                  </span>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                로그아웃
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto flex h-[calc(100vh-152px)] relative">
          {/* Sidebar - Repository List */}
          <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-gray-100 flex flex-col shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-h3 mb-4">📁 레포지토리</h2>
              <SearchInput
                placeholder="레포지토리 검색..."
                onSearch={setSearchTerm}
                onClear={() => setSearchTerm("")}
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
                  message={
                    searchTerm
                      ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
                      : "접근 가능한 레포지토리가 없습니다."
                  }
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
                  
                  {/* 무한 스크롤 로딩 */}
                  {isFetchingNextRepos && (
                    <div className="flex justify-center py-4">
                      <LoadingState>더 많은 레포지토리 불러오는 중...</LoadingState>
                    </div>
                  )}
                  
                  {/* 무한 스크롤 관찰 영역 */}
                  <div ref={reposScrollRef} className="h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Main Content - PR List */}
          <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm">
            {selectedRepo ? (
              <div className="flex flex-col h-full">
                {/* PR List Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-h2 text-gray-900 mb-2">
                        📋 {selectedRepo.name}
                      </h2>
                      <p className="text-gray-600">
                        분석할 PR을 선택하세요 (최대 5개)
                      </p>
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex items-center gap-3">
                      <span className="text-body2 text-gray-600">
                        내 PR만 보기
                      </span>
                      <button
                        onClick={() => {
                          setShowOnlyMyPRs(!showOnlyMyPRs);
                          setSelectedPRs([]); // 필터 변경시 선택 초기화
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                          showOnlyMyPRs ? "bg-primary-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showOnlyMyPRs ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* PR Count Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>전체 PR: {allPullRequests.length}개</span>
                    {showOnlyMyPRs && (
                      <span>내 PR: {pullRequests.length}개</span>
                    )}
                    {!showOnlyMyPRs &&
                      pullRequests.length !== allPullRequests.length && (
                        <span>표시된 PR: {pullRequests.length}개</span>
                      )}
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
                      title={
                        showOnlyMyPRs ? "내 PR이 없습니다" : "PR이 없습니다"
                      }
                      message={
                        showOnlyMyPRs
                          ? allPullRequests.length > 0
                            ? "이 레포지토리에 내가 생성한 PR이 없습니다. 필터를 해제하여 다른 사람의 PR도 확인해보세요."
                            : "이 레포지토리에는 PR이 없습니다."
                          : "이 레포지토리에는 분석할 수 있는 PR이 없습니다."
                      }
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
                      
                      {/* 무한 스크롤 로딩 */}
                      {isFetchingNextPRs && (
                        <div className="flex justify-center py-4">
                          <LoadingState>더 많은 PR 불러오는 중...</LoadingState>
                        </div>
                      )}
                      
                      {/* 무한 스크롤 관찰 영역 */}
                      <div ref={prsScrollRef} className="h-4" />
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
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-body1 font-medium text-gray-900">
                      선택됨: {selectedPRs.length}개 PR
                    </span>
                    <span className="text-body2 text-gray-500">(최대 5개)</span>
                  </div>
                  
                  {/* AI 설정 토글 */}
                  <AIToggle 
                    enabled={aiEnabled} 
                    onToggle={toggleAI}
                    className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm"
                  />
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

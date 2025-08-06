'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Dashboard() {
  const { user, logout } = useAuth();

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
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                환영합니다! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  GitHub OAuth 인증이 성공적으로 완료되었습니다.<br />
                  Phase 2 기본 UI 구성이 완료되었습니다.
                </p>
                
                <div className="bg-info/10 border border-info/20 rounded-lg p-4 max-w-md mx-auto">
                  <h3 className="font-semibold text-info mb-2">다음 단계</h3>
                  <p className="text-body2 text-info/80">
                    Phase 3에서 GitHub API 연동 및 레포지토리 목록, PR 선택 기능을 구현할 예정입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
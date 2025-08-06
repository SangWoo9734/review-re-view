'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Home() {
  const { isAuthenticated, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-h1 text-gray-900">
            🔍 Review - Re-view
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <Card>
            <CardContent>
              <div className="text-center mb-8">
                <h2 className="text-h2 text-gray-900 mb-6">
                  🔍 PR 코멘트 분석으로<br />
                  더 나은 코드를 만들어보세요
                </h2>
                
                <Button
                  onClick={login}
                  size="lg"
                  className="w-full bg-gray-900 hover:bg-gray-800"
                >
                  🐙 GitHub으로 로그인하기
                </Button>
              </div>

              <div className="space-y-3 text-body2 text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>PR 코멘트를 자동으로 분석해요</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>개발 패턴을 시각적으로 보여줘요</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>맞춤형 개선 가이드를 제공해요</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-caption text-gray-600">
          <p className="mb-1">Made by SangWoo9734</p>
          <a 
            href="https://github.com/SangWoo9734" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800 hover:underline"
          >
            github.com/SangWoo9734
          </a>
        </div>
      </footer>
    </div>
  );
}

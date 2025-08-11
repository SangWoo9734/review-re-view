/**
 * AI 분석 기능 토글 컴포넌트
 */

import { useState } from 'react';

interface AIToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export function AIToggle({ enabled, onToggle, className = '' }: AIToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      onToggle(!enabled);
      // TODO: 사용자 설정을 로컬스토리지나 서버에 저장
      localStorage.setItem('ai_analysis_enabled', (!enabled).toString());
    } catch (error) {
      console.error('AI 설정 변경 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          🧠 Gemini AI 분석
        </span>
        <span className="text-xs text-gray-500">
          Google Gemini로 더 정확한 키워드 분석 (무료 1500회/월)
        </span>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          enabled ? 'bg-primary-500' : 'bg-gray-300'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      {enabled && (
        <div className="text-xs text-green-600 font-medium">
          ✨ 활성화됨
        </div>
      )}
    </div>
  );
}

// 사용자 AI 설정 관리 훅
export function useAISettings() {
  const [enabled, setEnabled] = useState(() => {
    // TODO: 초기 설정값 로드
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ai_analysis_enabled') === 'true';
    }
    return false;
  });

  const toggle = (newEnabled: boolean) => {
    setEnabled(newEnabled);
  };

  return { enabled, toggle };
}
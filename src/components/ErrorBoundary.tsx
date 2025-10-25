'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 에러가 발생하면 상태를 업데이트
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅
    console.error('🚨 ErrorBoundary: 앱 에러 발생:', error);
    console.error('🚨 ErrorBoundary: 에러 정보:', errorInfo);
    
    // 에러가 광고 관련이면 특별히 처리
    if (error.message.includes('광고') || error.message.includes('AdMob')) {
      console.error('🚨 광고 관련 에러 감지 - 앱 안정성 보장');
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback 컴포넌트가 있으면 사용
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // 기본 에러 UI
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
            <p className="text-gray-700 mb-4">
              예상치 못한 오류가 발생했습니다. 앱을 다시 시작해주세요.
            </p>
            <button
              onClick={this.resetError}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 광고 관련 에러를 안전하게 처리하는 특별한 에러 바운더리
export const AdErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
            <h2 className="text-xl font-bold text-orange-600 mb-4">광고 오류</h2>
            <p className="text-gray-700 mb-4">
              광고 시청 중 문제가 발생했습니다. 게임은 계속 진행할 수 있습니다.
            </p>
            <div className="space-y-2">
              <button
                onClick={resetError}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                계속하기
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                페이지 새로고침
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

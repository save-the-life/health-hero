/**
 * 프로모션 결과 토스트 컴포넌트
 * 메인 페이지에서 프로모션 지급 결과를 표시
 */

"use client";

import { useEffect, useState } from 'react';

interface PromotionResult {
  success: boolean;
  amount?: number;
  condition?: string;
  message?: string;
  timestamp: number;
}

export default function PromotionResultToast() {
  const [result, setResult] = useState<PromotionResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 프로모션 결과 확인
    const checkPromotionResult = () => {
      const savedResult = localStorage.getItem('promotionResult');
      if (!savedResult) return;

      try {
        const parsedResult: PromotionResult = JSON.parse(savedResult);
        
        // 5분 이내의 결과만 표시
        const now = Date.now();
        if (now - parsedResult.timestamp > 5 * 60 * 1000) {
          localStorage.removeItem('promotionResult');
          return;
        }

        setResult(parsedResult);
        setIsVisible(true);

        // 결과 표시 후 로컬 스토리지에서 제거
        localStorage.removeItem('promotionResult');

        // 5초 후 자동으로 사라짐
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      } catch (error) {
        console.error('프로모션 결과 파싱 실패:', error);
        localStorage.removeItem('promotionResult');
      }
    };

    checkPromotionResult();
  }, []);

  if (!result || !isVisible) return null;

  return (
    <div 
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down"
      style={{
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <div 
        className={`
          px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md
          border-2 max-w-sm mx-4
          ${result.success 
            ? 'bg-green-500/95 border-green-300' 
            : 'bg-red-500/95 border-red-300'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {result.success ? '🎉' : '❌'}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">
              {result.success ? '프로모션 지급 성공!' : '프로모션 지급 실패'}
            </h3>
            {result.success && result.amount && (
              <p className="text-white/90 text-sm mt-1">
                {result.amount}원의 토스 포인트를 받았어요!
              </p>
            )}
            {result.message && (
              <p className="text-white/80 text-xs mt-1">
                {result.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}


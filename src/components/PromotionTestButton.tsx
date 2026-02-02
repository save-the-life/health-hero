/**
 * 프로모션 테스트 버튼 컴포넌트
 * 테스트 프로모션 지급을 위한 버튼
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { promotionService } from '@/services/promotionService';
import { GameAuthService } from '@/services/gameAuthService';
import { useAuthStore } from '@/store/authStore';
import { Clickable } from './SoundButton';
import { PROMOTION_CONFIGS } from '@/services/promotionService';

interface PromotionTestButtonProps {
  condition?: 'FIRST_QUIZ';
}

export default function PromotionTestButton({ 
  condition = 'FIRST_QUIZ' 
}: PromotionTestButtonProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestPromotion = async () => {
    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 게임 유저 해시 가져오기
    const gameUserHash = GameAuthService.getGameUserHashFromStorage();
    if (!gameUserHash) {
      alert('게임 유저 키가 없습니다. 로그인을 다시 해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const grantResult = await promotionService.grantReward(
        user.id,
        gameUserHash,
        condition,
        true // 테스트 모드
      );

      const config = PROMOTION_CONFIGS[condition];

      // 결과를 로컬 스토리지에 저장
      const resultData = {
        success: grantResult.success,
        amount: config.amount,
        condition: config.description,
        message: grantResult.success 
          ? `${config.description} 완료! 리워드 키: ${grantResult.rewardKey?.substring(0, 15)}...`
          : promotionService.getErrorMessage(grantResult.errorCode || ''),
        timestamp: Date.now(),
      };

      localStorage.setItem('promotionResult', JSON.stringify(resultData));

      // 메인 페이지로 이동
      router.push('/game');
    } catch (error) {
      console.error('프로모션 테스트 중 오류:', error);
      
      const errorResult = {
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: Date.now(),
      };
      
      localStorage.setItem('promotionResult', JSON.stringify(errorResult));
      router.push('/game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
      <h3 className="font-bold text-sm mb-2">🧪 프로모션 테스트</h3>
      <p className="text-xs text-gray-600 mb-2">조건: {condition}</p>
      
      <Clickable
        onClick={handleTestPromotion}
        disabled={isLoading}
        className={`
          w-full px-4 py-2 rounded-lg font-medium text-sm
          ${isLoading 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
          }
          transition-all duration-200
        `}
      >
        {isLoading ? '처리 중...' : '퀴즈 풀러가기'}
      </Clickable>

      <p className="text-xs text-gray-400 mt-2">
        * 클릭하면 프로모션을 지급하고 메인으로 이동합니다
      </p>
      <p className="text-xs text-gray-400">
        * 테스트 프로모션은 실제 포인트가 지급되지 않습니다
      </p>
    </div>
  );
}


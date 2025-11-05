/**
 * 프로모션 리워드 지급 서비스
 * @apps-in-toss/web-framework의 grantPromotionRewardForGame 사용
 */

import { grantPromotionRewardForGame } from '@apps-in-toss/web-framework';
import { supabase } from '@/lib/supabase';
import { 
  PromotionCondition, 
  PromotionGrantResult, 
  PromotionConfig,
  PROMOTION_ERROR_CODES,
  PROMOTION_CODES 
} from '@/types/promotion';

/**
 * 프로모션 설정 맵
 */
export const PROMOTION_CONFIGS: Record<PromotionCondition, PromotionConfig> = {
  FIRST_LOGIN: {
    code: PROMOTION_CODES.FIRST_QUIZ, // 실제로는 FIRST_LOGIN 프로모션 코드 필요
    condition: 'FIRST_LOGIN',
    amount: 1000,
    description: '첫 로그인 완료',
  },
  FIRST_QUIZ: {
    code: PROMOTION_CODES.FIRST_QUIZ,
    condition: 'FIRST_QUIZ',
    amount: 10,
    description: '첫 퀴즈 풀리기',
  },
  TUTORIAL_COMPLETE: {
    code: PROMOTION_CODES.FIRST_QUIZ, // 실제로는 TUTORIAL 프로모션 코드 필요
    condition: 'TUTORIAL_COMPLETE',
    amount: 500,
    description: '튜토리얼 완료',
  },
  DAILY_MISSION: {
    code: PROMOTION_CODES.FIRST_QUIZ, // 실제로는 DAILY_MISSION 프로모션 코드 필요
    condition: 'DAILY_MISSION',
    amount: 100,
    description: '일일 미션 완료',
  },
  FRIEND_INVITE: {
    code: PROMOTION_CODES.FIRST_QUIZ, // 실제로는 FRIEND_INVITE 프로모션 코드 필요
    condition: 'FRIEND_INVITE',
    amount: 500,
    description: '친구 초대',
  },
};

class PromotionService {
  /**
   * 중복 지급 여부 확인
   */
  async checkAlreadyGranted(
    userId: string,
    gameUserHash: string,
    condition: PromotionCondition
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('promotion_records')
        .select('id')
        .eq('user_id', userId)
        .eq('game_user_hash', gameUserHash)
        .eq('condition_type', condition)
        .eq('status', 'SUCCESS')
        .limit(1);

      if (error) {
        console.error('[PromotionService] 중복 체크 실패:', error);
        return false; // 에러 시 안전하게 false 반환
      }

      return (data?.length ?? 0) > 0;
    } catch (error) {
      console.error('[PromotionService] 중복 체크 예외:', error);
      return false;
    }
  }

  /**
   * 프로모션 지급 기록 저장
   */
  async savePromotionRecord(
    userId: string,
    gameUserHash: string,
    config: PromotionConfig,
    result: {
      success: boolean;
      rewardKey?: string;
      errorCode?: string;
      message?: string;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('promotion_records')
        .insert({
          user_id: userId,
          game_user_hash: gameUserHash,
          promotion_code: config.code,
          condition_type: config.condition,
          amount: config.amount,
          reward_key: result.rewardKey,
          status: result.success ? 'SUCCESS' : 'FAILED',
          error_code: result.errorCode,
          error_message: result.message,
          granted_at: result.success ? new Date().toISOString() : null,
        });

      if (error) {
        console.error('[PromotionService] 기록 저장 실패:', error);
      }
    } catch (error) {
      console.error('[PromotionService] 기록 저장 예외:', error);
    }
  }

  /**
   * 프로모션 리워드 지급
   */
  async grantReward(
    userId: string,
    gameUserHash: string,
    condition: PromotionCondition,
    isTest: boolean = false
  ): Promise<PromotionGrantResult> {
    console.log(`🎁 [PromotionService] 리워드 지급 시작:`, {
      userId,
      gameUserHash,
      condition,
      isTest,
    });

    // 1. 중복 지급 확인
    const alreadyGranted = await this.checkAlreadyGranted(
      userId,
      gameUserHash,
      condition
    );

    if (alreadyGranted) {
      console.warn('[PromotionService] 이미 지급된 프로모션입니다.');
      return {
        success: false,
        errorCode: PROMOTION_ERROR_CODES.ALREADY_GRANTED,
        message: '이미 지급받은 프로모션입니다.',
      };
    }

    // 2. 프로모션 설정 가져오기
    const config = PROMOTION_CONFIGS[condition];
    if (!config) {
      console.error('[PromotionService] 프로모션 설정을 찾을 수 없습니다:', condition);
      return {
        success: false,
        errorCode: PROMOTION_ERROR_CODES.PROMOTION_NOT_FOUND,
        message: '프로모션 설정을 찾을 수 없습니다.',
      };
    }

    // 3. 테스트 모드인 경우 테스트 프로모션 코드 사용
    const promotionCode = isTest 
      ? PROMOTION_CODES.TEST_FIRST_QUIZ 
      : config.code;

    console.log('[PromotionService] 프로모션 지급 요청:', {
      promotionCode,
      amount: config.amount,
    });

    // 4. 토스 SDK를 통한 리워드 지급
    try {
      const result = await grantPromotionRewardForGame({
        params: {
          promotionCode,
          amount: config.amount,
        },
      });

      // 5. 결과 처리
      if (!result) {
        // 지원하지 않는 앱 버전
        console.warn('[PromotionService] 지원하지 않는 앱 버전입니다.');
        const failResult = {
          success: false,
          errorCode: PROMOTION_ERROR_CODES.UNSUPPORTED_VERSION,
          message: '지원하지 않는 앱 버전입니다. 토스 앱을 업데이트해주세요.',
        };
        await this.savePromotionRecord(userId, gameUserHash, config, failResult);
        return failResult;
      }

      if (result === 'ERROR') {
        // 알 수 없는 오류
        console.error('[PromotionService] 알 수 없는 오류가 발생했습니다.');
        const failResult = {
          success: false,
          errorCode: PROMOTION_ERROR_CODES.UNKNOWN_ERROR,
          message: '알 수 없는 오류가 발생했습니다.',
        };
        await this.savePromotionRecord(userId, gameUserHash, config, failResult);
        return failResult;
      }

      if ('key' in result) {
        // 성공
        console.log('✅ [PromotionService] 포인트 지급 성공!', result.key);
        const successResult = {
          success: true,
          rewardKey: result.key,
        };
        await this.savePromotionRecord(userId, gameUserHash, config, successResult);
        return successResult;
      }

      if ('errorCode' in result) {
        // 실패 (에러 코드 있음)
        console.error('[PromotionService] 포인트 지급 실패:', result.errorCode, result.message);
        const failResult = {
          success: false,
          errorCode: result.errorCode,
          message: result.message,
        };
        await this.savePromotionRecord(userId, gameUserHash, config, failResult);
        return failResult;
      }

      // 예상치 못한 응답
      console.error('[PromotionService] 예상치 못한 응답:', result);
      const failResult = {
        success: false,
        errorCode: PROMOTION_ERROR_CODES.UNKNOWN_ERROR,
        message: '예상치 못한 응답입니다.',
      };
      await this.savePromotionRecord(userId, gameUserHash, config, failResult);
      return failResult;
    } catch (error) {
      console.error('[PromotionService] 프로모션 지급 중 예외 발생:', error);
      const failResult = {
        success: false,
        errorCode: PROMOTION_ERROR_CODES.UNKNOWN_ERROR,
        message: error instanceof Error ? error.message : '프로모션 지급 중 오류가 발생했습니다.',
      };
      await this.savePromotionRecord(userId, gameUserHash, config, failResult);
      return failResult;
    }
  }

  /**
   * 사용자별 프로모션 지급 내역 조회
   */
  async getPromotionHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('promotion_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[PromotionService] 히스토리 조회 실패:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[PromotionService] 히스토리 조회 예외:', error);
      return [];
    }
  }

  /**
   * 에러 코드에 따른 사용자 친화적 메시지 반환
   */
  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case PROMOTION_ERROR_CODES.NOT_GAME_APP:
        return '게임 앱에서만 사용할 수 있습니다.';
      case PROMOTION_ERROR_CODES.PROMOTION_NOT_FOUND:
        return '프로모션을 찾을 수 없습니다.';
      case PROMOTION_ERROR_CODES.PROMOTION_NOT_RUNNING:
        return '진행 중인 프로모션이 아닙니다.';
      case PROMOTION_ERROR_CODES.REWARD_GRANT_FAILED:
        return '리워드 지급에 실패했습니다. 잠시 후 다시 시도해주세요.';
      case PROMOTION_ERROR_CODES.INSUFFICIENT_BUDGET:
        return '프로모션 예산이 부족합니다. 관리자에게 문의해주세요.';
      case PROMOTION_ERROR_CODES.AMOUNT_EXCEEDED:
        return '1회 지급 금액을 초과했습니다.';
      case PROMOTION_ERROR_CODES.BUDGET_EXCEEDED:
        return '최대 지급 금액이 예산을 초과했습니다.';
      case PROMOTION_ERROR_CODES.UNSUPPORTED_VERSION:
        return '토스 앱을 최신 버전으로 업데이트해주세요.';
      case PROMOTION_ERROR_CODES.ALREADY_GRANTED:
        return '이미 지급받은 프로모션입니다.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  }
}

export const promotionService = new PromotionService();


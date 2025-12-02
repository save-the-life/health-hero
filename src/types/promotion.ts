/**
 * 프로모션 관련 타입 정의
 */

/**
 * 프로모션 코드 상수
 */
export const PROMOTION_CODES = {
  // 테스트 프로모션
  TEST_FIRST_QUIZ: 'TEST_01K98ST5FF47JE9WMASGHF45D0',

  // 실제 프로모션 (검토 승인 후 사용)
  FIRST_QUIZ: '01K98ST5FF47JE9WMASGHF45D0',
} as const;

/**
 * 프로모션 지급 조건 타입
 */
export type PromotionCondition =
  | 'FIRST_LOGIN'      // 첫 로그인
  | 'FIRST_QUIZ'       // 첫 퀴즈 완료
  | 'TUTORIAL_COMPLETE' // 튜토리얼 완료
  | 'DAILY_MISSION'    // 일일 미션
  | 'FRIEND_INVITE'    // 친구 초대
  | 'ATTENDANCE_3DAY'; // 3일 연속 출석

/**
 * 프로모션 지급 결과 타입
 */
export interface PromotionGrantResult {
  success: boolean;
  rewardKey?: string;
  errorCode?: string;
  message?: string;
}

/**
 * 프로모션 지급 기록
 */
export interface PromotionRecord {
  id: string;
  user_id: string;
  game_user_hash: string;
  promotion_code: string;
  condition_type: PromotionCondition;
  amount: number;
  reward_key?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  error_code?: string;
  error_message?: string;
  granted_at: string;
  created_at: string;
}

/**
 * 프로모션 설정
 */
export interface PromotionConfig {
  code: string;
  condition: PromotionCondition;
  amount: number;
  description: string;
  isTest?: boolean;
}

/**
 * 프로모션 에러 코드
 */
export const PROMOTION_ERROR_CODES = {
  NOT_GAME_APP: '40000',
  PROMOTION_NOT_FOUND: '4100',
  PROMOTION_NOT_RUNNING: '4109',
  REWARD_GRANT_FAILED: '4110',
  REWARD_NOT_FOUND: '4111',
  INSUFFICIENT_BUDGET: '4112',
  AMOUNT_EXCEEDED: '4114',
  BUDGET_EXCEEDED: '4116',
  UNKNOWN_ERROR: 'ERROR',
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
  ALREADY_GRANTED: 'ALREADY_GRANTED', // 중복 지급
} as const;

export type PromotionErrorCode = typeof PROMOTION_ERROR_CODES[keyof typeof PROMOTION_ERROR_CODES];


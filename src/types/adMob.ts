// 광고 관련 타입 정의

// 새로운 광고 API 타입 정의
export interface LoadAdMobParams {
  options: {
    adGroupId: string;
  };
  onEvent: (event: LoadAdMobEvent) => void;
  onError: (reason: unknown) => void;
}

export interface LoadAdMobEvent {
  type: 'loaded';
  data?: unknown;
}

export interface ShowAdMobParams {
  options: {
    adGroupId: string;
  };
  onEvent: (event: ShowAdMobEvent) => void;
  onError: (reason: unknown) => void;
}

export interface ShowAdMobEvent {
  type: 'requested' | 'clicked' | 'dismissed' | 'failedToShow' | 'impression' | 'show' | 'userEarnedReward';
  data?: {
    unitType: string;
    unitAmount: number;
  };
}

// 광고 타입 정의 (헬스 히어로 프로젝트용)
export type AdType = 'HEART_REFILL';

// 광고 보상 결과 타입
export interface AdRewardResult {
  success: boolean;
  message?: string;
  current_hearts?: number;
  ad_views_today?: number;
  error?: boolean;
  errorDetails?: unknown;
}

// Toss Ad 2.0 - 새로운 광고 그룹 ID 체계
export const AD_GROUP_IDS = {
  HEART_REFILL: process.env.NEXT_PUBLIC_AD_GROUP_HEART_REFILL || 'ait.live.50bf52c3ee9144f6',
} as const;

// 플랫폼 감지
export const getPlatform = (): 'android' | 'ios' | 'web' => {
  if (typeof window === 'undefined') return 'web';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (/android/.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  return 'web';
};

// 새로운 API용 adGroupId 가져오기 함수
export const getAdGroupId = (adType: AdType): string => {
  const adGroupId = AD_GROUP_IDS[adType];
  if (!adGroupId) {
    throw new Error(`광고 그룹 ID가 설정되지 않았습니다: ${adType}. .env.local 파일에서 NEXT_PUBLIC_AD_GROUP_${adType}를 확인해주세요.`);
  }
  return adGroupId;
};

// 광고 상태 타입
export type AdLoadStatus = 'not_loaded' | 'loading' | 'loaded' | 'failed' | 'cleaning';

// 광고 인스턴스 정보 타입
export interface AdInstance {
  cleanup: (() => void) | null;
  adGroupId: string;
  isReady: boolean;
  pendingPromise: {
    resolve: (value: AdRewardResult) => void;
    reject: (reason: unknown) => void;
  } | null;
  lastAdTime?: number; // 마지막 광고 시청 시간
}

// 광고 타입별 인스턴스 관리 타입
export type AdInstances = {
  [K in AdType]: AdInstance;
};

// 광고 훅 반환 타입
export interface UseAdMobReturn {
  // 개별 광고 타입별 상태 및 함수
  getAdStatus: (adType: AdType) => AdLoadStatus;
  loadAd: (adType: AdType) => Promise<void>;
  showAd: (adType: AdType) => Promise<AdRewardResult>;
  isSupported: boolean;
  autoLoadAd: (adType: AdType) => Promise<void>;
  reloadAd: (adType: AdType) => Promise<void>;
  resetAdInstance: (adType: AdType) => void;
  
  // 전체 광고 관리 함수
  resetAllAdInstances: () => void;
  loadAllAds: () => Promise<void>;
}

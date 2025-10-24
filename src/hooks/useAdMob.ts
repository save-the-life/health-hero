"use client";

import { useRef, useCallback } from "react";

// 앱인토스 광고 SDK 타입 정의
declare global {
  interface Window {
    appsInToss?: {
      GoogleAdMob: {
        loadAppsInTossAdMob: {
          isSupported: () => boolean;
          (params: {
            options: { adGroupId: string };
            onEvent: (event: AdEvent) => void;
            onError: (error: AdError) => void;
          }): () => void;
        };
        showAppsInTossAdMob: {
          isSupported: () => boolean;
          (params: {
            options: { adGroupId: string };
            onEvent: (event: AdEvent) => void;
            onError: (error: AdError) => void;
          }): void;
        };
      };
    };
  }
}

// 광고 이벤트 타입
interface AdEvent {
  type: 'loaded' | 'failed' | 'show' | 'userEarnedReward' | 'dismissed' | 'failedToShow';
  data?: unknown;
}

// 광고 에러 타입
interface AdError {
  code?: string | number;
  message?: string;
  details?: unknown;
}

// 광고 타입 정의 (현재는 하트 충전만)
export type AdType = "HEART_REFILL";

// 광고 상태 타입
export type AdLoadStatus = 
  | "not_loaded" 
  | "loading" 
  | "loaded" 
  | "failed" 
  | "cleaning";

// 광고 인스턴스 인터페이스
interface AdInstance {
  status: AdLoadStatus;
  cleanup?: () => void;
  lastUsed: number;
  pendingPromise?: {
    resolve: (value: AdResult) => void;
    reject: (error: Error) => void;
  };
}

// 광고 결과 타입
interface AdResult {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: boolean;
}

// useAdMob 훅 반환 타입
interface UseAdMobReturn {
  getAdStatus: (adType: AdType) => AdLoadStatus;
  loadAd: (adType: AdType) => Promise<void>;
  showAd: (adType: AdType) => Promise<AdResult>;
  isSupported: boolean;
  autoLoadAd: (adType: AdType) => Promise<void>;
  reloadAd: (adType: AdType) => Promise<void>;
  resetAdInstance: (adType: AdType) => void;
}

// 광고 그룹 ID 매핑 (환경변수에서 가져오기)
const getAdGroupId = (adType: AdType): string => {
  switch (adType) {
    case "HEART_REFILL":
      return process.env.NEXT_PUBLIC_AD_GROUP_HEART_REFILL || "health-hero-heart-refill";
    default:
      throw new Error(`Unknown ad type: ${adType}`);
  }
};

export const useAdMob = (userId?: string): UseAdMobReturn => {
  // 광고 인스턴스들을 저장하는 ref
  const adInstances = useRef<Map<AdType, AdInstance>>(new Map());

  // 광고 지원 여부 확인
  const isSupported = useCallback(() => {
    return typeof window !== "undefined" && 
           window.appsInToss?.GoogleAdMob?.loadAppsInTossAdMob?.isSupported() === true;
  }, []);

  // 광고 상태 조회
  const getAdStatus = useCallback((adType: AdType): AdLoadStatus => {
    const instance = adInstances.current.get(adType);
    return instance?.status || "not_loaded";
  }, []);

  // 광고 인스턴스 리셋
  const resetAdInstance = useCallback((adType: AdType) => {
    const instance = adInstances.current.get(adType);
    if (instance?.cleanup) {
      instance.cleanup();
    }
    adInstances.current.delete(adType);
  }, []);

  // 광고 로드
  const loadAd = useCallback(async (adType: AdType): Promise<void> => {
    if (!isSupported()) {
      throw new Error("광고를 지원하지 않는 환경입니다.");
    }

    // 이미 로드 중이거나 로드된 경우 스킵
    const currentStatus = getAdStatus(adType);
    if (currentStatus === "loading" || currentStatus === "loaded") {
      return;
    }

    // 인스턴스 상태를 loading으로 설정
    const instance: AdInstance = {
      status: "loading",
      lastUsed: 0,
    };
    adInstances.current.set(adType, instance);

    const adGroupId = getAdGroupId(adType);

    try {
      const cleanup = window.appsInToss!.GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId },
        onEvent: (event) => {
          console.log(`[${adType}] 광고 이벤트:`, event);
          
          switch (event.type) {
            case "loaded":
              console.log(`[${adType}] 광고 로드 성공`);
              instance.status = "loaded";
              instance.cleanup = cleanup;
              break;
            case "failed":
              console.log(`[${adType}] 광고 로드 실패:`, event.data);
              instance.status = "failed";
              break;
          }
        },
        onError: (error) => {
          console.error(`[${adType}] 광고 로드 에러:`, error);
          instance.status = "failed";
        },
      });

      // 로드 실패 시 cleanup 호출
      if (instance.status === "failed") {
        cleanup();
      }
    } catch (error) {
      console.error(`[${adType}] 광고 로드 예외:`, error);
      instance.status = "failed";
    }
  }, [isSupported, getAdStatus]);

  // 광고 표시
  const showAd = useCallback(async (adType: AdType): Promise<AdResult> => {
    if (!isSupported()) {
      throw new Error("광고를 지원하지 않는 환경입니다.");
    }

    const instance = adInstances.current.get(adType);
    if (!instance || instance.status !== "loaded") {
      throw new Error("광고가 로드되지 않았습니다. 먼저 광고를 로드해주세요.");
    }

    // 연속 시청 방지 (최소 3초 간격)
    const now = Date.now();
    if (now - instance.lastUsed < 3000) {
      throw new Error("광고 시청 간격이 너무 짧습니다. 잠시 후 다시 시도해주세요.");
    }

    // 상태를 cleaning으로 변경
    instance.status = "cleaning";
    instance.lastUsed = now;

    return new Promise((resolve, reject) => {
      instance.pendingPromise = { resolve, reject };

      const adGroupId = getAdGroupId(adType);

      // 타임아웃 설정 (45초)
      const timeout = setTimeout(() => {
        if (instance.pendingPromise) {
          instance.pendingPromise.resolve({
            success: false,
            error: true,
            message: "광고 시청 시간이 초과되었습니다.",
          });
        }
      }, 45000);

      window.appsInToss!.GoogleAdMob.showAppsInTossAdMob({
        options: { adGroupId },
        onEvent: (event) => {
          console.log(`[${adType}] 광고 표시 이벤트:`, event);
          
          switch (event.type) {
            case "show":
              console.log(`[${adType}] 광고 표시 시작`);
              break;
            case "userEarnedReward":
              console.log(`[${adType}] 광고 보상 획득:`, event.data);
              clearTimeout(timeout);
              
              // Supabase RPC 함수로 하트 충전 처리
              if (!userId) {
                instance.pendingPromise?.resolve({
                  success: false,
                  message: "사용자 정보를 찾을 수 없습니다.",
                });
                return;
              }

              import('@/services/adService').then(({ addHeartByAd }) => {
                addHeartByAd(userId)
                  .then(result => {
                    if (result.success) {
                      instance.pendingPromise?.resolve({
                        success: true,
                        message: result.message || "하트를 획득했습니다!",
                        data: result.data,
                      });
                    } else {
                      instance.pendingPromise?.resolve({
                        success: false,
                        message: result.message || "하트 획득에 실패했습니다.",
                      });
                    }
                  })
                  .catch(error => {
                    console.error(`[${adType}] 하트 충전 에러:`, error);
                    instance.pendingPromise?.resolve({
                      success: false,
                      message: "하트 획득 중 오류가 발생했습니다.",
                    });
                  });
              });
              break;
            case "dismissed":
              console.log(`[${adType}] 광고 닫힘`);
              clearTimeout(timeout);
              
              // 광고를 닫았지만 보상을 받지 않은 경우
              if (instance.pendingPromise) {
                instance.pendingPromise.resolve({
                  success: false,
                  message: "광고를 완전히 시청하지 않았습니다.",
                });
              }
              break;
            case "failedToShow":
              console.log(`[${adType}] 광고 표시 실패:`, event.data);
              clearTimeout(timeout);
              
              if (instance.pendingPromise) {
                instance.pendingPromise.reject(new Error("광고 표시에 실패했습니다."));
              }
              break;
          }
        },
        onError: (error) => {
          console.error(`[${adType}] 광고 표시 에러:`, error);
          clearTimeout(timeout);
          
          if (instance.pendingPromise) {
            // AdError를 Error 객체로 변환
            const errorMessage = error.message || `광고 표시 에러 (코드: ${error.code || 'unknown'})`;
            instance.pendingPromise.reject(new Error(errorMessage));
          }
        },
      });
    });
  }, [isSupported, userId]);

  // 자동 로드 (이미 로드된 경우 스킵)
  const autoLoadAd = useCallback(async (adType: AdType): Promise<void> => {
    const status = getAdStatus(adType);
    if (status === "not_loaded" || status === "failed") {
      await loadAd(adType);
    }
  }, [getAdStatus, loadAd]);

  // 광고 재로드 (리셋 후 로드)
  const reloadAd = useCallback(async (adType: AdType): Promise<void> => {
    resetAdInstance(adType);
    await loadAd(adType);
  }, [resetAdInstance, loadAd]);

  return {
    getAdStatus,
    loadAd,
    showAd,
    isSupported: isSupported(),
    autoLoadAd,
    reloadAd,
    resetAdInstance,
  };
};

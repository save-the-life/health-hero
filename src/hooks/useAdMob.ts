"use client";

import { useRef, useCallback } from "react";

// 앱인토스 광고 SDK 타입 정의 (공식 문서 기준)
declare global {
  interface Window {
    appsInToss?: {
      GoogleAdMob: {
        loadAppsInTossAdMob: {
          isSupported: () => boolean;
          (params: {
            options: { adGroupId: string };
            onEvent: (event: LoadAdEvent) => void;
            onError: (error: AdError) => void;
          }): () => void;
        };
        showAppsInTossAdMob: {
          isSupported: () => boolean;
          (params: {
            options: { adGroupId: string };  // ✅ adGroupId로 통일 (공식 문서 기준)
            onEvent: (event: ShowAdEvent) => void;
            onError: (error: AdError) => void;
          }): void;
        };
      };
    };
  }
}

// 광고 로드 이벤트 타입 (공식 문서 기준)
// type LoadAdMobEvent = AdMobFullScreenEvent | { type: 'loaded' }
// AdMobFullScreenEvent = 'clicked' | 'dismissed' | 'failedToShow' | 'impression' | 'show'
type LoadAdEvent =
  | { type: 'loaded'; data?: unknown }  // ResponseInfo 객체
  | { type: 'clicked'; data?: unknown }
  | { type: 'dismissed'; data?: unknown }
  | { type: 'failedToShow'; data?: unknown }
  | { type: 'impression'; data?: unknown }
  | { type: 'show'; data?: unknown };

// 광고 표시 이벤트 타입 (공식 문서 기준)
// type ShowAdMobEvent = { type: 'requested' } | { type: 'clicked' } | ...
type ShowAdEvent =
  | { type: 'requested'; data?: unknown }
  | { type: 'clicked'; data?: unknown }
  | { type: 'dismissed'; data?: unknown }
  | { type: 'failedToShow'; data?: unknown }
  | { type: 'impression'; data?: unknown }
  | { type: 'show'; data?: unknown }
  | {
      type: 'userEarnedReward';  // 보상형 광고만 사용 가능
      data: {
        unitType: string;
        unitAmount: number;
      };
    };

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
  console.log("🎣 useAdMob 훅 초기화 - userId:", userId);
  
  // 광고 인스턴스들을 저장하는 ref
  const adInstances = useRef<Map<AdType, AdInstance>>(new Map());

  // 광고 지원 여부 확인
  const isSupported = useCallback(() => {
    console.log("🔍 useAdMob isSupported 함수 호출됨");
    
    const loadSupported = typeof window !== "undefined" && 
           window.appsInToss?.GoogleAdMob?.loadAppsInTossAdMob?.isSupported() === true;
    const showSupported = typeof window !== "undefined" && 
           window.appsInToss?.GoogleAdMob?.showAppsInTossAdMob?.isSupported() === true;
    
    const supported = loadSupported && showSupported;
    
    console.log("🔍 광고 지원 여부 확인:");
    console.log("- window 존재:", typeof window !== "undefined");
    console.log("- appsInToss 존재:", typeof window !== "undefined" && !!window.appsInToss);
    console.log("- GoogleAdMob 존재:", typeof window !== "undefined" && !!window.appsInToss?.GoogleAdMob);
    console.log("- loadAppsInTossAdMob 존재:", typeof window !== "undefined" && !!window.appsInToss?.GoogleAdMob?.loadAppsInTossAdMob);
    console.log("- showAppsInTossAdMob 존재:", typeof window !== "undefined" && !!window.appsInToss?.GoogleAdMob?.showAppsInTossAdMob);
    console.log("- loadAppsInTossAdMob.isSupported() 결과:", typeof window !== "undefined" && window.appsInToss?.GoogleAdMob?.loadAppsInTossAdMob ? window.appsInToss.GoogleAdMob.loadAppsInTossAdMob.isSupported() : "undefined");
    console.log("- showAppsInTossAdMob.isSupported() 결과:", typeof window !== "undefined" && window.appsInToss?.GoogleAdMob?.showAppsInTossAdMob ? window.appsInToss.GoogleAdMob.showAppsInTossAdMob.isSupported() : "undefined");
    console.log("- loadSupported:", loadSupported);
    console.log("- showSupported:", showSupported);
    console.log("- 전체 지원 여부:", supported);
    
    return supported;
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
    console.log(`📡 광고 로드 시작 - 타입: ${adType}`);
    
    if (typeof window === "undefined" || 
        window.appsInToss?.GoogleAdMob?.loadAppsInTossAdMob?.isSupported() !== true) {
      console.error("❌ 광고 로드를 지원하지 않는 환경입니다.");
      throw new Error("광고를 지원하지 않는 환경입니다.");
    }

    // 이미 로드 중이거나 로드된 경우 스킵
    const currentStatus = getAdStatus(adType);
    console.log(`📊 현재 광고 상태: ${currentStatus}`);
    
    if (currentStatus === "loading" || currentStatus === "loaded") {
      console.log("⏭️ 이미 로드 중이거나 로드됨 - 스킵");
      return;
    }

    // 인스턴스 상태를 loading으로 설정
    const instance: AdInstance = {
      status: "loading",
      lastUsed: 0,
    };
    adInstances.current.set(adType, instance);
    console.log("🔄 광고 인스턴스 상태를 loading으로 설정");

    const adGroupId = getAdGroupId(adType);
    console.log(`🎯 광고 그룹 ID: ${adGroupId}`);

    try {
      console.log("📺 Apps-in-Toss AdMob 로드 요청");
      const cleanup = window.appsInToss!.GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId },
        onEvent: (event) => {
          console.log(`[${adType}] 광고 로드 이벤트:`, event);

          // 공식 문서: LoadAdMobEvent = AdMobFullScreenEvent | { type: 'loaded' }
          switch (event.type) {
            case "loaded":
              console.log(`[${adType}] 광고 로드 성공`, event.data);
              instance.status = "loaded";
              instance.cleanup = cleanup;
              break;
            case "clicked":
              console.log(`[${adType}] 광고 로드 중 클릭됨`);
              break;
            case "dismissed":
              console.log(`[${adType}] 광고 로드 중 닫힘`);
              break;
            case "failedToShow":
              console.log(`[${adType}] 광고 로드 중 표시 실패`, event.data);
              instance.status = "failed";
              break;
            case "impression":
              console.log(`[${adType}] 광고 로드 중 노출됨`);
              break;
            case "show":
              console.log(`[${adType}] 광고 로드 중 보여짐`);
              break;
          }
        },
        onError: (error) => {
          console.error(`[${adType}] 광고 로드 에러:`, error);
          instance.status = "failed";
          // cleanup 함수 호출하여 리소스 정리
          cleanup();
        },
      });
    } catch (error) {
      console.error(`[${adType}] 광고 로드 예외:`, error);
      instance.status = "failed";
    }
  }, [getAdStatus]);

  // 광고 표시
  const showAd = useCallback(async (adType: AdType): Promise<AdResult> => {
    console.log(`🎬 광고 표시 시작 - 타입: ${adType}`);
    
    if (typeof window === "undefined" || 
        window.appsInToss?.GoogleAdMob?.showAppsInTossAdMob?.isSupported() !== true) {
      console.error("❌ 광고 표시를 지원하지 않는 환경입니다.");
      throw new Error("광고를 지원하지 않는 환경입니다.");
    }

    const instance = adInstances.current.get(adType);
    console.log(`📊 광고 인스턴스 상태:`, instance?.status);
    
    if (!instance || instance.status !== "loaded") {
      console.error("❌ 광고가 로드되지 않았습니다.");
      throw new Error("광고가 로드되지 않았습니다. 먼저 광고를 로드해주세요.");
    }

    // 연속 시청 방지 (최소 3초 간격)
    const now = Date.now();
    const timeSinceLastUse = now - instance.lastUsed;
    console.log(`⏰ 마지막 사용 후 경과 시간: ${timeSinceLastUse}ms`);
    
    if (timeSinceLastUse < 3000) {
      console.error("❌ 광고 시청 간격이 너무 짧습니다.");
      throw new Error("광고 시청 간격이 너무 짧습니다. 잠시 후 다시 시도해주세요.");
    }

    // 상태를 cleaning으로 변경
    instance.status = "cleaning";
    instance.lastUsed = now;
    console.log("🔄 광고 인스턴스 상태를 cleaning으로 변경");

    return new Promise((resolve, reject) => {
      instance.pendingPromise = { resolve, reject };

      const adGroupId = getAdGroupId(adType);
      console.log(`🎯 광고 그룹 ID: ${adGroupId}`);

      // 타임아웃 설정 (45초)
      const timeout = setTimeout(() => {
        console.log("⏰ 광고 시청 타임아웃 (45초)");
        if (instance.pendingPromise) {
          instance.pendingPromise.resolve({
            success: false,
            error: true,
            message: "광고 시청 시간이 초과되었습니다.",
          });
        }
      }, 45000);

      console.log("📺 Apps-in-Toss AdMob 표시 요청");
      window.appsInToss!.GoogleAdMob.showAppsInTossAdMob({
        options: { adGroupId: adGroupId },  // ✅ adGroupId로 통일 (공식 문서 기준)
        onEvent: (event) => {
          console.log(`[${adType}] 광고 표시 이벤트:`, event);

          switch (event.type) {
            case "requested":
              // 광고 보여주기 요청 완료 (공식 문서)
              console.log(`[${adType}] 광고 보여주기 요청 완료`);
              break;

            case "show":
              // 광고 컨텐츠 보여졌음 (공식 문서)
              console.log(`[${adType}] 광고 컨텐츠 보여졌음`);
              break;

            case "clicked":
              // 광고 클릭 (공식 문서)
              console.log(`[${adType}] 광고 클릭됨`);
              break;

            case "impression":
              // 광고 노출 (공식 문서)
              console.log(`[${adType}] 광고 노출됨`);
              break;

            case "userEarnedReward":
              // 광고 보상 획득 - 보상형 광고만 사용 가능 (공식 문서)
              console.log(`🎉 [${adType}] 광고 보상 획득:`, event.data);
              console.log(`- unitType: ${event.data?.unitType}`);
              console.log(`- unitAmount: ${event.data?.unitAmount}`);
              console.log(`[${adType}] 사용자가 광고 시청을 완료했음`);
              clearTimeout(timeout);

              // Supabase RPC 함수로 하트 충전 처리
              if (!userId) {
                console.error("❌ 사용자 ID가 없습니다.");
                instance.pendingPromise?.resolve({
                  success: false,
                  message: "사용자 정보를 찾을 수 없습니다.",
                });
                return;
              }

              console.log(`💖 [${adType}] 하트 충전 처리 시작 - 사용자 ID: ${userId}`);
              import('@/services/adService').then(({ addHeartByAd }) => {
                addHeartByAd(userId)
                  .then(result => {
                    console.log(`💖 [${adType}] 하트 충전 결과:`, result);
                    if (result.success) {
                      console.log(`✅ [${adType}] 하트 충전 성공`);
                      instance.pendingPromise?.resolve({
                        success: true,
                        message: result.message || "하트를 획득했습니다!",
                        data: result.data,
                      });
                    } else {
                      console.log(`❌ [${adType}] 하트 충전 실패:`, result.message);
                      instance.pendingPromise?.resolve({
                        success: false,
                        message: result.message || "하트 획득에 실패했습니다.",
                      });
                    }
                  })
                  .catch(error => {
                    console.error(`💥 [${adType}] 하트 충전 에러:`, error);
                    instance.pendingPromise?.resolve({
                      success: false,
                      message: "하트 충전 중 오류가 발생했습니다.",
                    });
                  });
              });
              break;

            case "dismissed":
              // 광고 닫힘 (공식 문서)
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
              // 광고 보여주기 실패 (공식 문서)
              console.log(`[${adType}] 광고 보여주기 실패:`, event.data);
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
  }, [userId]);

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

  console.log("🎣 useAdMob 훅 반환값 생성 시작");
  const returnValue = {
    getAdStatus,
    loadAd,
    showAd,
    isSupported: isSupported(),
    autoLoadAd,
    reloadAd,
    resetAdInstance,
  };
  console.log("🎣 useAdMob 훅 반환값 생성 완료 - isSupported:", returnValue.isSupported);
  
  return returnValue;
};

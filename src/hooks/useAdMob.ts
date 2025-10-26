import { useState, useCallback, useEffect, useRef } from 'react';
import { getAdGroupId, AdType, LoadAdMobEvent, ShowAdMobEvent, AdLoadStatus, AdInstances, UseAdMobReturn, AdRewardResult } from '@/types/adMob';
import { supabase } from '@/lib/supabase';
import { adLogger } from '@/utils/adLogger';
import { TokenManager } from '@/utils/tokenManager';

// 광고 지원 여부 확인
const checkAdSupport = async (): Promise<boolean> => {
  try {
    // 앱인토스 환경에서만 광고 지원
    if (typeof window === 'undefined') {
      console.log('🔍 checkAdSupport: window 객체가 없음 (SSR)');
      return false;
    }

    // 앱인토스 환경 확인 (토스 앱 내 환경 포함)
    const isAppsInToss = window.location.hostname.includes('apps-in-toss') || 
                        window.location.hostname.includes('toss.im') ||
                        window.location.hostname.includes('toss.com') ||
                        window.location.hostname.includes('tossmini.com') ||
                        window.navigator.userAgent.includes('TossApp');
    
    // 환경 확인 로그 (한 번만 출력)
    if (!isAppsInToss) {
      console.log('🔍 checkAdSupport: 앱인토스 환경 확인:', {
        hostname: window.location.hostname,
        isAppsInToss,
        checks: {
          hasAppsInToss: window.location.hostname.includes('apps-in-toss'),
          hasTossIm: window.location.hostname.includes('toss.im'),
          hasTossCom: window.location.hostname.includes('toss.com'),
          hasTossMini: window.location.hostname.includes('tossmini.com'),
          hasTossApp: window.navigator.userAgent.includes('TossApp')
        }
      });
    }

    if (!isAppsInToss) {
      console.log('❌ checkAdSupport: 앱인토스 환경이 아님');
      return false;
    }

    // GoogleAdMob SDK 로드 시도
    const { GoogleAdMob } = await import('@apps-in-toss/web-framework');
    const isSupported = GoogleAdMob.loadAppsInTossAdMob.isSupported();
    
    return isSupported;
  } catch (error) {
    console.error('❌ checkAdSupport: GoogleAdMob 로드 실패:', error);
    return false;
  }
};

// 새로운 광고 로딩 함수
const loadAppsInTossAdMob = async (
  params: {
    options: { adGroupId: string };
    onEvent: (event: LoadAdMobEvent) => void;
    onError: (reason: unknown) => void;
  }
): Promise<() => void> => {
  try {
    const { GoogleAdMob } = await import('@apps-in-toss/web-framework');
    return GoogleAdMob.loadAppsInTossAdMob(params);
  } catch (error) {
    console.error('GoogleAdMob 로딩 실패:', error);
    throw error;
  }
};

// 새로운 광고 표시 함수
const showAppsInTossAdMob = async (
  params: {
    options: { adGroupId: string };
    onEvent: (event: ShowAdMobEvent) => void;
    onError: (reason: unknown) => void;
  }
): Promise<void> => {
  try {
    const { GoogleAdMob } = await import('@apps-in-toss/web-framework');
    await GoogleAdMob.showAppsInTossAdMob(params);
  } catch (error) {
    console.error('GoogleAdMob 표시 실패:', error);
    throw error;
  }
};

export const useAdMob = (): UseAdMobReturn => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  
  // 광고 타입별 상태 관리
  const [adStatuses, setAdStatuses] = useState<Record<AdType, AdLoadStatus>>({
    HEART_REFILL: 'not_loaded',
  });

  // 광고 타입별 인스턴스 관리
  const adInstancesRef = useRef<AdInstances>({
    HEART_REFILL: {
      cleanup: null,
      adGroupId: '',
      isReady: false,
      pendingPromise: null,
    },
  });

  // 광고 지원 여부 확인 (한 번만 실행)
  useEffect(() => {
    checkAdSupport().then(setIsSupported);
  }, []);

  // 인증 상태 모니터링
  useEffect(() => {
    if (!isSupported) return;
    
    const checkAuthStatus = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          console.log('🔐 인증 상태 정상:', {
            userId: sessionData.session.user.id,
            expiresAt: sessionData.session.expires_at
          });
        } else {
          console.warn('⚠️ 인증 세션 없음');
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
      }
    };
    
    // 초기 확인
    checkAuthStatus();
    
    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 인증 상태 변화:', event, session ? '세션 있음' : '세션 없음');
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log('🔄 인증 상태 변경으로 광고 인스턴스 리셋');
        resetAdInstance('HEART_REFILL');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    const adInstances = adInstancesRef.current;
    return () => {
      // 모든 광고 인스턴스 정리
      Object.values(adInstances).forEach(instance => {
        if (instance.cleanup && typeof instance.cleanup === 'function') {
          instance.cleanup();
        }
        instance.cleanup = null;
        instance.isReady = false;
        instance.pendingPromise = null;
      });
    };
  }, []);

  // Supabase RPC 함수 호출
  const callAdRewardAPI = async (adType: AdType): Promise<AdRewardResult> => {
    try {
      adLogger.log('info', '🔍 callAdRewardAPI 시작', { adType });
      
      if (adType === 'HEART_REFILL') {
        // 현재 사용자 ID 가져오기
        adLogger.log('info', '🔍 사용자 인증 확인 중...');
        
        // 먼저 현재 세션 상태 확인
        const { data: initialSessionData, error: initialSessionError } = await supabase.auth.getSession();
        let sessionData = initialSessionData;
        const sessionError = initialSessionError;
        
        // 세션이 없으면 토큰 갱신 시도
        if (!sessionData.session || sessionError) {
          adLogger.log('warning', '⚠️ 세션이 없거나 만료됨 - 토큰 갱신 시도');
          
          try {
            // 토큰 갱신 시도
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
              adLogger.log('error', '❌ 토큰 갱신 실패', { error: refreshError });
            } else if (refreshData.session) {
              adLogger.log('success', '✅ 토큰 갱신 성공 - 세션 복구됨');
              sessionData = refreshData;
            }
          } catch (refreshErr) {
            adLogger.log('error', '❌ 토큰 갱신 중 에러', { error: refreshErr });
          }
        }
        
        if (sessionError) {
          adLogger.log('error', '❌ 세션 확인 실패', { error: sessionError });
          throw new Error(`세션 확인 실패: ${sessionError.message}`);
        }
        
        // 사용자 ID 찾기 - Supabase Auth 세션 또는 토스 토큰으로
        let userId: string | null = null;
        
        if (sessionData.session) {
          userId = sessionData.session.user.id;
          adLogger.log('success', '✅ Supabase Auth 세션으로 user_id 획득', { userId });
        } else {
          adLogger.log('warning', '⚠️ Supabase Auth 세션 없음 - 토스 토큰으로 user_id 찾기 시도');
          
          // 토스 토큰 정보로 user_id 찾기
          const tossUserKey = TokenManager.getUserKey();
          if (tossUserKey !== null) {
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('id')
              .eq('toss_user_key', tossUserKey.toString())
              .single();
            
            if (profileError) {
              adLogger.log('error', '❌ user_profiles에서 user_id 조회 실패', { error: profileError });
            } else if (profile) {
              userId = profile.id;
              adLogger.log('success', '✅ 토스 토큰으로 user_id 획득', { userId, tossUserKey });
            }
          } else {
            adLogger.log('error', '❌ 토스 userKey도 없음');
          }
        }
        
        if (!userId) {
          adLogger.log('error', '❌ user_id를 찾을 수 없음 - 모든 방법 실패');
          throw new Error("사용자 인증 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
        }

        // Supabase RPC 함수 호출
        adLogger.log('info', '🔍 Supabase RPC 함수 호출 시작', { functionName: 'add_heart_by_ad', userId });
        const { data, error } = await supabase.rpc('add_heart_by_ad', {
          p_user_id: userId
        });

        adLogger.log('info', '🔍 Supabase RPC 응답', { data, error });

        if (error) {
          adLogger.log('error', '❌ Supabase RPC 에러', { error });
          throw error;
        }

        adLogger.log('success', '✅ Supabase RPC 성공', { result: data });
        return data;
      } else {
        adLogger.log('error', '❌ 지원하지 않는 광고 타입', { adType });
        throw new Error(`지원하지 않는 광고 타입: ${adType}`);
      }
    } catch (error) {
      adLogger.log('error', `❌ ${adType} 광고 보상 API 호출 실패`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        adType,
        errorType: typeof error
      });
      throw error;
    }
  };

  // 광고 상태 조회 함수
  const getAdStatus = useCallback((adType: AdType): AdLoadStatus => {
    return adStatuses[adType];
  }, [adStatuses]);

  // 광고 로딩 함수
  const loadAd = useCallback(async (adType: AdType) => {
    if (!isSupported) {
      return;
    }

    const currentStatus = adStatuses[adType];
    
    // 이미 로딩 중이면 중복 실행 방지  
    if (currentStatus === 'loading') {
      return;
    }

    try {
      // 해당 광고 타입의 상태를 loading으로 설정
      setAdStatuses(prev => ({
        ...prev,
        [adType]: 'loading'
      }));

    const adGroupId = getAdGroupId(adType);
      
      // 기존 광고 인스턴스 정리
      const instance = adInstancesRef.current[adType];
      if (instance.cleanup && typeof instance.cleanup === 'function') {
        instance.cleanup();
      }
      
      // 새로운 광고 API를 사용하여 광고 로드
      const cleanup = await loadAppsInTossAdMob({
        options: { adGroupId },
        onEvent: async (event: LoadAdMobEvent) => {
          switch (event.type) {
            case 'loaded':
              setAdStatuses(prev => ({
                ...prev,
                [adType]: 'loaded'
              }));
              instance.isReady = true;
              break;
          }
        },
        onError: (error: unknown) => {
          console.error(`${adType} 광고 불러오기 실패:`, error);
          setAdStatuses(prev => ({
            ...prev,
            [adType]: 'failed'
          }));
          instance.isReady = false;
        }
      });
      
      // 인스턴스 정보 업데이트
      instance.cleanup = cleanup;
      instance.adGroupId = adGroupId;
      
    } catch (error) {
      console.error(`${adType} 광고 로딩 중 오류:`, error);
      setAdStatuses(prev => ({
        ...prev,
        [adType]: 'failed'
      }));
      adInstancesRef.current[adType].isReady = false;
    }
  }, [isSupported, adStatuses]);

  // 광고 표시 함수
  const showAd = useCallback(async (adType: AdType): Promise<AdRewardResult> => {
    adLogger.log('info', '🎬 광고 표시 함수 시작', { adType, isSupported });
    
    if (!isSupported) {
      adLogger.log('error', '❌ 광고 미지원 환경');
      throw new Error('광고가 지원되지 않는 환경입니다');
    }
    
    const instance = adInstancesRef.current[adType];
    const currentStatus = adStatuses[adType];
    
    adLogger.log('info', '📊 현재 광고 상태', { adType, currentStatus, isReady: instance.isReady });
    
    // 광고 시청 간격 체크 (최소 3초 간격)
    const now = Date.now();
    const lastAdTime = instance.lastAdTime || 0;
    if (now - lastAdTime < 3000) {
      adLogger.log('warning', '⚠️ 광고 시청 간격이 너무 짧음', { elapsed: now - lastAdTime });
      throw new Error('광고 시청 간격이 너무 짧습니다. 잠시 후 다시 시도해주세요.');
    }

    // 보류 중인 Promise가 있으면 정리
    if (instance.pendingPromise) {
      instance.pendingPromise = null;
    }

    // 광고 상태 재확인 및 재로드 시도
    if (currentStatus !== 'loaded' || !instance.isReady) {
      // 광고가 로드 중이거나 실패한 경우 재로드 시도
      if (currentStatus === 'failed' || currentStatus === 'not_loaded') {
        await loadAd(adType);
        
        // 재로드 후 상태 확인 - 최대 3초 대기
        let waitCount = 0;
        while (waitCount < 30) {
          await new Promise(resolve => setTimeout(resolve, 100));
          waitCount++;
          // 현재 상태를 직접 확인하여 클로저 문제 해결
          const currentStatus = adStatuses[adType];
          if (currentStatus === 'loaded' && instance.isReady) {
            break;
          }
        }
        
        // 최종 상태 확인
        if (adStatuses[adType] !== 'loaded' || !instance.isReady) {
          throw new Error(`${adType} 광고 로드에 실패했습니다`);
        }
      } else if (currentStatus === 'loading') {
        // 로딩 중인 경우 최대 3초 대기
        let waitCount = 0;
        while (waitCount < 30) {
          await new Promise(resolve => setTimeout(resolve, 100));
          waitCount++;
          // 현재 상태를 직접 확인하여 클로저 문제 해결
          const currentStatus = adStatuses[adType];
          if (currentStatus === 'loaded' && instance.isReady) {
            break;
          }
        }
        
        // 최종 상태 확인
        if (adStatuses[adType] !== 'loaded' || !instance.isReady) {
          throw new Error(`${adType} 광고 로딩 시간 초과`);
        }
      } else {
        throw new Error(`${adType} 광고가 로드되지 않았습니다`);
      }
    }

    return new Promise((resolve, reject) => {
      try {
        adLogger.log('info', '🔄 새 Promise 생성', { adType });
        
        // 보류 중인 광고 Promise 참조 저장
      instance.pendingPromise = { resolve, reject };
        adLogger.log('info', '✅ pendingPromise 설정됨', { adType });

        // 광고 시청 시작 시간 기록
        instance.lastAdTime = now;
        adLogger.log('info', '📝 lastAdTime 기록', { adType, now });
        
        // 광고 표시
        showAppsInTossAdMob({
          options: { adGroupId: getAdGroupId(adType) },
          onEvent: (event: ShowAdMobEvent) => {
          switch (event.type) {
              case 'requested':
                console.log(`${adType} 광고 표시 요청 완료`);
                break;
              case 'clicked':
                console.log(`${adType} 광고 클릭`);
                break;
              case 'dismissed':
                console.log(`${adType} 광고 닫힘`);
                resetAdInstance(adType);
              break;
              case 'failedToShow':
                console.log(`${adType} 광고 표시 실패`);
                resetAdInstance(adType);
              break;
              case 'impression':
                console.log(`${adType} 광고 노출`);
              break;
              case 'show':
                console.log(`${adType} 광고 컨텐츠 표시`);
              break;
              case 'userEarnedReward':
                adLogger.log('success', '🎁 광고 보상 획득 이벤트 발생', {
                  adType,
                  eventData: event.data,
                  hasPendingPromise: !!instance.pendingPromise
                });
                
                // 중복 호출 방지: pendingPromise가 없으면 이미 처리된 것
                if (!instance.pendingPromise) {
                  adLogger.log('warning', '⚠️ userEarnedReward 중복 호출 감지 - 무시', { adType });
                  return;
                }
                
                // 이벤트가 여러 번 발생할 수 있으므로, pendingPromise를 즉시 null로 설정
                const currentPromise = instance.pendingPromise;
                instance.pendingPromise = null;
                
                // 광고 보상 API 호출
                (async () => {
                  try {
                    adLogger.log('info', '🔍 광고 보상 API 호출 시작...');
                    const rewardData = await callAdRewardAPI(adType);
                      adLogger.log('success', '✅ 광고 보상 API 호출 성공', { rewardData });
                      
                      // 결과 검증
                      if (rewardData && typeof rewardData === 'object' && 'success' in rewardData) {
                        if (rewardData.success) {
                          adLogger.log('success', '🎉 광고 보상 성공 - 하트 충전됨');
                        } else {
                          adLogger.log('warning', '⚠️ 광고 보상 실패', { message: rewardData.message });
                        }
                      } else {
                        adLogger.log('error', '❌ 광고 보상 결과 형식 오류', { rewardData });
                      }
                      
                      // Promise resolve
                      adLogger.log('info', '🔄 Promise resolve 시작', { adType });
                      if (currentPromise) {
                        currentPromise.resolve(rewardData);
                        adLogger.log('success', '✅ Promise resolve 완료', { adType });
                      }
                    } catch (error) {
                      adLogger.log('error', `❌ ${adType} showAd: 광고 보상 API 호출 실패`, { error });
                      
                      try {
                        const errorDetails = {
                          message: error instanceof Error ? error.message : 'Unknown error',
                          stack: error instanceof Error ? error.stack : undefined,
                          adType
                        };
                        
                        adLogger.log('error', '❌ 에러 상세 정보', errorDetails);
                        
                        if (currentPromise) {
                          // 안전한 에러 응답 생성
                          const safeError = {
                            type: adType,
                            message: error instanceof Error ? error.message : '광고 보상 처리 중 오류가 발생했습니다.',
                            error: true,
                        success: false,
                            errorDetails: error instanceof Error ? error.message : String(error)
                          };
                          
                          adLogger.log('error', '🔄 Promise reject 시작', { adType, error: safeError });
                          currentPromise.reject(safeError);
                          adLogger.log('success', '✅ Promise reject 완료', { adType });
                        }
                    } catch (rejectError) {
                      adLogger.log('error', "❌ 에러 처리 실패", { rejectError });
                    }
                  }
                })();
                
                // 광고 인스턴스 리셋을 지연시켜 호출
                setTimeout(() => {
                  resetAdInstance(adType);
                }, 2000);
              break;
          }
        },
          onError: (error: unknown) => {
            console.error(`${adType} showAd: 광고 표시 중 오류:`, error);
            
            // 에러 발생 시 Promise reject (안전하게 처리)
            if (instance.pendingPromise) {
              try {
                const errorResponse = {
                  type: adType,
                  message: '광고 시청에 실패했습니다',
                  error: true,
                  success: false,
                  errorDetails: error instanceof Error ? error.message : String(error)
                };
                
                instance.pendingPromise.reject(errorResponse);
                instance.pendingPromise = null;
              } catch (rejectError) {
                console.error("❌ Promise reject 실패:", rejectError);
                // Promise reject도 실패하면 조용히 넘어감
                instance.pendingPromise = null;
              }
            }
          }
        });
        
        // 타임아웃 설정을 45초로 설정 (30초 광고 + 여유시간)
        const timeoutId = setTimeout(() => {
          if (instance.pendingPromise) {
            console.error(`${adType} showAd: 광고 표시 타임아웃 (45초)`);
            
            try {
              // 타임아웃 시 적절한 에러 응답 생성
              const timeoutResponse = {
                type: adType,
                message: '광고 시청 시간이 초과되었습니다. 다시 시도해주세요.',
                error: true,
                success: false,
                errorDetails: 'timeout'
              };
              
              instance.pendingPromise.resolve(timeoutResponse);
              instance.pendingPromise = null;
            } catch (timeoutError) {
              console.error("❌ 타임아웃 처리 실패:", timeoutError);
              instance.pendingPromise = null;
            }
          }
        }, 45000);

        // 타임아웃 정리 함수 저장
        if (instance.cleanup) {
          const originalCleanup = instance.cleanup;
          instance.cleanup = () => {
            clearTimeout(timeoutId);
            if (typeof originalCleanup === 'function') {
              originalCleanup();
            }
          };
        }
      } catch (error) {
        console.error(`${adType} showAd: 광고 표시 중 오류:`, error);
        reject(error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, adStatuses, loadAd]);

  // resetAdInstance 함수
  const resetAdInstance = useCallback((adType: AdType) => {
    const instance = adInstancesRef.current[adType];
    
    // 정리 상태로 설정
    setAdStatuses(prev => ({
      ...prev,
      [adType]: 'cleaning'
    }));
    
    // 기존 인스턴스 정리
    if (instance.cleanup && typeof instance.cleanup === 'function') {
      try {
        instance.cleanup();
      } catch (error) {
        console.error(`❌ ${adType} cleanup 함수 실행 중 오류:`, error);
      }
    }
    
    // 참조 정리
    instance.cleanup = null;
    instance.isReady = false;
    instance.adGroupId = '';
    
    // 보류 중인 Promise 정리
    if (instance.pendingPromise) {
      instance.pendingPromise = null;
    }
    
    // 정리 완료 후 not_loaded 상태로 변경
    setTimeout(() => {
      setAdStatuses(prev => ({
        ...prev,
        [adType]: 'not_loaded'
      }));
    }, 500);
  }, []);

  // 광고 재로드 함수
  const reloadAd = useCallback(async (adType: AdType) => {
    resetAdInstance(adType);
    await loadAd(adType);
  }, [loadAd, resetAdInstance]);

  // 자동 광고 로드 함수 (중복 로드 방지)
  const autoLoadAd = useCallback(async (adType: AdType) => {
    if (!isSupported) {
      console.log("❌ autoLoadAd: 광고 미지원 환경");
      return;
    }

    const currentStatus = adStatuses[adType];
    const instance = adInstancesRef.current[adType];

    // 이미 로드되고 사용 가능한 상태면 다시 로드하지 않음
    if (currentStatus === 'loaded' && instance.isReady) {
      console.log("✅ autoLoadAd: 광고 이미 로드됨 - 재로드 스킵");
      return;
    }

    // 로딩 중이면 재로드하지 않음
    if (currentStatus === 'loading') {
      console.log("⏳ autoLoadAd: 광고 로딩 중 - 재로드 스킵");
      return;
    }

    console.log("🔄 autoLoadAd: 광고 로드 시작 - 상태:", currentStatus);
    await loadAd(adType);
  }, [isSupported, adStatuses, loadAd]);

  // 모든 광고 인스턴스 리셋
  const resetAllAdInstances = useCallback(() => {
    Object.keys(adInstancesRef.current).forEach(adType => {
      resetAdInstance(adType as AdType);
    });
  }, [resetAdInstance]);

  // 모든 광고 로드
  const loadAllAds = useCallback(async () => {
    const loadPromises = Object.keys(adInstancesRef.current).map(adType => 
      loadAd(adType as AdType)
    );
    await Promise.all(loadPromises);
  }, [loadAd]);

  return {
    getAdStatus,
    loadAd,
    showAd,
    isSupported,
    autoLoadAd,
    reloadAd,
    resetAdInstance,
    resetAllAdInstances,
    loadAllAds,
  };
};
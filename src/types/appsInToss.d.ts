// 앱인토스 환경 타입 정의
declare global {
  interface Window {
    appsInToss?: {
      GoogleAdMob?: {
        loadAppsInTossAdMob: {
          isSupported: () => boolean;
        };
      };
    };
  }
}

export {};

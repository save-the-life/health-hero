import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'lucky-dice',  // ✅ 앱인토스 콘솔에 등록된 정확한 앱 ID
  brand: {
    displayName: '헬스히어로', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: '#3182F6', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "https://static.toss.im/appsintoss/229/70577e23-0f8a-4d19-bce2-2e431a04bb26.png",
    // bridgeColorMode: 'inverted',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'next dev',
      build: 'next build',
    },
  },
  permissions: [],  // 광고 SDK는 자동으로 로드됨 (permissions 불필요)
  outdir: 'dist',
  webViewProps: {
    type: 'game'
  }
});

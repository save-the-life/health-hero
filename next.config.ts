import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'dist',
  output: 'export',
  images: {
    unoptimized: true,
    // Static export에서는 formats, deviceSizes, imageSizes 사용 불가
  },
  // 성능 최적화 설정
  experimental: {
    optimizePackageImports: ['@/components', '@/hooks', '@/services'],
  },
  // 컴파일러 최적화
  compiler: {
    // Eruda 콘솔 로그 출력을 위해 console 제거 비활성화
    // 프로덕션에서도 디버깅이 필요하므로 console.log 유지
    removeConsole: false,
  },
};

export default nextConfig;

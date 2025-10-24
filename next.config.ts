import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'dist',
  output: 'export',
  images: {
    unoptimized: true,
    // 이미지 최적화 설정
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 성능 최적화 설정
  experimental: {
    optimizePackageImports: ['@/components', '@/hooks', '@/services'],
  },
  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 번들 분석기 (개발 시에만)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      config.plugins.push(
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
      return config;
    },
  }),
};

export default nextConfig;

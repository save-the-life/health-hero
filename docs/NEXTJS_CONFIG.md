# Next.js 설정 가이드

## 📋 현재 설정

### `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'dist',
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

---

## 🔍 설정 상세 설명

### 1. `distDir: 'dist'`

**목적**: Next.js 빌드 출력 디렉토리를 `dist`로 변경

**이유**:
- 앱인토스 `granite` 빌드 시스템은 `granite.config.ts`의 `outdir`과 일치해야 함
- `granite.config.ts`에서 `outdir: 'dist'` 설정
- Next.js 기본값은 `.next`이므로 변경 필요

**효과**:
```bash
npm run build
# 출력: dist/ 디렉토리에 빌드 결과물 생성
```

---

### 2. `output: 'export'`

**목적**: Next.js를 Static Site Generation (SSG) 모드로 빌드

**이유**:
- 앱인토스는 **정적 사이트만 지원**
- 서버 사이드 렌더링(SSR) 불가능
- Node.js 서버가 필요 없는 순수 HTML/CSS/JS 파일 생성

**효과**:
- `.ait` 파일에 순수 정적 파일만 포함
- 서버 없이 웹뷰에서 실행 가능
- `server/` 디렉토리 생성 안 함 (Windows EPERM 에러 방지)

**제약사항**:
- ❌ Server Actions 사용 불가
- ❌ API Routes 사용 불가
- ❌ Dynamic Routing 시 `generateStaticParams()` 필수
- ❌ Image Optimization API 사용 불가

**해결 방법**:
- 동적 라우트: `generateStaticParams()` 추가
- 이미지: `images: { unoptimized: true }` 설정

---

### 3. `images: { unoptimized: true }`

**목적**: Next.js Image Optimization API 비활성화

**이유**:
- `output: 'export'`는 Image Optimization과 **호환 불가**
- Image Optimization은 서버가 필요함
- 정적 빌드에서는 원본 이미지를 그대로 사용

**효과**:
- `<Image>` 컴포넌트가 일반 `<img>` 태그처럼 동작
- 자동 이미지 최적화 없음
- 다양한 해상도 자동 생성 없음

**트레이드오프**:

| 항목 | 장점 | 단점 |
|------|------|------|
| 빌드 | ✅ 빠름 | - |
| 번들 크기 | - | ⚠️ 최적화 안 됨 |
| 로딩 속도 | - | ⚠️ 느릴 수 있음 |
| 호환성 | ✅ SSG 지원 | - |

**권장 사항**:
- 이미지를 수동으로 최적화 (WebP, 적절한 크기)
- 필요 시 CDN 사용 (Cloudinary, ImageKit 등)

---

## 🚨 주요 에러 해결

### 에러 1: `Internal Error: EPERM: operation not permitted`

**원인**: Next.js가 `server/` 폴더를 생성하고 `granite`이 이를 이동하려 할 때 Windows에서 권한 에러 발생

**해결**: `output: 'export'` 설정으로 `server/` 폴더 생성 안 함

---

### 에러 2: `Image Optimization using the default loader is not compatible with 'export'`

**원인**: `output: 'export'`와 Image Optimization API 충돌

**해결**: `images: { unoptimized: true }` 추가

---

### 에러 3: `Page "/game/[phase]" is missing "generateStaticParams()"`

**원인**: `output: 'export'`는 동적 라우트의 정적 경로를 미리 알아야 함

**해결**: 각 동적 라우트에 `generateStaticParams()` 추가

```typescript
// src/app/game/[phase]/page.tsx
export function generateStaticParams() {
  return [
    { phase: '1' },
    { phase: '2' },
    { phase: '3' },
  ];
}

export default function PhasePage() {
  return <div>Phase Page</div>
}
```

---

## 📊 빌드 프로세스

### 1. Next.js 빌드

```bash
npm run build
```

**실행 내용**:
```bash
next build --turbopack
```

**출력**:
```
dist/
├── _next/
│   ├── static/
│   └── ...
├── index.html
├── game.html
└── ...
```

### 2. Granite 빌드

```bash
npx @apps-in-toss/cli build
```

**실행 내용**:
- `dist/` 디렉토리 읽기
- 웹뷰용 `.ait` 파일 생성
- 앱인토스 콘솔에 업로드 준비

**출력**:
```
health-hero-0.1.0.ait
```

---

## 🎯 권장 워크플로우

### 개발 (로컬)

```bash
npm run dev
```

- Hot Reload 지원
- 빠른 개발
- Image Optimization 비활성화되어 있지만 문제없음

### 빌드 (배포)

```bash
# 1. Next.js 빌드
npm run build

# 2. 빌드 결과 확인
ls dist/

# 3. Granite 빌드
npx @apps-in-toss/cli build

# 4. .ait 파일 확인
ls *.ait
```

---

## 📚 참고 문서

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [앱인토스 웹뷰 가이드](https://developers-apps-in-toss.toss.im/tutorials/webview.html)

---

## ✅ 체크리스트

배포 전 확인:

- [x] `next.config.ts`에 `output: 'export'` 설정
- [x] `next.config.ts`에 `images: { unoptimized: true }` 설정
- [x] `distDir: 'dist'`와 `granite.config.ts`의 `outdir` 일치
- [x] 모든 동적 라우트에 `generateStaticParams()` 추가
- [ ] 이미지 수동 최적화 (권장)
- [ ] `npm run build` 성공 확인
- [ ] `npx @apps-in-toss/cli build` 성공 확인

---

**Last Updated**: 2025-01-20  
**Next.js Version**: 15.5.5  
**Status**: Production Ready ✓


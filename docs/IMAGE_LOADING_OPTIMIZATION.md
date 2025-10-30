# 이미지 로딩 최적화 가이드

## 문제점

배포된 앱에서 간헐적으로 이미지 로딩이 실패하는 경우가 발생할 수 있습니다. 이는 다음과 같은 원인으로 발생합니다:

1. **네트워크 불안정**: 느린 연결, 타임아웃
2. **브라우저 캐싱 문제**: 잘못된 캐시 데이터
3. **리소스 경합**: 동시에 많은 이미지 로딩 시도
4. **CDN 응답 지연**: 정적 파일 서빙 지연

## 해결 방법

### 1. SafeImage 컴포넌트 사용

`SafeImage` 컴포넌트는 재시도 로직과 에러 핸들링을 포함한 안전한 이미지 로딩을 제공합니다.

#### 기본 사용법

```tsx
import { SafeImage } from '@/components/SafeImage';

function MyComponent() {
  return (
    <SafeImage
      src="/images/my-image.png"
      alt="설명"
      width={100}
      height={100}
    />
  );
}
```

#### 옵션

- **priority**: 중요한 이미지 (Above the Fold)는 `priority` 속성을 추가하여 즉시 로딩
- **maxRetries**: 최대 재시도 횟수 (기본값: 3)
- **retryDelay**: 재시도 간격 (밀리초, 기본값: 1000)
- **fallbackSrc**: 로딩 실패 시 표시할 대체 이미지

```tsx
<SafeImage
  src="/images/critical-image.png"
  alt="중요한 이미지"
  width={100}
  height={100}
  priority                                    // 즉시 로딩
  maxRetries={5}                              // 최대 5회 재시도
  retryDelay={500}                            // 500ms 간격으로 재시도
  fallbackSrc="/images/placeholder.png"       // 실패 시 대체 이미지
/>
```

### 2. 적용 우선순위

다음과 같은 이미지에 우선적으로 `SafeImage`를 적용하세요:

#### 🔴 우선순위 높음 (Priority)
- 모달/팝업의 배경 이미지
- 핵심 UI 요소 (하트, 별, 타이머 등)
- 첫 화면에 보이는 이미지 (Above the Fold)

```tsx
<SafeImage
  src="/images/items/blackboard.png"
  alt="칠판"
  width={342}
  height={282}
  priority  // 우선 로딩
/>
```

#### 🟡 우선순위 중간
- 버튼 아이콘
- 캐릭터 이미지
- 스테이지 배경

```tsx
<SafeImage
  src="/images/items/icon-heart.png"
  alt="하트"
  width={100}
  height={100}
/>
```

#### 🟢 우선순위 낮음
- 스크롤 해야 보이는 이미지
- 장식용 이미지

### 3. Next.js Image 최적화 설정

현재 프로젝트는 static export를 사용하므로 `unoptimized: true`로 설정되어 있습니다.

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,  // Static export를 위해 필요
  },
};
```

### 4. 추가 최적화 방법

#### 4.1 이미지 Preload

중요한 이미지를 HTML `<head>`에서 미리 로드:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="preload" as="image" href="/images/items/blackboard.png" />
        <link rel="preload" as="image" href="/images/items/icon-heart.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 4.2 이미지 포맷 최적화

- PNG 대신 WebP 사용 (더 작은 파일 크기)
- 적절한 해상도로 이미지 리사이징 (과도한 크기 방지)

#### 4.3 Lazy Loading

화면에 보이지 않는 이미지는 lazy loading:

```tsx
<SafeImage
  src="/images/some-image.png"
  alt="나중에 로딩"
  width={100}
  height={100}
  loading="lazy"  // 스크롤 시 로딩
/>
```

## 적용 현황

### ✅ 적용 완료
- `HeartShortageModal.tsx` - 칠판, 하트, 타이머 이미지
- `AdRewardDialog.tsx` - 하트/알림 아이콘

### 📋 적용 권장
- `GameHeader.tsx` - 캐릭터, 하트, 별 아이콘
- `ItemInfoModal.tsx` - 아이템 아이콘
- `StageResultModal.tsx` - 결과 화면 이미지
- 모든 phase 페이지의 배경 및 UI 이미지

## 모니터링

SafeImage는 콘솔에 로딩 상태를 기록합니다:

```
⚠️ 이미지 로딩 실패 (시도 1/3): /images/...
🔄 이미지 재시도 중... (1/3): /images/...
✅ 이미지 로딩 성공 (재시도 1회 후): /images/...
❌ 이미지 로딩 최종 실패, fallback 사용: /images/...
```

프로덕션에서 이러한 로그를 모니터링하여 문제가 되는 이미지를 파악할 수 있습니다.

## 베스트 프랙티스

1. ✅ **중요 이미지에 priority 추가**
2. ✅ **SafeImage 사용 시 적절한 maxRetries 설정**
3. ✅ **fallbackSrc로 사용자 경험 보장**
4. ✅ **이미지 크기 최적화 (WebP, 적절한 해상도)**
5. ✅ **네트워크 상태에 따른 에러 처리**

## 참고 자료

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Performance Best Practices](https://web.dev/fast/)


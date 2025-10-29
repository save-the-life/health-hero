# TDS Mobile 통합 가이드

**최종 업데이트**: 2025-10-29

## 개요

헬스 히어로 프로젝트에 토스 디자인 시스템(TDS Mobile)을 통합하여 일관된 UI/UX를 제공합니다.

---

## 설치

### 필요한 패키지

```bash
npm install @toss/tds-mobile @toss/tds-mobile-ait @emotion/react@^11 react@^18 react-dom@^18
```

### 의존성

- **React 18 이상**: TDS Mobile 필수 요구사항
- **Emotion**: TDS의 CSS-in-JS 솔루션
- **TDS Mobile AIT**: 앱인토스 환경 지원

---

## 통합 전략

### 문제점: 전역 스타일 충돌

TDS의 `TDSMobileAITProvider`를 앱 전체에 적용하면:
- 기존 CSS 스타일이 덮어써짐
- Emotion의 CSS-in-JS가 기존 스타일과 충돌
- 시작 페이지, 게임 페이지 등의 커스텀 디자인이 손상됨

### 해결책: 선택적 격리 적용

TDS가 필요한 컴포넌트에만 `TDSProvider`를 적용하여 스타일 충돌을 방지합니다.

---

## 구현

### 1. TDSProvider 컴포넌트

**파일**: `src/components/TDSProvider.tsx`

```typescript
"use client";

import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import { useEffect, useState } from 'react';

export function TDSProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 서버 사이드에서는 Provider 없이 렌더링
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <TDSMobileAITProvider>
      {children}
    </TDSMobileAITProvider>
  );
}
```

**주요 기능**:
- Client-side only 렌더링 (SSR 호환성)
- `useEffect`로 클라이언트 감지
- 서버에서는 Provider 없이 children만 렌더링

### 2. AdRewardDialog 컴포넌트

**파일**: `src/components/AdRewardDialog.tsx`

```typescript
"use client";

import { Button } from '@toss/tds-mobile';
import Image from 'next/image';

interface AdRewardDialogProps {
  open: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
}

export function AdRewardDialog({
  open,
  onClose,
  success,
  message,
}: AdRewardDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* 다이얼로그 */}
      <div className="relative z-10 bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          <Image
            src={success ? "/images/items/icon-heart.png" : "/images/ui/popup-failed.png"}
            alt={success ? "하트" : "알림"}
            width={80}
            height={80}
          />
        </div>
        
        {/* 제목 */}
        <h2 className="text-xl font-bold text-center mb-2 text-gray-900">
          {success ? "하트 획득!" : "알림"}
        </h2>
        
        {/* 메시지 */}
        <p className="text-center text-gray-700 mb-6 whitespace-pre-wrap">
          {message}
        </p>
        
        {/* TDS 버튼 */}
        <Button
          display="full"
          variant="fill"
          color="primary"
          size="xlarge"
          onClick={onClose}
          style={{
            backgroundColor: 'white',
            color: '#000',
            border: '2px solid #000',
            fontWeight: 'bold',
            borderRadius: '12px',
          }}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
```

**주요 기능**:
- TDS `Button` 컴포넌트 사용
- 커스텀 다이얼로그 디자인
- 성공/실패 상태에 따른 UI 변경
- 둥근 버튼 스타일 (`borderRadius: 12px`)

### 3. HeartShortageModal에서 사용

**파일**: `src/components/HeartShortageModal.tsx`

```typescript
import { AdRewardDialog } from "./AdRewardDialog";
import { TDSProvider } from "./TDSProvider";

// ... 기존 코드 ...

// TDS 다이얼로그 상태
const [dialogOpen, setDialogOpen] = useState(false);
const [dialogMessage, setDialogMessage] = useState("");
const [dialogSuccess, setDialogSuccess] = useState(false);

// 광고 시청 성공 시
if (result.success) {
  await updateHearts();
  
  // TDS 다이얼로그 즉시 표시
  setDialogSuccess(true);
  setDialogMessage("하트를 획득했습니다!");
  setDialogOpen(true);
}

// JSX
return (
  <div>
    {/* 기존 모달 내용 */}
    
    {/* TDS 광고 결과 다이얼로그 - TDS Provider로 격리 */}
    <TDSProvider>
      <AdRewardDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          onClose(); // HeartShortageModal도 닫기
        }}
        success={dialogSuccess}
        message={dialogMessage}
      />
    </TDSProvider>
  </div>
);
```

**주요 포인트**:
- `TDSProvider`로 `AdRewardDialog`만 감싸기
- 기존 모달 콘텐츠는 TDS 영향 받지 않음
- 광고 완료 즉시 다이얼로그 표시

---

## 스타일 가이드

### TDS Button 커스터마이징

```typescript
<Button
  display="full"        // 전체 너비
  variant="fill"        // 채워진 스타일
  color="primary"       // 기본 색상
  size="xlarge"         // 큰 크기
  onClick={handleClick}
  style={{
    backgroundColor: 'white',    // 배경색 커스터마이징
    color: '#000',               // 텍스트 색상
    border: '2px solid #000',    // 테두리
    fontWeight: 'bold',          // 굵은 텍스트
    borderRadius: '12px',        // 둥근 모서리
  }}
>
  버튼 텍스트
</Button>
```

### 지원되는 Props

#### Button 컴포넌트

| Prop | 타입 | 설명 |
|------|------|------|
| `display` | `"inline" \| "block" \| "full"` | 버튼 표시 방식 |
| `variant` | `"fill" \| "weak"` | 버튼 스타일 |
| `color` | `"primary" \| "danger" \| "light" \| "dark"` | 버튼 색상 |
| `size` | `"small" \| "medium" \| "large" \| "xlarge"` | 버튼 크기 |
| `loading` | `boolean` | 로딩 상태 |
| `disabled` | `boolean` | 비활성 상태 |

---

## SSR 호환성

### 문제

TDS Mobile은 client-side only 라이브러리로, Next.js의 SSR과 호환되지 않습니다.

### 해결

1. **"use client" 지시어**: 모든 TDS 관련 컴포넌트에 추가
2. **클라이언트 감지**: `useEffect`로 `isClient` 상태 관리
3. **조건부 렌더링**: 서버에서는 Provider 없이 렌더링

```typescript
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) {
  return <>{children}</>;
}
```

---

## 빌드 에러 해결

### 에러: "deploymentId is not a constant handler"

**원인**: TDS Provider가 서버 렌더링 시도

**해결**: 
1. `"use client"` 지시어 추가
2. Client-side only 렌더링 보장
3. `TDSProvider` 컴포넌트 사용

---

## 모범 사례

### ✅ DO

- TDS가 필요한 컴포넌트만 격리하여 사용
- `TDSProvider`로 감싸서 스타일 충돌 방지
- Client-side 렌더링 보장

### ❌ DON'T

- 앱 전체에 `TDSMobileAITProvider` 적용 (스타일 충돌)
- 서버 컴포넌트에서 TDS 사용 (SSR 에러)
- TDS와 기존 스타일 혼용 (일관성 저하)

---

## 향후 계획

1. **더 많은 TDS 컴포넌트 활용**
   - Dialog, Toast, Sheet 등
   - 일관된 UI/UX 제공

2. **커스텀 테마 적용**
   - 헬스 히어로 브랜드 컬러 적용
   - TDS CSS 변수 커스터마이징

3. **접근성 개선**
   - TDS의 기본 접근성 기능 활용
   - 스크린 리더 지원 강화

---

## 참고 문서

- [TDS Mobile 공식 문서](https://tossmini-docs.toss.im/tds-mobile/start/)
- [TDS Button 컴포넌트](https://tossmini-docs.toss.im/tds-mobile/components/button/)
- [앱인토스 환경 가이드](https://techchat-apps-in-toss.toss.im/)


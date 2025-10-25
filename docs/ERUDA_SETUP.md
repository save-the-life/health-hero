# Eruda 디버깅 도구 설정 가이드

## 📋 개요

Eruda는 모바일 브라우저와 웹뷰에서 사용할 수 있는 개발자 도구입니다.  
토스 앱인토스 샌드박스 앱에서 로그인 플로우를 디버깅할 때 매우 유용합니다.

---

## 🎯 주요 기능

- 📱 **Console**: `console.log()` 출력 확인
- 🌐 **Network**: API 요청/응답 모니터링
- 💾 **Resources**: localStorage, sessionStorage 확인
- 🔍 **Elements**: HTML/CSS 구조 확인
- ℹ️ **Info**: 디바이스 정보, UserAgent 확인

---

## ⚙️ Next.js에서 Eruda 설정

### 방법 1: CDN 방식 (권장) ✅

#### 1. Client Component 생성

```typescript
// src/components/ErudaScript.tsx
'use client'

import { useEffect } from 'react'

export default function ErudaScript() {
  useEffect(() => {
    // 중복 로드 방지
    if ('eruda' in window) {
      console.log('✅ Eruda already loaded')
      return
    }

    // 이미 스크립트가 있는지 확인
    const existingScript = document.querySelector('script[src*="eruda"]')
    if (existingScript) {
      console.log('✅ Eruda script already exists')
      return
    }

    // CDN에서 Eruda 로드
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    script.async = true
    
    script.onload = () => {
      if ('eruda' in window) {
        const eruda = (window as typeof window & { eruda: { init: () => void } }).eruda
        eruda.init()
        console.log('🔧 Eruda initialized successfully!')
      }
    }
    
    script.onerror = () => {
      console.error('❌ Failed to load Eruda')
    }
    
    document.head.appendChild(script)
    
    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}
```

#### 2. Layout에 추가

```typescript
// src/app/layout.tsx
import ErudaScript from '@/components/ErudaScript'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErudaScript />
        {children}
      </body>
    </html>
  )
}
```

---

### 방법 2: npm 패키지 (비권장) ❌

```bash
# 설치
npm install --save-dev eruda

# 문제점
# - 번들 크기 증가
# - Next.js Static Export와 충돌 가능
# - 중복 로드 이슈
```

**권장하지 않는 이유**:
- CDN 방식이 더 안전하고 간단함
- 개발 도구는 번들에 포함할 필요 없음

---

## 🚨 문제 해결

### 문제 1: Eruda 버튼이 2개 표시됨

**원인**: npm 패키지와 CDN이 동시에 로드됨

**해결**:
```powershell
# 1. npm 패키지 제거
npm uninstall eruda

# 2. package.json 확인
# devDependencies에서 "eruda" 항목 제거

# 3. node_modules 재설치
npm install

# 4. 개발 서버 재시작
npm run dev
```

---

### 문제 2: Eruda 버튼이 보이지 않음

**원인 1**: 스크립트 로드 실패

**확인**:
```typescript
// Console에서 확인
console.log('eruda' in window)  // false면 로드 안 됨
```

**해결**:
- 네트워크 탭에서 `eruda` 스크립트 로드 확인
- CDN URL이 올바른지 확인
- 브라우저 캐시 삭제 후 재시도

**원인 2**: Next.js Script 컴포넌트 사용 (작동 안 함)

```typescript
// ❌ 작동 안 함
<Script 
  src="https://cdn.jsdelivr.net/npm/eruda"
  strategy="beforeInteractive"
  onLoad={...}
/>
```

**해결**: `useEffect` 사용 (위의 권장 방법)

---

### 문제 3: Hydration 에러 발생

**에러 메시지**:
```
Event handlers cannot be passed to Client Component props.
```

**해결**: Client Component로 분리 (`'use client'` 추가)

---

## 🎯 사용 방법

### 1. 로컬 개발

```powershell
npm run dev
```

브라우저에서 `http://localhost:3000` 접속
- 우측 하단에 **초록색 톱니바퀴 버튼** 확인
- 버튼 클릭 → 개발자 도구 패널 열림

### 2. 샌드박스 앱

```powershell
# 빌드
npm run build

# .ait 파일 업로드
# 앱인토스 콘솔 → 테스트 → 업로드
```

샌드박스 앱 실행 시:
- 우측 하단에 **초록색 톱니바퀴 버튼** 확인
- 로그인 플로우 디버깅 가능

---

## 📊 실제 디버깅 예시

### 토스 로그인 디버깅

```typescript
// src/components/TossLoginButton.tsx
const handleLogin = async () => {
  console.log('🚀 [TossLogin] 로그인 시작')
  
  const tossResult = await login()
  console.log('✅ [TossLogin] 토스 로그인 성공:', {
    userKey: tossResult.user?.userKey,
    name: tossResult.user?.name,
  })
  
  const supabaseResult = await TossAuthService.createOrUpdateUser(tossResult)
  console.log('✅ [TossLogin] Supabase 연동 성공')
}
```

**Eruda Console에서 확인**:
```
🚀 [TossLogin] 로그인 시작
📝 [TossLogin] 토스 로그인 SDK 호출 중...
✅ [TossLogin] 토스 로그인 성공: {userKey: 123456, name: "홍길동"}
💾 [TossLogin] Supabase에 사용자 정보 저장 중...
✅ [TossLogin] Supabase 연동 성공
🎮 [TossLogin] 게임 페이지로 이동
```

**Eruda Network에서 확인**:
- `POST /api-partner/v1/apps-in-toss/user/oauth2/generate-token`
- `GET /api-partner/v1/apps-in-toss/user`
- Supabase API 호출들

**Eruda Resources에서 확인**:
- `toss_access_token`
- `toss_refresh_token`
- `toss_user_key`

---

## 🔒 프로덕션 환경

### ⚠️ 중요: next.config.ts 설정

프로덕션 빌드에서 Eruda 콘솔 로그가 출력되지 않는 문제를 방지하려면:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  compiler: {
    // Eruda 콘솔 로그 출력을 위해 console 제거 비활성화
    // 프로덕션에서도 디버깅이 필요하므로 console.log 유지
    removeConsole: false,  // ✅ false로 설정 필수!
  },
};
```

**문제 원인:**
- `removeConsole: process.env.NODE_ENV === 'production'` 설정 시
- 프로덕션 빌드에서 모든 `console.log()` 제거됨
- Eruda 콘솔에 아무 로그도 출력되지 않음

**해결 방법:**
- `removeConsole: false`로 설정
- 프로덕션 빌드에서도 console.log 유지
- 앱인토스 샌드박스에서 디버깅 가능

### 옵션 1: 조건부 로드 (개발 환경만)

```typescript
// src/components/ErudaScript.tsx
useEffect(() => {
  // 프로덕션에서는 로드 안 함
  if (process.env.NODE_ENV === 'production') {
    return
  }

  // ... Eruda 로드 코드
}, [])
```

### 옵션 2: 항상 로드 (샌드박스 테스트용) ✅ 권장

현재 구현은 항상 로드됩니다.
샌드박스 테스트 시 디버깅이 필요하므로 이 방식을 권장합니다.

---

## 📋 체크리스트

배포 전 확인:

- [x] `ErudaScript.tsx` Client Component로 생성
- [x] `layout.tsx`에 추가
- [x] 중복 로드 방지 로직 구현
- [x] npm 패키지 제거 (`eruda` in devDependencies)
- [x] 로컬에서 버튼 1개만 표시 확인
- [ ] 샌드박스 앱에서 정상 작동 확인

---

## 💡 팁

### 1. Eruda 설정 커스터마이징

```typescript
script.onload = () => {
  if ('eruda' in window) {
    const eruda = window.eruda
    eruda.init({
      tool: ['console', 'network', 'resources'],  // 필요한 탭만
      useShadowDom: true,  // Shadow DOM 사용
      autoScale: true,  // 자동 스케일 조정
    })
  }
}
```

### 2. 특정 페이지에서만 로드

```typescript
// src/app/debug/page.tsx
'use client'

import ErudaScript from '@/components/ErudaScript'

export default function DebugPage() {
  return (
    <div>
      <ErudaScript />
      <h1>디버그 페이지</h1>
    </div>
  )
}
```

---

## 📚 참고 자료

- [Eruda 공식 GitHub](https://github.com/liriliri/eruda)
- [Eruda CDN (jsDelivr)](https://www.jsdelivr.com/package/npm/eruda)

---

**Last Updated**: 2025-01-20  
**Status**: Production Ready ✓


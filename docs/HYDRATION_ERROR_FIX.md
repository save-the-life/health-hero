# Next.js Hydration 에러 해결 가이드

## 🚨 발생한 에러

```
Hydration failed because the server rendered HTML didn't match the client. 
As a result this tree will be regenerated on the client.
```

---

## 🔍 문제 원인

### 잘못된 코드
```typescript
// ❌ Server와 Client에서 다르게 렌더링됨
{typeof window !== 'undefined' && typeof appLogin === 'undefined' && (
  <div>
    개발 환경 안내 메시지
  </div>
)}
```

**왜 에러가 발생하나?**
1. **Server (빌드 시)**: `window`가 없음 → 조건 `false` → 아무것도 렌더링 안 함
2. **Client (브라우저)**: `window`가 있음 → 조건 평가 → 렌더링될 수도 있음
3. **결과**: Server HTML과 Client HTML이 불일치 → Hydration 에러

---

## ✅ 해결 방법

### 1. useEffect + State 패턴 (권장)

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function MyComponent() {
  const [isClient, setIsClient] = useState(false)
  
  // 클라이언트 마운트 후에만 true로 변경
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <div>
      {/* ✅ Server와 Client 모두 일치 */}
      {isClient && typeof appLogin === 'undefined' && (
        <div>
          개발 환경 안내 메시지
        </div>
      )}
    </div>
  )
}
```

**작동 원리**:
1. **Server 렌더링**: `isClient = false` → 조건 불만족 → 렌더링 안 함
2. **Client 첫 렌더링**: `isClient = false` → 조건 불만족 → 렌더링 안 함
3. **useEffect 실행**: `setIsClient(true)` 실행
4. **Client 재렌더링**: `isClient = true` → 조건 평가 → 필요시 렌더링

결과: Server와 Client 첫 렌더링이 일치! ✅

---

### 2. 동적 import (Client Component)

```typescript
// components/ClientOnly.tsx
'use client'

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  if (!hasMounted) return null
  
  return <>{children}</>
}

// 사용
import ClientOnly from './ClientOnly'

<ClientOnly>
  <div>클라이언트에서만 렌더링</div>
</ClientOnly>
```

---

### 3. Suppressing Hydration Warning (간단한 불일치)

```typescript
// 간단한 시간 표시 등
<div suppressHydrationWarning>
  {new Date().toLocaleString()}
</div>
```

⚠️ **주의**: 실제 문제를 숨기는 것이므로 권장하지 않음

---

## 📋 실제 적용 예시

### Before (에러 발생)
```typescript
// src/components/TossLoginButton.tsx
export default function TossLoginButton() {
  return (
    <div>
      <button>로그인</button>
      
      {/* ❌ Hydration 에러 */}
      {typeof window !== 'undefined' && typeof appLogin === 'undefined' && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
          <p className="text-yellow-600 text-xs text-center">
            💡 토스 로그인은 앱인토스 환경에서만 사용할 수 있습니다.<br />
            샌드박스 앱 또는 토스앱에서 테스트해주세요.
          </p>
        </div>
      )}
    </div>
  )
}
```

### After (해결)
```typescript
// src/components/TossLoginButton.tsx
'use client'

import { useState, useEffect } from 'react'

export default function TossLoginButton() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <div>
      <button>로그인</button>
      
      {/* ✅ Hydration 에러 해결 */}
      {isClient && typeof appLogin === 'undefined' && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
          <p className="text-yellow-600 text-xs text-center">
            💡 토스 로그인은 앱인토스 환경에서만 사용할 수 있습니다.<br />
            샌드박스 앱 또는 토스앱에서 테스트해주세요.
          </p>
        </div>
      )}
    </div>
  )
}
```

---

## 🎯 Hydration 에러가 발생하는 일반적인 패턴

### 1. window/document 체크
```typescript
// ❌ 에러
{typeof window !== 'undefined' && <Component />}

// ✅ 해결
const [isClient, setIsClient] = useState(false)
useEffect(() => setIsClient(true), [])
{isClient && <Component />}
```

### 2. 랜덤 값
```typescript
// ❌ 에러
<div>{Math.random()}</div>

// ✅ 해결
const [randomValue] = useState(() => Math.random())
<div>{randomValue}</div>
```

### 3. Date/Time
```typescript
// ❌ 에러
<div>{new Date().toLocaleString()}</div>

// ✅ 해결 1: suppressHydrationWarning
<div suppressHydrationWarning>
  {new Date().toLocaleString()}
</div>

// ✅ 해결 2: useEffect
const [currentTime, setCurrentTime] = useState('')
useEffect(() => {
  setCurrentTime(new Date().toLocaleString())
}, [])
<div>{currentTime}</div>
```

### 4. localStorage/sessionStorage
```typescript
// ❌ 에러
const value = localStorage.getItem('key')

// ✅ 해결
const [value, setValue] = useState('')
useEffect(() => {
  setValue(localStorage.getItem('key') || '')
}, [])
```

---

## 📚 참고 자료

- [Next.js Hydration Error 공식 문서](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration 가이드](https://react.dev/link/hydration-mismatch)

---

## 🔑 핵심 정리

1. **Server와 Client의 첫 렌더링은 반드시 일치**해야 함
2. `typeof window !== 'undefined'` 체크는 Hydration 에러의 주범
3. **useEffect + State** 패턴이 가장 안전한 해결책
4. `'use client'` 선언 필수 (Client Component)

---

**Last Updated**: 2025-01-20  
**Status**: Production Ready ✓


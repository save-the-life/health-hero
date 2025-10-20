# mTLS 인증서 가이드

## 📌 mTLS가 필요한 경우

현재 기본 토스 로그인은 **mTLS 없이 작동**합니다. 하지만 다음 기능을 추가하려면 mTLS 인증서가 필요합니다.

[공식 문서 참고](https://developers-apps-in-toss.toss.im/development/integration-process.html)

### mTLS가 필요한 기능

- ⚠️ 토스 페이 결제
- ⚠️ 인앱 결제
- ⚠️ 기능성 푸시/알림 발송
- ⚠️ 프로모션 (토스 포인트) 지급
- ⚠️ 서버 사이드 토스 로그인 API

### mTLS가 불필요한 기능 (현재 구현)

- ✅ 토스 로그인 (클라이언트 직접 호출)
- ✅ 사용자 정보 조회
- ✅ 토큰 발급/갱신

---

## 🔐 mTLS란?

**mTLS (Mutual TLS)** = 양방향 TLS 인증

일반 HTTPS는 **클라이언트가 서버를 인증**합니다.
mTLS는 **서버도 클라이언트를 인증**합니다.

```
일반 HTTPS:
클라이언트 → (서버 인증서 확인) → 서버

mTLS:
클라이언트 ⇄ (양방향 인증서 확인) ⇄ 서버
```

---

## 📋 mTLS 인증서 발급 방법

### 1. 앱인토스 콘솔 접속

1. [앱인토스 콘솔](https://developers-apps-in-toss.toss.im) 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **mTLS 인증서** 클릭

### 2. 인증서 발급

1. **+ 발급받기** 버튼 클릭
2. 인증서와 키 파일 다운로드:
   - `client-cert.pem` (인증서)
   - `client-key.pem` (개인키)

⚠️ **중요**: 
- 인증서는 **390일간 유효**
- 만료 전에 재발급 필요
- 개인키는 **절대 공유하지 마세요**

### 3. 안전한 보관

```bash
# 인증서 파일을 안전한 위치에 보관
mkdir -p ~/.toss-certs
mv client-cert.pem ~/.toss-certs/
mv client-key.pem ~/.toss-certs/
chmod 600 ~/.toss-certs/client-key.pem
```

---

## 🏗️ 서버 구현 필요

mTLS를 사용하려면 **백엔드 서버**가 필요합니다.

### 아키텍처

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   브라우저   │ HTTPS │  우리 서버   │ mTLS │  토스 API   │
│  (클라이언트) │ ────→ │  (Next.js)  │ ───→ │   서버      │
└─────────────┘       └─────────────┘       └─────────────┘
```

### Next.js API Route 예시

```typescript
// app/api/toss/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import https from 'https'
import fs from 'fs'

export async function POST(request: NextRequest) {
  // 클라이언트에서 받은 데이터
  const body = await request.json()
  
  // mTLS 인증서 설정
  const agent = new https.Agent({
    cert: fs.readFileSync('/path/to/client-cert.pem'),
    key: fs.readFileSync('/path/to/client-key.pem')
  })

  // 토스 API 호출 (mTLS)
  const response = await fetch('https://apps-in-toss-api.toss.im/api-endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    // @ts-ignore
    agent
  })

  const data = await response.json()
  return NextResponse.json(data)
}
```

---

## 🔄 현재 구현 vs mTLS 구현

### 현재 구현 (mTLS 없음)

```typescript
// src/hooks/useTossAuth.ts
// 클라이언트에서 직접 호출
const response = await fetch('https://apps-in-toss-api.toss.im/...', {
  method: 'POST',
  body: JSON.stringify({ authorizationCode, referrer })
})
```

**장점:**
- ✅ 간단한 구현
- ✅ 서버 불필요
- ✅ 빠른 응답

**단점:**
- ❌ 제한된 기능
- ❌ 결제/포인트 기능 불가

### mTLS 구현 (미래)

```typescript
// 클라이언트
const response = await fetch('/api/toss/payment', {
  method: 'POST',
  body: JSON.stringify({ ... })
})

// 서버 (app/api/toss/payment/route.ts)
// mTLS로 토스 API 호출
```

**장점:**
- ✅ 모든 기능 사용 가능
- ✅ 더 안전한 구조
- ✅ 서버에서 검증 가능

**단점:**
- ❌ 복잡한 구현
- ❌ 서버 관리 필요
- ❌ 약간 느린 응답

---

## 📚 언제 mTLS로 전환해야 하나?

### 지금 당장 필요 없는 경우

- ✅ 토스 로그인만 사용
- ✅ 사용자 정보만 조회
- ✅ 무료 서비스

### mTLS 전환이 필요한 경우

- ⚠️ 토스 페이로 결제 받기
- ⚠️ 인앱 결제 구현
- ⚠️ 푸시 알림 발송
- ⚠️ 토스 포인트 프로모션
- ⚠️ 유료 서비스 출시

---

## 🚀 mTLS 전환 로드맵

### Phase 1: 현재 (mTLS 없음)
- [x] 토스 로그인
- [x] 사용자 정보 조회
- [x] 토큰 관리

### Phase 2: mTLS 준비
- [ ] 백엔드 API Routes 구현
- [ ] mTLS 인증서 발급
- [ ] 인증서 서버 설정

### Phase 3: mTLS 적용
- [ ] 결제 기능 구현
- [ ] 푸시 알림 구현
- [ ] 프로모션 기능 구현

---

## 🔒 보안 주의사항

### 인증서 관리

1. **개인키 보호**
   ```bash
   # 파일 권한 설정
   chmod 600 client-key.pem
   ```

2. **환경 변수로 관리**
   ```bash
   # .env.local
   TOSS_CERT_PATH=/path/to/client-cert.pem
   TOSS_KEY_PATH=/path/to/client-key.pem
   ```

3. **Git에 커밋 금지**
   ```gitignore
   # .gitignore
   *.pem
   *.crt
   *.key
   .toss-certs/
   ```

4. **프로덕션 배포**
   - Vercel: Environment Variables에 인증서 내용 저장
   - AWS: Secrets Manager 사용
   - Docker: Secret 볼륨 마운트

---

## 📖 참고 자료

- [앱인토스 개발 구조](https://developers-apps-in-toss.toss.im/development/integration-process.html)
- [mTLS 인증서 발급](https://developers-apps-in-toss.toss.im/development/integration-process.html#mtls-인증서-발급-방법)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## ✅ 체크리스트

### 현재 구현 확인
- [x] 토스 로그인 작동
- [x] Client Secret 불필요 확인
- [x] 클라이언트 직접 호출 방식
- [x] mTLS 없이 작동 가능

### mTLS 필요 시
- [ ] 결제/포인트 기능 필요한가?
- [ ] 푸시 알림 필요한가?
- [ ] 백엔드 서버 준비되었나?
- [ ] mTLS 인증서 발급받았나?
- [ ] 인증서 안전하게 보관되었나?

---

**현재 상태**: mTLS 불필요 ✅  
**미래 필요 시**: 이 문서 참고  
**마지막 업데이트**: 2024-01-20


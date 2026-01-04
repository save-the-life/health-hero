# Supabase Edge Functions 완벽 가이드

본 문서는 **Health Hero (헬스 히어로)** 프로젝트의 Supabase Edge Functions 구조, 구현 방법, 배포 프로세스를 상세히 정리한 기술 문서입니다.

## 목차

1. [Edge Functions 개요](#1-edge-functions-개요)
2. [현재 구현된 Functions](#2-현재-구현된-functions)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [공통 패턴 및 Best Practices](#4-공통-패턴-및-best-practices)
5. [개발 가이드](#5-개발-가이드)
6. [배포 및 관리](#6-배포-및-관리)
7. [트러블슈팅](#7-트러블슈팅)

---

## 1. Edge Functions 개요

### 1.1 Edge Functions란?

Supabase Edge Functions는 **Deno 런타임** 기반의 서버리스 함수입니다.

| 특징 | 설명 |
|------|------|
| **런타임** | Deno (TypeScript/JavaScript) |
| **실행 위치** | Cloudflare Workers 기반 (글로벌 엣지 네트워크) |
| **콜드 스타트** | ~50-100ms (매우 빠름) |
| **타임아웃** | 기본 150초 (최대 10분) |
| **메모리** | 512MB |
| **비용** | 월 500,000 요청까지 무료 |

### 1.2 사용 목적

| 용도 | 사례 |
|------|------|
| **보안** | 클라이언트에서 노출할 수 없는 민감한 로직 실행 (mTLS 인증서, Service Role Key 사용) |
| **비즈니스 로직** | 복잡한 계산, 데이터 검증, 점수 계산 등 |
| **외부 API 호출** | 토스 API, 결제 API 등 서버 간 통신 |
| **Webhook 수신** | 외부 서비스의 콜백 처리 (연결 끊기 콜백 등) |

---

## 2. 현재 구현된 Functions

### 2.1 toss-auth (토스 OAuth 프록시)

**목적:** mTLS 인증서를 사용한 토스 API 호출

| 항목 | 내용 |
|------|------|
| **경로** | `supabase/functions/toss-auth/index.ts` |
| **엔드포인트** | `https://uasphzqbluxctnukoazy.supabase.co/functions/v1/toss-auth` |
| **Method** | POST |
| **Action** | `generate-token` (토큰 발급), `get-user-info` (사용자 정보 조회) |

**주요 기능:**
1. 토스 인가 코드 → AccessToken 교환
2. AccessToken으로 사용자 정보 조회
3. mTLS 인증서 기반 보안 통신

**사용 예시:**
```typescript
// 1. AccessToken 발급
const response = await fetch(
  'https://uasphzqbluxctnukoazy.supabase.co/functions/v1/toss-auth',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'generate-token',
      authorizationCode: 'AUTH_CODE',
      referrer: 'DEFAULT'
    })
  }
);

// 2. 사용자 정보 조회
const userResponse = await fetch(
  'https://uasphzqbluxctnukoazy.supabase.co/functions/v1/toss-auth',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'get-user-info',
      accessToken: 'ACCESS_TOKEN',
      referrer: 'DEFAULT'
    })
  }
);
```

### 2.2 quiz-submit (퀴즈 제출 검증)

**목적:** 클라이언트에서 정답을 숨기고 서버에서 검증

| 항목 | 내용 |
|------|------|
| **경로** | `supabase/functions/quiz-submit/index.ts` |
| **엔드포인트** | `https://uasphzqbluxctnukoazy.supabase.co/functions/v1/quiz-submit` |
| **Method** | POST |

**주요 기능:**
1. 서버에서 정답 조회 (클라이언트에 노출 안됨)
2. 사용자 답안 검증
3. 점수 계산 (난이도별 차등 점수)
4. 퀴즈 기록 및 감사 로그 저장

**사용 예시:**
```typescript
const response = await fetch(
  'https://uasphzqbluxctnukoazy.supabase.co/functions/v1/quiz-submit',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId: 'uuid',
      userAnswer: 2,
      userId: 'user-uuid'
    })
  }
);

// 응답
// {
//   isCorrect: true,
//   explanation: "해설 내용",
//   correctAnswer: 2,
//   scoreEarned: 150,
//   difficultyLevel: 2
// }
```

### 2.3 toss-unlink (연결 끊기 콜백) [예정]

**목적:** 토스 앱에서 연결 끊기 시 DB 동기화

| 항목 | 내용 |
|------|------|
| **경로** | `supabase/functions/toss-unlink/index.ts` (미생성) |
| **엔드포인트** | `https://uasphzqbluxctnukoazy.supabase.co/functions/v1/toss-unlink` |
| **Method** | POST |
| **호출자** | 토스 서버 (Webhook) |

**주요 기능:**
1. Basic Auth 헤더 검증
2. toss_user_key로 사용자 검색
3. DB 업데이트 (status, unlinked_at)
4. 로그 기록

---

## 3. 프로젝트 구조

### 3.1 디렉토리 구조

```
supabase/functions/
├── _shared/
│   └── cors.ts               # CORS 헤더 공통 모듈
├── toss-auth/
│   └── index.ts              # 토스 OAuth mTLS 프록시
├── quiz-submit/
│   └── index.ts              # 퀴즈 제출 검증
├── toss-unlink/              # 연결 끊기 콜백 (예정)
│   └── index.ts
└── deno.d.ts                 # Deno 타입 정의
```

### 3.2 공통 모듈 (_shared)

**cors.ts:**
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

**사용법:**
```typescript
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // ... 로직

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
```

---

## 4. 공통 패턴 및 Best Practices

### 4.1 기본 구조 템플릿

모든 Edge Function은 다음 패턴을 따릅니다:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  // 1. CORS Preflight 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. 요청 데이터 파싱
    const body = await req.json();

    // 3. 비즈니스 로직 실행
    // ...

    // 4. 성공 응답
    return new Response(
      JSON.stringify({ result: 'success' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    // 5. 에러 처리
    console.error('[Function Name] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
```

### 4.2 환경 변수 사용

```typescript
// Supabase 클라이언트 (Service Role Key 사용)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// 커스텀 환경 변수
const TOSS_SECRET = Deno.env.get('TOSS_CALLBACK_SECRET');
const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY');
```

**환경 변수 설정:**
```bash
# 로컬 개발 (.env.local)
TOSS_CALLBACK_SECRET=my_secret_key

# Supabase Dashboard
Settings > Edge Functions > Secrets
```

### 4.3 Supabase 클라이언트 생성

**일반 클라이언트 (RLS 적용):**
```typescript
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);
```

**Admin 클라이언트 (RLS 우회):**
```typescript
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);
```

> ⚠️ **보안 주의:** Service Role Key는 RLS를 우회하므로 신중히 사용해야 합니다.

### 4.4 mTLS 인증서 사용 (토스 API)

```typescript
// Base64 인코딩된 인증서 읽기
const certBase64 = Deno.env.get('TOSS_CERT_BASE64');
const keyBase64 = Deno.env.get('TOSS_KEY_BASE64');

// Base64 디코딩
const cert = atob(certBase64);
const key = atob(keyBase64);

// mTLS 클라이언트 생성
const mtlsClient = Deno.createHttpClient({ cert, key });

// fetch 시 client 옵션 전달
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  client: mtlsClient // ⚠️ Deno 전용
});
```

### 4.5 에러 처리 패턴

```typescript
try {
  // 비즈니스 로직
} catch (error) {
  console.error('[Function Name] Error:', error);

  // 상세한 에러 정보 반환 (개발 환경)
  const isDev = Deno.env.get('ENVIRONMENT') === 'development';

  return new Response(
    JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: isDev && error instanceof Error ? error.stack : undefined
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    }
  );
}
```

### 4.6 로깅 Best Practices

```typescript
// 함수 시작 로그
console.log(`[toss-auth] Action: ${action}, Referrer: ${referrer}`);

// 중요 단계 로그
console.log('[toss-auth] Requesting access token from Toss API...');
console.log(`[toss-auth] Toss API response status: ${response.status}`);

// 에러 로그
console.error('[toss-auth] Failed to parse response:', error);

// 성공 로그
console.log('✅ User unlinked successfully:', userId);
```

---

## 5. 개발 가이드

### 5.1 로컬 개발 환경 설정

**1. Supabase CLI 설치:**
```bash
npm install -g supabase
```

**2. 로컬 Supabase 시작:**
```bash
supabase start
```

**3. 환경 변수 설정 (.env.local):**
```
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-key-here
TOSS_CALLBACK_SECRET=test_secret
```

**4. 함수 로컬 실행:**
```bash
supabase functions serve toss-auth --env-file .env.local
```

**5. 테스트 요청:**
```bash
curl -X POST http://localhost:54321/functions/v1/toss-auth \
  -H "Content-Type: application/json" \
  -d '{"action":"generate-token","authorizationCode":"test","referrer":"DEFAULT"}'
```

### 5.2 새로운 Function 생성

**1. Function 생성:**
```bash
supabase functions new my-function
```

**2. 코드 작성 (supabase/functions/my-function/index.ts):**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { data } = await req.json();

    // 로직 작성

    return new Response(
      JSON.stringify({ result: 'success' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

**3. 로컬 테스트:**
```bash
supabase functions serve my-function
```

**4. 배포:**
```bash
supabase functions deploy my-function
```

### 5.3 디버깅

**로그 확인:**
```bash
# 로컬
supabase functions serve my-function --debug

# 프로덕션 (Supabase Dashboard)
Dashboard > Edge Functions > my-function > Logs
```

**Deno 디버거:**
```bash
supabase functions serve my-function --inspect
```

---

## 6. 배포 및 관리

### 6.1 배포 프로세스

**단일 함수 배포:**
```bash
supabase functions deploy toss-auth
```

**모든 함수 배포:**
```bash
supabase functions deploy
```

**환경 변수와 함께 배포:**
```bash
supabase secrets set TOSS_CALLBACK_SECRET=my_secret_key
supabase functions deploy toss-unlink
```

### 6.2 환경 변수 관리

**Secrets 설정:**
```bash
# 단일 secret
supabase secrets set MY_SECRET=value

# 파일에서 읽기
supabase secrets set --env-file .env.production

# 목록 확인
supabase secrets list

# 삭제
supabase secrets unset MY_SECRET
```

**Supabase Dashboard에서 설정:**
```
Dashboard > Settings > Edge Functions > Secrets
```

### 6.3 함수 호출 URL

**프로덕션:**
```
https://uasphzqbluxctnukoazy.supabase.co/functions/v1/{function-name}
```

**로컬:**
```
http://localhost:54321/functions/v1/{function-name}
```

### 6.4 인증 설정

**Anon Key 인증 (기본):**
```typescript
fetch(url, {
  headers: {
    'apikey': 'SUPABASE_ANON_KEY',
    'Authorization': 'Bearer SUPABASE_ANON_KEY'
  }
})
```

**인증 없이 호출 (Public):**
```sql
-- Supabase Dashboard > SQL Editor
GRANT USAGE ON SCHEMA public TO anon;
GRANT EXECUTE ON FUNCTION public.my_function TO anon;
```

**JWT 토큰 검증:**
```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const authHeader = req.headers.get('Authorization');
if (!authHeader) throw new Error('Missing authorization header');

const token = authHeader.replace('Bearer ', '');
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

const { data: { user }, error } = await supabase.auth.getUser(token);
if (error || !user) throw new Error('Invalid token');
```

---

## 7. 트러블슈팅

### 7.1 일반적인 오류

**1. CORS 에러**

**증상:** 브라우저 콘솔에 CORS 오류
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**해결:**
```typescript
// CORS preflight 처리 추가
if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders });
}

// 모든 응답에 corsHeaders 포함
return new Response(data, {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

**2. 환경 변수 없음**

**증상:** `Deno.env.get()` 반환값이 undefined
```
Error: SUPABASE_URL is not defined
```

**해결:**
```bash
# 로컬
echo "MY_VAR=value" >> .env.local
supabase functions serve --env-file .env.local

# 프로덕션
supabase secrets set MY_VAR=value
```

**3. Timeout 에러**

**증상:** 함수 실행 시간 초과
```
Error: Function execution timed out
```

**해결:**
- 기본 타임아웃: 150초
- 장시간 작업은 비동기 처리 고려
- 외부 API 호출 시 타임아웃 설정

```typescript
const response = await fetch(url, {
  signal: AbortSignal.timeout(30000) // 30초 타임아웃
});
```

**4. Module import 에러**

**증상:** Deno import 실패
```
error: Module not found "https://esm.sh/..."
```

**해결:**
```typescript
// ✅ 올바른 import (URL 사용)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ❌ 잘못된 import (npm 스타일)
import { createClient } from "@supabase/supabase-js";
```

### 7.2 디버깅 팁

**1. 로그 확인:**
```bash
# 실시간 로그 모니터링
supabase functions serve my-function

# Supabase Dashboard 로그
Dashboard > Edge Functions > my-function > Logs (최근 1시간)
```

**2. 요청/응답 검증:**
```typescript
// 요청 body 로깅
const body = await req.json();
console.log('Request body:', JSON.stringify(body, null, 2));

// 응답 데이터 로깅
console.log('Response:', JSON.stringify(responseData, null, 2));
```

**3. 에러 스택 추적:**
```typescript
catch (error) {
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('Name:', error.name);
  console.error('Message:', error.message);
}
```

### 7.3 성능 최적화

**1. 콜드 스타트 최소화:**
```typescript
// ✅ 함수 외부에서 초기화 (재사용)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // 함수 내부에서는 초기화하지 않음
});
```

**2. 불필요한 await 제거:**
```typescript
// ❌ 순차 실행 (느림)
const result1 = await fetch(url1);
const result2 = await fetch(url2);

// ✅ 병렬 실행 (빠름)
const [result1, result2] = await Promise.all([
  fetch(url1),
  fetch(url2)
]);
```

**3. 캐싱 활용:**
```typescript
// 환경 변수 캐싱
const TOSS_SECRET = Deno.env.get('TOSS_CALLBACK_SECRET');

// DB 결과 캐싱 (글로벌 변수)
let cachedQuestions: Question[] | null = null;
```

---

## 8. 보안 체크리스트

### 8.1 환경 변수 보안

- [ ] Service Role Key는 절대 클라이언트에 노출하지 않기
- [ ] 민감한 정보는 Supabase Secrets에 저장
- [ ] `.env.local` 파일은 `.gitignore`에 추가
- [ ] 프로덕션과 개발 환경 변수 분리

### 8.2 API 보안

- [ ] Basic Auth, JWT 등 인증 메커니즘 구현
- [ ] Rate limiting 고려 (토스 콜백 등)
- [ ] 입력 데이터 검증 (타입, 범위 체크)
- [ ] SQL Injection 방지 (Supabase 클라이언트 사용)

### 8.3 CORS 설정

- [ ] 프로덕션에서는 특정 도메인만 허용 고려
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};
```

---

## 9. 참고 자료

- [Supabase Edge Functions 공식 문서](https://supabase.com/docs/guides/functions)
- [Deno 공식 문서](https://deno.land/manual)
- [Deno Deploy 문서](https://deno.com/deploy/docs)
- [토스 로그인 API 문서](https://developers-apps-in-toss.toss.im/login/develop.md)

---

## 부록: 함수별 환경 변수 목록

| Function | 환경 변수 | 필수 여부 | 설명 |
|----------|-----------|-----------|------|
| **toss-auth** | `SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| | `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service Role Key (자동 설정) |
| | `TOSS_CERT_BASE64` | ✅ | mTLS 인증서 (Base64) |
| | `TOSS_KEY_BASE64` | ✅ | mTLS 개인키 (Base64) |
| **quiz-submit** | `SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| | `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service Role Key |
| **toss-unlink** | `SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| | `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service Role Key |
| | `TOSS_CALLBACK_SECRET` | ✅ | 토스 콜백 인증 비밀키 |

---

## 문서 버전

- **최초 작성:** 2026-01-04
- **최종 수정:** 2026-01-04
- **작성자:** Health Hero Dev Team

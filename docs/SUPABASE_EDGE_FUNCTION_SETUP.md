# Supabase Edge Function 설정 가이드

## 📋 개요

토스 API는 mTLS 인증서가 필요하므로 클라이언트에서 직접 호출할 수 없습니다.  
Supabase Edge Function을 백엔드 프록시로 사용하여 이 문제를 해결합니다.

---

## 🎯 아키텍처

```
[클라이언트 (Next.js)]
    ↓ authorizationCode
[Supabase Edge Function (toss-auth)]
    ↓ HTTP API
[토스 API (apps-in-toss-api.toss.im)]
```

**주의**: 현재 Supabase Edge Functions는 mTLS를 직접 지원하지 않습니다.  
따라서 토스 API가 mTLS 없이 호출 가능한 경우에만 작동합니다.

---

## ⚙️ Supabase CLI 설치

### Windows (PowerShell)

```powershell
# Scoop 사용
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 또는 직접 다운로드
# https://github.com/supabase/cli/releases
```

### 설치 확인

```powershell
supabase --version
```

---

## 🚀 Edge Function 배포

### 1. Supabase 로그인

```powershell
supabase login
```

브라우저에서 인증 후 access token을 받습니다.

### 2. 프로젝트 연결

```powershell
# Supabase 프로젝트 ID 확인
# Supabase Dashboard → Settings → General → Reference ID

supabase link --project-ref YOUR_PROJECT_ID
```

### 3. Edge Function 배포

```powershell
# toss-auth 함수 배포
supabase functions deploy toss-auth

# 배포 확인
supabase functions list
```

---

## 🔑 환경 변수 설정

### 로컬 테스트용 (.env.local)

```.env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_TOSS_APP_KEY=health-hero
```

### Supabase Edge Function용 (선택사항)

```powershell
# 토스 Client Secret이 필요한 경우
supabase secrets set TOSS_CLIENT_SECRET=your_client_secret
```

---

## 🧪 로컬 테스트

### 1. Edge Function 로컬 실행

```powershell
supabase start
supabase functions serve toss-auth
```

### 2. 테스트 요청

```powershell
curl -X POST http://localhost:54321/functions/v1/toss-auth `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ANON_KEY" `
  -d '{\"action\":\"generate-token\",\"authorizationCode\":\"test\",\"referrer\":\"SANDBOX\"}'
```

---

## 📁 파일 구조

```
supabase/
├── functions/
│   ├── toss-auth/
│   │   └── index.ts          # 토스 인증 프록시
│   └── _shared/
│       └── cors.ts            # CORS 헤더
```

---

## 🔒 보안 고려사항

### 1. CORS 설정

현재는 모든 origin을 허용(`*`)하고 있습니다.  
프로덕션에서는 특정 도메인만 허용하도록 수정하세요:

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-app-domain.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### 2. Rate Limiting

Supabase Edge Functions는 기본적으로 rate limiting이 적용됩니다:
- Free tier: 500,000 invocations/month
- Pro tier: 2,000,000 invocations/month

### 3. 로그 모니터링

```powershell
# 실시간 로그 확인
supabase functions logs toss-auth
```

---

## 🚨 mTLS 인증서 문제

**중요**: Supabase Edge Functions는 현재 mTLS 클라이언트 인증서를 지원하지 않습니다.

### 해결 방법

#### 옵션 1: 토스 API가 샌드박스에서 mTLS 미요구 (테스트)
- 샌드박스 환경에서는 mTLS 없이 테스트 가능할 수 있음
- 프로덕션에서는 mTLS 필수

#### 옵션 2: 별도 백엔드 서버 구축
- Node.js/Express 서버에서 mTLS 인증서 사용
- AWS Lambda, Vercel Serverless Functions 등

#### 옵션 3: Cloudflare Workers (추천)
- Cloudflare Workers는 mTLS 지원
- 토스 API 프록시로 사용 가능

---

## 📚 참고 자료

- [Supabase Edge Functions 문서](https://supabase.com/docs/guides/functions)
- [Deno Deploy 문서](https://deno.com/deploy/docs)
- [토스 API 문서](https://developers-apps-in-toss.toss.im/api/overview.html)

---

## 🔧 트러블슈팅

### 함수 배포 실패

```powershell
# 로그 확인
supabase functions logs toss-auth

# 다시 배포
supabase functions deploy toss-auth --no-verify-jwt
```

### CORS 에러

- `cors.ts` 파일의 `Access-Control-Allow-Origin` 확인
- 브라우저 개발자 도구에서 요청 헤더 확인

### 인증 에러

- Supabase Anon Key가 올바른지 확인
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버 재시작


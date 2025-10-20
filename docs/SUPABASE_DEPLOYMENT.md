# Supabase로 프로덕션 배포하기

## 📋 개요

Supabase Edge Functions를 사용하여 **서버 없이** 토스 로그인을 배포할 수 있습니다.

### ✅ 장점
- 서버 관리 불필요 (Serverless)
- Supabase 데이터베이스와 통합
- 무료 티어 사용 가능
- 빠른 배포

### ⚠️ 제한사항
- **mTLS 인증서를 직접 사용할 수 없음**
- 토스 API가 mTLS를 강제하면 작동하지 않을 수 있음
- **샌드박스 환경에서 먼저 테스트 필수**

---

## 🚀 배포 단계

### 1. Supabase CLI 설치

#### Windows (PowerShell)

```powershell
# Scoop으로 설치 (권장)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 또는 npm으로 설치
npm install -g supabase
```

#### Mac/Linux

```bash
brew install supabase/tap/supabase
```

#### 설치 확인

```powershell
supabase --version
```

---

### 2. Supabase 로그인

```powershell
supabase login
```

브라우저가 열리고 인증 페이지로 이동합니다.  
Access Token을 복사하여 터미널에 붙여넣습니다.

---

### 3. 프로젝트 연결

```powershell
# Supabase Dashboard에서 Project ID 확인
# Settings → General → Reference ID

supabase link --project-ref YOUR_PROJECT_ID
```

**Project ID 확인 방법**:
1. https://supabase.com/dashboard
2. 프로젝트 선택
3. Settings → General
4. Reference ID 복사 (예: `abcdefghijklmnop`)

---

### 4. Edge Function 배포

```powershell
# toss-auth 함수 배포
supabase functions deploy toss-auth

# 배포 확인
supabase functions list
```

**성공 메시지**:
```
Deploying function toss-auth...
✅ Function deployed successfully!
URL: https://YOUR_PROJECT.supabase.co/functions/v1/toss-auth
```

---

### 5. 환경 변수 설정

#### 로컬 개발용 (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 토스
NEXT_PUBLIC_TOSS_APP_KEY=health-hero

# 백엔드 URL (Supabase 우선 사용하므로 필수 아님)
# NEXT_PUBLIC_BACKEND_URL=
```

**Supabase URL 및 Anon Key 확인**:
1. Supabase Dashboard → Settings → API
2. **Project URL** 복사 → `NEXT_PUBLIC_SUPABASE_URL`
3. **anon public** 키 복사 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 6. 프론트엔드 빌드 및 테스트

```powershell
# 빌드
npm run build
npx @apps-in-toss/cli build

# .ait 파일 업로드
# 앱인토스 콘솔 → 테스트 → 업로드
```

---

## 🧪 테스트

### 1. Edge Function 직접 테스트

```powershell
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/toss-auth" `
  -H "Authorization: Bearer YOUR_ANON_KEY" `
  -H "Content-Type: application/json" `
  -d '{\"action\":\"generate-token\",\"authorizationCode\":\"test\",\"referrer\":\"SANDBOX\"}'
```

### 2. 샌드박스 앱에서 테스트

1. 샌드박스 앱 실행
2. "토스로 시작하기" 버튼 클릭
3. Eruda Console 확인

**예상 로그**:
```
[useTossAuth] 액세스 토큰 요청 (Supabase Edge Function)
→ url: https://YOUR_PROJECT.supabase.co/functions/v1/toss-auth
```

---

## 📊 Supabase Edge Function 로그 확인

```powershell
# 실시간 로그 확인
supabase functions logs toss-auth

# 최근 로그 확인
supabase functions logs toss-auth --limit 50
```

**로그 예시**:
```
[toss-auth] Action: generate-token
[toss-auth] Requesting access token from Toss API...
[toss-auth] Toss API response status: 200
```

---

## 🔥 문제 해결

### ❌ mTLS 인증 필요 에러

만약 Supabase Edge Function에서 토스 API 호출 시 mTLS 에러가 발생하면:

```
[toss-auth] Toss API response status: 403
Error: mTLS certificate required
```

**해결책**: Node.js 백엔드 서버 사용

1. `backend/` 폴더의 Node.js 서버 사용
2. Railway.app 또는 AWS EC2에 배포
3. `.env.local`에 백엔드 URL 추가:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
   ```

**우선순위**:
1. `NEXT_PUBLIC_SUPABASE_URL`이 있으면 Supabase 사용
2. 없으면 `NEXT_PUBLIC_BACKEND_URL` 사용
3. 둘 다 없으면 `localhost:3001` 사용

---

### ✅ Supabase만으로 성공하는 경우

토스 API가 **샌드박스 환경에서 mTLS를 요구하지 않는다면** Supabase만으로 충분합니다!

이 경우:
- ✅ 서버 관리 불필요
- ✅ 인프라 비용 절감
- ✅ 자동 스케일링
- ✅ Supabase 무료 티어 활용

---

## 💰 Supabase 요금제

### Free Tier
- Edge Functions: **500,000 호출/월**
- Database: 500MB
- Storage: 1GB
- 소규모 서비스에 충분

### Pro Tier ($25/월)
- Edge Functions: **2,000,000 호출/월**
- Database: 8GB
- Storage: 100GB

---

## 🔐 보안 설정

### 1. CORS 제한

프로덕션에서는 CORS를 특정 도메인만 허용하도록 수정:

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-app-domain.tossmini.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### 2. Rate Limiting

Supabase는 기본적으로 Rate Limiting을 제공하지만,  
추가 제한이 필요한 경우 Edge Function 내에서 구현 가능합니다.

---

## 📚 참고 자료

- [Supabase Edge Functions 문서](https://supabase.com/docs/guides/functions)
- [Supabase CLI 문서](https://supabase.com/docs/reference/cli)
- [토스 API 문서](https://developers-apps-in-toss.toss.im/api/overview.html)

---

## 🎯 요약

### Supabase 배포 (추천 🌟)

**장점**:
- ✅ 서버리스 (관리 불필요)
- ✅ Supabase 통합
- ✅ 무료 티어 충분
- ✅ 빠른 배포

**단점**:
- ❌ mTLS 미지원
- ⚠️ 토스 API mTLS 요구 시 작동 안 함

**적합한 경우**:
- 토스 샌드박스에서 mTLS 없이 작동
- 프로토타입/MVP
- 소규모 서비스

---

### Node.js 백엔드 (대안)

**장점**:
- ✅ mTLS 완벽 지원
- ✅ 프로덕션 보장
- ✅ 유연한 커스터마이징

**단점**:
- ❌ 서버 관리 필요
- ❌ 인프라 비용
- ❌ 배포 복잡도 증가

**적합한 경우**:
- 프로덕션 환경
- mTLS 필수
- 대규모 서비스

---

**권장 전략**:
1. **먼저 Supabase로 테스트**
2. mTLS 에러 발생 시 → Node.js 백엔드로 전환


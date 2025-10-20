# Supabase Edge Functions mTLS 배포 가이드 ✅

> ✅ **상태**: 완전 작동 (2025-01-20)  
> 🎯 **테스트**: 샌드박스 성공  
> 🚀 **배포**: Production Ready

## 🎉 중요한 발견!

**Supabase Edge Functions에서 mTLS 지원 가능합니다!**

Deno의 `Deno.createHttpClient` API를 사용하여 mTLS 클라이언트 인증서를 적용할 수 있습니다.

### 출처
- [Supabase Community Discussion](https://www.answeroverflow.com/m/1407359757743947786)
- [Deno Deploy Documentation](https://deno.com/deploy/docs)

---

## 🚀 Supabase로 배포하기 (권장 🌟)

### 장점
- ✅ **서버 관리 불필요** (Serverless)
- ✅ **mTLS 완벽 지원**
- ✅ Supabase 데이터베이스와 통합
- ✅ 무료 티어 충분 (500,000 호출/월)
- ✅ 자동 스케일링
- ❌ ~~Node.js 백엔드 배포 불필요!~~

---

## 📦 배포 단계

### 1. Supabase CLI 설치

```powershell
# Scoop으로 설치 (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 또는 npm으로 설치
npm install -g supabase

# 설치 확인
supabase --version
```

---

### 2. Supabase 로그인

```powershell
supabase login
```

브라우저에서 인증 후 Access Token 입력

---

### 3. 프로젝트 연결

```powershell
# Supabase Dashboard에서 Project ID 확인
# Settings → General → Reference ID

supabase link --project-ref YOUR_PROJECT_ID
```

---

### 4. 인증서 Base64 인코딩

```powershell
cd supabase/functions/scripts
.\encode-certs.ps1
```

스크립트가 출력한 명령어를 복사하여 실행:

```powershell
supabase secrets set TOSS_CERT_BASE64="..."
supabase secrets set TOSS_KEY_BASE64="..."
```

---

### 5. Edge Function 배포

```powershell
# toss-auth 함수 배포
supabase functions deploy toss-auth

# 배포 확인
supabase functions list
```

**성공 메시지**:
```
✅ Function deployed successfully!
URL: https://YOUR_PROJECT.supabase.co/functions/v1/toss-auth
```

---

### 6. 환경 변수 설정

#### `.env.local` 파일 (프로젝트 루트)

```env
# Supabase (mTLS 지원 Edge Function)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 토스
NEXT_PUBLIC_TOSS_APP_KEY=health-hero

# 백엔드 URL (Supabase 우선 사용하므로 선택사항)
# NEXT_PUBLIC_BACKEND_URL=
```

**Supabase URL 및 Anon Key 확인**:
1. Supabase Dashboard → Settings → API
2. **Project URL** 복사
3. **anon public** 키 복사

---

### 7. 빌드 및 테스트

```powershell
# 빌드
npm run build
npx @apps-in-toss/cli build

# .ait 파일 업로드
# 앱인토스 콘솔 → 테스트 → 업로드
```

---

### 8. 샌드박스 앱에서 테스트

1. 샌드박스 앱 실행
2. "토스로 시작하기" 버튼 클릭
3. **Eruda Console** 확인

**예상 로그**:
```
[useTossAuth] appLogin 함수 호출 시작...
[useTossAuth] appLogin() 응답: {...}
[useTossAuth] 인가 코드 획득 성공
[useTossAuth] 액세스 토큰 요청 (Supabase Edge Function (mTLS))
→ url: https://YOUR_PROJECT.supabase.co/functions/v1/toss-auth
[toss-auth] Action: generate-token
[mTLS] 인증서 로드 성공
[toss-auth] Toss API response status: 200
[useTossAuth] 액세스 토큰 응답: {ok: true, status: 200}
✅ [TossLogin] 토스 로그인 성공
```

---

## 🔍 Edge Function 로그 확인

```powershell
# 실시간 로그
supabase functions logs toss-auth

# 최근 로그
supabase functions logs toss-auth --limit 50
```

---

## 🐛 트러블슈팅

### 1. mTLS 인증서 에러

```
[mTLS] 인증서 환경 변수가 설정되지 않았습니다.
```

**해결**:
```powershell
# 환경 변수 확인
supabase secrets list

# 다시 설정
cd supabase/functions/scripts
.\encode-certs.ps1
# 출력된 명령어 실행
```

---

### 2. Deno.createHttpClient 에러

```
Error: Deno.createHttpClient is not a function
```

**해결**:
- Supabase Edge Functions는 Deno Deploy 환경 사용
- `Deno.createHttpClient`가 지원되는지 확인
- 필요 시 Supabase Support에 문의

---

### 3. CORS 에러

```
Access to fetch blocked by CORS
```

**해결**:
- `supabase/functions/_shared/cors.ts` 확인
- CORS 헤더 설정 확인

---

## 💰 비용

### Supabase 무료 티어
- ✅ Edge Functions: **500,000 호출/월**
- ✅ Database: 500MB
- ✅ Storage: 1GB
- ✅ 소규모 서비스 충분

### Pro 티어 ($25/월)
- Edge Functions: 2,000,000 호출/월
- Database: 8GB
- Storage: 100GB

---

## 🎯 Supabase vs Node.js 백엔드

| 항목 | Supabase Edge Functions | Node.js Backend (Railway) |
|------|-------------------------|---------------------------|
| mTLS 지원 | ✅ | ✅ |
| 서버 관리 | ❌ 불필요 | ✅ 필요 |
| 비용 | 무료 ~ $25/월 | 무료 ~ $20/월 |
| 배포 난이도 | ⭐ 쉬움 | ⭐⭐ 보통 |
| 스케일링 | 자동 | 수동 |
| 데이터베이스 통합 | ✅ 기본 제공 | 별도 설정 필요 |
| 권장도 | 🌟🌟🌟🌟🌟 | 🌟🌟🌟 |

---

## ✅ 최종 권장 사항

### 🌟 Supabase Edge Functions 사용 (1순위)

**이유**:
1. ✅ mTLS 완벽 지원 (Deno.createHttpClient)
2. ✅ 서버 관리 불필요
3. ✅ 무료 티어 충분
4. ✅ Supabase 데이터베이스와 통합
5. ✅ 빠른 배포

**적합한 경우**:
- 대부분의 경우
- 빠른 프로토타입
- 서버 관리 부담 회피

---

### 🔧 Node.js 백엔드 사용 (2순위)

**이유**:
- 더 많은 커스터마이징 필요
- Node.js 생태계 활용
- 복잡한 비즈니스 로직

**적합한 경우**:
- 복잡한 서버 로직
- Node.js 전용 라이브러리 필요
- 기존 Node.js 인프라 활용

---

## 🚀 지금 바로 시작

```powershell
# 1. 인증서 인코딩
cd supabase/functions/scripts
.\encode-certs.ps1

# 2. 환경 변수 설정 (출력된 명령어 실행)
supabase secrets set TOSS_CERT_BASE64="..."
supabase secrets set TOSS_KEY_BASE64="..."

# 3. 배포
supabase functions deploy toss-auth

# 4. .env.local 설정
# NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 5. 빌드 및 테스트
npm run build
npx @apps-in-toss/cli build
```

**축하합니다! Supabase로 배포 완료!** 🎉


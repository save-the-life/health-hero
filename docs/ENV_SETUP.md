# 🔐 환경 변수 설정 가이드

## 보안 주의사항

### ✅ 클라이언트에서 안전한 환경 변수

- `NEXT_PUBLIC_*` 접두사가 붙은 변수는 **클라이언트(브라우저)에 노출됩니다**
- 민감하지 않은 공개 정보만 포함해야 합니다

### ❌ 절대 클라이언트에 노출하면 안 되는 것

- API Secret Keys
- Private Keys
- Database Passwords
- Client Secrets (OAuth)

---

## 필수 환경 변수

### 1. Supabase 설정

```bash
# Project URL (공개 가능)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# anon public key (공개 가능 - Row Level Security로 보호됨)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**확인 방법:**

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Project Settings** > **API** 메뉴
4. **Project URL**과 **anon public** key 복사

---

### 2. 토스 앱인토스 설정

```bash
# Client ID (공개 가능)
NEXT_PUBLIC_TOSS_CLIENT_ID=your_toss_client_id

# 앱 이름 (공개 가능)
NEXT_PUBLIC_TOSS_APP_KEY=health-hero
```

**확인 방법:**

1. [앱인토스 콘솔](https://developers-apps-in-toss.toss.im) 접속
2. 프로젝트 선택
3. **개발** > **토스 로그인** 메뉴
4. **Client ID** 복사

### 3. 광고 설정 (2025-01-27 추가)

```bash
# 하트 충전 광고 그룹 ID (공개 가능)
NEXT_PUBLIC_AD_GROUP_HEART_REFILL=your-ad-group-id-here
```

**확인 방법:**

1. [앱인토스 콘솔](https://developers-apps-in-toss.toss.im) 접속
2. 프로젝트 선택
3. **개발** > **광고** 메뉴
4. **광고 그룹 ID** 복사

---

## ⚠️ Client Secret은 왜 없나요?

### 토스 로그인 플로우 분석

현재 구현된 토스 로그인은 다음과 같이 작동합니다:

```typescript
// 1. 앱인토스 SDK를 통해 인가 코드 받기
const { authorizationCode, referrer } = await appLogin();

// 2. 인가 코드로 토큰 발급 (Client Secret 불필요!)
const response = await fetch("토스 API 엔드포인트", {
  body: JSON.stringify({
    authorizationCode, // ✅ 필요
    referrer, // ✅ 필요
    // ❌ Client Secret 불필요!
  }),
});
```

### 토스 API의 보안 메커니즘

토스는 다음과 같은 방식으로 보안을 유지합니다:

1. **인가 코드 (authorizationCode)**

   - 10분 동안만 유효
   - 1회만 사용 가능
   - 앱인토스 SDK를 통해서만 발급

2. **Referrer 검증**

   - `sandbox` 또는 `DEFAULT` 값
   - 토스 앱 내부에서만 발급

3. **도메인 화이트리스트**
   - 앱인토스 콘솔에 등록된 앱만 사용 가능
   - 콘솔에서 관리

따라서 **Client Secret 없이도 안전**합니다!

---

## .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 입력:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 토스 앱인토스
NEXT_PUBLIC_TOSS_CLIENT_ID=your-toss-client-id
NEXT_PUBLIC_TOSS_APP_KEY=health-hero

# 광고 설정
NEXT_PUBLIC_AD_GROUP_HEART_REFILL=your-ad-group-id-here
```

---

## 환경별 설정

### 개발 환경 (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
NEXT_PUBLIC_TOSS_CLIENT_ID=dev-client-id
NEXT_PUBLIC_TOSS_APP_KEY=health-hero
NEXT_PUBLIC_AD_GROUP_HEART_REFILL=dev-ad-group-id
```

### 프로덕션 환경 (.env.production)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
NEXT_PUBLIC_TOSS_CLIENT_ID=prod-client-id
NEXT_PUBLIC_TOSS_APP_KEY=health-hero
NEXT_PUBLIC_AD_GROUP_HEART_REFILL=prod-ad-group-id
```

---

## 보안 체크리스트

- [x] `NEXT_PUBLIC_` 접두사가 붙은 변수만 사용
- [x] Client Secret 불필요 (토스 API 설계)
- [x] Supabase anon key는 RLS로 보호
- [x] `.env.local` 파일은 `.gitignore`에 포함
- [x] 환경 변수는 절대 Git에 커밋 안 함
- [x] 프로덕션 환경 변수는 배포 플랫폼(Vercel 등)에서 관리

---

## 추가 보안 고려사항

### Supabase Row Level Security (RLS)

`anon key`가 클라이언트에 노출되어도 안전한 이유:

1. **RLS 정책**으로 사용자는 자신의 데이터만 접근
2. **테이블별 정책**:

   ```sql
   -- 사용자는 자신의 프로필만 조회/수정 가능
   CREATE POLICY "Users can view own profile" ON user_profiles
     FOR SELECT USING (auth.uid() = id);
   ```

3. **인증된 사용자만** 데이터 수정 가능

### 토스 토큰 보안

1. **Access Token**:

   - localStorage에 저장 (XSS 주의)
   - 1시간 만료
   - HTTPS로만 전송

2. **Refresh Token**:
   - localStorage에 저장
   - 자동 갱신 구현

---

## 문제 해결

### "Missing environment variables" 에러

**원인**: 환경 변수가 설정되지 않음

**해결**:

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 파일 이름이 정확한지 확인 (`.env.local`, `.env`가 아님)
3. 개발 서버 재시작: `npm run dev`

### 환경 변수가 업데이트 안 됨

**해결**:

1. 개발 서버 종료 (Ctrl+C)
2. `.next` 폴더 삭제: `Remove-Item -Recurse -Force .next`
3. 개발 서버 재시작: `npm run dev`

---

## 참고 문서

- [Next.js 환경 변수 가이드](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase 보안 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [토스 앱인토스 문서](https://developers-apps-in-toss.toss.im/)

---

**Last Updated**: 2024-01-20  
**보안 검토**: 통과 ✅

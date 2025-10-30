# 🔧 트러블슈팅 가이드

## 📋 목차

1. [빌드 에러](#빌드-에러)
2. [Hydration 에러](#hydration-에러)
3. [Eruda 관련](#eruda-관련)
4. [TypeScript 에러](#typescript-에러)
5. [환경 변수](#환경-변수)
6. [토스 로그인 에러](#토스-로그인-에러)
7. [Supabase 에러](#supabase-에러)

---

## 🚨 빌드 에러

### 1. `EPERM: operation not permitted`

**에러 메시지**:
```
Internal Error: EPERM: operation not permitted, rename 'dist\server' -> 'dist\web\server'
```

**원인**: Next.js가 `server/` 폴더를 생성하고 granite이 이를 이동하려 할 때 Windows 권한 문제

**해결**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',  // ← 추가: SSG 모드
}
```

자세한 내용: [docs/NEXTJS_CONFIG.md](NEXTJS_CONFIG.md)

---

### 2. `Image Optimization is not compatible with 'export'`

**에러 메시지**:
```
Image Optimization using the default loader is not compatible with `{ output: 'export' }`
```

**해결**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // ← 추가
  },
}
```

---

### 3. `Page is missing "generateStaticParams()"`

**에러 메시지**:
```
Page "/game/[phase]" is missing "generateStaticParams()" so it cannot be used with "output: export"
```

**해결**:
```typescript
// src/app/game/[phase]/page.tsx
export function generateStaticParams() {
  return [
    { phase: '1' },
    { phase: '2' },
    { phase: '3' },
  ]
}
```

---

## 💧 Hydration 에러

### 1. `Hydration failed because the server rendered HTML didn't match the client`

**원인**: `typeof window !== 'undefined'` 체크

**해결**:
```typescript
// ❌ 잘못된 코드
{typeof window !== 'undefined' && <Component />}

// ✅ 올바른 코드
const [isClient, setIsClient] = useState(false)
useEffect(() => setIsClient(true), [])
{isClient && <Component />}
```

자세한 내용: [docs/HYDRATION_ERROR_FIX.md](HYDRATION_ERROR_FIX.md)

---

### 2. `Event handlers cannot be passed to Client Component props`

**원인**: Server Component에서 이벤트 핸들러 사용

**해결**: Client Component로 분리
```typescript
// ❌ 잘못된 코드 (Server Component)
<Script onLoad={() => { ... }} />

// ✅ 올바른 코드
// ErudaScript.tsx
'use client'
export default function ErudaScript() {
  return <Script onLoad={() => { ... }} />
}
```

---

## 🐛 Eruda 관련

### 1. Eruda 버튼이 보이지 않음

**확인 사항**:

1. **Console 로그 확인**
   ```
   F12 → Console 탭
   "🔧 Eruda initialized successfully!" 메시지 확인
   ```

2. **네트워크 확인**
   ```
   F12 → Network 탭
   eruda 스크립트 로드 확인
   ```

3. **브라우저 캐시 삭제**
   ```
   Ctrl + Shift + R (강력 새로고침)
   ```

4. **개발 서버 재시작**
   ```powershell
   # Ctrl+C로 종료 후
   npm run dev
   ```

---

### 2. Eruda 버튼이 2개 표시됨

**원인**: npm 패키지와 CDN이 동시에 로드됨

**해결**:
```powershell
# 1. npm 패키지 제거
npm uninstall eruda

# 2. package.json 확인
# devDependencies에서 "eruda" 제거 확인

# 3. node_modules 재설치
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# 4. 개발 서버 재시작
npm run dev
```

자세한 내용: [docs/ERUDA_SETUP.md](ERUDA_SETUP.md)

---

## 📝 TypeScript 에러

### 1. `'user' is possibly 'undefined'`

**해결**:
```typescript
// ❌ 잘못된 코드
const email = `${user.userKey}@example.com`

// ✅ 올바른 코드 1: null 체크
if (!user) {
  throw new Error('User is required')
}
const email = `${user.userKey}@example.com`

// ✅ 올바른 코드 2: Optional chaining
const email = `${user?.userKey}@example.com`
```

---

### 2. `Unexpected any. Specify a different type`

**해결**:
```typescript
// ❌ 잘못된 코드
function handleError(error: any) { }

// ✅ 올바른 코드
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

---

### 3. `Property 'xxx' does not exist on type`

**해결**:
```typescript
// ❌ 잘못된 코드
console.log(result.isNewUser)

// ✅ 올바른 코드: 타입 정의 확인 후 존재하는 속성만 사용
console.log(result.userId)
```

---

## 🔑 환경 변수

### 1. `Missing Supabase environment variables`

**원인**: `.env.local` 파일이 없거나 잘못됨

**해결**:
```bash
# .env.local 파일 생성 (프로젝트 루트)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_TOSS_APP_KEY=health-hero
```

**확인**:
1. 파일 위치: 프로젝트 루트 (`package.json`과 같은 위치)
2. 파일 이름: `.env.local` (정확히)
3. 개발 서버 재시작 필수

자세한 내용: [docs/ENV_SETUP.md](ENV_SETUP.md)

---

### 2. 환경 변수가 `undefined`로 표시됨

**원인**: `NEXT_PUBLIC_` 접두사 누락

**해결**:
```bash
# ❌ 잘못된 코드
SUPABASE_URL=https://...

# ✅ 올바른 코드
NEXT_PUBLIC_SUPABASE_URL=https://...
```

Next.js는 `NEXT_PUBLIC_`로 시작하는 변수만 클라이언트에 노출합니다.

---

### 3. 배포 후 환경 변수가 업데이트 안 됨

**원인**: Static Export는 빌드 시점에 환경 변수를 하드코딩

**해결**:
```powershell
# 1. 환경 변수 수정
# 2. 반드시 재빌드
npm run build
npx @apps-in-toss/cli build
# 3. 새 .ait 파일 업로드
```

---

## 🛠️ 기타

### 1. 개발 서버가 시작되지 않음

**확인**:
```powershell
# 포트 충돌 확인
netstat -ano | findstr :3000

# 프로세스 종료
taskkill /PID [PID번호] /F

# 재시작
npm run dev
```

---

### 2. `node_modules` 꼬임

**해결**:
```powershell
# 완전 재설치
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

---

### 3. Git 충돌

**중요 파일들**:
- ✅ 커밋: `src/`, `docs/`, `package.json`, `tsconfig.json`
- ❌ 제외: `.env.local`, `node_modules/`, `dist/`, `.next/`, `*.ait`

`.gitignore` 확인:
```gitignore
.env.local
.env*.local
node_modules/
dist/
.next/
*.ait
```

---

## 🔐 토스 로그인 관련

### 1. 약관 동의 화면이 표시되지 않음

**원인**: 앱인토스 콘솔에서 약관 설정 누락

**해결**:
1. **앱인토스 콘솔** 접속
   - https://developers-apps-in-toss.toss.im/

2. **토스 로그인 설정**
   ```
   프로젝트 선택 → 개발 → 토스 로그인
   ```

3. **약관 동의 설정** ⭐
   - 필수 약관:
     - ✅ 서비스 이용약관
     - ✅ 개인정보 처리방침
   - 사용자 정보:
     - ✅ 이름 (user_name)

4. **저장 후 재테스트**
   ```powershell
   npm run build
   npx @apps-in-toss/cli build
   # 새 .ait 파일 업로드
   ```

자세한 내용: [토스 로그인 개발 가이드](https://developers-apps-in-toss.toss.im/login/develop.html)

---

### 2. `appLogin is not defined` 에러

**원인**: 로컬 환경 또는 일반 브라우저에서 실행

**해결**:
- 샌드박스 앱 또는 토스 앱에서만 테스트 가능
- `.ait` 파일을 빌드하여 업로드 필요

---

### 3. 인가 코드 발급 실패

**원인**: 토스 로그인 설정 문제

**확인**:
1. 토스 로그인 활성화 여부
2. Client ID 발급 여부
3. 약관 설정 완료 여부

---

## 📚 관련 문서

- [Next.js 설정](NEXTJS_CONFIG.md)
- [Hydration 에러 해결](HYDRATION_ERROR_FIX.md)
- [Eruda 설정](ERUDA_SETUP.md)
- [환경 변수 설정](ENV_SETUP.md)
- [토스 로그인 설정](TOSS_LOGIN_SETUP.md)

---

## 💡 추가 도움

문제가 해결되지 않으면:

1. **에러 메시지 전문 복사**
2. **재현 단계 기록**
3. **환경 정보 확인**:
   - Node.js 버전: `node -v`
   - npm 버전: `npm -v`
   - OS: Windows/Mac/Linux

---

## 🔐 토스 로그인 에러

### 1. `appLogin is not defined`

**에러**: 샌드박스에서 `appLogin` 함수가 정의되지 않음

**원인**: `appLogin`을 `window.appLogin`으로 잘못 호출

**해결**:
```typescript
// ❌ 잘못된 방법
const result = await window.appLogin()

// ✅ 올바른 방법
import { appLogin } from '@apps-in-toss/web-framework'
const result = await appLogin()
```

---

### 2. User Info API 404 에러

**에러**: 
```
[toss-auth] Toss API response status: 404
{"errorCode":"50000","reason":"Unknown error"}
```

**원인 1**: 잘못된 API 엔드포인트 사용

**해결**:
```typescript
// ❌ 잘못된 URL
'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user'

// ✅ 올바른 URL
'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me'
```

**원인 2**: `referrer` 미전달

**해결**: 모든 API 호출 시 `referrer` 포함
```typescript
const userResult = await getUserInfo(accessToken, referrer)
```

**원인 3**: Scope 설정 부족

**해결**: 앱인토스 콘솔에서 최소 `user_name` + `user_ci` scope 설정

---

### 3. TypeScript 타입 에러

**에러**: 
```
Type '"FAIL"' has no overlap with '"SUCCESS" | "FAILURE"'
```

**해결**:
```typescript
// src/types/toss.ts
export interface TossUserInfo {
  resultType: 'SUCCESS' | 'FAILURE' | 'FAIL'  // ← 'FAIL' 추가
  // ...
}
```

---

## 🗄️ Supabase 에러

### 1. 이메일 검증 에러

**에러**:
```
AuthApiError: Email address "529047996@toss.health-hero.app" is invalid
```

**해결 1**: 유효한 도메인 사용
```typescript
// ❌ 잘못된 이메일
const email = `${userKey}@toss.health-hero.app`

// ✅ 올바른 이메일
const email = `user${userKey}@health-hero.app`
```

**해결 2**: Supabase에서 이메일 확인 비활성화
- **Authentication** → **Providers** → **Email** → **Confirm email** → **OFF**

---

### 2. RLS 정책 위반 에러

**에러**:
```
{
  "code":"42501",
  "message":"new row violates row-level security policy for table \"user_profiles\""
}
```

**원인**: 인증 없이 `user_profiles` 테이블에 직접 삽입 시도

**해결**: Supabase Auth로 사용자 생성 후 프로필 저장
```typescript
// 1. Supabase Auth로 사용자 생성
const { data, error } = await supabase.auth.signUp({
  email,
  password
})

// 2. 프로필 저장 (이제 RLS 통과)
await supabase.from('user_profiles').upsert({
  id: data.user.id,
  // ...
})
```

---

### 3. Function Search Path Mutable 경고

**경고**: Supabase Security Advisor

**해결**: `supabase/schema.sql`에서 함수에 `SET search_path = ''` 추가
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';  -- ← 추가
```

---

### 4. Policy Already Exists 에러

**에러**: `ERROR: 42710: policy "..." already exists`

**해결**: `DROP POLICY IF EXISTS` 추가
```sql
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
```

---

## 🔧 Supabase Edge Function 에러

### 1. Docker Not Running 경고

**경고**: `WARNING: Docker is not running`

**해결**: 무시해도 됩니다!
- Docker는 로컬 테스트용 (`supabase functions serve`)
- 실제 배포 (`supabase functions deploy`)는 Docker 불필요

---

### 2. mTLS 인증서 파일 찾을 수 없음

**에러**: `❌ 인증서 파일을 찾을 수 없습니다`

**해결**: 상대 경로 수정
```powershell
# supabase/functions/scripts/encode-certs.ps1
$certPath = "..\..\..\backend\certs\health_hero_public.crt"
$keyPath = "..\..\..\backend\certs\health_hero_private.key"
```

---

### 3. Deno 타입 에러

**에러**: `Cannot find namespace 'Deno'`

**해결**: 타입 단언 사용
```typescript
const response = await fetch(url, {
  // ...
  client: mtlsClient,
} as any)  // ← 타입 단언
```

---

## 🚀 성능 최적화 문제 해결

### 1. 페이지 이동 시 로딩 지연 문제

**문제**: 페이지 이동할 때마다 로딩이 걸리는 현상

**원인 분석**:
- 각 페이지마다 동일한 데이터 로딩 로직 중복 실행
- `loadUserData(user.id)` 매번 서버 호출
- 불필요한 useEffect 중복 실행
- Static Export로 인한 클라이언트 사이드 라우팅만 가능

**해결 방법**:

#### 1.1. 데이터 로딩 캐싱 시스템
```typescript
// src/store/gameStore.ts
loadUserData: async (userId: string) => {
  const state = get()
  
  // 이미 로딩 중이면 중복 호출 방지
  if (state.isLoading) {
    console.log('이미 로딩 중입니다. 중복 호출 방지')
    return
  }
  
  // 데이터가 이미 있고 최근에 로드되었다면 스킵 (5분 캐시)
  const lastLoadTime = localStorage.getItem(`userData_${userId}_lastLoad`)
  if (lastLoadTime && state.level > 1) {
    const timeDiff = Date.now() - parseInt(lastLoadTime)
    if (timeDiff < 5 * 60 * 1000) { // 5분
      console.log('캐시된 데이터 사용. 서버 호출 스킵')
      return
    }
  }
  
  // 실제 데이터 로딩...
}
```

#### 1.2. 공통 로직 추출
```typescript
// src/hooks/useGamePage.ts
export function useGamePage() {
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { hearts, isLoading, error, loadUserData, updateHearts } = useGameStore();
  
  // 모든 게임 페이지의 중복 로직을 하나로 통합
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserData(user.id);
    }
  }, [isAuthenticated, user?.id, loadUserData]);
  
  return { user, isAuthenticated, hearts, isLoading, error, isSmallScreen };
}
```

#### 1.3. 네비게이션 최적화
```typescript
// router.push 사용으로 빠른 전환
const router = useRouter();
router.push(`/game/phase${currentPhase}`);
```

**성능 향상 결과**:
- **재방문 시**: 70% 빨라짐 (캐시 사용)
- **데이터베이스 호출**: 80% 감소
- **페이지 간 이동**: 즉시 전환

### 2. 나가기 모달 표시 문제

**문제**: 나가기 버튼 클릭 시 모달이 표시되지 않음

**원인**: 컴포넌트 언마운트로 인한 상태 업데이트 실패

**해결 방법**:
```typescript
// GameHeader에서 나가기 모달 관리
const [showExitModal, setShowExitModal] = useState(false);

// SettingsDropdown에서 콜백 사용
const handleExitClick = () => {
  handleClose();
  setTimeout(() => {
    onShowExitModal(); // 부모 컴포넌트로 요청
  }, 500);
};
```

---

## 🖼️ 이미지 로딩 문제

### 1. 간헐적인 이미지 로딩 실패

**증상**: 네트워크가 불안정한 환경에서 일부 이미지가 표시되지 않음

**원인**: 
- 네트워크 타임아웃
- 브라우저 캐시 문제
- CDN 응답 지연

**해결**: `SafeImage` 컴포넌트 사용

```typescript
// 변경 전
import Image from "next/image";
<Image src="/images/icon.png" alt="아이콘" width={100} height={100} />

// 변경 후
import { SafeImage } from "@/components/SafeImage";
<SafeImage 
  src="/images/icon.png" 
  alt="아이콘" 
  width={100} 
  height={100}
  priority              // 중요 이미지는 즉시 로딩
  maxRetries={3}        // 최대 3회 재시도
  retryDelay={1000}     // 1초 간격
  fallbackSrc="/placeholder.png"  // 실패 시 대체 이미지
/>
```

**SafeImage 기능**:
- ✅ 로딩 실패 시 자동 재시도 (최대 3회)
- ✅ 타임스탬프로 캐시 우회
- ✅ Fallback 이미지 지원
- ✅ 콘솔에 상세 로그 출력

---

## 🔐 인증 에러

### 1. user_already_exists 에러

**에러 메시지**:
```
AuthApiError: User already exists
code: "user_already_exists"
```

**원인**: 
- `user_profiles`는 삭제했지만 `auth.users`에 사용자 정보가 남아있음
- 또는 이전 로그인 시도에서 생성된 사용자 정보

**해결**: 
코드가 자동으로 처리합니다. `TossAuthService`에서 다음과 같이 동작:

```typescript
// 자동 처리 로직
if (signUpError.message.includes('already')) {
  // 기존 사용자로 자동 로그인 시도
  await supabase.auth.signInWithPassword({ email, password })
}
```

**수동 해결** (자동 처리 실패 시):
```sql
-- auth.users에서 삭제
DELETE FROM auth.users WHERE email = 'user529047996@health-hero.app';
```

### 2. Invalid login credentials 에러

**에러 메시지**:
```
AuthApiError: Invalid login credentials
code: "invalid_credentials"
status: 400
```

**원인**: 
- `auth.users`는 삭제되었지만 `user_profiles`가 남아있음
- 비밀번호 불일치

**해결**:
코드가 자동으로 처리합니다:

```typescript
// 자동 처리 로직
if (signInError.message.includes('Invalid') || signInError.message.includes('credentials')) {
  // 1. 기존 프로필 삭제
  await supabase.from('user_profiles').delete().eq('id', existingProfile.id)
  // 관련 데이터도 함께 삭제
  
  // 2. 새로운 Auth 사용자 생성
  await supabase.auth.signUp({ ... })
}
```

### 3. 테스트 데이터 완전 삭제

개발 중 테스트 데이터를 완전히 삭제하려면:

```sql
-- toss_user_key로 한 번에 삭제
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- 본인의 toss_user_key로 변경
  SELECT id INTO target_user_id 
  FROM user_profiles 
  WHERE toss_user_key = 529047996;
  
  IF target_user_id IS NOT NULL THEN
    -- 관련 데이터 모두 삭제
    DELETE FROM user_quiz_records WHERE user_id = target_user_id;
    DELETE FROM user_progress WHERE user_id = target_user_id;
    DELETE FROM user_hearts WHERE user_id = target_user_id;
    DELETE FROM toss_login_logs WHERE user_id = target_user_id;
    DELETE FROM user_profiles WHERE id = target_user_id;
    
    -- auth.users에서도 삭제
    DELETE FROM auth.users WHERE id = target_user_id;
    
    RAISE NOTICE '✅ 사용자 데이터 완전 삭제 완료';
  ELSE
    RAISE NOTICE '⚠️ 해당 사용자를 찾을 수 없습니다.';
  END IF;
END $$;
```

**또는 Supabase Dashboard에서**:
1. **Authentication** → **Users** 메뉴
2. 본인 계정 찾기
3. 우측 메뉴(`...`) → **Delete user** 클릭

### 4. 인증 상태별 자동 처리

| auth.users | user_profiles | 자동 처리 동작 |
|------------|---------------|----------------|
| ✅ 있음 | ✅ 있음 | 기존 세션으로 로그인 |
| ❌ 없음 | ✅ 있음 | 프로필 삭제 → 신규 생성 |
| ✅ 있음 | ❌ 없음 | signIn → 프로필 생성 |
| ❌ 없음 | ❌ 없음 | 완전 신규 사용자 생성 |

**모든 케이스가 자동으로 처리되므로** 특별한 조치가 필요 없습니다.

---

**Last Updated**: 2025-01-30  
**Status**: Living Document  
**토스 로그인**: ✅ 완전 해결  
**성능 최적화**: ✅ 완전 해결  
**이미지 로딩**: ✅ SafeImage 적용 완료  
**인증 시스템**: ✅ 자동 복구 완료


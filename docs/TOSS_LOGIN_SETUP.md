# 토스 로그인 설정 가이드

> ✅ **상태**: 완전 작동 (2025-01-20 테스트 완료)

## 📋 목차

1. [환경 변수 설정](#환경-변수-설정)
2. [Supabase 설정](#supabase-설정)
3. [Supabase Edge Function 배포](#supabase-edge-function-배포)
4. [로컬 개발 테스트](#로컬-개발-테스트)
5. [샌드박스 앱 테스트](#샌드박스-앱-테스트)
6. [트러블슈팅](#트러블슈팅)

---

## 1. 환경 변수 설정

### Supabase 설정 값 확인

1. [Supabase 콘솔](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Project Settings** > **API** 메뉴로 이동
4. 다음 값 복사:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (긴 문자열)

### 앱인토스 설정 값 확인

1. [앱인토스 콘솔](https://developers-apps-in-toss.toss.im) 접속
2. 프로젝트 선택
3. **앱 설정** 또는 **기본 설정** 확인
4. **App Key** (앱 이름) 확인: `health-hero`

⚠️ **Client ID는 선택사항**: 현재 토스 로그인 구현에서는 사용하지 않습니다.

### .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력:

```bash
# Supabase 설정 (필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 토스 앱인토스 설정 (필수)
NEXT_PUBLIC_TOSS_APP_KEY=health-hero

# ℹ️ Client ID/Secret은 현재 토스 로그인 플로우에서 사용하지 않습니다.
# NEXT_PUBLIC_TOSS_CLIENT_ID=your-toss-client-id
```

⚠️ **주의**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

---

## 2. Supabase 설정

### 2.1. 데이터베이스 설정

1. Supabase 콘솔에서 **SQL Editor** 메뉴로 이동
2. **New query** 버튼 클릭
3. `supabase/schema.sql` 파일 내용 복사 & 붙여넣기
4. **Run** 버튼 클릭

생성되는 테이블:
- ✅ `user_profiles` - 사용자 프로필 및 게임 진행 상태
- ✅ `toss_login_logs` - 토스 로그인 기록

### 2.2. 이메일 확인 비활성화 (중요!)

**Authentication** → **Providers** → **Email** → **Confirm email** → **OFF**

⚠️ 이 설정을 하지 않으면 토스 로그인 시 이메일 검증 에러가 발생합니다!

### 2.3. Row Level Security 확인

**Authentication** > **Policies** 메뉴에서 다음 정책이 활성화되었는지 확인:

- `Users can view own profile`
- `Users can update own profile`
- `Users can insert own profile`

---

## 3. Supabase Edge Function 배포

### 3.1. Supabase CLI 설치

**Windows (Scoop)**:
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**macOS (Homebrew)**:
```bash
brew install supabase/tap/supabase
```

### 3.2. Supabase 로그인

```powershell
supabase login
```

### 3.3. 프로젝트 연결

```powershell
supabase link --project-ref your-project-ref
```

프로젝트 ref는 Supabase URL에서 확인: `https://[your-project-ref].supabase.co`

### 3.4. mTLS 인증서 인코딩

앱인토스 콘솔에서 발급받은 인증서를 `backend/certs/` 폴더에 저장 후:

```powershell
cd supabase/functions/scripts
.\encode-certs.ps1
```

출력된 명령어 2개를 실행하여 Secrets 저장:

```powershell
supabase secrets set TOSS_CERT_BASE64="..."
supabase secrets set TOSS_KEY_BASE64="..."
```

### 3.5. Edge Function 배포

```powershell
supabase functions deploy toss-auth
```

배포 성공 시 다음 URL이 생성됩니다:
```
https://[your-project-ref].supabase.co/functions/v1/toss-auth
```

---

## 4. 로컬 개발 테스트

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 테스트 시나리오

1. **메인 페이지 확인**
   - "토스로 시작하기" 버튼 표시 확인
   - 개발 환경 안내 메시지 확인 (노란색 박스)
   - **Eruda 디버깅 도구** 우측 하단 버튼 확인

2. **Eruda 콘솔 확인**
   - 우측 하단 초록색 버튼 클릭
   - Console 탭에서 로그 확인
   - Resources 탭에서 환경 변수 로드 확인

3. **로그인 플로우 (앱인토스 환경에서만)**
   - 로그인 버튼 클릭
   - 토스 로그인 화면 표시
   - 로그인 완료 후 `/game` 페이지로 이동

⚠️ **참고**: 로컬 환경에서는 `appLogin()` 함수가 없어 실제 로그인이 불가능합니다. 샌드박스 앱에서 테스트해야 합니다.

---

## 4. 샌드박스 앱 테스트

### .ait 파일 빌드

```bash
npm run build
```

빌드 성공 시 `health-hero.ait` 파일이 생성됩니다.

### 앱인토스 샌드박스에서 테스트

1. [앱인토스 콘솔](https://developers-apps-in-toss.toss.im) > **출시하기** 메뉴
2. **테스트** 탭 선택
3. `.ait` 파일 업로드
4. QR 코드 스캔하여 샌드박스 앱 실행

### 샌드박스 앱에서 테스트 시나리오

1. **앱 실행**
   - 메인 화면에 "토스로 시작하기" 버튼 확인
   - **Eruda 디버깅 도구** 우측 하단 확인

2. **Eruda 콘솔 열기**
   - 우측 하단 초록색 버튼 클릭
   - Console 탭 준비
   - Network 탭 준비

3. **토스 로그인**
   - 버튼 클릭 시 토스 로그인 화면 표시
   - 테스트 계정으로 로그인
   - 이름 정보 제공 동의

4. **로그인 성공 확인**
   - 게임 페이지(`/game`)로 자동 이동
   - **Eruda Console**에서 로그 확인:
     ```
     🚀 [TossLogin] 로그인 시작
     ✅ [TossLogin] 토스 로그인 성공
     ✅ [TossLogin] Supabase 연동 성공
     🎮 [TossLogin] 게임 페이지로 이동
     ```
   - **Eruda Network**에서 API 호출 확인
   - **Eruda Resources**에서 토큰 저장 확인

5. **Supabase 데이터 확인**
   - Supabase > **Table Editor** > `user_profiles`
   - 새로운 사용자 레코드 생성 확인
   - `toss_user_key`, `name` 필드 확인

---

## 5. 트러블슈팅

### "앱인토스 환경에서만 사용할 수 있습니다" 에러

**원인**: 로컬 환경이나 일반 브라우저에서 실행 중

**해결**:
- 샌드박스 앱 또는 토스앱에서 테스트
- `.ait` 파일을 빌드하여 업로드

### "Missing Supabase environment variables" 에러

**원인**: 환경 변수가 설정되지 않음

**해결**:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 값이 올바른지 확인
3. 개발 서버 재시작 (`npm run dev`)

### 토큰 발급 실패 (401, 403 에러)

**원인**: Client ID 또는 Client Secret이 잘못됨

**해결**:
1. 앱인토스 콘솔에서 Client ID, Secret 재확인
2. `.env.local` 파일의 값 업데이트
3. 개발 서버 재시작

### 사용자 프로필 생성 실패

**원인**: Supabase RLS 정책 또는 테이블 설정 문제

**해결**:
1. Supabase > **Table Editor**에서 `user_profiles` 테이블 확인
2. **Authentication** > **Policies**에서 정책 활성화 확인
3. SQL 스크립트 재실행

### "User already registered" 에러

**원인**: 동일한 토스 계정으로 이미 가입됨

**해결**:
- 정상적인 동작입니다
- 기존 사용자로 로그인됩니다
- Supabase에서 사용자 정보가 업데이트됩니다

---

## 🎉 설정 완료!

모든 설정이 완료되었습니다. 이제 토스 로그인을 사용할 수 있습니다.

### ✅ 구현 확인

**서버리스 아키텍처:**
- Client Secret 불필요 (토스 API 설계)
- mTLS 불필요 (기본 로그인)
- 백엔드 서버 불필요 (Supabase만으로 완결)

**비용:**
- Supabase Free Tier: $0/월
- Vercel 호스팅: $0/월
- 총합: **$0/월** 🎉

### 다음 단계

1. **게임 로직 구현**: 퀴즈 시스템 및 게임 플로우
2. **사용자 프로필 UI**: 레벨, 경험치, 점수 표시
3. **토큰 자동 갱신**: 백그라운드에서 토큰 갱신
4. **에러 처리 고도화**: 더 친화적인 에러 메시지

### 참고 문서

- [Toss.md](./Toss.md) - 상세한 토스 로그인 가이드
- [앱인토스 공식 문서](https://developers-apps-in-toss.toss.im/)
- [Supabase 공식 문서](https://supabase.com/docs)

---

**Last Updated**: 2024-01-20  
**Version**: 1.0.0


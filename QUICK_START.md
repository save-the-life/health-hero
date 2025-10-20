# 🚀 헬스 히어로 빠른 시작 가이드

## ⏱️ 5분 안에 시작하기

### 1단계: Supabase 설정 (2분)

1. **Supabase 콘솔** → **SQL Editor**
2. `supabase/schema.sql` 파일 내용 복사 & 실행
3. **Project Settings** → **API**에서 URL과 anon key 복사

### 2단계: 환경 변수 (1분)

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 토스 앱인토스 (필수)
NEXT_PUBLIC_TOSS_APP_KEY=health-hero

# Client ID는 선택사항 (현재 사용 안 함)
# NEXT_PUBLIC_TOSS_CLIENT_ID=your-toss-client-id
```

### 3단계: 개발 서버 실행 (1분)

```bash
npm install
npm run dev
```

브라우저: http://localhost:5173

### 4단계: 빌드 & 테스트 (1분)

```bash
npm run build
```

→ `health-hero.ait` 파일이 생성됩니다!

---

## ✅ 구현 완료 사항

### 토스 로그인 ✓
- [x] 토스 인증 (appLogin)
- [x] 토큰 관리
- [x] 사용자 정보 조회
- [x] Supabase 연동

### UI ✓
- [x] 메인 페이지 (로그인)
- [x] 인트로 페이지
- [x] 게임 메인 페이지
- [x] Phase/Stage 페이지 (템플릿)
- [x] Eruda 디버깅 도구

### 데이터베이스 ✓
- [x] user_profiles 테이블
- [x] toss_login_logs 테이블
- [x] RLS 정책
- [x] Security Advisor 경고 해결

### 설정 ✓
- [x] Next.js Static Export (`output: 'export'`)
- [x] Image Optimization 비활성화
- [x] Granite 빌드 설정
- [x] 로컬 테스트 성공

---

## 🎯 다음 작업

### 즉시 가능
1. 환경 변수 입력
2. Supabase SQL 실행
3. 로컬 개발 테스트
4. 샌드박스 앱 테스트

### 개발 필요
1. 퀴즈 시스템
2. 하트 시스템
3. 광고 연동
4. 점수/레벨업

---

## 📚 상세 문서

### 필수 문서
- **토스 로그인**: [README_TOSS_LOGIN.md](README_TOSS_LOGIN.md)
- **전체 아키텍처**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **환경 변수**: [docs/ENV_SETUP.md](docs/ENV_SETUP.md)

### 기술 문서
- **Next.js 설정**: [docs/NEXTJS_CONFIG.md](docs/NEXTJS_CONFIG.md)
- **Hydration 에러**: [docs/HYDRATION_ERROR_FIX.md](docs/HYDRATION_ERROR_FIX.md)
- **Eruda 디버깅**: [docs/ERUDA_SETUP.md](docs/ERUDA_SETUP.md)

### 참고 문서
- **보안 FAQ**: [docs/SECURITY_FAQ.md](docs/SECURITY_FAQ.md)
- **프로젝트 구조**: [docs/PROJECT.md](docs/PROJECT.md)

---

## 💡 핵심 포인트

### ✅ 서버 불필요
- 토스 로그인: 클라이언트 직접 호출
- 데이터 저장: Supabase (RLS 보안)
- 광고: SDK로 직접 연동

### ✅ 보안
- Client Secret 불필요
- mTLS 불필요 (기본 기능)
- RLS로 데이터 보호

### ✅ 비용
- 현재: **$0/월**
- 미래: 결제 기능 추가 시 서버 필요

---

**구축 완료!** 이제 게임 로직을 개발할 수 있습니다! 🎮


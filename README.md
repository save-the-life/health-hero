# 🏥 헬스 히어로 (Health Hero)

의료 상식 퀴즈 게임 - 토스 앱인토스 프로젝트

## 📌 프로젝트 개요

헬스 히어로는 재미있는 퀴즈를 통해 의료 상식을 학습할 수 있는 교육용 게임입니다.

**특징:**

- 🎮 200개의 의료 상식 퀴즈 ✅
- 💙 하트 시스템 (광고로 충전 가능)
- 📊 레벨업 & 경험치 시스템
- 🏆 리더보드
- 🔐 토스 로그인 연동 ✅
- 👤 게스트 로그인 지원 ✅

---

## 🏗️ 아키텍처

### 서버리스 (Serverless) 구조

```
클라이언트 (Next.js)
    ├─→ 토스 API (로그인)
    └─→ Supabase (데이터베이스)
```

**특징:**

- ✅ **백엔드 서버 불필요**
- ✅ 완전한 서버리스 아키텍처
- ✅ 비용: $0/월 (Free Tier)

자세한 내용: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env.local` 파일 생성:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 토스 앱인토스 (필수)
NEXT_PUBLIC_TOSS_APP_KEY=health-hero

# Client ID는 선택사항 (현재 사용 안 함)
# NEXT_PUBLIC_TOSS_CLIENT_ID=your_toss_client_id
```

자세한 설정: [docs/ENV_SETUP.md](docs/ENV_SETUP.md)

### 2. Supabase 데이터베이스 설정

1. **기본 스키마**: `supabase/schema.sql` 실행
2. **퀴즈 스키마**: `supabase/quiz-schema.sql` 실행
3. **퀴즈 데이터**: CSV 파일 업로드 또는 스크립트 실행

자세한 설정: [supabase/QUIZ_IMPORT_GUIDE.md](supabase/QUIZ_IMPORT_GUIDE.md)

### 3. 개발 서버 실행

```bash
npm install
npm run dev
```

### 4. 빌드 (.ait 파일 생성)

```bash
npm run build
```

---

## 📚 문서

### 토스 로그인

- [README_TOSS_LOGIN.md](README_TOSS_LOGIN.md) - 토스 로그인 개요
- [docs/TOSS_LOGIN_SETUP.md](docs/TOSS_LOGIN_SETUP.md) - 설정 가이드
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - 구현 요약

### 보안 & 아키텍처

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - 전체 아키텍처
- [docs/SECURITY_FAQ.md](docs/SECURITY_FAQ.md) - 보안 FAQ
- [docs/ENV_SETUP.md](docs/ENV_SETUP.md) - 환경 변수 가이드

### Next.js & 디버깅

- [docs/NEXTJS_CONFIG.md](docs/NEXTJS_CONFIG.md) - Next.js 설정 가이드
- [docs/HYDRATION_ERROR_FIX.md](docs/HYDRATION_ERROR_FIX.md) - Hydration 에러 해결
- [docs/ERUDA_SETUP.md](docs/ERUDA_SETUP.md) - Eruda 디버깅 도구 설정

### 확장 기능

- [docs/MTLS_GUIDE.md](docs/MTLS_GUIDE.md) - 결제/푸시 기능 추가 시 가이드

### 프로젝트

- [docs/PROJECT.md](docs/PROJECT.md) - 전체 프로젝트 구조 및 계획
- [docs/Toss.md](docs/Toss.md) - 토스 로그인 상세 가이드

---

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 15.5.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand 5.0.8
- **Game Engine**: Phaser 3.90.0
- **Animation**: Framer Motion

### Backend (서버리스)

- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth + 토스 로그인
- **API**: Supabase REST API

### External APIs

- **Login**: 앱인토스 (토스)
- **Ads**: 앱인토스/AdMob (계획)

### Deployment

- **Frontend**: Vercel (Static Export)
- **Backend**: Supabase
- **Build**: Granite (앱인토스)

---

## 📁 프로젝트 구조

```
health-hero/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # 메인 (로그인)
│   │   ├── intro/        # 인트로
│   │   └── game/         # 게임
│   ├── components/       # React 컴포넌트
│   │   └── TossLoginButton.tsx
│   ├── hooks/            # React 훅
│   │   └── useTossAuth.ts
│   ├── services/         # 비즈니스 로직
│   │   ├── tossAuthService.ts
│   │   ├── gameService.ts
│   │   └── quizService.ts
│   ├── store/            # Zustand 상태 관리
│   │   ├── authStore.ts
│   │   ├── gameStore.ts
│   │   └── quizStore.ts
│   ├── types/            # TypeScript 타입
│   │   ├── toss.ts
│   │   └── database.ts
│   ├── utils/            # 유틸리티
│   │   ├── tokenManager.ts
│   │   └── errorHandler.ts
│   └── lib/              # 라이브러리
│       └── supabase.ts
├── supabase/
│   ├── schema.sql        # DB 스키마
│   └── README.md
├── docs/                 # 문서
├── public/               # 정적 리소스
│   └── images/
└── .ait                  # 앱인토스 빌드 파일
```

---

## ✨ 주요 기능

### ✅ 구현 완료 (Phase 2)

- [x] 토스 로그인 (완전 통합)
  - [x] appLogin() SDK 연동
  - [x] AccessToken 발급 (mTLS)
  - [x] 사용자 정보 조회 (login-me API)
  - [x] Supabase 사용자 생성/로그인
- [x] 게스트 로그인 (Anonymous Auth) ✅
- [x] Supabase Edge Function (mTLS 프록시)
- [x] 사용자 프로필 관리
- [x] 퀴즈 데이터베이스 (200문항) ✅
- [x] 데이터베이스 스키마 (6개 테이블) ✅
- [x] RLS 보안 정책
- [x] 하트 자동 충전 함수 ✅
- [x] CSV → JSONB 변환 스크립트 ✅
- [x] 메인 페이지 UI
- [x] 인트로 페이지 UI
- [x] 게임 페이지 라우팅
- [x] Eruda 디버깅 도구 (모바일)
- [x] 샌드박스/토스앱 테스트 완료 ✅

### 🚧 개발 중 (Phase 3)

- [ ] 핵심 게임 메커니즘
- [ ] Zustand 스토어 구현
- [ ] 퀴즈 선택 로직
- [ ] 하트 시스템 UI
- [ ] 점수/경험치 계산

### 📅 계획 (Phase 4+)

- [ ] UI/UX 구현
- [ ] Phaser 씬
- [ ] 광고 연동 (하트 충전)
- [ ] 리더보드
- [ ] 프로필 페이지
- [ ] PWA 지원
- [ ] 애니메이션 효과

---

## 🔐 보안

### 현재 구현

- ✅ Row Level Security (RLS)
- ✅ Supabase Auth (이메일 확인 비활성화)
- ✅ 토스 OAuth 2.0
- ✅ Supabase Edge Function (mTLS 지원)
- ✅ 환경 변수로 민감 정보 관리
- ✅ Client Secret 서버에서만 사용

### 미래 확장 시

- ⚠️ 결제 기능 → mTLS 필요
- ⚠️ 푸시 알림 → mTLS 필요
- ⚠️ 포인트 지급 → mTLS 필요

자세한 내용: [docs/SECURITY_FAQ.md](docs/SECURITY_FAQ.md)

---

## 💰 비용

### 현재 (서버리스)

- Supabase Free Tier: **$0/월**
- Vercel 호스팅: **$0/월**
- **총합: $0/월** 🎉

### 미래 확장 시

- Vercel Pro (서버 기능): $20/월
- Supabase Pro: $25/월

---

## 📊 개발 상태

- **Phase 1**: 환경 설정 ✅
- **Phase 2**: DB 스키마 & 데이터 임포트 ✅
- **Phase 3**: 핵심 게임 메커니즘 🚧
- **Phase 4**: UI/UX 구현 📅
- **Phase 5**: Phaser 씬 📅
- **Phase 6**: 광고 연동 📅
- **Phase 7**: 배포 📅

---

## 🤝 기여

이 프로젝트는 교육용 프로젝트입니다.

---

## 📄 라이선스

MIT License

---

## 📞 문의

- **프로젝트**: 헬스 히어로
- **기술 스택**: Next.js + Supabase + 앱인토스
- **문서**: [docs/](docs/)

---

**Last Updated**: 2025-10-21  
**Version**: 0.3.0  
**Status**: Phase 2 완료 ✅  
**Toss Login**: ✅ **완전 작동**  
**Guest Login**: ✅ **완전 작동**  
**Quiz Database**: ✅ **200문항 완료**  
**Next Phase**: Phase 3 (핵심 게임 메커니즘)

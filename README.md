# 🏥 헬스 히어로 (Health Hero)

의료 상식 퀴즈 게임 - 토스 앱인토스 프로젝트

## 📌 프로젝트 개요

헬스 히어로는 재미있는 퀴즈를 통해 의료 상식을 학습할 수 있는 교육용 게임입니다.

**특징:**
- 🎮 200개의 의료 상식 퀴즈
- 💙 하트 시스템 (광고로 충전 가능)
- 📊 레벨업 & 경험치 시스템
- 🏆 리더보드
- 🔐 토스 로그인 연동

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

Supabase SQL Editor에서 `supabase/schema.sql` 실행

자세한 설정: [supabase/README.md](supabase/README.md)

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

### ✅ 구현 완료
- [x] 토스 로그인
- [x] 사용자 프로필 관리
- [x] Supabase 데이터베이스 연동
- [x] RLS 보안 정책
- [x] 메인 페이지 UI
- [x] 인트로 페이지 UI
- [x] Eruda 디버깅 도구 (모바일)
- [x] 로컬 개발 환경 테스트 완료

### 🚧 개발 중
- [ ] 퀴즈 시스템
- [ ] 하트 시스템
- [ ] 점수/레벨 시스템
- [ ] 광고 연동 (하트 충전)

### 📅 계획
- [ ] 리더보드
- [ ] 프로필 페이지
- [ ] PWA 지원
- [ ] 애니메이션 효과

---

## 🔐 보안

### 현재 구현
- ✅ Row Level Security (RLS)
- ✅ Supabase Auth
- ✅ 토스 OAuth 2.0
- ✅ Client Secret 불필요
- ✅ mTLS 불필요 (기본 기능)

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
- **Phase 2**: 토스 로그인 ✅
- **Phase 3**: 기본 UI ✅
- **Phase 4**: 게임 로직 🚧
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

**Last Updated**: 2025-01-20  
**Version**: 0.1.0  
**Status**: Development 🚧  
**Local Test**: ✅ Passed

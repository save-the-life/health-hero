# 토스 로그인 구현 완료 요약

> ✅ **상태**: 완전 작동 (2025-01-20)  
> 🎯 **테스트**: 샌드박스 앱 성공

---

## 🎉 최종 결과

**토스 로그인 → Supabase 사용자 생성 → 게임 페이지 이동** 완전 작동!

---

## 📋 구현된 기능

### 1. 토스 로그인 플로우
```
사용자 클릭 "토스로 시작하기"
  ↓
appLogin() SDK 호출
  ↓
토스 동의 화면 (첫 로그인 시)
  ↓
authorizationCode + referrer 반환
  ↓
Supabase Edge Function 호출 (mTLS)
  ↓
토스 API: generate-token (AccessToken 발급)
  ↓
토스 API: login-me (사용자 정보 조회)
  ↓
Supabase Auth: 사용자 생성/로그인
  ↓
user_profiles 테이블: 프로필 저장
  ↓
게임 페이지로 이동 ✅
```

### 2. 주요 컴포넌트

#### Frontend (Next.js)
- `src/components/TossLoginButton.tsx` - 로그인 버튼 UI
- `src/hooks/useTossAuth.ts` - 토스 인증 로직
- `src/services/tossAuthService.ts` - Supabase 연동
- `src/store/authStore.ts` - 인증 상태 관리

#### Backend (Supabase)
- `supabase/functions/toss-auth/index.ts` - mTLS 프록시
- `supabase/schema.sql` - 데이터베이스 스키마

#### Types
- `src/types/toss.ts` - 토스 API 타입
- `src/types/database.ts` - Supabase 타입

---

## 🔑 핵심 기술

### 1. Supabase Edge Function (mTLS)
- **위치**: `supabase/functions/toss-auth/index.ts`
- **역할**: 토스 API 호출 프록시 (mTLS 인증서 사용)
- **API**:
  - `POST /toss-auth` with `action: "generate-token"`
  - `POST /toss-auth` with `action: "get-user-info"`

### 2. 토스 API 엔드포인트
- **Token 발급**: `POST /api-partner/v1/apps-in-toss/user/oauth2/generate-token`
- **사용자 정보**: `GET /api-partner/v1/apps-in-toss/user/oauth2/login-me`

### 3. Supabase Auth
- **이메일 형식**: `user{userKey}@health-hero.app`
- **이메일 확인**: OFF (중요!)
- **RLS 정책**: 사용자별 프로필 접근 제어

---

## 🛠️ 해결한 주요 문제

### 1. TypeScript 에러
- **문제**: `supabase/functions` 폴더가 Next.js 빌드에 포함됨
- **해결**: `tsconfig.json`에서 `exclude: ["supabase"]` 추가

### 2. Image Optimization 에러
- **문제**: `output: 'export'`와 Image Optimization 충돌
- **해결**: `next.config.ts`에 `images: { unoptimized: true }` 추가

### 3. Hydration 에러
- **문제**: Server/Client 렌더링 불일치
- **해결**: `useState` + `useEffect`로 클라이언트 전용 렌더링

### 4. Eruda 디버깅 도구
- **문제**: npm 패키지와 CDN 중복 로딩
- **해결**: CDN만 사용, `useEffect`로 동적 로딩

### 5. `appLogin` 함수 인식 실패
- **문제**: `window.appLogin`로 잘못 호출
- **해결**: `import { appLogin } from '@apps-in-toss/web-framework'`

### 6. User Info API 404 에러
- **문제**: 잘못된 엔드포인트 사용
- **해결**: `/oauth2/login-me` 엔드포인트 사용
- **문제 2**: `referrer` 미전달
- **해결**: 모든 API 호출 시 `referrer` 포함

### 7. Supabase 이메일 검증 에러
- **문제**: `{userKey}@toss.health-hero.app` 이메일 형식 거부
- **해결 1**: 유효한 도메인 형식 사용 (`@health-hero.app`)
- **해결 2**: Supabase **Confirm email** 비활성화

### 8. RLS 정책 위반 에러
- **문제**: 인증 없이 `user_profiles` 삽입 시도
- **해결**: Supabase Auth로 사용자 생성 후 프로필 저장

---

## 📂 파일 구조

```
health-hero/
├── src/
│   ├── components/
│   │   ├── TossLoginButton.tsx        # 로그인 버튼
│   │   └── ErudaScript.tsx           # Eruda 초기화
│   ├── hooks/
│   │   └── useTossAuth.ts            # 토스 인증 훅
│   ├── services/
│   │   └── tossAuthService.ts        # Supabase 연동
│   ├── store/
│   │   └── authStore.ts              # 인증 상태
│   ├── types/
│   │   ├── toss.ts                   # 토스 타입
│   │   └── database.ts               # DB 타입
│   └── utils/
│       ├── tokenManager.ts           # 토큰 관리
│       └── errorHandler.ts           # 에러 처리
├── supabase/
│   ├── functions/
│   │   ├── toss-auth/
│   │   │   └── index.ts              # mTLS 프록시
│   │   ├── _shared/
│   │   │   └── cors.ts               # CORS 헤더
│   │   └── scripts/
│   │       └── encode-certs.ps1      # 인증서 인코딩
│   └── schema.sql                    # DB 스키마
├── .env.local                        # 환경 변수
└── tsconfig.json                     # TS 설정 (supabase 제외)
```

---

## 🚀 배포 절차

### 1. 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_TOSS_APP_KEY=health-hero
```

### 2. Supabase 설정

1. **Database**: `supabase/schema.sql` 실행
2. **Auth**: **Confirm email** OFF
3. **Secrets**: mTLS 인증서 업로드
4. **Edge Function**: `supabase functions deploy toss-auth`

### 3. 빌드

```bash
npm run build
```

### 4. 배포

- **Frontend**: `.ait` 파일 업로드 (앱인토스)
- **Backend**: Supabase (자동)

---

## 📊 API 플로우

### 토스 로그인 API

```typescript
// 1. 인가 코드 받기
const { authorizationCode, referrer } = await appLogin()

// 2. AccessToken 발급 (mTLS)
POST /functions/v1/toss-auth
Body: { action: "generate-token", authorizationCode, referrer }
→ { accessToken, refreshToken, expiresIn, scope }

// 3. 사용자 정보 조회 (mTLS)
POST /functions/v1/toss-auth
Body: { action: "get-user-info", accessToken, referrer }
→ { userKey, name, ... }

// 4. Supabase 사용자 생성
const { data, error } = await supabase.auth.signUp({
  email: `user${userKey}@health-hero.app`,
  password: `toss_${userKey}_${Date.now()}`
})

// 5. 프로필 저장
await supabase.from('user_profiles').upsert({ ... })
```

---

## 🎯 다음 단계

### ✅ 완료
- [x] 토스 로그인
- [x] Supabase 연동
- [x] 사용자 프로필
- [x] RLS 정책
- [x] 샌드박스 테스트

### 🚧 진행 중
- [ ] 퀴즈 시스템
- [ ] 하트 시스템
- [ ] 레벨/경험치

### 📅 계획
- [ ] 리더보드
- [ ] 광고 연동
- [ ] PWA

---

## 📚 참고 문서

- [README.md](README.md) - 프로젝트 개요
- [docs/TOSS_LOGIN_SETUP.md](docs/TOSS_LOGIN_SETUP.md) - 설정 가이드
- [SUPABASE_MTLS_GUIDE.md](SUPABASE_MTLS_GUIDE.md) - mTLS 배포 가이드
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - 트러블슈팅

---

**Last Updated**: 2025-01-20  
**Status**: ✅ Production Ready  
**Test**: ✅ Sandbox Passed

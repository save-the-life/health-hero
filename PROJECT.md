# 🏥 헬스 히어로 (Health Hero)

**장르**: 교육형 퀴즈 RPG (모바일 웹/PWA, HTML5 기반)

**목표**: 잘못된 민간요법과 의료 미신을 바로잡고, 생활·응급 의료지식을 재미있게 학습하도록 유도하는 퀴즈형 게임

---

## 📋 목차

1. [게임 핵심 컨셉](#게임-핵심-컨셉)
2. [핵심 플레이 루프](#핵심-플레이-루프)
3. [화면 구성](#화면-구성)
4. [성장 구조](#성장-구조)
5. [경제 시스템](#경제-시스템)
6. [보상 & 동기부여](#보상--동기부여)
7. [기술 스택](#기술-스택)
8. [퀴즈 데이터](#퀴즈-데이터)
9. [개발 로드맵](#개발-로드맵)

---

## 🎮 게임 핵심 컨셉

- 퀴즈를 풀며 **의료 히어로**로 성장하는 RPG형 학습 게임
- 스테이지를 **계단** 구조로 배치 → 한 단계씩 오를 때마다 캐릭터 성장
- 기초 지식(남녀노소) → 전문 지식(응급·질환 관리) → 고급 의료(시뮬레이션)까지 난이도 점진 상승
- **하트/점수/아이템 시스템**으로 전략성과 수익화를 동시에 확보

---

## 🔄 핵심 플레이 루프

1. **홈 화면에서 스테이지 선택**
2. **하트(❤️) 1개 소모** → 퀴즈 진행 시작
3. **객관식 4지선다 퀴즈 진행**
   - 스테이지 성공/실패 기준: **3문제 이상 맞춘 경우 성공**
   - **5 문제 정답**: 보너스 점수 50 + 추가 경험치 + 성공 → 다음 단계 진입 가능
     - 재시도 시: 맞추는 점수만 획득 + 기본 경험치
   - **4 문제 정답**: 보너스 점수 30 + 추가 경험치 + 성공 → 다음 단계 진입 가능
     - 재시도 시: 맞추는 점수만 획득 + 기본 경험치
   - **3 문제 정답**: 성공 → 다음 단계 진입 가능
     - 재시도 시: 맞추는 점수만 획득 + 기본 경험치
   - **2 문제 이하**: 실패 → 재시도 진행
     - 재시도 시: 추가 점수 및 경험치 획득
4. **오답 시**: 하트 추가 소모 + 정답을 알려주고 다음 문제 진행
5. **아이템 사용 가능** (보기 삭제, 점수 2배, 자동 정답, 힌트)
6. **모든 문제를 마치면 결과 화면**(정답률·점수·보상)
7. **누적 점수로 아이템 구매/아바타 성장**
8. **계단을 올라 캐릭터 직급·외형 업그레이드**

---

## 🖥️ 화면 구성

### 홈 화면

- **중앙**: 맵 (단계 표시)
- **상단**: 현재 레벨, 진행 스테이지(2-3과 같은 "페이즈-단계" 형식)
- **각 단계 클릭 시**: 퀴즈 풀이 진행(4지선다 5문제)

### 퀴즈 화면

- **상단**: 하트(❤️), 점수(⭐), 진행 스테이지(2-3과 같은 "페이즈-단계" 형식)
- **중앙**: 퀴즈 문제/보기 4개
- **하단**: 아이템 슬롯(4종)
  - 오답 제거
  - 점수 2배
  - 자동 정답
  - 힌트

#### 아이템 사용 규칙

- **아이템 사용은 중복 X** (한 문제당 하나만)
- **힌트 사용 시**: 뒷배경 어둡게 블러처리 + 캐릭터 + 힌트 말풍선

### 결과 화면

- 정답률 %, 획득 점수
- EXP 증가, 레벨업 시 캐릭터 변화 연출
- 보상 획득(점수·아이템·배지)

---

## 📈 성장 구조

### 캐릭터 직급 업그레이드

- **Lv.1**: 의대 새내기
- **Lv.5**: 인턴
- **Lv.10**: 레지던트
- **Lv.15**: 전문의
- **Lv.20**: 헬스 히어로 (슈퍼히어로 의상)

### 단계별 지식 트리 (5단계)

1. **1단계**: 민간요법 깨기 (소금물·소주·파스 등)
2. **2단계**: 생활 응급(화상, 출혈, 기도폐쇄)
3. **3단계**: 생활 건강(혈압, 혈당, 복약지도)
4. **4단계**: 전문 응급(심근경색, 뇌졸중 FAST)
5. **5단계**: 고급 시뮬레이션(환자 사례, 종합 퀴즈)

---

## 💰 경제 시스템

### ❤️ 하트 (Heart)

- **최대 5개 보유**
- **스테이지 진입 시**: -1 소모
- **오답 시**: 추가 -1 소모
- **5분마다 1개 자동 충전** (최대 5개)
- **광고 시청 시**: +1 회복

### ⭐ 점수 (Points)

#### 문제 정답 시 기본 점수 (난이도 보정)

- **쉬움**: 10점
- **보통**: 30점
- **어려움**: 50점

#### 스테이지 클리어 보너스 점수

- **5문제 정답**: 50 포인트
- **4문제 정답**: 30 포인트
- **3문제 이하**: 보너스 점수 X

#### 사용처

- 아이템 구매

### 🎁 아이템 (Items)

한 문제에서 **중복 사용 X** (4개 중 하나만 사용)

1. **오답 제거** - 50점
2. **점수 2배** - 100점
3. **자동 정답** - 200점
4. **힌트 제공** - 80점

### 📺 광고 연동

- 하트 충전
- 아이템 랜덤 지급
- 점수 2배 찬스
- 스테이지 보너스 점수

---

## 🎁 보상 & 동기부여

- **배지/칭호**: 단계별 학습 달성 시 획득 (추후 GPT 연동 또는 후순위)
- **출석 보상**: 연속 접속 시 하트/아이템 지급
- **소셜 공유**: 최종 "헬스 히어로 인증서" 이미지 공유 가능

---

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 15.5.5 (App Router, TypeScript)
- **Game Engine**: Phaser 3.90.0 (퀴즈/애니메이션)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5.0.8
- **Animation**: Framer Motion 12.23.24
- **UI Components**: Lucide React 0.545.0
- **Utilities**: 
  - clsx 2.1.1
  - tailwind-merge 3.3.1
  - use-local-storage-state 19.5.0

### Backend

- **Database & Auth**: Supabase 2.75.0
- **API**: Supabase REST API

### PWA

- **PWA Support**: next-pwa 5.6.0

### Design & Assets

- **Sprite**: Aseprite (스프라이트 제작)
- **Atlas**: TexturePacker (JSON 아틀라스)
- **UI Design**: Figma

### Deployment

- **Frontend**: Vercel
- **Backend**: Supabase
- **Analytics**: PostHog/Amplitude (예정)

### Development Tools

- **Build Tool**: Apps In Toss Web Framework (@apps-in-toss/web-framework 1.2.1)
- **Linting**: ESLint 9
- **TypeScript**: 5.x

---

## 📚 퀴즈 데이터

### 데이터 소스

- **파일 위치**: `c:\Users\dhwan\Downloads\health-hero_Q1-200_v2_4choice_with_hints_ko_2025-10-14_NO-GENERIC-CHOICE4_fromTXT (1).jsonl`
- **총 문제 수**: 200개
- **형식**: JSONL (JSON Lines)

### 데이터 구조

```json
{
  "qnum": 1,
  "topic": "감기·호흡기 오해",
  "prompt": "감기에 항생제를 먹으면 빨리 낫는다.",
  "choices": ["대부분 맞다", "대부분 아니다", "코로나일 때만 맞다", "증상이 좋아지면 항생제는 바로 중단해도 된다"],
  "answer_index": 2,
  "hint": "감기의 주된 원인(바이러스 vs 세균)과 항생제가 작용하는 대상을 구분해 보세요.",
  "explanation": "감기의 상당수는 바이러스 원인이어서 항생제가 효과 없고, 오남용은 내성만 늘립니다.",
  "difficulty_label": "쉬움"
}
```

### 난이도 레벨 및 점수

| 난이도 (`difficulty_label`) | 점수 | 예상 문제 수 |
|----------------------------|------|-------------|
| 쉬움 (easy) | 10점 | ~80개 |
| 보통 (medium) | 30점 | ~90개 |
| 어려움 (hard) | 50점 | ~30개 |

### 주제 분류

- 감기·호흡기 오해
- 화상·일광화상
- 영양·식습관
- 눈·귀·피부·자외선
- 코피·비강 응급
- 동물·곤충·뱀 사고
- 상처·지혈·골절
- 기도폐쇄·질식
- 화학물질·중독
- 심혈관 응급
- 치아·구강 응급·위생
- 온열·저체온
- 의약품·복약 안전
- 감염병·손위생
- 식품 안전·보관
- 손 위생·소독제
- 운동·자세·근골격
- 수면·정신건강
- 노인 건강·낙상·탈수

---

## 🗺️ 개발 로드맵

### Phase 1: 프로젝트 초기 세팅 ✅

- [x] Next.js 프로젝트 생성
- [x] 필수 라이브러리 설치
  - [x] Phaser 3
  - [x] Supabase Client
  - [x] Zustand
  - [x] Framer Motion
  - [x] Tailwind CSS
  - [x] next-pwa
- [x] Apps In Toss 프레임워크 설정
- [x] 프로젝트 문서화 (PROJECT.md)

**완료 기준**: 개발 서버 실행 가능, 기본 라이브러리 설치 완료

---

### Phase 2: 데이터베이스 스키마 & 데이터 임포트

#### 2.1 Supabase 프로젝트 설정

- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 설정 (.env.local)
- [ ] Supabase 클라이언트 초기화 (src/lib/supabase.ts)

#### 2.2 데이터베이스 스키마 설계

**테이블 구조**:

- [ ] `users` 테이블
  - id, email, created_at, updated_at
  - level, exp, total_score
  - current_stage, current_phase
  
- [ ] `quizzes` 테이블
  - id, qnum, topic, prompt
  - choices (JSONB), correct_answer_index
  - hint, explanation
  - difficulty, points
  
- [ ] `user_progress` 테이블
  - id, user_id, stage_id
  - completed, stars, best_score
  - attempts, created_at
  
- [ ] `user_items` 테이블
  - id, user_id, item_type
  - quantity, created_at
  
- [ ] `user_hearts` 테이블
  - id, user_id, hearts_count
  - last_refill_at, updated_at

#### 2.3 퀴즈 데이터 임포트

- [ ] JSONL → JSON 변환 스크립트 작성
- [ ] 데이터 검증 및 정제
- [ ] Supabase 데이터베이스에 임포트
- [ ] 난이도별 인덱싱

**완료 기준**: 200개 퀴즈 데이터가 DB에 정상 임포트, 스키마 완성

---

### Phase 3: 핵심 게임 메커니즘

#### 3.1 상태 관리 (Zustand Store)

- [ ] `useGameStore.ts` 생성
  - 사용자 정보 (레벨, 경험치, 점수)
  - 하트 시스템
  - 현재 스테이지/페이즈
  - 아이템 인벤토리
  
- [ ] `useQuizStore.ts` 생성
  - 현재 퀴즈 세션
  - 정답/오답 기록
  - 사용된 아이템
  - 타이머 상태

#### 3.2 하트 시스템 구현

- [ ] 하트 자동 충전 로직 (5분마다 1개)
- [ ] LocalStorage 연동 (오프라인 지원)
- [ ] 하트 소모 로직 (스테이지 진입, 오답)
- [ ] 최대 하트 제한 (5개)

#### 3.3 점수 & 경험치 시스템

- [ ] 난이도별 점수 계산
- [ ] 보너스 점수 로직 (5문제, 4문제 정답)
- [ ] 경험치 계산 및 레벨업 로직
- [ ] 레벨별 캐릭터 직급 매핑

#### 3.4 아이템 시스템

- [ ] 아이템 사용 로직
  - 오답 제거 (50% 보기 제거)
  - 점수 2배
  - 자동 정답
  - 힌트 표시
- [ ] 아이템 구매 시스템
- [ ] 중복 사용 방지 로직

**완료 기준**: 게임 핵심 로직 완성, 테스트 케이스 통과

---

### Phase 4: UI/UX 구현

#### 4.1 홈 화면 (Home Screen)

- [ ] 스테이지 맵 레이아웃
- [ ] 계단 구조 디자인 (CSS/Framer Motion)
- [ ] 현재 레벨 & 진행 상황 표시
- [ ] 하트/점수 UI
- [ ] 스테이지 잠금/해금 상태 표시

#### 4.2 퀴즈 화면 (Quiz Screen)

- [ ] 퀴즈 문제 표시 컴포넌트
- [ ] 4지선다 보기 레이아웃
- [ ] 아이템 슬롯 UI
- [ ] 하트/점수/스테이지 상태바
- [ ] 정답/오답 피드백 애니메이션
- [ ] 힌트 모달 (블러 배경 + 캐릭터 + 말풍선)

#### 4.3 결과 화면 (Result Screen)

- [ ] 정답률 그래프
- [ ] 획득 점수 표시
- [ ] 경험치 바 애니메이션
- [ ] 레벨업 연출
- [ ] 보상 표시
- [ ] 다음 스테이지/재시도 버튼

#### 4.4 공통 컴포넌트

- [ ] Button 컴포넌트
- [ ] Modal 컴포넌트
- [ ] ProgressBar 컴포넌트
- [ ] HeartDisplay 컴포넌트
- [ ] ScoreDisplay 컴포넌트

**완료 기준**: 모든 화면 구현 완료, 반응형 디자인 적용

---

### Phase 5: Phaser 3 게임 씬 & 캐릭터 시스템

#### 5.1 Phaser 3 설정

- [ ] Phaser 게임 인스턴스 초기화
- [ ] 게임 씬 구조 설계
  - MainScene (홈)
  - QuizScene (퀴즈)
  - ResultScene (결과)
- [ ] 리소스 로더 구현

#### 5.2 캐릭터 스프라이트

- [ ] 캐릭터 스프라이트 제작/수집
  - Lv.1: 의대 새내기
  - Lv.5: 인턴
  - Lv.10: 레지던트
  - Lv.15: 전문의
  - Lv.20: 헬스 히어로
- [ ] 스프라이트 애니메이션
- [ ] 레벨업 전환 효과

#### 5.3 스테이지 맵 비주얼

- [ ] 계단 구조 디자인
- [ ] 배경 이미지/그래픽
- [ ] 잠금/해금 아이콘
- [ ] 클릭/호버 인터랙션

**완료 기준**: 캐릭터 애니메이션 동작, 스테이지 맵 시각화 완성

---

### Phase 6: 추가 기능 & 최적화

#### 6.1 PWA 설정

- [ ] manifest.json 생성
- [ ] 아이콘 세트 준비 (192x192, 512x512)
- [ ] next-pwa 설정
- [ ] 오프라인 지원
- [ ] 설치 프롬프트

#### 6.2 광고 연동 (선택사항)

- [ ] 광고 SDK 통합 (Google AdMob 등)
- [ ] 하트 충전 광고
- [ ] 아이템 지급 광고
- [ ] 점수 2배 광고

#### 6.3 출석 보상 시스템

- [ ] 출석 체크 로직
- [ ] 연속 출석 계산
- [ ] 보상 지급 (하트/아이템)
- [ ] 출석 UI

#### 6.4 소셜 공유

- [ ] 인증서 이미지 생성 (Canvas API)
- [ ] SNS 공유 기능
- [ ] OG 태그 설정

#### 6.5 성능 최적화

- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 레이지 로딩
- [ ] 캐싱 전략

**완료 기준**: PWA 설치 가능, 성능 점수 90+ (Lighthouse)

---

### Phase 7: 테스팅 & 배포

#### 7.1 테스팅

- [ ] 유닛 테스트 (핵심 로직)
- [ ] 통합 테스트 (퀴즈 플레이 플로우)
- [ ] E2E 테스트 (주요 시나리오)
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 디바이스 테스트

#### 7.2 배포

- [ ] Vercel 배포 설정
- [ ] 환경 변수 설정 (Production)
- [ ] 도메인 연결
- [ ] HTTPS 설정
- [ ] Analytics 연동

#### 7.3 모니터링

- [ ] 에러 트래킹 (Sentry 등)
- [ ] 사용자 분석 (PostHog/Amplitude)
- [ ] 성능 모니터링

**완료 기준**: 프로덕션 배포 완료, 모니터링 시스템 가동

---

### Phase 8: 후속 개발 (Optional)

- [ ] 배지/칭호 시스템 (GPT 연동)
- [ ] 멀티플레이어 모드
- [ ] 리더보드
- [ ] 추가 퀴즈 콘텐츠
- [ ] 음향 효과 & 배경음악
- [ ] 다국어 지원

---

## 📁 프로젝트 구조

```
health-hero/
├── public/
│   ├── images/          # 이미지 리소스
│   ├── sounds/          # 사운드 이펙트
│   ├── icons/           # PWA 아이콘
│   └── manifest.json    # PWA 매니페스트
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx     # 홈 화면
│   │   ├── quiz/        # 퀴즈 화면
│   │   └── result/      # 결과 화면
│   ├── components/      # React 컴포넌트
│   │   ├── common/      # 공통 컴포넌트
│   │   ├── quiz/        # 퀴즈 관련
│   │   ├── home/        # 홈 관련
│   │   └── result/      # 결과 관련
│   ├── lib/             # 유틸리티 & 설정
│   │   ├── supabase.ts  # Supabase 클라이언트
│   │   ├── utils.ts     # 유틸 함수
│   │   └── constants.ts # 상수
│   ├── hooks/           # Custom Hooks
│   ├── stores/          # Zustand 스토어
│   │   ├── gameStore.ts
│   │   └── quizStore.ts
│   ├── scenes/          # Phaser 3 씬
│   │   ├── MainScene.ts
│   │   ├── QuizScene.ts
│   │   └── ResultScene.ts
│   ├── game/            # 게임 로직
│   │   ├── GameManager.ts
│   │   └── PhaserConfig.ts
│   ├── types/           # TypeScript 타입
│   └── constants/       # 게임 상수
├── granite.config.ts    # Granite 설정
├── next.config.ts       # Next.js 설정
├── tailwind.config.ts   # Tailwind 설정
├── tsconfig.json        # TypeScript 설정
├── package.json
├── .env.local          # 환경 변수
├── PROJECT.md          # 이 문서
└── README.md           # 프로젝트 README
```

---

## 🚀 시작하기

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

### 배포

```bash
npm run deploy
```

---

## 📝 참고 문서

- [Next.js Documentation](https://nextjs.org/docs)
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## 📊 프로젝트 현황

- **프로젝트 시작일**: 2025-10-14
- **현재 단계**: Phase 1 완료 ✅
- **다음 단계**: Phase 2 - 데이터베이스 스키마 & 데이터 임포트

---

## 💡 개발 팁

### 퀴즈 데이터 변환 예시

```typescript
// JSONL → JSON 배열 변환
const quizzes = jsonlData.map((quiz) => ({
  id: quiz.qnum,
  topic: quiz.topic,
  prompt: quiz.prompt,
  choices: quiz.choices,
  correctAnswer: quiz.answer_index,
  hint: quiz.hint,
  explanation: quiz.explanation,
  difficulty: quiz.difficulty_label === "쉬움" ? "easy" 
    : quiz.difficulty_label === "보통" ? "medium" 
    : "hard",
  points: quiz.difficulty_label === "쉬움" ? 10 
    : quiz.difficulty_label === "보통" ? 30 
    : 50
}));
```

### 하트 자동 충전 로직 예시

```typescript
const HEART_REFILL_INTERVAL = 5 * 60 * 1000; // 5분
const MAX_HEARTS = 5;

setInterval(() => {
  const currentHearts = getHearts();
  if (currentHearts < MAX_HEARTS) {
    setHearts(currentHearts + 1);
  }
}, HEART_REFILL_INTERVAL);
```

---

## 🤝 기여 방법

현재는 개인 프로젝트이나, 추후 오픈소스화 예정

---

## 📄 라이선스

MIT License (예정)

---

**Last Updated**: 2025-10-14


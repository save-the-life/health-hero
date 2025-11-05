# 게임 유저 키 (getUserKeyForGame) 설정 가이드

> ✅ **상태**: 구현 완료 (2025-01-30)  
> 🎯 **목적**: 프로모션(토스 포인트) 기능 준비

## 📋 목차

1. [개요](#개요)
2. [구현 방식](#구현-방식)
3. [코드 구조](#코드-구조)
4. [테스트 방법](#테스트-방법)
5. [문제 해결](#문제-해결)

---

## 📚 개요

### getUserKeyForGame이란?

**게임 미니앱에서 유저를 식별할 수 있는 키 값을 가져오는 함수**

- 별도의 서버 연동 없이도 토스 로그인 기능처럼 유저를 구분
- 미니앱별로 고유한 유저 식별자(hash) 제공
- **프로모션(토스 포인트) 기능**에서 함께 사용 가능

### 기존 로그인 vs 게임 유저 키

| 항목 | 기존 토스 로그인 | getUserKeyForGame |
|------|------------------|-------------------|
| **플로우** | 5단계 (appLogin → 토큰 발급 → 사용자 정보) | 1단계 (즉시 hash 반환) |
| **서버 필요** | ✅ Supabase Edge Function | ❌ 불필요 |
| **mTLS 인증서** | ✅ 필요 | ❌ 불필요 |
| **사용자 정보** | ✅ 이름, 토큰 등 | ❌ hash만 제공 |
| **프로모션 지원** | ❌ 직접 지원 안함 | ✅ 직접 지원 |
| **최소 버전** | 토스앱 5.0 | 토스앱 5.232.0 |

### 우리의 선택: 병행 사용

**기존 토스 로그인 + 게임 유저 키 추가 저장**

```
1. appLogin으로 풍부한 사용자 정보 획득 (이름, 토큰 등)
   ↓
2. getUserKeyForGame으로 프로모션용 hash 추가 획득
   ↓
3. 둘 다 Supabase에 저장
   ↓
4. 게임 진행 + 향후 프로모션 기능 준비 완료
```

---

## 🏗️ 구현 방식

### 1. 데이터베이스 스키마

```sql
-- user_profiles 테이블에 game_user_hash 컬럼 추가
ALTER TABLE user_profiles 
ADD COLUMN game_user_hash TEXT UNIQUE;

-- 인덱스 생성 (빠른 조회)
CREATE INDEX idx_user_profiles_game_user_hash 
ON user_profiles(game_user_hash) 
WHERE game_user_hash IS NOT NULL;
```

**실행 위치**: Supabase Dashboard → SQL Editor

### 2. GameAuthService 서비스

**파일**: `src/services/gameAuthService.ts`

```typescript
import { getUserKeyForGame } from '@apps-in-toss/web-framework'

export class GameAuthService {
  // 게임 유저 키 획득
  static async getGameUserKey(): Promise<GameUserKeyResult>
  
  // Supabase에 저장
  static async saveGameUserKey(userId: string, gameHash: string): Promise<boolean>
  
  // 게임 해시로 사용자 조회
  static async findUserByGameHash(gameHash: string)
}
```

### 3. 로그인 플로우 통합

**파일**: `src/components/TossLoginButton.tsx`

```typescript
const handleLogin = async () => {
  // 1. 기존 토스 로그인
  const tossResult = await login();
  const supabaseResult = await TossAuthService.createOrUpdateUser(tossResult);
  
  // 2. 게임 유저 키 추가 획득 (NEW!)
  const gameKeyResult = await GameAuthService.getGameUserKey();
  if (gameKeyResult.success) {
    await GameAuthService.saveGameUserKey(
      supabaseResult.userId,
      gameKeyResult.hash
    );
  }
  
  // 3. 게임 페이지 이동
  router.push('/game');
}
```

### 4. 타입 정의

**파일**: `src/types/database.ts`

```typescript
export interface UserProfile {
  // 기존 필드들...
  toss_user_key: number | null
  
  // 게임 유저 키 (NEW!)
  game_user_hash: string | null
  
  // 게임 관련 필드들...
}
```

---

## 📁 코드 구조

```
health-hero/
├── src/
│   ├── services/
│   │   ├── tossAuthService.ts        # 기존 토스 로그인
│   │   └── gameAuthService.ts        # 🆕 게임 유저 키 서비스
│   ├── components/
│   │   └── TossLoginButton.tsx       # ✏️ 로그인 통합
│   └── types/
│       └── database.ts                # ✏️ 타입 추가
├── docs/
│   └── GAME_USER_KEY_SETUP.md        # 🆕 본 문서
└── supabase/
    └── add-game-user-hash.sql        # 🆕 SQL 스크립트
```

---

## 🧪 테스트 방법

### 1. 로컬 개발 환경

**제약 사항**: `getUserKeyForGame`은 토스앱 5.232.0 이상에서만 동작

**테스트 방법**:
1. `npm run dev` 실행
2. 브라우저 콘솔 확인
3. 예상 메시지:
   ```
   ⚠️ [GameAuth] 지원하지 않는 앱 버전
   ⚠️ [GameAuth] 프로모션 기능은 사용할 수 없습니다 (게임 진행은 가능)
   ```

### 2. 샌드박스 앱 테스트

**전제 조건**: 토스앱 5.232.0 이상 설치

**테스트 시나리오**:

1. **빌드**
   ```bash
   npm run build
   ```

2. **앱인토스 콘솔 업로드**
   - `.ait` 파일 업로드
   - QR 코드 스캔

3. **로그인 테스트**
   - "퀴즈 풀러 가기" 버튼 클릭
   - Eruda 콘솔 확인:
   ```
   🎮 [GameAuth] getUserKeyForGame 호출 시작...
   ✅ [GameAuth] 게임 유저 키 획득 성공
   ✅ [GameAuth] 게임 유저 키 저장 완료 (프로모션 준비 완료)
   ```

4. **Supabase 확인**
   - Table Editor → `user_profiles`
   - `game_user_hash` 컬럼에 값이 저장되었는지 확인

### 3. 프로덕션 테스트

**체크리스트**:
- [ ] 기존 사용자도 로그인 시 game_user_hash 자동 저장
- [ ] 신규 사용자 game_user_hash 정상 저장
- [ ] 게임 유저 키 획득 실패 시에도 게임 정상 진행
- [ ] 에러 로그 정상 출력

---

## 🎯 사용 예시

### 프로모션 기능에서 사용하기 (향후)

```typescript
// 프로모션 API 호출 시 game_user_hash 사용
async function givePromotionReward() {
  const user = await getCurrentUser();
  
  if (!user.game_user_hash) {
    console.error('게임 유저 키가 없습니다');
    return;
  }
  
  // 토스 프로모션 API 호출
  await fetch('https://toss-promotion-api.com/reward', {
    method: 'POST',
    body: JSON.stringify({
      user_key: user.game_user_hash,  // ← 여기서 사용!
      reward_type: 'POINT',
      amount: 100
    })
  });
}
```

### 게임 해시로 사용자 조회

```typescript
// 특정 게임 유저 찾기
const user = await GameAuthService.findUserByGameHash('abc123...');

// 게임 유저 키 존재 여부 확인
const hasKey = await GameAuthService.hasGameUserKey(userId);
```

---

## 🔧 문제 해결

### "지원하지 않는 앱 버전" 경고

**원인**: 토스앱 버전 5.232.0 미만

**해결**:
- 토스앱 업데이트 안내 (자동 표시됨)
- 게임은 정상 진행 가능 (프로모션만 불가)

### "게임 카테고리가 아닌 미니앱" 에러

**원인**: 앱인토스 콘솔에서 카테고리가 "게임"이 아님

**해결**:
1. 앱인토스 콘솔 접속
2. 앱 설정 → 카테고리 → "게임"으로 변경
3. 재배포

### 게임 유저 키가 저장되지 않음

**원인**: Supabase RLS 정책 또는 스키마 문제

**해결**:
1. SQL Editor에서 스키마 확인:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns
   WHERE table_name = 'user_profiles' 
     AND column_name = 'game_user_hash';
   ```

2. UNIQUE 제약 조건 확인:
   ```sql
   SELECT conname 
   FROM pg_constraint
   WHERE conname = 'user_profiles_game_user_hash_key';
   ```

3. 스크립트 재실행 (멱등성 보장)

### 기존 사용자 game_user_hash 업데이트

**수동 업데이트 필요 없음**: 다음 로그인 시 자동 저장됨

**즉시 업데이트가 필요한 경우**:
```sql
-- 특정 사용자 game_user_hash 수동 설정 (테스트용)
UPDATE user_profiles 
SET game_user_hash = 'test-hash-12345'
WHERE id = 'user-uuid';
```

---

## 📊 모니터링

### 게임 유저 키 통계 조회

```sql
-- game_user_hash 보유 사용자 수
SELECT 
  COUNT(*) as total_users,
  COUNT(game_user_hash) as users_with_game_key,
  ROUND(COUNT(game_user_hash) * 100.0 / COUNT(*), 2) as percentage
FROM user_profiles;

-- 최근 7일간 게임 유저 키 획득 현황
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users,
  COUNT(game_user_hash) as with_game_key
FROM user_profiles
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## ✅ 구현 완료 체크리스트

- [x] Supabase 스키마 업데이트 (`game_user_hash` 컬럼 추가)
- [x] GameAuthService 구현
- [x] TossLoginButton 통합
- [x] 타입 정의 추가
- [x] 에러 처리 구현
- [x] 로깅 추가
- [x] 문서화 완료
- [ ] 샌드박스 테스트
- [ ] 프로덕션 배포
- [ ] 프로모션 기능 구현 (향후)

---

## 🚀 다음 단계

### Phase 1: 테스트 및 검증 (현재)
- [ ] 샌드박스 앱에서 실제 테스트
- [ ] 기존 사용자 로그인 테스트
- [ ] 신규 사용자 가입 테스트
- [ ] 에러 케이스 테스트

### Phase 2: 프로덕션 배포
- [ ] 프로덕션 환경 스키마 업데이트
- [ ] 프로덕션 빌드 및 배포
- [ ] 모니터링 설정

### Phase 3: 프로모션 기능 개발 (향후)
- [ ] 토스 프로모션 API 연동
- [ ] 리워드 지급 시스템
- [ ] 출석 체크 시스템
- [ ] 이벤트 시스템

---

## 📚 참고 자료

- **앱인토스 공식 문서**: [게임 로그인](https://developers-apps-in-toss.toss.im/docs/game/login)
- **Supabase 문서**: [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- **프로젝트 문서**: 
  - [TOSS_LOGIN_SETUP.md](./TOSS_LOGIN_SETUP.md) - 기존 토스 로그인 설정
  - [ARCHITECTURE.md](./ARCHITECTURE.md) - 전체 아키텍처
  - [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - 구현 현황

---

**Last Updated**: 2025-01-30  
**Version**: 1.0.0  
**Status**: ✅ 구현 완료, 테스트 대기


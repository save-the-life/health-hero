# 광고 시스템 설정 가이드

## 개요

헬스 히어로 프로젝트는 앱인토스 환경에서 광고를 통해 하트를 충전할 수 있는 시스템을 제공합니다.

## 환경 변수 설정

### .env.local 파일에 추가할 환경 변수

```bash
# 앱인토스 광고 그룹 ID (하트 충전용)
NEXT_PUBLIC_AD_GROUP_HEART_REFILL=ait.live.50bf52c3ee9144f6
```

## Supabase 설정

### 1. RPC 함수 생성

`supabase/add-heart-by-ad.sql` 파일을 실행하여 하트 충전 광고 RPC 함수를 생성합니다.

```sql
-- Supabase 대시보드의 SQL Editor에서 실행
-- 또는 supabase CLI 사용: supabase db reset
```

### 2. RLS 정책 확인

다음 테이블에 대해 RLS 정책이 올바르게 설정되어 있는지 확인합니다:

- `user_hearts` - 모든 사용자가 접근 가능하도록 설정
- `user_profiles` - 사용자 프로필 정보

## 광고 시스템 작동 방식

### 1. 광고 지원 환경

- 앱인토스 환경에서만 광고가 지원됩니다
- `@apps-in-toss/web-framework` 패키지가 필요합니다
- **환경 감지 개선**: `tossmini.com` 도메인과 `TossApp` UserAgent 감지 추가
- **토스 앱 내 환경**: 카카오톡, 토스 앱 내에서 실행 시 자동 감지

### 2. 광고 타입

현재 지원하는 광고 타입:

- `HEART_REFILL`: 하트 충전 광고

### 3. 광고 제한

- 일일 최대 5회 광고 시청 가능
- 자정에 광고 시청 횟수가 리셋됩니다
- 광고 시청 간격은 최소 3초입니다

### 4. 광고 보상

- 광고 시청 완료 시 하트 1개 충전
- 최대 하트 개수는 5개입니다

## 사용법

### 1. useAdMob 훅 사용

```typescript
import { useAdMob } from "@/hooks/useAdMob";

const { getAdStatus, showAd, autoLoadAd, isSupported } = useAdMob();

// 광고 상태 확인
const status = getAdStatus("HEART_REFILL");

// 광고 시청
const result = await showAd("HEART_REFILL");
```

### 2. HeartShortageModal에서 사용

HeartShortageModal 컴포넌트는 이미 광고 시스템이 통합되어 있습니다:

- 하트가 0개일 때 모달이 표시됩니다
- 광고 버튼을 통해 하트를 충전할 수 있습니다
- 광고 로딩 상태에 따라 버튼이 활성화/비활성화됩니다

## 디버깅

### 1. 콘솔 로그 확인

광고 관련 로그는 다음과 같은 접두사로 표시됩니다:

- `🎯`: HeartShortageModal 열림/닫힘
- `📺`: 광고 표시 관련 로그
- `💖`: 하트 충전 관련 로그
- `🔍`: 디버깅 및 환경 확인 로그
- `✅`: 성공 상태 로그
- `❌`: 에러 및 실패 로그

**로그 최적화**: 반복적인 불필요한 로그 제거, 상태 변경 시에만 로그 출력

### 인증 상태 모니터링 (2025-01-27 추가)

- `🔐`: 인증 상태 확인 및 세션 관리 로그
- `⚠️`: 인증 세션 없음 경고
- `🔄`: 인증 상태 변경으로 광고 인스턴스 리셋

### 2. 광고 상태 확인

```typescript
const status = getAdStatus("HEART_REFILL");
// 가능한 상태: 'not_loaded', 'loading', 'loaded', 'failed', 'cleaning'
```

### 3. 환경 확인

```typescript
const isSupported = useAdMob().isSupported;
// 앱인토스 환경에서만 true
```

## 문제 해결

### 1. 광고가 로드되지 않는 경우

- **환경 감지**: `tossmini.com` 도메인 또는 `TossApp` UserAgent 확인
- **앱인토스 환경**: 실제 토스 앱 내에서 실행 중인지 확인
- **환경 변수**: `NEXT_PUBLIC_AD_GROUP_HEART_REFILL` 설정 확인
- **네트워크**: 연결 상태 및 광고 인벤토리 확인

### 2. 광고 시청 후 하트가 충전되지 않는 경우

- **인증 세션 확인**: `AuthSessionMissingError` 발생 시 재로그인 필요
- **세션 만료**: 로그인 세션이 만료된 경우 자동 감지 및 안내
- **Supabase RPC 함수**: `add_heart_by_ad` 함수가 올바르게 생성되었는지 확인
- **RLS 정책 설정**: 사용자 인증 관련 정책 확인
- **에러 바운더리**: 광고 관련 오류 시 앱 크래시 방지

### 3. 광고 시청 제한 관련

- 일일 5회 제한 확인
- 광고 시청 간격 확인 (최소 3초)

### 4. 하트가 3개 충전되는 문제 (2025-01-27 해결)

- **문제**: 광고 시청 후 하트 1개가 아닌 3개가 충전됨
- **원인**: `userEarnedReward` 이벤트 중복 발생 및 `updateHearts` 중복 호출
- **해결**:
  - `pendingPromise`를 즉시 null로 설정하여 중복 처리 방지
  - `useRef`를 사용한 중복 호출 방지 플래그 추가
- **결과**: 하트 정확히 1개만 충전됨

### 5. 하트 차감 후 조회 문제 (2025-01-27 해결)

- **문제**: 하트 차감 후 `current_hearts`가 부정확하게 조회됨
- **원인**: `consume_heart` RPC 함수가 계산된 값을 반환하여 DB와 불일치
- **해결**: 차감 후 실제 DB 값을 다시 조회하여 반환
- **결과**: 정확한 하트 개수 반환

## 보안 고려사항

1. **RLS 정책**: 모든 사용자가 광고 관련 함수를 호출할 수 있도록 설정
2. **일일 제한**: 서버 측에서 광고 시청 횟수를 제한
3. **사용자 인증**: 광고 보상은 인증된 사용자에게만 제공
4. **세션 관리**: 인증 세션 만료 시 자동 감지 및 재로그인 유도
5. **에러 처리**: 광고 실패 시 적절한 에러 메시지 표시
6. **앱 안정성**: 에러 바운더리로 광고 관련 오류 시 앱 크래시 방지

## 향후 개선 사항

1. **다양한 광고 타입**: 아이템 획득, 포인트 획득 등
2. **광고 보상 다양화**: 하트 외 다른 보상 추가
3. **광고 통계**: 광고 시청 통계 및 분석
4. **A/B 테스트**: 광고 배치 및 보상 최적화

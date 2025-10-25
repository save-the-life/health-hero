# 광고 시스템 디버깅 가이드

**최종 업데이트**: 2025-01-27

---

## 📋 개요

하트 부족 모달에서 광고 로드 및 표시 로직이 정상적으로 작동하는지 확인하는 가이드입니다.

---

## 🎯 광고 로드 플로우

### 1. 하트 부족 모달 열림

```typescript
// HeartShortageModal.tsx
useEffect(() => {
  if (isOpen) {
    console.log("🎯 HeartShortageModal 열림 - 광고 로드 시작");

    if (isSupported) {
      console.log("✅ 광고 지원됨 - 자동 로드 시작");
      autoLoadAd("HEART_REFILL")
        .then(() => console.log("✅ 광고 자동 로드 완료"))
        .catch((error) => console.error("❌ 광고 자동 로드 실패:", error));
    } else {
      console.log("❌ 광고 미지원 환경");
    }
  }
}, [isOpen, isSupported, autoLoadAd]);
```

### 2. 광고 상태 모니터링

```typescript
// 1초마다 광고 상태 체크
useEffect(() => {
  const checkAdStatus = () => {
    const status = getAdStatus("HEART_REFILL");
    console.log("📊 광고 상태 체크:", status);

    // "loading" | "loaded" | "failed" | "not_loaded"
    setAdStatus(status);
  };

  checkAdStatus();
  const interval = setInterval(checkAdStatus, 1000);
  return () => clearInterval(interval);
}, [getAdStatus, adStatus]);
```

### 3. 광고 버튼 상태

광고 버튼은 다음 조건에서 활성화됩니다:

```typescript
// 버튼 활성화 조건
const isButtonEnabled = isSupported && adStatus === "ready" && !isWatchingAd;

// 버튼 텍스트
{!isSupported
  ? "광고 미지원"
  : adStatus === "loading"
  ? "로딩 중..."
  : isWatchingAd
  ? "광고 시청 중..."
  : "하트 받기"}
```

---

## 🔍 광고 로드 상태별 로그

### 상태 1: 광고 미지원 환경

```
❌ 광고 미지원 환경
🔍 디버깅 정보:
- window: object
- appsInToss: undefined
- GoogleAdMob: undefined
- loadAppsInTossAdMob: undefined
- isSupported: undefined
```

**원인:**
- 로컬 개발 환경 (앱인토스 SDK 없음)
- 일반 브라우저 (토스 앱 아님)

**해결:**
- 앱인토스 샌드박스 앱에서 테스트 필요

---

### 상태 2: 광고 로드 중

```
✅ 광고 지원됨 - 자동 로드 시작
📡 광고 로드 시작 - 타입: HEART_REFILL
📊 현재 광고 상태: not_loaded
🔄 광고 인스턴스 상태를 loading으로 설정
🎯 광고 그룹 ID: health-hero-heart-refill
📺 Apps-in-Toss AdMob 로드 요청
📊 광고 상태 체크: loading
```

**상태:**
- 광고가 로드되고 있음
- 버튼 텍스트: "로딩 중..."
- 버튼 비활성화 (회색)

---

### 상태 3: 광고 로드 완료

```
[HEART_REFILL] 광고 이벤트: {type: "loaded"}
[HEART_REFILL] 광고 로드 성공
✅ 광고 자동 로드 완료
📊 광고 상태 체크: loaded
✅ 광고 로드 완료 - 버튼 활성화
```

**상태:**
- 광고가 준비됨
- 버튼 텍스트: "하트 받기"
- 버튼 활성화 (파란색)

---

### 상태 4: 광고 로드 실패

```
[HEART_REFILL] 광고 이벤트: {type: "failed", data: {...}}
[HEART_REFILL] 광고 로드 실패: {...}
❌ 광고 로드 실패
📊 광고 상태 체크: failed
```

**원인:**
- 광고 인벤토리 부족
- 네트워크 오류
- 광고 그룹 ID 오류

**해결:**
- 광고 그룹 ID 확인 (`.env` 파일)
- 네트워크 연결 확인
- 나중에 다시 시도

---

## 🎬 광고 시청 플로우

### 1. 광고 버튼 클릭

```
🎬 광고 버튼 클릭됨
👤 사용자 ID: abc-123-def
📊 현재 광고 상태: loaded
🎥 광고 시청 중 여부: false
```

### 2. 광고 시청 가능 여부 확인

```
🔍 광고 시청 가능 여부 확인 중...
📋 광고 시청 가능 여부: {canWatch: true, reason: null}
✅ 광고 시청 가능 - 광고 표시 시작
```

### 3. 광고 표시

```
🎬 광고 표시 시작 - 타입: HEART_REFILL
📊 광고 인스턴스 상태: loaded
⏰ 마지막 사용 후 경과 시간: 5000ms
🔄 광고 인스턴스 상태를 cleaning으로 변경
🎯 광고 그룹 ID: health-hero-heart-refill
📺 Apps-in-Toss AdMob 표시 요청
```

### 4. 광고 이벤트

#### 광고 표시 시작
```
[HEART_REFILL] 광고 표시 이벤트: {type: "show"}
[HEART_REFILL] 광고 표시 시작
```

#### 광고 보상 획득
```
🎉 [HEART_REFILL] 광고 보상 획득: {unitType: "HEART", unitAmount: 1}
💖 [HEART_REFILL] 하트 충전 처리 시작 - 사용자 ID: abc-123-def
💖 [HEART_REFILL] 하트 충전 결과: {success: true, message: "하트를 획득했습니다!"}
✅ [HEART_REFILL] 하트 충전 성공
🎉 하트 충전 성공!
💖 하트 상태 업데이트 중...
🚪 모달 닫기
🔄 광고 재로드 예약
```

#### 광고 닫힘
```
[HEART_REFILL] 광고 이벤트: {type: "dismissed"}
[HEART_REFILL] 광고 닫힘
🏁 광고 시청 프로세스 완료
```

---

## 🚨 문제 해결

### 문제 1: 광고가 로드되지 않음

**증상:**
```
❌ 광고 미지원 환경
```

**확인 사항:**
1. 앱인토스 환경인지 확인
   ```typescript
   console.log(window.appsInToss);  // undefined이면 일반 브라우저
   ```

2. 광고 SDK 로드 확인
   ```typescript
   console.log(window.appsInToss?.GoogleAdMob);  // undefined이면 SDK 미로드
   ```

**해결 방법:**
- 앱인토스 샌드박스 앱에서 테스트
- `.ait` 파일로 빌드 후 업로드

---

### 문제 2: 광고 로드는 되지만 표시 실패

**증상:**
```
[HEART_REFILL] 광고 표시 이벤트: {type: "failedToShow"}
[HEART_REFILL] 광고 표시 실패
```

**원인:**
- 광고 인벤토리 부족
- 광고가 이미 표시됨 (중복 호출)
- 연속 시청 간격이 너무 짧음 (3초 미만)

**해결 방법:**
1. 광고 재로드
   ```typescript
   reloadAd("HEART_REFILL");
   ```

2. 3초 이상 대기 후 재시도

---

### 문제 3: 광고 보상을 받지 못함

**증상:**
```
[HEART_REFILL] 광고 이벤트: {type: "dismissed"}
[HEART_REFILL] 광고 닫힘
```

**원인:**
- 광고를 완전히 시청하지 않고 닫음
- `userEarnedReward` 이벤트가 발생하지 않음

**해결 방법:**
- 광고를 끝까지 시청
- "광고를 완전히 시청하지 않았습니다." 메시지 표시

---

### 문제 4: 하트 충전 실패

**증상:**
```
💖 [HEART_REFILL] 하트 충전 결과: {success: false, message: "일일 제한 초과"}
❌ [HEART_REFILL] 하트 충전 실패: 일일 제한 초과
```

**원인:**
- 일일 광고 시청 횟수 초과 (5회)
- 사용자 ID가 없음

**확인:**
```sql
-- Supabase에서 확인
SELECT ad_views_today, ad_reset_at
FROM user_hearts
WHERE user_id = 'abc-123-def';
```

**해결 방법:**
- 자정까지 대기 (자동 리셋)
- 500 포인트로 하트 구매

---

## 📊 광고 상태 체크리스트

배포 전 확인:

- [ ] 앱인토스 환경에서 광고 SDK 로드 확인
- [ ] 광고 그룹 ID 올바른지 확인 (`.env` 파일)
- [ ] 하트 부족 모달 열릴 때 광고 자동 로드 확인
- [ ] 광고 상태가 "loaded"로 변경되는지 확인
- [ ] 광고 버튼이 활성화되는지 확인
- [ ] 광고 시청 후 `userEarnedReward` 이벤트 발생 확인
- [ ] 하트 충전이 정상적으로 처리되는지 확인
- [ ] 광고 시청 후 모달이 닫히는지 확인
- [ ] 광고 재로드가 정상적으로 작동하는지 확인
- [ ] 일일 제한 (5회) 정상 작동 확인

---

## 🎯 광고 로그 예시 (정상 플로우)

```
# 모달 열림
🎭 HeartShortageModal 컴포넌트 렌더링됨
🎭 props - isOpen: true, currentPhase: 1
🔍 HeartShortageModal useEffect 실행됨 - isOpen: true
🎯 HeartShortageModal 열림 - 광고 로드 시작
📱 Apps-in-Toss 지원 여부: true
✅ 광고 지원됨 - 자동 로드 시작

# 광고 로드
📡 광고 로드 시작 - 타입: HEART_REFILL
📊 현재 광고 상태: not_loaded
🔄 광고 인스턴스 상태를 loading으로 설정
🎯 광고 그룹 ID: health-hero-heart-refill
📺 Apps-in-Toss AdMob 로드 요청
[HEART_REFILL] 광고 이벤트: {type: "loaded"}
[HEART_REFILL] 광고 로드 성공
✅ 광고 자동 로드 완료
📊 광고 상태 체크: loaded
✅ 광고 로드 완료 - 버튼 활성화

# 광고 버튼 클릭
🎬 광고 버튼 클릭됨
👤 사용자 ID: abc-123-def
📊 현재 광고 상태: loaded
🎥 광고 시청 중 여부: false
🎬 광고 시청 시작
🔍 광고 시청 가능 여부 확인 중...
📋 광고 시청 가능 여부: {canWatch: true}
✅ 광고 시청 가능 - 광고 표시 시작

# 광고 표시
🎬 광고 표시 시작 - 타입: HEART_REFILL
📊 광고 인스턴스 상태: loaded
⏰ 마지막 사용 후 경과 시간: 0ms
🔄 광고 인스턴스 상태를 cleaning으로 변경
🎯 광고 그룹 ID: health-hero-heart-refill
📺 Apps-in-Toss AdMob 표시 요청
[HEART_REFILL] 광고 표시 이벤트: {type: "show"}
[HEART_REFILL] 광고 표시 시작

# 광고 보상 획득
🎉 [HEART_REFILL] 광고 보상 획득: {unitType: "HEART", unitAmount: 1}
- unitType: HEART
- unitAmount: 1
💖 [HEART_REFILL] 하트 충전 처리 시작 - 사용자 ID: abc-123-def
💖 [HEART_REFILL] 하트 충전 결과: {success: true, current_hearts: 1, ad_views_today: 1}
✅ [HEART_REFILL] 하트 충전 성공
🎉 하트 충전 성공!
💖 하트 상태 업데이트 중...
🚪 모달 닫기
🔄 광고 재로드 예약

# 광고 닫힘
[HEART_REFILL] 광고 표시 이벤트: {type: "dismissed"}
[HEART_REFILL] 광고 닫힘
🏁 광고 시청 프로세스 완료
```

---

**Last Updated**: 2025-01-27
**Status**: Production Ready ✓

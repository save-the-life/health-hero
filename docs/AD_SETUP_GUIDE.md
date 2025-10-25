# 📺 광고 시스템 설정 가이드

**최종 업데이트**: 2025-01-27

---

## 🎯 개요

이 가이드는 Apps-in-Toss AdMob 광고를 설정하는 방법을 설명합니다.

---

## 📋 사전 준비

### 1. 앱인토스 콘솔 접속

1. [앱인토스 콘솔](https://developers-apps-in-toss.toss.im) 접속
2. 로그인
3. 프로젝트 선택

### 2. 광고 권한 확인

**개발** > **광고** 메뉴에서 광고 기능이 활성화되어 있는지 확인

---

## 🔧 광고 그룹 ID 설정

### 1. 광고 그룹 생성

1. 앱인토스 콘솔 > **개발** > **광고**
2. **광고 그룹 생성** 버튼 클릭
3. 광고 그룹 정보 입력:
   - **광고 그룹 이름**: `하트 충전 광고` (또는 원하는 이름)
   - **광고 타입**: `보상형 광고` 선택
   - **플랫폼**: `웹` 선택

### 2. 광고 그룹 ID 복사

광고 그룹 생성 후 표시되는 **광고 그룹 ID**를 복사합니다.

예시:
```
ait.live.50bf52c3ee9144f6
```

### 3. 환경 변수 설정

`.env.local` 파일에 광고 그룹 ID를 추가합니다:

```bash
# 광고 그룹 ID (앱인토스 콘솔에서 복사)
NEXT_PUBLIC_AD_GROUP_HEART_REFILL=ait.live.50bf52c3ee9144f6
```

**중요:**
- `adUnitId`가 아닌 **`adGroupId`**를 사용해야 합니다!
- 토스 광고 2.0부터 `adUnitId` → `adGroupId`로 변경되었습니다.

---

## ✅ 설정 확인

### 1. 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작합니다:

```bash
# 개발 서버 종료 (Ctrl+C)
# .next 폴더 삭제
Remove-Item -Recurse -Force .next

# 개발 서버 재시작
npm run dev
```

### 2. 빌드 및 테스트

```bash
# 빌드
npm run build

# .ait 파일 생성 확인
ls dist/*.ait
```

### 3. 앱인토스 샌드박스에서 테스트

1. `.ait` 파일을 앱인토스 콘솔에 업로드
2. QR 코드로 토스 앱에서 열기
3. Eruda 콘솔 확인 (F12 또는 설정 > 개발자 도구)

**확인 로그:**
```
✅ 광고 지원됨 - 자동 로드 시작
📡 광고 로드 시작 - 타입: HEART_REFILL
🎯 광고 그룹 ID: ait.live.50bf52c3ee9144f6
📺 Apps-in-Toss AdMob 로드 요청
[HEART_REFILL] 광고 이벤트: {type: "loaded"}
✅ 광고 자동 로드 완료
```

---

## 🚨 문제 해결

### 문제 1: 광고가 로드되지 않음

**증상:**
```
❌ 광고 미지원 환경
```

**원인:**
1. 로컬 개발 환경 (앱인토스 SDK 없음)
2. `adGroupId` 환경 변수 미설정
3. 광고 그룹 ID가 잘못됨

**해결:**
1. 앱인토스 샌드박스 앱에서 테스트 (로컬 개발 환경은 지원 안 함)
2. `.env.local` 파일에 `NEXT_PUBLIC_AD_GROUP_HEART_REFILL` 추가
3. 앱인토스 콘솔에서 광고 그룹 ID 재확인

### 문제 2: "adUnitId" 타입 오류

**증상:**
```typescript
Property 'adUnitId' does not exist on type...
```

**원인:**
토스 광고 2.0부터 `adUnitId` → `adGroupId`로 변경됨

**해결:**
코드에서 모든 `adUnitId`를 `adGroupId`로 변경:

```typescript
// ❌ 잘못된 코드 (광고 1.0)
GoogleAdMob.loadAppsInTossAdMob({
  options: { adUnitId: AD_UNIT_ID },
  ...
});

// ✅ 올바른 코드 (광고 2.0)
GoogleAdMob.loadAppsInTossAdMob({
  options: { adGroupId: AD_GROUP_ID },
  ...
});
```

### 문제 3: 광고 로드는 되지만 표시 실패

**증상:**
```
[HEART_REFILL] 광고 표시 이벤트: {type: "failedToShow"}
```

**원인:**
1. 광고 인벤토리 부족 (테스트 광고 소진)
2. 연속 시청 간격이 너무 짧음 (3초 미만)
3. 광고가 이미 표시됨 (중복 호출)

**해결:**
1. 잠시 후 다시 시도 (광고 인벤토리 회복 대기)
2. 3초 이상 대기 후 재시도
3. 광고 재로드 후 시도

---

## 📊 광고 그룹 ID 위치 참고

### useAdMob.ts
```typescript
// 광고 그룹 ID 매핑 (환경 변수에서 가져오기)
const getAdGroupId = (adType: AdType): string => {
  switch (adType) {
    case "HEART_REFILL":
      return process.env.NEXT_PUBLIC_AD_GROUP_HEART_REFILL || "health-hero-heart-refill";
    default:
      throw new Error(`Unknown ad type: ${adType}`);
  }
};
```

### 광고 로드
```typescript
const cleanup = window.appsInToss!.GoogleAdMob.loadAppsInTossAdMob({
  options: { adGroupId },  // ✅ adGroupId 사용
  onEvent: (event) => { ... },
  onError: (error) => { ... },
});
```

### 광고 표시
```typescript
window.appsInToss!.GoogleAdMob.showAppsInTossAdMob({
  options: { adGroupId },  // ✅ adGroupId 사용
  onEvent: (event) => { ... },
  onError: (error) => { ... },
});
```

---

## 🔍 관련 문서

- [환경 변수 설정 가이드](./ENV_SETUP.md)
- [광고 API 검증 보고서](./AD_API_VERIFICATION.md)
- [광고 SDK 트러블슈팅](./AD_SDK_TROUBLESHOOTING.md)
- [광고 시스템 디버깅 가이드](./AD_SYSTEM_DEBUG.md)
- [토스 개발자 커뮤니티 - 광고 2.0 변경 사항](https://developers.toss.im/community)

---

## 💡 팁

### 테스트 광고 vs 실제 광고

**테스트 환경 (샌드박스):**
- 테스트 광고만 표시됨
- 실제 수익 발생 안 함
- 무제한 광고 시청 가능

**프로덕션 환경:**
- 실제 광고 표시됨
- 실제 수익 발생
- 광고 인벤토리 제한 있음

### 광고 인벤토리 관리

1. **테스트 시 주의사항:**
   - 너무 자주 광고를 시청하면 인벤토리 소진
   - 잠시 후 다시 시도 (보통 5-10분)

2. **프로덕션 배포 시:**
   - 광고 그룹 ID를 프로덕션용으로 변경
   - 환경 변수를 배포 플랫폼(Vercel 등)에 설정

---

**Last Updated**: 2025-01-27
**Status**: Production Ready ✓

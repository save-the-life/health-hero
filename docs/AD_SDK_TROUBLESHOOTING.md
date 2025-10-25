# 광고 SDK 로드 실패 문제 해결 가이드

**최종 업데이트**: 2025-01-27
**문제**: `window.appsInToss`가 `undefined`로 광고 SDK가 로드되지 않음
**해결**: 환경 감지 로직 개선으로 토스 앱 환경 자동 감지

---

## 🚨 문제 증상

Eruda 콘솔에서 다음 로그가 표시됨:

```
❌ 광고 미지원 환경
🔍 디버깅 정보:
- window 존재: true
- appsInToss 존재: false  ⚠️
- GoogleAdMob 존재: false
- loadAppsInTossAdMob 존재: false
- isSupported: undefined
```

---

## ✅ 해결 방법

### 0. **환경 감지 로직 개선** (2025-01-27 업데이트)

#### 개선사항:
```typescript
// src/hooks/useAdMob.ts
const isAppsInToss = window.location.hostname.includes('apps-in-toss') || 
                    window.location.hostname.includes('toss.im') ||
                    window.location.hostname.includes('toss.com') ||
                    window.location.hostname.includes('tossmini.com') ||  // ✅ 추가
                    window.navigator.userAgent.includes('TossApp');        // ✅ 추가
```

#### 지원 환경 확장:
- ✅ `tossmini.com` 도메인 (토스 앱 내 환경)
- ✅ `TossApp` UserAgent (카카오톡, 토스 앱)
- ✅ 기존 앱인토스 환경 유지

### 1. **appName 확인 및 수정** (가장 중요!)

#### 문제:
`granite.config.ts`의 `appName`이 앱인토스 콘솔에 등록된 앱 이름과 다름

#### 확인 방법:
1. [앱인토스 콘솔](https://developers-apps-in-toss.toss.im) 접속
2. 프로젝트 선택
3. **설정** 탭에서 **앱 ID** 확인

#### 수정:
```typescript
// granite.config.ts

// ✅ 현재 프로젝트의 올바른 설정
export default defineConfig({
  appName: 'lucky-dice',  // 앱인토스 콘솔에 등록된 실제 앱 ID
});

// ❌ 주의: package.json의 name과 다를 수 있음
// package.json: "name": "health-hero"
// granite.config.ts: appName: "lucky-dice"
// → 앱인토스 콘솔의 앱 ID가 우선!
```

**중요:** `appName`은 앱인토스 콘솔에 등록된 정확한 앱 ID여야 합니다!

---

### 2. **테스트 방법 개선**

#### 토스 앱 환경에서 테스트:
```bash
# 1. 빌드
npm run build

# 2. .ait 파일 업로드 (앱인토스 콘솔)

# 3. 토스 앱에서 실행
# - 카카오톡 내에서 실행
# - 토스 앱 내에서 실행
```

#### 환경 확인 로그:
```javascript
🔍 checkAdSupport: 앱인토스 환경 확인: {
  hostname: "lucky-dice.private-apps.tossmini.com",
  isAppsInToss: true,
  checks: {
    hasAppsInToss: false,
    hasTossIm: false,
    hasTossCom: false,
    hasTossMini: true,  // ✅ 토스 앱 환경 감지
    hasTossApp: true    // ✅ TossApp UserAgent 감지
  }
}
```

### 3. **permissions 설정 확인**

#### 문제:
`permissions`에 `'GoogleAdMob'`을 추가하면 타입 오류 발생

#### 이유:
```typescript
// @apps-in-toss/plugins/dist/index.d.ts
type Permission =
  | ClipboardPermission
  | GeolocationPermission
  | ContactsPermission
  | PhotosPermission
  | CameraPermission;
```

`Permission` 타입에는 다음만 허용됨:
- `clipboard`
- `geolocation`
- `contacts`
- `photos`
- `camera`

**광고 SDK는 자동으로 로드됨!** (별도 권한 불필요)

#### 수정:
```typescript
// granite.config.ts

// ❌ 잘못된 예시
export default defineConfig({
  permissions: [
    'GoogleAdMob',  // 타입 오류 발생!
  ],
});

// ✅ 올바른 예시
export default defineConfig({
  permissions: [],  // 광고 SDK는 자동 로드됨
});
```

---

## 🔍 원인 분석

### Apps-in-Toss SDK 로드 과정

1. **앱 실행 시** → 앱인토스가 `appName` 확인
2. **앱 ID 일치** → `window.appsInToss` 객체 주입
3. **SDK 초기화** → `GoogleAdMob`, `TossLogin` 등 서비스 로드

### appName이 틀리면?

```
앱 실행
  → appName 불일치 감지
  → window.appsInToss 주입 안 함 ❌
  → 모든 SDK 사용 불가
```

---

## 📊 체크리스트 (업데이트됨)

배포 전 확인 사항:

- [x] **환경 감지 로직 개선** - `tossmini.com` 도메인 및 `TossApp` UserAgent 지원
- [ ] `granite.config.ts`의 `appName`이 앱인토스 콘솔의 앱 ID와 일치
- [ ] `permissions`에 `'GoogleAdMob'` 포함 안 됨 (타입 오류)
- [ ] 빌드 성공 (`npm run build`)
- [ ] `.ait` 파일 생성 확인
- [ ] 앱인토스 콘솔에서 앱 활성화 상태 확인
- [x] **토스 앱 환경에서 테스트** - 카카오톡, 토스 앱 내 실행

---

## 🎯 테스트 방법

### 1. 로컬 개발 환경

```bash
npm run dev
```

**결과:**
- `window.appsInToss`: `undefined` (정상)
- 로컬 환경에서는 앱인토스 SDK 없음

### 2. 샌드박스 앱

```bash
npm run build
# .ait 파일 업로드
```

**Eruda 콘솔 확인:**
```
✅ window 존재: true
✅ appsInToss 존재: true
✅ GoogleAdMob 존재: true
✅ loadAppsInTossAdMob 존재: true
✅ showAppsInTossAdMob 존재: true
✅ isSupported: true
```

### 3. 광고 기능 테스트

1. 하트를 0개로 만들기
2. 스테이지 진입 → 하트 부족 모달 확인
3. Eruda 콘솔에서 로그 확인:
   ```
   ✅ 광고 지원됨 - 자동 로드 시작
   📡 광고 로드 시작 - 타입: HEART_REFILL
   🎯 광고 그룹 ID: ait.live.50bf52c3ee9144f6
   📺 Apps-in-Toss AdMob 로드 요청
   [HEART_REFILL] 광고 이벤트: {type: "loaded"}
   ✅ 광고 자동 로드 완료
   ```
4. 광고 버튼 클릭 → 광고 시청
5. 하트 충전 확인

---

## 🛠️ 문제 해결 플로우

```
광고 SDK 로드 실패
    │
    ├─ window.appsInToss === undefined?
    │   ├─ YES → appName 확인
    │   │   ├─ appName이 앱인토스 콘솔과 다름?
    │   │   │   ├─ YES → granite.config.ts 수정 ✅
    │   │   │   └─ NO → 앱인토스 콘솔에서 앱 활성화 확인
    │   │   └─ 빌드 및 재테스트
    │   └─ NO → 다음 단계
    │
    ├─ GoogleAdMob === undefined?
    │   ├─ YES → 앱인토스 버전 확인
    │   └─ NO → 다음 단계
    │
    └─ loadAppsInTossAdMob.isSupported() === false?
        ├─ YES → 광고 권한 확인 (앱인토스 콘솔)
        └─ NO → 정상 작동 ✅
```

---

## 📚 관련 문서

- [Apps-in-Toss 공식 문서](https://developers.toss.im/apps-in-toss)
- [광고 API 검증 보고서](./AD_API_VERIFICATION.md)
- [광고 시스템 디버깅 가이드](./AD_SYSTEM_DEBUG.md)
- [환경 변수 설정 가이드](./ENV_SETUP.md)

---

## 💡 추가 팁

### appName 찾는 방법

1. **앱인토스 콘솔에서 확인**
   - [앱인토스 콘솔](https://developers-apps-in-toss.toss.im) 접속
   - 프로젝트 선택
   - **설정** 탭 → **앱 ID** 확인

2. **package.json에서 참고만 하기**
   ```json
   {
     "name": "health-hero"  // ⚠️ 항상 일치하는 것은 아님!
   }
   ```
   **주의**: 이 프로젝트의 경우 `package.json`은 `"health-hero"`지만, 앱인토스 콘솔 등록은 `"lucky-dice"`입니다.

3. **프로젝트 폴더 이름은 참고만**
   ```
   C:\Users\User\Desktop\WORK SPACE\health-hero
                                     ^^^^^^^^^^^
                                     (폴더 이름 ≠ 앱 ID)
   ```

### 빌드 시 확인 사항

```bash
npm run build
```

**성공 시:**
```
✔ Build successful
✔ Generated .ait file: dist/health-hero.ait
```

**실패 시:**
- appName 불일치 에러 → `granite.config.ts` 수정
- 타입 에러 → `permissions` 확인

---

**Last Updated**: 2025-01-27
**Status**: Production Ready ✓

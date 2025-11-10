# 🎁 프로모션 설정 가이드

Health Hero 프로젝트의 프로모션 연동 가이드입니다.

## 📋 앱인토스 콘솔 설정

### 1. 프로모션 등록

1. **앱인토스 콘솔** 접속: https://console.toss.im
2. 워크스페이스 선택 → Lucky Dice 미니앱 선택
3. 좌측 메뉴 **"프로모션"** 클릭
4. **"+ 등록하기"** 버튼 클릭

### 2. 프로모션 정보 입력

#### 기본 정보
```
프로모션 이름: 첫 퀴즈 풀러가기
프로모션 코드: 01K98ST5FF47JE9WMASGHF45D0
프로모션 종료일: (원하는 날짜)
혜택 탭 노출: 노출 ✅
```

#### 혜택 탭 정보
```
미션 이름: 첫 퀴즈 풀러가기
지급 방식: 고정 금액
금액: 10원
이동 URL: intoss://lucky-dice?promotion=first-quiz
```

⚠️ **중요**: 이동 URL에 `?promotion=first-quiz` 쿼리 파라미터를 반드시 포함해주세요!

#### 예산 정보
```
예산: (비즈 월렛 잔액 내에서 설정)
```

---

## 🔄 사용자 플로우

### 일반 진입 (프로모션 없음)
```
토스 앱에서 "Lucky Dice" 검색 → 앱 실행
  ↓
intoss://lucky-dice
  ↓
/ (시작 페이지)
  ↓
"퀴즈 풀러가기" 버튼 클릭
  ↓
토스 로그인 (최초: 약관 동의)
  ↓
메인 페이지 (/game) 이동
  ↓
게임 시작 (프로모션 없음)
```

### 혜택 탭 진입 (프로모션 지급)
```
토스 앱 → 혜택 탭 → "첫 퀴즈 풀러가기" 클릭
  ↓
intoss://lucky-dice?promotion=first-quiz
  ↓
/ (시작 페이지) ← 쿼리 파라미터로 프로모션 감지!
  ↓
프로모션 플래그 자동 설정 (localStorage)
  ↓
"퀴즈 풀러가기" 버튼 클릭
  ↓
토스 로그인 (최초: 약관 동의)
  ↓
프로모션 10원 자동 지급
  ↓
메인 페이지 (/game) 이동
  ↓
토스트: "🎉 10원을 지급했어요!"
```

---

## 🎯 동작 원리

### 쿼리 파라미터 방식
```typescript
// src/app/page.tsx
const searchParams = useSearchParams();
const promotion = searchParams.get('promotion');

if (promotion === 'first-quiz') {
  // 프로모션 플래그 설정
  localStorage.setItem('shouldGrantPromotion', 'true');
}
```

### 로그인 버튼 로직
```typescript
// src/components/TossLoginButton.tsx
const shouldGrantPromotion = localStorage.getItem('shouldGrantPromotion') === 'true';

if (shouldGrantPromotion) {
  // 프로모션 지급
  await promotionService.grantReward(..., false); // 운영 모드
  localStorage.removeItem('shouldGrantPromotion'); // 재사용 방지
}
```

---

## 📊 비교표

| 항목 | 일반 진입 | 혜택 탭 진입 |
|------|----------|------------|
| **딥링크** | `intoss://lucky-dice` | `intoss://lucky-dice?promotion=first-quiz` |
| **페이지** | `/` | `/` |
| **쿼리 파라미터** | ❌ 없음 | ✅ `?promotion=first-quiz` |
| **프로모션 플래그** | ❌ 없음 | ✅ 자동 설정 |
| **로그인** | ✅ | ✅ |
| **약관 동의** | 최초 1회 | 최초 1회 |
| **프로모션 지급** | ❌ | ✅ (10원) |
| **게임 시작** | ✅ | ✅ |
| **토스트 메시지** | ❌ | ✅ "10원 지급!" |

---

## 🔒 중복 방지

프로모션은 **1인 1회**만 지급됩니다:

### 1. 플래그 자동 삭제
```typescript
localStorage.removeItem('shouldGrantPromotion');
```

### 2. DB 유니크 인덱스
```sql
UNIQUE (user_id, game_user_hash, condition_type, status='SUCCESS')
```

### 3. 사전 체크
- 로그인 시 자동으로 중복 확인
- 이미 받았으면: "이미 지급받은 프로모션입니다" 메시지
- SDK에서도 중복 방지

---

## 📱 테스트 방법

### 로컬 테스트

#### 일반 진입
```
http://localhost:3000/
→ 퀴즈 풀러가기 클릭
→ 로그인 → 게임 시작 (프로모션 없음)
```

#### 혜택 탭 진입 시뮬레이션
```
http://localhost:3000/?promotion=first-quiz
→ 자동으로 프로모션 플래그 설정됨
→ 퀴즈 풀러가기 클릭
→ 로그인 → 프로모션 지급 → 게임 시작
```

### 콘솔 로그 확인

#### 일반 진입
```
✅ [TossLogin] 토스 로그인 완료
✅ [TossLogin] 게임 유저 키 저장 완료
ℹ️ [TossLogin] 일반 진입 (프로모션 없음)
```

#### 혜택 탭 진입
```
🎁 [Home] 혜택 탭에서 진입 (promotion=first-quiz)
✅ [Home] 프로모션 플래그 설정 완료
🎁 [TossLogin] 혜택 탭 진입 감지!
🎁 [TossLogin] 첫 퀴즈 프로모션 자동 지급 시작
🎉 [TossLogin] 프로모션 지급 성공!
💰 [TossLogin] 지급 금액: 10 원
```

---

## 🚀 실제 출시 전 체크리스트

### 앱인토스 콘솔
- [ ] 프로모션 등록 완료
- [ ] 프로모션 코드: `01K98ST5FF47JE9WMASGHF45D0` 확인
- [ ] 이동 URL: `intoss://lucky-dice?promotion=first-quiz` 설정 ⚠️
- [ ] 혜택 탭 노출: ✅
- [ ] 비즈 월렛 충전
- [ ] 예산 설정
- [ ] 프로모션 검토 승인 완료

### 코드
- [x] `isTest: false` (운영 모드) 설정 완료 ✅
- [x] 쿼리 파라미터 방식으로 구현 완료 ✅
- [x] 중복 방지 기능 작동 확인 ✅
- [x] RLS 정책 확인 완료 ✅

### 딥링크
- [ ] `intoss://lucky-dice?promotion=first-quiz` 테스트
- [ ] 샌드박스 앱에서 테스트
- [ ] 프로덕션 앱에서 최종 테스트

---

## 💡 참고사항

### 프로모션 예산 관리
- 예산 80% 소진 시 이메일 알림
- 예산 100% 소진 시 자동 종료
- 콘솔에서 실시간 예산 증액 가능

### 혜택 탭 노출
- 검토 승인 후 자동 노출
- 예산 소진 시 자동 숨김
- 수동으로 프로모션 종료 가능

### 에러 코드
| 코드 | 의미 | 대응 |
|------|------|------|
| 4109 | 프로모션 미실행 | 콘솔에서 시작 필요 |
| 4112 | 예산 부족 | 비즈 월렛 충전 |
| ALREADY_GRANTED | 중복 지급 | 정상 동작 (1인 1회) |

---

## 🎊 장점

### 간단한 구조
- `/first-quiz` 같은 별도 페이지 불필요
- 쿼리 파라미터만으로 모든 처리
- 코드 중복 최소화

### 일관된 UX
- 모든 사용자가 동일한 시작 페이지 경험
- 프로모션 여부는 내부 로직으로만 처리
- 사용자는 차이를 느끼지 못함 (좋은 UX!)

### 유지보수 용이
- 파일 구조 단순
- 로직 추적 쉬움
- 향후 프로모션 추가 용이

---

## 🎊 완료!

이제 사용자는:
1. **혜택 탭**에서 프로모션 발견
2. **클릭 한 번**으로 로그인 + 프로모션 수령
3. **동일한 시작 페이지**에서 자연스러운 경험
4. **바로 게임 시작**

간편하고 자연스러운 프로모션 플로우가 완성되었습니다! 🚀


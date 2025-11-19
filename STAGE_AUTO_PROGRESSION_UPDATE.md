# 페이즈 자동 전환 기능 추가

## 📅 업데이트 날짜
2025-11-19

## 🎯 변경 목적
페이즈 1의 마지막 스테이지(Stage 5)를 클리어했을 때 사용자가 수동으로 다음 페이즈로 이동하지 않는 문제 해결. 자동으로 다음 페이즈로 이동하도록 개선하여 사용자 경험 향상.

## ❌ 기존 문제점

### 이슈
- 사용자가 페이즈 1의 Stage 5를 클리어
- DB에서는 Phase 2, Stage 1로 업데이트됨
- 하지만 StageResultModal의 "보상 받기" 클릭 시 여전히 Phase 1 페이지로 이동
- 사용자가 수동으로 다음 페이즈를 찾아야 함

### 원인
1. `completeStage` 함수가 boolean만 반환 (성공 여부만)
2. `phase_cleared` 정보가 UI에 전달되지 않음
3. StageResultModal이 현재 페이즈 정보만 받음

## ✨ 해결 방법

### 전체 플로우

```
1. 사용자가 Stage 5 클리어
   ↓
2. completeStage SQL 함수 실행
   - phase_cleared: true
   - current_phase: 2 (업데이트)
   - current_stage: 1 (업데이트)
   ↓
3. gameStore.completeStage 반환값 확장
   - CompleteStageResult 객체 반환
   - newPhase: 2, newStage: 1 포함
   ↓
4. quiz/page.tsx에서 결과 처리
   - phase_cleared 확인
   - stageResultData에 저장
   ↓
5. StageResultModal에 전달
   - phaseCleared: true
   - nextPhase: 2
   ↓
6. "보상 받기" 클릭 시
   - Phase 2 페이지로 자동 이동 ✅
```

---

## 🔧 구현 내용

### 1️⃣ gameStore.ts 수정

#### CompleteStageResult 인터페이스 추가

**파일**: `src/store/gameStore.ts`

```typescript
export interface CompleteStageResult {
  success: boolean
  stage_cleared: boolean
  next_stage_unlocked: boolean
  phase_cleared: boolean
  message: string
  newPhase?: number
  newStage?: number
}
```

#### completeStage 함수 반환 타입 변경

**이전**:
```typescript
completeStage: (...) => Promise<boolean>
```

**변경 후**:
```typescript
completeStage: (...) => Promise<CompleteStageResult | null>
```

#### completeStage 함수 구현 수정

**주요 변경 사항**:
1. 반환값을 `boolean` → `CompleteStageResult | null`로 변경
2. 새로운 페이즈/스테이지 계산 로직 추가
3. 전체 result 객체 반환 (newPhase, newStage 포함)

```typescript
// 다음 페이즈와 스테이지 계산
const newStage = result.next_stage_unlocked ? (stage === 5 ? 1 : stage + 1) : stage
const newPhase = result.phase_cleared ? phase + 1 : phase

// 전체 result 반환 (새로운 페이즈/스테이지 정보 포함)
return {
  ...result,
  newPhase,
  newStage
}
```

---

### 2️⃣ quiz/page.tsx 수정

**파일**: `src/app/game/quiz/page.tsx`

#### stageResultData 타입 확장

**이전**:
```typescript
const [stageResultData, setStageResultData] = useState<{
  isSuccess: boolean;
  correctCount: number;
  earnedExp: number;
  earnedScore: number;
} | null>(null);
```

**변경 후**:
```typescript
const [stageResultData, setStageResultData] = useState<{
  isSuccess: boolean;
  correctCount: number;
  earnedExp: number;
  earnedScore: number;
  phaseCleared: boolean;  // ✅ 추가
  nextPhase: number;       // ✅ 추가
} | null>(null);
```

#### completeStage 호출 및 결과 처리 수정

**이전**:
```typescript
const success = await completeStage(...);
if (success) {
  setStageResultData({
    isSuccess,
    correctCount,
    earnedExp: totalExp,
    earnedScore: totalScore,
  });
}
```

**변경 후**:
```typescript
const result = await completeStage(...);
if (result && result.success) {
  console.log("페이즈 클리어:", result.phase_cleared);
  console.log("다음 진행:", `Phase ${result.newPhase}, Stage ${result.newStage}`);
  
  setStageResultData({
    isSuccess,
    correctCount,
    earnedExp: totalExp,
    earnedScore: totalScore,
    phaseCleared: result.phase_cleared,      // ✅ 추가
    nextPhase: result.newPhase || quizPhase, // ✅ 추가
  });
}
```

#### StageResultModal Props 전달 수정

**이전**:
```typescript
<StageResultModal
  isOpen={showStageResultModal}
  isSuccess={stageResultData.isSuccess}
  earnedExp={stageResultData.earnedExp}
  earnedScore={stageResultData.earnedScore}
  currentPhase={quizPhase}
  onClose={handleCloseStageResultModal}
/>
```

**변경 후**:
```typescript
<StageResultModal
  isOpen={showStageResultModal}
  isSuccess={stageResultData.isSuccess}
  earnedExp={stageResultData.earnedExp}
  earnedScore={stageResultData.earnedScore}
  currentPhase={quizPhase}
  phaseCleared={stageResultData.phaseCleared}  // ✅ 추가
  nextPhase={stageResultData.nextPhase}         // ✅ 추가
  onClose={handleCloseStageResultModal}
/>
```

---

### 3️⃣ StageResultModal.tsx 수정

**파일**: `src/components/StageResultModal.tsx`

#### Props 인터페이스 확장

**이전**:
```typescript
interface StageResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  earnedExp: number;
  earnedScore: number;
  currentPhase: number;
  onClose: () => void;
}
```

**변경 후**:
```typescript
interface StageResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  earnedExp: number;
  earnedScore: number;
  currentPhase: number;
  phaseCleared: boolean;  // ✅ 추가
  nextPhase: number;      // ✅ 추가
  onClose: () => void;
}
```

#### handleRewardClick 로직 수정

**이전**:
```typescript
const handleRewardClick = async () => {
  onClose();
  
  if (user?.id) {
    await loadUserData(user.id);
  }
  
  // 현재 페이즈로 이동
  router.push(`/game/phase${currentPhase}`);
};
```

**변경 후**:
```typescript
const handleRewardClick = async () => {
  onClose();
  
  if (user?.id) {
    await loadUserData(user.id);
  }
  
  // 페이즈가 클리어되었으면 다음 페이즈로, 아니면 현재 페이즈로 이동
  const targetPhase = phaseCleared ? nextPhase : currentPhase;
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🎯 [StageResult] 페이지 이동: Phase ${targetPhase}`);
  if (phaseCleared) {
    console.log(`🎊 [StageResult] 페이즈 ${currentPhase} 클리어! 다음 페이즈로 이동`);
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  router.push(`/game/phase${targetPhase}`);
};
```

---

## 🔄 사용자 플로우 변경

### 변경 전 (수동 이동 필요)

```
사용자가 Phase 1, Stage 5 클리어
  ↓
스테이지 결과 모달 표시
  ↓
"보상 받기" 클릭
  ↓
Phase 1 페이지로 이동 ❌ (잘못된 동작)
  ↓
사용자가 수동으로 다음 페이즈를 찾아야 함
```

### 변경 후 (자동 이동)

```
사용자가 Phase 1, Stage 5 클리어
  ↓
DB 업데이트: Phase 2, Stage 1
  ↓
스테이지 결과 모달 표시
  ↓
"보상 받기" 클릭
  ↓
Phase 2 페이지로 자동 이동 ✅ (올바른 동작)
  ↓
사용자는 즉시 다음 페이즈 진행 가능
```

---

## 🎊 기대 효과

### 1. 사용자 경험 개선 ✅
- 페이즈 전환이 자연스럽게 진행
- 사용자가 다음 페이즈를 찾을 필요 없음
- 게임 플로우가 끊기지 않음

### 2. 혼란 감소 ✅
- "왜 Phase 1에 있지?" 같은 혼란 방지
- 진행 상황이 명확하게 표시됨

### 3. 전환율 향상 ✅
- 페이즈 전환 시 이탈률 감소 예상
- 자연스러운 게임 진행으로 참여도 증가

---

## 🔍 기술 구현 세부사항

### 페이즈 전환 조건

**SQL 함수** (`complete_stage`):
```sql
-- 스테이지 5 완료 시 다음 페이즈로 이동
IF p_stage >= 5 THEN
  v_new_stage := 1;
  v_new_phase := p_phase + 1;
  
  -- 페이즈 4 완료 시 모든 페이즈 클리어
  IF p_phase >= 4 THEN
    v_phase_cleared := TRUE;
  END IF;
END IF;
```

### 상태 계산 로직

**gameStore.ts**:
```typescript
// Stage 5를 클리어하면 다음 페이즈의 Stage 1로
const newStage = result.next_stage_unlocked 
  ? (stage === 5 ? 1 : stage + 1) 
  : stage;

// phase_cleared가 true면 다음 페이즈로
const newPhase = result.phase_cleared 
  ? phase + 1 
  : phase;
```

### 페이지 이동 결정

**StageResultModal.tsx**:
```typescript
// phaseCleared가 true면 nextPhase로, 아니면 currentPhase로
const targetPhase = phaseCleared ? nextPhase : currentPhase;
router.push(`/game/phase${targetPhase}`);
```

---

## 📊 테스트 시나리오

### 시나리오 1: 일반 스테이지 클리어
```
Phase 1, Stage 1 클리어
  ↓
result.phase_cleared: false
result.newPhase: 1
result.newStage: 2
  ↓
StageResultModal: phaseCleared = false
  ↓
"보상 받기" 클릭 → Phase 1 페이지로 이동 ✅
```

### 시나리오 2: 페이즈 마지막 스테이지 클리어
```
Phase 1, Stage 5 클리어
  ↓
result.phase_cleared: true
result.newPhase: 2
result.newStage: 1
  ↓
StageResultModal: phaseCleared = true, nextPhase = 2
  ↓
"보상 받기" 클릭 → Phase 2 페이지로 자동 이동 ✅
```

### 시나리오 3: 모든 페이즈 클리어
```
Phase 4, Stage 5 클리어
  ↓
result.phase_cleared: true (최종 클리어)
result.newPhase: 5 (또는 특별 처리)
  ↓
엔딩 또는 축하 화면 표시 가능
```

---

## 🚨 주의사항

### 1. 페이즈 번호 유효성 검사
- Phase 5 이상으로 넘어가지 않도록 확인 필요
- 필요시 최대 페이즈 제한 추가

### 2. 에러 처리
- `completeStage` 실패 시 null 반환
- UI에서 null 체크 필수

### 3. 사용자 데이터 동기화
- 페이지 이동 전 `loadUserData` 호출
- 최신 진행 상황 반영 확인

---

## ✅ 변경 완료 사항

### 수정된 파일
1. `src/store/gameStore.ts`
   - CompleteStageResult 인터페이스 추가
   - completeStage 함수 반환 타입 변경
   - 새로운 페이즈/스테이지 계산 로직 추가

2. `src/app/game/quiz/page.tsx`
   - stageResultData 타입 확장
   - completeStage 결과 처리 로직 수정
   - StageResultModal props 전달 수정

3. `src/components/StageResultModal.tsx`
   - Props 인터페이스 확장
   - handleRewardClick 로직 수정
   - 페이즈 전환 로그 추가

### 린트 검사
- ✅ TypeScript 타입 에러 없음
- ✅ ESLint 에러 없음
- ✅ 빌드 에러 없음

---

## 📝 콘솔 로그 예시

### Phase 1, Stage 5 클리어 시

```
스테이지 완료 데이터 저장 성공
페이즈 클리어: true
다음 진행: Phase 2, Stage 1
스테이지 완료 후 강제 캐시 무효화 및 상태 업데이트 완료
새로운 진행 상황: Phase 2, Stage 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 [StageResult] 페이지 이동: Phase 2
🎊 [StageResult] 페이즈 1 클리어! 다음 페이즈로 이동
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎉 최종 결과

**페이즈 1의 Stage 5를 클리어하면 자동으로 Phase 2 페이지로 이동합니다!**

사용자 경험:
```
Phase 1, Stage 5 클리어
  ↓ (자동)
스테이지 성공 모달
  ↓ ("보상 받기" 클릭)
Phase 2 페이지 (자동 이동)
  ↓
Stage 1부터 새로운 퀴즈 도전!
```

**자연스러운 게임 진행과 향상된 사용자 경험!** 🚀


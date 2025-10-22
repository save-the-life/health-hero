# 퀴즈 데이터 동기화 문제 해결 가이드

## 문제 상황

새로운 퀴즈 데이터로 업데이트한 후, 기존 `user_quiz_records` 테이블에 존재하지 않는 `quiz_id`를 참조하는 레코드들이 남아있어 외래키 제약조건 위반 오류가 발생하고 있습니다.

## 오류 메시지

```
POST https://uasphzqbluxctnukoazy.supabase.co/rest/v1/user_quiz_records 409 (Conflict)
퀴즈 기록 저장 실패:
{code: '23503', details: 'Key is not present in table "quizzes".', hint: null, message: 'insert or update on table "user_quiz_records" violates foreign key constraint "user_quiz_records_quiz_id_fkey"'}
```

## 해결 방법

### 1. 데이터베이스 정리 (즉시 해결)

**Supabase SQL Editor에서 다음 스크립트를 실행하세요:**

```sql
-- 존재하지 않는 quiz_id를 참조하는 user_quiz_records 삭제
DELETE FROM user_quiz_records
WHERE quiz_id NOT IN (
    SELECT id FROM quizzes
);

-- 존재하지 않는 question_id를 참조하는 quiz_submission_logs 삭제
DELETE FROM quiz_submission_logs
WHERE question_id NOT IN (
    SELECT id FROM quizzes
);
```

또는 `supabase/fix-quiz-records.sql` 파일의 전체 내용을 실행하세요.

### 2. 애플리케이션 코드 개선 (장기적 해결)

`src/services/quizService.ts`의 `submitQuizAnswer` 함수를 다음과 같이 개선했습니다:

1. **퀴즈 존재 여부 사전 확인**: 기록 저장 전에 `quiz_id`가 존재하는지 확인
2. **외래키 제약조건 오류 처리**: `23503` 오류 코드에 대한 특별 처리
3. **게임 진행 보장**: 데이터 저장 실패가 있어도 게임 진행은 계속

### 3. 실행 순서

1. **데이터베이스 정리**:

   - Supabase 대시보드 → SQL Editor
   - `supabase/fix-quiz-records.sql` 내용 복사하여 실행

2. **애플리케이션 재시작**:

   - 개발 서버 재시작 (코드 변경사항 반영)

3. **테스트**:
   - 퀴즈 풀이 시도
   - 콘솔에서 오류 메시지 확인

## 예상 결과

- ✅ 외래키 제약조건 오류 해결
- ✅ 퀴즈 기록 정상 저장
- ✅ 게임 진행 중단 없음
- ✅ 기존 사용자 진행 상황 유지

## 추가 권장사항

향후 퀴즈 데이터 업데이트 시:

1. 기존 데이터 삭제 전에 백업 생성
2. 관련 테이블(`user_quiz_records`, `quiz_submission_logs`)도 함께 정리
3. 단계적 업데이트로 데이터 무결성 보장

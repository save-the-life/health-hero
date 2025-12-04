-- ============================================
-- 중복 퀴즈 제거 스크립트
-- ============================================

-- 1. 중복된 프롬프트(문제 내용)를 가진 퀴즈 식별 및 제거
-- qnum이 가장 작은(가장 먼저 생성된 것으로 추정) 하나만 남기고 나머지는 삭제
DELETE FROM quizzes
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
      ROW_NUMBER() OVER (PARTITION BY prompt ORDER BY qnum ASC) as rnum
    FROM quizzes
  ) t
  WHERE t.rnum > 1
);

-- 2. 결과 확인
SELECT COUNT(*) as remaining_questions FROM quizzes;

-- 3. (선택 사항) 향후 중복 방지를 위해 prompt에 유니크 제약 조건 추가
-- 주의: 이 작업은 중복이 완전히 제거된 후에만 성공합니다.
-- ALTER TABLE quizzes ADD CONSTRAINT unique_prompt UNIQUE (prompt);

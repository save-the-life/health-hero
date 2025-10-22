-- ============================================
-- 퀴즈 기록 테이블 정리 스크립트 (2025-01-27)
-- 존재하지 않는 quiz_id 참조 제거
-- ============================================

-- 1. 존재하지 않는 quiz_id를 참조하는 user_quiz_records 삭제
-- ============================================
DELETE FROM user_quiz_records 
WHERE quiz_id NOT IN (
    SELECT id FROM quizzes
);

-- 2. 존재하지 않는 question_id를 참조하는 quiz_submission_logs 삭제
-- ============================================
DELETE FROM quiz_submission_logs 
WHERE question_id NOT IN (
    SELECT id FROM quizzes
);

-- 3. 정리 결과 확인
-- ============================================
SELECT 'user_quiz_records' as table_name, COUNT(*) as remaining_records FROM user_quiz_records
UNION ALL
SELECT 'quiz_submission_logs' as table_name, COUNT(*) as remaining_records FROM quiz_submission_logs
UNION ALL
SELECT 'quizzes' as table_name, COUNT(*) as remaining_records FROM quizzes;

-- 4. 외래키 제약조건 확인
-- ============================================
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('user_quiz_records', 'quiz_submission_logs');

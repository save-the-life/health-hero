-- ============================================
-- 테이블 상태 최종 확인 SQL
-- ============================================

-- 1. 테이블 존재 및 데이터 확인
SELECT 'user_hearts' as table_name, COUNT(*) as row_count FROM user_hearts
UNION ALL
SELECT 'quizzes' as table_name, COUNT(*) as row_count FROM quizzes
UNION ALL
SELECT 'user_profiles' as table_name, COUNT(*) as row_count FROM user_profiles;

-- 2. RLS 정책 확인
SELECT 
  tablename,
  policyname,
  cmd as operation,
  roles
FROM pg_policies 
WHERE tablename IN ('user_hearts', 'quizzes', 'user_profiles')
ORDER BY tablename, policyname;

-- 3. 테이블 구조 확인
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_hearts' 
ORDER BY ordinal_position;

-- 4. 샘플 데이터 확인 (quizzes)
SELECT qnum, topic, prompt FROM quizzes ORDER BY qnum LIMIT 3;

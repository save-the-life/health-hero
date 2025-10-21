-- ============================================
-- Supabase 테이블 상태 확인 및 디버깅 SQL
-- ============================================

-- 1. 테이블 존재 여부 확인
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename IN ('user_hearts', 'quizzes', 'user_quiz_records', 'user_progress', 'quiz_submission_logs', 'user_profiles')
ORDER BY tablename;

-- 2. RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('user_hearts', 'quizzes', 'user_quiz_records', 'user_progress', 'quiz_submission_logs', 'user_profiles')
ORDER BY tablename, policyname;

-- 3. RLS 활성화 상태 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_hearts', 'quizzes', 'user_quiz_records', 'user_progress', 'quiz_submission_logs', 'user_profiles')
ORDER BY tablename;

-- 4. 함수 존재 여부 확인
SELECT 
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_result(p.oid) as return_type,
  pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname IN ('refill_heart', 'consume_heart', 'add_heart_by_ad', 'buy_heart_with_points', 'update_updated_at_column')
ORDER BY p.proname;

-- 5. 샘플 데이터 확인 (quizzes 테이블)
SELECT COUNT(*) as quiz_count FROM quizzes;

-- 6. 현재 사용자 정보 확인
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

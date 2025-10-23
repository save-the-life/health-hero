-- RLS 정책을 토스 로그인 방식에 맞게 수정
-- 익명 사용자도 접근할 수 있도록 하되, 보안은 유지

-- 1. 기존 정책 삭제
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_hearts;
DROP POLICY IF EXISTS "Allow read for all users" ON quizzes;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_quiz_records;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON toss_login_logs;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_item_settings;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON quiz_submission_logs;

-- 2. 새로운 정책 생성 (익명 사용자도 접근 가능)

-- user_profiles 테이블 정책
CREATE POLICY "Allow all operations for all users" ON user_profiles
  FOR ALL USING (true);

-- user_hearts 테이블 정책  
CREATE POLICY "Allow all operations for all users" ON user_hearts
  FOR ALL USING (true);

-- quizzes 테이블 정책 (모든 사용자가 읽기 가능)
CREATE POLICY "Allow read for all users" ON quizzes
  FOR SELECT USING (true);

-- user_quiz_records 테이블 정책
CREATE POLICY "Allow all operations for all users" ON user_quiz_records
  FOR ALL USING (true);

-- user_progress 테이블 정책
CREATE POLICY "Allow all operations for all users" ON user_progress
  FOR ALL USING (true);

-- toss_login_logs 테이블 정책
CREATE POLICY "Allow all operations for all users" ON toss_login_logs
  FOR ALL USING (true);

-- user_item_settings 테이블 정책
CREATE POLICY "Allow all operations for all users" ON user_item_settings
  FOR ALL USING (true);

-- quiz_submission_logs 테이블 정책
CREATE POLICY "Allow all operations for all users" ON quiz_submission_logs
  FOR ALL USING (true);

-- 3. 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN (
  'user_profiles', 
  'user_hearts', 
  'quizzes', 
  'user_quiz_records', 
  'user_progress', 
  'toss_login_logs', 
  'user_item_settings', 
  'quiz_submission_logs'
)
ORDER BY tablename, policyname;

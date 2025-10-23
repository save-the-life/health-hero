-- RLS 다시 활성화 및 올바른 정책 설정
-- 보안을 위해 RLS를 다시 활성화하되, 토스 로그인 방식에 맞는 정책 설정

-- 1. 모든 테이블의 RLS 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hearts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE toss_login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_item_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submission_logs ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own hearts" ON user_hearts;
DROP POLICY IF EXISTS "Users can update own hearts" ON user_hearts;
DROP POLICY IF EXISTS "Users can insert own hearts" ON user_hearts;

DROP POLICY IF EXISTS "Users can read quiz questions only" ON quizzes;
DROP POLICY IF EXISTS "Server can read quiz answers" ON quizzes;

DROP POLICY IF EXISTS "Users can view own quiz records" ON user_quiz_records;
DROP POLICY IF EXISTS "Users can insert own quiz records" ON user_quiz_records;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;

DROP POLICY IF EXISTS "Users can view own login logs" ON toss_login_logs;
DROP POLICY IF EXISTS "Users can insert own login logs" ON toss_login_logs;

DROP POLICY IF EXISTS "Users can view own item settings" ON user_item_settings;
DROP POLICY IF EXISTS "Users can update own item settings" ON user_item_settings;
DROP POLICY IF EXISTS "Users can insert own item settings" ON user_item_settings;

DROP POLICY IF EXISTS "Users can view own submission logs" ON quiz_submission_logs;
DROP POLICY IF EXISTS "Users can insert own submission logs" ON quiz_submission_logs;

-- 3. 새로운 정책 생성 (토스 로그인 방식에 맞게)

-- user_profiles 테이블 정책
CREATE POLICY "Allow all operations for authenticated users" ON user_profiles
  FOR ALL USING (true);

-- user_hearts 테이블 정책  
CREATE POLICY "Allow all operations for authenticated users" ON user_hearts
  FOR ALL USING (true);

-- quizzes 테이블 정책 (모든 사용자가 읽기 가능)
CREATE POLICY "Allow read for all users" ON quizzes
  FOR SELECT USING (true);

-- user_quiz_records 테이블 정책
CREATE POLICY "Allow all operations for authenticated users" ON user_quiz_records
  FOR ALL USING (true);

-- user_progress 테이블 정책
CREATE POLICY "Allow all operations for authenticated users" ON user_progress
  FOR ALL USING (true);

-- toss_login_logs 테이블 정책
CREATE POLICY "Allow all operations for authenticated users" ON toss_login_logs
  FOR ALL USING (true);

-- user_item_settings 테이블 정책
CREATE POLICY "Allow all operations for authenticated users" ON user_item_settings
  FOR ALL USING (true);

-- quiz_submission_logs 테이블 정책
CREATE POLICY "Allow all operations for authenticated users" ON quiz_submission_logs
  FOR ALL USING (true);

-- 4. RLS 활성화 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
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
ORDER BY tablename;

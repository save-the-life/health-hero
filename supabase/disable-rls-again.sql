-- RLS 다시 비활성화 (임시 해결책)
-- 보안상 주의가 필요하지만 앱이 정상 작동하도록 함

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_hearts DISABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE toss_login_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_item_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submission_logs DISABLE ROW LEVEL SECURITY;

-- RLS 비활성화 확인
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

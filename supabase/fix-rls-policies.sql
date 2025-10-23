-- RLS 정책 수정 쿼리
-- 익명 사용자 접근을 제거하고 인증된 사용자만 접근하도록 수정

-- 1. user_profiles 테이블 정책 수정
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. user_hearts 테이블 정책 수정
DROP POLICY IF EXISTS "Users can view own hearts" ON user_hearts;
CREATE POLICY "Users can view own hearts" ON user_hearts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own hearts" ON user_hearts;
CREATE POLICY "Users can update own hearts" ON user_hearts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own hearts" ON user_hearts;
CREATE POLICY "Users can insert own hearts" ON user_hearts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. quizzes 테이블 정책 수정 (인증된 사용자만 접근)
DROP POLICY IF EXISTS "Users can read quiz questions only" ON quizzes;
CREATE POLICY "Users can read quiz questions only" ON quizzes
  FOR SELECT USING (auth.role() = 'authenticated');

-- 4. user_quiz_records 테이블 정책 수정
DROP POLICY IF EXISTS "Users can view own quiz records" ON user_quiz_records;
CREATE POLICY "Users can view own quiz records" ON user_quiz_records
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz records" ON user_quiz_records;
CREATE POLICY "Users can insert own quiz records" ON user_quiz_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. user_progress 테이블 정책 수정
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. toss_login_logs 테이블 정책 수정 (로그는 인증된 사용자만)
DROP POLICY IF EXISTS "Users can view own login logs" ON toss_login_logs;
CREATE POLICY "Users can view own login logs" ON toss_login_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own login logs" ON toss_login_logs;
CREATE POLICY "Users can insert own login logs" ON toss_login_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. user_item_settings 테이블 정책 수정
DROP POLICY IF EXISTS "Users can view own item settings" ON user_item_settings;
CREATE POLICY "Users can view own item settings" ON user_item_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own item settings" ON user_item_settings;
CREATE POLICY "Users can update own item settings" ON user_item_settings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own item settings" ON user_item_settings;
CREATE POLICY "Users can insert own item settings" ON user_item_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. quiz_submission_logs 테이블 정책 수정
DROP POLICY IF EXISTS "Users can view own submission logs" ON quiz_submission_logs;
CREATE POLICY "Users can view own submission logs" ON quiz_submission_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own submission logs" ON quiz_submission_logs;
CREATE POLICY "Users can insert own submission logs" ON quiz_submission_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
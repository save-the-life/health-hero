-- ============================================
-- 간단한 정책 재생성 SQL (기존 정책 삭제 후 재생성)
-- ============================================

-- user_hearts 정책 재생성
DROP POLICY IF EXISTS "Users can view own hearts" ON user_hearts;
DROP POLICY IF EXISTS "Users can update own hearts" ON user_hearts;
DROP POLICY IF EXISTS "Users can insert own hearts" ON user_hearts;

CREATE POLICY "Users can view own hearts" ON user_hearts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own hearts" ON user_hearts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hearts" ON user_hearts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- quizzes 정책 재생성
DROP POLICY IF EXISTS "Users can read quiz questions only" ON quizzes;
DROP POLICY IF EXISTS "Server can read quiz answers" ON quizzes;

CREATE POLICY "Users can read quiz questions only" ON quizzes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Server can read quiz answers" ON quizzes
  FOR SELECT USING (auth.role() = 'service_role');

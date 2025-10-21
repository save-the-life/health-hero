-- ============================================
-- RLS 정책 수정 - anon 역할 허용
-- ============================================

-- 1. 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own hearts" ON user_hearts;
DROP POLICY IF EXISTS "Users can update own hearts" ON user_hearts;
DROP POLICY IF EXISTS "Users can insert own hearts" ON user_hearts;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- 2. 새로운 정책 생성 (anon 역할 포함)
-- user_hearts 정책
CREATE POLICY "Users can view own hearts" ON user_hearts
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'anon' OR 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own hearts" ON user_hearts
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.role() = 'anon' OR 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can insert own hearts" ON user_hearts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.role() = 'anon' OR 
    auth.role() = 'authenticated'
  );

-- user_profiles 정책
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    auth.role() = 'anon' OR 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    auth.role() = 'anon' OR 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    auth.role() = 'anon' OR 
    auth.role() = 'authenticated'
  );

-- 3. 테스트 쿼리
-- anon 역할로 실행해서 데이터가 보이는지 확인
SELECT COUNT(*) as quizzes_count FROM quizzes;
SELECT COUNT(*) as user_hearts_count FROM user_hearts;
SELECT COUNT(*) as user_profiles_count FROM user_profiles;

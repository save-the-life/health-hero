-- 사용자 프로필 테이블 (토스 정보 포함)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  
  -- 토스 관련 필드
  toss_user_key BIGINT UNIQUE,
  toss_access_token TEXT,
  toss_refresh_token TEXT,
  toss_token_expires_at TIMESTAMP WITH TIME ZONE,
  toss_referrer TEXT,
  
  -- 게임 관련 필드
  level INTEGER DEFAULT 1,
  current_exp INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  current_stage INTEGER DEFAULT 1,
  current_phase INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 토스 로그인 기록
CREATE TABLE IF NOT EXISTS toss_login_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  toss_user_key BIGINT,
  referrer TEXT,
  login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Row Level Security 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE toss_login_logs ENABLE ROW LEVEL SECURITY;

-- user_profiles 정책 (기존 정책 삭제 후 재생성)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- toss_login_logs 정책 (기존 정책 삭제 후 재생성)
DROP POLICY IF EXISTS "Users can view own login logs" ON toss_login_logs;
CREATE POLICY "Users can view own login logs" ON toss_login_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own login logs" ON toss_login_logs;
CREATE POLICY "Users can insert own login logs" ON toss_login_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_user_profiles_toss_user_key ON user_profiles(toss_user_key);
CREATE INDEX IF NOT EXISTS idx_toss_login_logs_user_id ON toss_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_toss_login_logs_login_at ON toss_login_logs(login_at DESC);

-- 자동 updated_at 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- updated_at 트리거
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


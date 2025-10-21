-- ============================================
-- 퀴즈 관련 테이블 생성 스크립트
-- ============================================

-- 1. 퀴즈 데이터 테이블
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qnum INTEGER UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  prompt TEXT NOT NULL,
  choices JSONB NOT NULL, -- ["선택지1", "선택지2", "선택지3", "선택지4"]
  answer_index INTEGER NOT NULL CHECK (answer_index >= 0 AND answer_index <= 3),
  hint TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty_label TEXT NOT NULL CHECK (difficulty_label IN ('쉬움', '보통', '어려움')),
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 사용자 진행 상황 테이블
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL CHECK (phase >= 1 AND phase <= 4),
  stage INTEGER NOT NULL CHECK (stage >= 1 AND stage <= 5),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0, -- 정답 개수
  total_questions INTEGER DEFAULT 5, -- 총 문제 수
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phase, stage)
);

-- 3. 사용자 퀴즈 기록 테이블
CREATE TABLE IF NOT EXISTS user_quiz_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL,
  stage INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  score_earned INTEGER DEFAULT 0,
  items_used JSONB DEFAULT '[]', -- 사용한 아이템 기록 ["remove_wrong", "hint", "double_score", "auto_answer"]
  time_taken INTEGER, -- 소요 시간 (초)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 아이템 사용 설정 테이블 (팝업 표시 여부)
CREATE TABLE IF NOT EXISTS user_item_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('remove_wrong', 'hint', 'double_score', 'auto_answer')),
  show_popup BOOLEAN DEFAULT TRUE, -- 팝업 표시 여부
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_type)
);

-- 5. 하트 시스템 테이블 (추가)
CREATE TABLE IF NOT EXISTS user_hearts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_hearts INTEGER DEFAULT 5 CHECK (current_hearts >= 0 AND current_hearts <= 5),
  last_refill_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ad_views_today INTEGER DEFAULT 0, -- 오늘 본 광고 횟수
  ad_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 광고 횟수 리셋 시간
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================

-- 퀴즈 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_quizzes_qnum ON quizzes(qnum);
CREATE INDEX IF NOT EXISTS idx_quizzes_topic ON quizzes(topic);
CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty_label ON quizzes(difficulty_label);
CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty_level ON quizzes(difficulty_level);

-- 사용자 진행 상황 인덱스
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_phase_stage ON user_progress(phase, stage);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);

-- 사용자 퀴즈 기록 인덱스
CREATE INDEX IF NOT EXISTS idx_user_quiz_records_user_id ON user_quiz_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_records_quiz_id ON user_quiz_records(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_records_created_at ON user_quiz_records(created_at DESC);

-- 아이템 설정 인덱스
CREATE INDEX IF NOT EXISTS idx_user_item_settings_user_id ON user_item_settings(user_id);

-- 하트 시스템 인덱스
CREATE INDEX IF NOT EXISTS idx_user_hearts_user_id ON user_hearts(user_id);

-- ============================================
-- Row Level Security 활성화
-- ============================================

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_item_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hearts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS 정책 설정
-- ============================================

-- quizzes: 모든 인증된 사용자가 읽기 가능
DROP POLICY IF EXISTS "Authenticated users can read quizzes" ON quizzes;
CREATE POLICY "Authenticated users can read quizzes" ON quizzes
  FOR SELECT USING (auth.role() = 'authenticated');

-- user_progress: 본인 데이터만 읽기/쓰기 가능
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- user_quiz_records: 본인 데이터만 읽기/쓰기 가능
DROP POLICY IF EXISTS "Users can view own quiz records" ON user_quiz_records;
CREATE POLICY "Users can view own quiz records" ON user_quiz_records
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz records" ON user_quiz_records;
CREATE POLICY "Users can insert own quiz records" ON user_quiz_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_item_settings: 본인 데이터만 읽기/쓰기 가능
DROP POLICY IF EXISTS "Users can view own item settings" ON user_item_settings;
CREATE POLICY "Users can view own item settings" ON user_item_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own item settings" ON user_item_settings;
CREATE POLICY "Users can insert own item settings" ON user_item_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own item settings" ON user_item_settings;
CREATE POLICY "Users can update own item settings" ON user_item_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- user_hearts: 본인 데이터만 읽기/쓰기 가능
DROP POLICY IF EXISTS "Users can view own hearts" ON user_hearts;
CREATE POLICY "Users can view own hearts" ON user_hearts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own hearts" ON user_hearts;
CREATE POLICY "Users can insert own hearts" ON user_hearts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own hearts" ON user_hearts;
CREATE POLICY "Users can update own hearts" ON user_hearts
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 트리거 함수 및 트리거
-- ============================================

-- updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_item_settings_updated_at ON user_item_settings;
CREATE TRIGGER update_user_item_settings_updated_at
  BEFORE UPDATE ON user_item_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_hearts_updated_at ON user_hearts;
CREATE TRIGGER update_user_hearts_updated_at
  BEFORE UPDATE ON user_hearts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 사용자 생성 시 자동으로 하트 초기화
-- ============================================

CREATE OR REPLACE FUNCTION init_user_hearts()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_hearts (user_id, current_hearts, last_refill_at, ad_views_today, ad_reset_at)
  VALUES (NEW.id, 5, NOW(), 0, NOW())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created_init_hearts ON auth.users;
CREATE TRIGGER on_auth_user_created_init_hearts
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION init_user_hearts();

-- ============================================
-- 하트 자동 충전 함수 (5분마다 +1, 최대 5개)
-- ============================================

CREATE OR REPLACE FUNCTION refill_heart(p_user_id UUID)
RETURNS TABLE(
  current_hearts INTEGER,
  last_refill_at TIMESTAMP WITH TIME ZONE,
  next_refill_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_hearts INTEGER;
  v_last_refill TIMESTAMP WITH TIME ZONE;
  v_minutes_passed INTEGER;
  v_hearts_to_add INTEGER;
BEGIN
  -- 현재 하트 상태 조회
  SELECT uh.current_hearts, uh.last_refill_at
  INTO v_hearts, v_last_refill
  FROM user_hearts uh
  WHERE uh.user_id = p_user_id;

  -- 하트가 이미 최대치면 업데이트 없이 반환
  IF v_hearts >= 5 THEN
    RETURN QUERY
    SELECT v_hearts, v_last_refill, v_last_refill;
    RETURN;
  END IF;

  -- 경과 시간 계산 (분 단위)
  v_minutes_passed := FLOOR(EXTRACT(EPOCH FROM (NOW() - v_last_refill)) / 60);

  -- 충전할 하트 개수 계산 (5분당 1개)
  v_hearts_to_add := FLOOR(v_minutes_passed / 5);

  -- 충전할 하트가 있으면 업데이트
  IF v_hearts_to_add > 0 THEN
    UPDATE user_hearts
    SET 
      current_hearts = LEAST(v_hearts + v_hearts_to_add, 5),
      last_refill_at = v_last_refill + (v_hearts_to_add * INTERVAL '5 minutes')
    WHERE user_id = p_user_id;

    -- 업데이트된 값 조회
    SELECT uh.current_hearts, uh.last_refill_at
    INTO v_hearts, v_last_refill
    FROM user_hearts uh
    WHERE uh.user_id = p_user_id;
  END IF;

  -- 다음 충전 시간 계산
  RETURN QUERY
  SELECT 
    v_hearts,
    v_last_refill,
    CASE 
      WHEN v_hearts >= 5 THEN v_last_refill
      ELSE v_last_refill + INTERVAL '5 minutes'
    END AS next_refill;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- ============================================
-- 하트 소모 함수
-- ============================================

CREATE OR REPLACE FUNCTION consume_heart(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS TABLE(
  success BOOLEAN,
  current_hearts INTEGER,
  message TEXT
) AS $$
DECLARE
  v_hearts INTEGER;
BEGIN
  -- 먼저 하트 자동 충전 시도
  PERFORM refill_heart(p_user_id);

  -- 현재 하트 조회
  SELECT uh.current_hearts INTO v_hearts
  FROM user_hearts uh
  WHERE uh.user_id = p_user_id;

  -- 하트가 부족하면 실패
  IF v_hearts < p_amount THEN
    RETURN QUERY
    SELECT FALSE, v_hearts, '하트가 부족합니다.'::TEXT;
    RETURN;
  END IF;

  -- 하트 차감
  UPDATE user_hearts
  SET current_hearts = current_hearts - p_amount
  WHERE user_id = p_user_id;

  -- 성공 반환
  RETURN QUERY
  SELECT TRUE, v_hearts - p_amount, '하트가 소모되었습니다.'::TEXT;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- ============================================
-- 광고 시청으로 하트 획득 함수
-- ============================================

CREATE OR REPLACE FUNCTION add_heart_by_ad(p_user_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  current_hearts INTEGER,
  ad_views_today INTEGER,
  message TEXT
) AS $$
DECLARE
  v_hearts INTEGER;
  v_ad_views INTEGER;
  v_ad_reset TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 현재 하트 및 광고 시청 횟수 조회
  SELECT uh.current_hearts, uh.ad_views_today, uh.ad_reset_at
  INTO v_hearts, v_ad_views, v_ad_reset
  FROM user_hearts uh
  WHERE uh.user_id = p_user_id;

  -- 자정이 지났으면 광고 카운트 리셋
  IF v_ad_reset::DATE < NOW()::DATE THEN
    UPDATE user_hearts
    SET ad_views_today = 0, ad_reset_at = NOW()
    WHERE user_id = p_user_id;
    v_ad_views := 0;
  END IF;

  -- 일일 광고 시청 제한 확인 (5회)
  IF v_ad_views >= 5 THEN
    RETURN QUERY
    SELECT FALSE, v_hearts, v_ad_views, '오늘의 광고 시청 횟수를 모두 사용했습니다.'::TEXT;
    RETURN;
  END IF;

  -- 하트가 이미 최대치면 실패
  IF v_hearts >= 5 THEN
    RETURN QUERY
    SELECT FALSE, v_hearts, v_ad_views, '하트가 이미 최대치입니다.'::TEXT;
    RETURN;
  END IF;

  -- 하트 추가 및 광고 카운트 증가
  UPDATE user_hearts
  SET 
    current_hearts = LEAST(current_hearts + 1, 5),
    ad_views_today = ad_views_today + 1
  WHERE user_id = p_user_id;

  -- 성공 반환
  RETURN QUERY
  SELECT TRUE, LEAST(v_hearts + 1, 5), v_ad_views + 1, '하트를 획득했습니다!'::TEXT;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- ============================================
-- 포인트로 하트 구매 함수
-- ============================================

CREATE OR REPLACE FUNCTION buy_heart_with_points(p_user_id UUID, p_cost INTEGER DEFAULT 500)
RETURNS TABLE(
  success BOOLEAN,
  current_hearts INTEGER,
  current_points INTEGER,
  message TEXT
) AS $$
DECLARE
  v_hearts INTEGER;
  v_points INTEGER;
BEGIN
  -- 현재 하트 및 포인트 조회
  SELECT uh.current_hearts, up.total_score
  INTO v_hearts, v_points
  FROM user_hearts uh
  JOIN user_profiles up ON uh.user_id = up.id
  WHERE uh.user_id = p_user_id;

  -- 포인트 부족 확인
  IF v_points < p_cost THEN
    RETURN QUERY
    SELECT FALSE, v_hearts, v_points, '포인트가 부족합니다.'::TEXT;
    RETURN;
  END IF;

  -- 하트가 이미 최대치면 실패
  IF v_hearts >= 5 THEN
    RETURN QUERY
    SELECT FALSE, v_hearts, v_points, '하트가 이미 최대치입니다.'::TEXT;
    RETURN;
  END IF;

  -- 포인트 차감
  UPDATE user_profiles
  SET total_score = total_score - p_cost
  WHERE id = p_user_id;

  -- 하트 추가
  UPDATE user_hearts
  SET current_hearts = LEAST(current_hearts + 1, 5)
  WHERE user_id = p_user_id;

  -- 성공 반환
  RETURN QUERY
  SELECT TRUE, LEAST(v_hearts + 1, 5), v_points - p_cost, '하트를 획득했습니다!'::TEXT;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- ============================================
-- 완료! 다음 스크립트: import-quizzes.sql
-- ============================================


-- ============================================
-- 누락된 테이블들 생성
-- ============================================

-- 하트 시스템 테이블
CREATE TABLE IF NOT EXISTS user_hearts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_hearts INTEGER DEFAULT 5 CHECK (current_hearts >= 0 AND current_hearts <= 5),
  last_refill_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ad_views_today INTEGER DEFAULT 0 CHECK (ad_views_today >= 0 AND ad_views_today <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 퀴즈 테이블
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qnum INTEGER UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  prompt TEXT NOT NULL,
  choices TEXT[] NOT NULL,
  answer_index INTEGER NOT NULL CHECK (answer_index >= 0 AND answer_index <= 3),
  hint TEXT,
  explanation TEXT NOT NULL,
  difficulty_label TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 퀴즈 기록 테이블
CREATE TABLE IF NOT EXISTS user_quiz_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  score_earned INTEGER NOT NULL CHECK (score_earned >= 0),
  time_taken INTEGER, -- 초 단위
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 진행 상황 테이블
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  phase INTEGER DEFAULT 1 CHECK (phase >= 1 AND phase <= 4),
  stage INTEGER DEFAULT 1 CHECK (stage >= 1 AND stage <= 5),
  score INTEGER DEFAULT 0 CHECK (score >= 0),
  attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
  correct_count INTEGER DEFAULT 0 CHECK (correct_count >= 0),
  total_questions INTEGER DEFAULT 0 CHECK (total_questions >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS 활성화
-- ============================================

ALTER TABLE user_hearts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS 정책 생성 (기존 정책 삭제 후 재생성)
-- ============================================

-- user_hearts 정책 (기존 정책 삭제 후 재생성)
DROP POLICY IF EXISTS "Users can view own hearts" ON user_hearts;
CREATE POLICY "Users can view own hearts" ON user_hearts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own hearts" ON user_hearts;
CREATE POLICY "Users can update own hearts" ON user_hearts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own hearts" ON user_hearts;
CREATE POLICY "Users can insert own hearts" ON user_hearts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- quizzes 정책 (기존 정책 삭제 후 재생성)
DROP POLICY IF EXISTS "Users can read quiz questions only" ON quizzes;
CREATE POLICY "Users can read quiz questions only" ON quizzes
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Server can read quiz answers" ON quizzes;
CREATE POLICY "Server can read quiz answers" ON quizzes
  FOR SELECT USING (auth.role() = 'service_role');

-- user_quiz_records 정책 (기존 정책 삭제 후 재생성)
DROP POLICY IF EXISTS "Users can view own quiz records" ON user_quiz_records;
CREATE POLICY "Users can view own quiz records" ON user_quiz_records
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz records" ON user_quiz_records;
CREATE POLICY "Users can insert own quiz records" ON user_quiz_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_progress 정책 (기존 정책 삭제 후 재생성)
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 인덱스 생성
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_hearts_user_id ON user_hearts(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_qnum ON quizzes(qnum);
CREATE INDEX IF NOT EXISTS idx_user_quiz_records_user_id ON user_quiz_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_records_quiz_id ON user_quiz_records(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- ============================================
-- 트리거 함수 및 트리거
-- ============================================

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_user_hearts_updated_at
  BEFORE UPDATE ON user_hearts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 기본 데이터 삽입 (샘플 퀴즈)
-- ============================================

-- 샘플 퀴즈 데이터 (Phase 1, Stage 1-5)
INSERT INTO quizzes (qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level) VALUES
(1, '건강', '건강한 생활을 위해 가장 중요한 것은?', ARRAY['규칙적인 운동', '충분한 수면', '균형잡힌 식사', '스트레스 관리'], 2, '모든 것이 중요하지만, 기본은 무엇일까요?', '균형잡힌 식사는 모든 영양소를 골고루 섭취하여 건강의 기초를 제공합니다.', '쉬움', 1),
(2, '운동', '하루 권장 운동 시간은?', ARRAY['30분', '60분', '90분', '120분'], 0, 'WHO에서 권장하는 시간을 생각해보세요.', 'WHO는 성인에게 주 5일, 하루 30분 이상의 중등도 운동을 권장합니다.', '쉬움', 1),
(3, '수면', '성인의 권장 수면 시간은?', ARRAY['6-7시간', '7-9시간', '9-10시간', '10시간 이상'], 1, '너무 적거나 많지 않은 적당한 시간입니다.', '성인은 7-9시간의 수면이 건강에 가장 적합합니다.', '보통', 2),
(4, '영양', '비타민 C가 풍부한 과일은?', ARRAY['사과', '오렌지', '바나나', '포도'], 1, '신맛이 나는 과일을 생각해보세요.', '오렌지는 비타민 C가 풍부한 대표적인 과일입니다.', '쉬움', 1),
(5, '스트레스', '스트레스 해소에 효과적인 방법은?', ARRAY['과식', '깊은 호흡', '과음', '게임'], 1, '건강한 방법을 선택하세요.', '깊은 호흡은 즉시 스트레스를 완화하는 효과적인 방법입니다.', '보통', 2)
ON CONFLICT (qnum) DO NOTHING;

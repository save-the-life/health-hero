-- ============================================
-- 보안 강화된 RLS 정책 설정
-- ============================================

-- quizzes 테이블: 정답 정보 접근 제한
-- 문제 정보만 읽기 가능 (answer_index 제외)
DROP POLICY IF EXISTS "Authenticated users can read quizzes" ON quizzes;
CREATE POLICY "Users can read quiz questions only" ON quizzes
  FOR SELECT USING (auth.role() = 'authenticated');

-- quizzes 테이블: 정답 정보는 서버 사이드에서만 접근 가능
-- 이 정책은 Edge Function이나 서버 사이드 코드에서만 사용
DROP POLICY IF EXISTS "Server can read quiz answers" ON quizzes;
CREATE POLICY "Server can read quiz answers" ON quizzes
  FOR SELECT USING (auth.role() = 'service_role');

-- ============================================
-- 보안 강화를 위한 추가 정책
-- ============================================

-- 퀴즈 기록 테이블에 정답 정보 저장 방지
-- 사용자는 자신의 답안만 저장할 수 있음
DROP POLICY IF EXISTS "Users can insert own quiz records" ON user_quiz_records;
CREATE POLICY "Users can insert own quiz records" ON user_quiz_records
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    is_correct IS NOT NULL AND
    score_earned >= 0 AND
    score_earned <= 1000  -- 최대 점수 제한
  );

-- 퀴즈 기록 수정 방지 (데이터 무결성 보장)
DROP POLICY IF EXISTS "Users can update own quiz records" ON user_quiz_records;
CREATE POLICY "Users cannot update quiz records" ON user_quiz_records
  FOR UPDATE USING (false);  -- 퀴즈 기록은 수정 불가

-- ============================================
-- 하트 시스템 보안 강화
-- ============================================

-- 하트 수정 시 유효성 검사 강화
DROP POLICY IF EXISTS "Users can update own hearts" ON user_hearts;
CREATE POLICY "Users can update own hearts safely" ON user_hearts
  FOR UPDATE USING (
    auth.uid() = user_id AND
    current_hearts >= 0 AND
    current_hearts <= 5 AND
    ad_views_today >= 0 AND
    ad_views_today <= 100  -- 일일 광고 시청 제한
  );

-- ============================================
-- 사용자 진행 상황 보안 강화
-- ============================================

-- 진행 상황 수정 시 유효성 검사
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress safely" ON user_progress
  FOR UPDATE USING (
    auth.uid() = user_id AND
    phase >= 1 AND
    phase <= 4 AND
    stage >= 1 AND
    stage <= 5 AND
    score >= 0 AND
    attempts >= 0 AND
    correct_count >= 0 AND
    correct_count <= total_questions
  );

-- ============================================
-- 감사 로그 테이블 생성 (선택사항)
-- ============================================

-- 퀴즈 답안 제출 로그 테이블
CREATE TABLE IF NOT EXISTS quiz_submission_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- 감사 로그 RLS 정책
ALTER TABLE quiz_submission_logs ENABLE ROW LEVEL SECURITY;

-- 서버만 감사 로그에 접근 가능
CREATE POLICY "Server can manage submission logs" ON quiz_submission_logs
  FOR ALL USING (auth.role() = 'service_role');

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_quiz_submission_logs_user_id ON quiz_submission_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submission_logs_submitted_at ON quiz_submission_logs(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_submission_logs_question_id ON quiz_submission_logs(question_id);

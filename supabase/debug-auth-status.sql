-- 인증 상태 디버깅 쿼리
-- 이 쿼리들을 Supabase SQL Editor에서 실행하여 인증 상태 확인

-- 1. 현재 인증된 사용자 확인
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role,
  auth.email() as current_email;

-- 2. 인증된 사용자로 퀴즈 데이터 접근 테스트
SELECT COUNT(*) as accessible_quizzes 
FROM quizzes 
WHERE difficulty_label = '쉬움';

-- 3. 인증된 사용자로 자신의 프로필 접근 테스트
SELECT 
  id,
  email,
  level,
  total_score,
  current_stage
FROM user_profiles 
WHERE id = auth.uid();

-- 4. 인증된 사용자로 자신의 하트 데이터 접근 테스트
SELECT 
  user_id,
  current_hearts,
  last_refill_at
FROM user_hearts 
WHERE user_id = auth.uid();

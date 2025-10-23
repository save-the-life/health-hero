-- 사용자 프로필 디버깅 쿼리 (스키마 수정)
-- 이 쿼리를 Supabase SQL Editor에서 실행하여 사용자 데이터 확인

-- 1. 특정 사용자 프로필 확인
SELECT 
  id,
  email,
  level,
  total_score,
  current_exp,
  current_phase,
  current_stage,
  created_at,
  updated_at
FROM user_profiles 
WHERE id = 'd430df9d-7a9f-4204-a02b-4a346dfde9f5';

-- 2. 모든 사용자 프로필 개수 확인
SELECT COUNT(*) as total_profiles FROM user_profiles;

-- 3. 최근 생성된 프로필 확인
SELECT 
  id,
  email,
  level,
  total_score,
  current_stage,
  created_at
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. user_profiles 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 5. user_profiles 테이블 RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

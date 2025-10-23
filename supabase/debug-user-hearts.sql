-- 사용자 하트 데이터 디버깅 쿼리 (스키마 수정)
-- 이 쿼리를 Supabase SQL Editor에서 실행하여 하트 데이터 확인

-- 1. 특정 사용자 하트 데이터 확인
SELECT 
  user_id,
  current_hearts,
  last_refill_at,
  ad_views_today,
  ad_reset_at,
  created_at,
  updated_at
FROM user_hearts 
WHERE user_id = 'd430df9d-7a9f-4204-a02b-4a346dfde9f5';

-- 2. 모든 사용자 하트 데이터 개수 확인
SELECT COUNT(*) as total_hearts FROM user_hearts;

-- 3. 최근 생성된 하트 데이터 확인
SELECT 
  user_id,
  current_hearts,
  last_refill_at,
  created_at
FROM user_hearts 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. 하트 데이터가 없는 사용자 확인
SELECT 
  up.id,
  up.email
FROM user_profiles up
LEFT JOIN user_hearts uh ON up.id = uh.user_id
WHERE uh.user_id IS NULL;

-- 5. user_hearts 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_hearts'
ORDER BY ordinal_position;

-- 6. user_hearts 테이블 RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_hearts';

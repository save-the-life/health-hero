-- ========================================
-- 게스트 사용자 데이터 삭제 스크립트
-- ========================================
-- 이 스크립트는 게스트 로그인으로 생성된 테스트 데이터를 삭제합니다.
-- 주의: 실행 전 반드시 백업하세요!
--
-- 실행 방법:
-- 1. Supabase Dashboard > SQL Editor
-- 2. 아래 전체 스크립트 복사
-- 3. "Run" 클릭
-- ========================================

-- 게스트 사용자 ID 조회 (확인용)
DO $$
DECLARE
  guest_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO guest_count
  FROM user_profiles
  WHERE name = '게스트' OR email IS NULL OR email LIKE '%anonymous%';
  
  RAISE NOTICE '삭제될 게스트 사용자 수: %', guest_count;
END $$;

-- ========================================
-- 1단계: 게스트 사용자의 퀴즈 기록 삭제
-- ========================================
DELETE FROM user_quiz_records
WHERE user_id IN (
  SELECT id 
  FROM user_profiles 
  WHERE name = '게스트' OR email IS NULL OR email LIKE '%anonymous%'
);

-- ========================================
-- 2단계: 게스트 사용자의 진행 상황 삭제
-- ========================================
DELETE FROM user_progress
WHERE user_id IN (
  SELECT id 
  FROM user_profiles 
  WHERE name = '게스트' OR email IS NULL OR email LIKE '%anonymous%'
);

-- ========================================
-- 3단계: 게스트 사용자의 하트 정보 삭제
-- ========================================
DELETE FROM user_hearts
WHERE user_id IN (
  SELECT id 
  FROM user_profiles 
  WHERE name = '게스트' OR email IS NULL OR email LIKE '%anonymous%'
);

-- ========================================
-- 4단계: 게스트 사용자의 프로필 삭제
-- ========================================
DELETE FROM user_profiles
WHERE name = '게스트' OR email IS NULL OR email LIKE '%anonymous%';

-- ========================================
-- 5단계: auth.users에서 익명 사용자 삭제 (선택사항)
-- ========================================
-- 주의: 이 단계는 Supabase Auth 테이블을 직접 수정합니다.
-- RLS 정책 때문에 실행이 안될 수 있습니다.
-- 필요한 경우 Supabase 대시보드의 Authentication > Users에서 수동 삭제하세요.

-- 아래 주석을 해제하면 auth.users에서도 삭제됩니다:
-- DELETE FROM auth.users
-- WHERE id IN (
--   SELECT id 
--   FROM auth.users 
--   WHERE is_anonymous = true
--   OR email IS NULL 
--   OR email LIKE '%anonymous%'
-- );

-- ========================================
-- 삭제 후 결과 확인
-- ========================================
DO $$
DECLARE
  remaining_guest_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_guest_count
  FROM user_profiles
  WHERE name = '게스트' OR email IS NULL OR email LIKE '%anonymous%';
  
  RAISE NOTICE '남은 게스트 사용자 수: %', remaining_guest_count;
  
  IF remaining_guest_count = 0 THEN
    RAISE NOTICE '✅ 게스트 데이터 삭제 완료!';
  ELSE
    RAISE NOTICE '⚠️ 일부 게스트 데이터가 남아있습니다.';
  END IF;
END $$;

-- ========================================
-- 전체 테이블 카운트 확인 (선택사항)
-- ========================================
SELECT 
  'user_profiles' as table_name,
  COUNT(*) as total_count,
  SUM(CASE WHEN name = '게스트' THEN 1 ELSE 0 END) as guest_count
FROM user_profiles
UNION ALL
SELECT 
  'user_hearts' as table_name,
  COUNT(*) as total_count,
  SUM(CASE WHEN user_id IN (SELECT id FROM user_profiles WHERE name = '게스트') THEN 1 ELSE 0 END) as guest_count
FROM user_hearts
UNION ALL
SELECT 
  'user_progress' as table_name,
  COUNT(*) as total_count,
  SUM(CASE WHEN user_id IN (SELECT id FROM user_profiles WHERE name = '게스트') THEN 1 ELSE 0 END) as guest_count
FROM user_progress
UNION ALL
SELECT 
  'user_quiz_records' as table_name,
  COUNT(*) as total_count,
  SUM(CASE WHEN user_id IN (SELECT id FROM user_profiles WHERE name = '게스트') THEN 1 ELSE 0 END) as guest_count
FROM user_quiz_records;


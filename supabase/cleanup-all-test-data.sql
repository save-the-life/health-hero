-- ========================================
-- 모든 테스트 데이터 삭제 스크립트
-- ========================================
-- ⚠️ 경고: 이 스크립트는 모든 사용자 데이터를 삭제합니다!
-- 개발/테스트 환경에서만 사용하세요!
-- 프로덕션 환경에서는 절대 실행하지 마세요!
-- ========================================

-- 실행 확인용 메시지
DO $$
BEGIN
  RAISE NOTICE '⚠️ 경고: 모든 테스트 데이터가 삭제됩니다!';
  RAISE NOTICE '프로덕션 환경에서는 절대 실행하지 마세요!';
END $$;

-- ========================================
-- 삭제 전 데이터 개수 확인
-- ========================================
DO $$
DECLARE
  profile_count INTEGER;
  hearts_count INTEGER;
  progress_count INTEGER;
  quiz_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM user_profiles;
  SELECT COUNT(*) INTO hearts_count FROM user_hearts;
  SELECT COUNT(*) INTO progress_count FROM user_progress;
  SELECT COUNT(*) INTO quiz_count FROM user_quiz_records;
  
  RAISE NOTICE '삭제 전 데이터 개수:';
  RAISE NOTICE '  - user_profiles: %', profile_count;
  RAISE NOTICE '  - user_hearts: %', hearts_count;
  RAISE NOTICE '  - user_progress: %', progress_count;
  RAISE NOTICE '  - user_quiz_records: %', quiz_count;
END $$;

-- ========================================
-- 모든 테이블 데이터 삭제 (순서 중요)
-- ========================================

-- 1. 퀴즈 기록 삭제
TRUNCATE user_quiz_records CASCADE;

-- 2. 진행 상황 삭제
TRUNCATE user_progress CASCADE;

-- 3. 하트 정보 삭제
TRUNCATE user_hearts CASCADE;

-- 4. 사용자 프로필 삭제
TRUNCATE user_profiles CASCADE;

-- 5. 토스 로그인 로그 삭제 (있는 경우)
TRUNCATE toss_login_logs CASCADE;

-- ========================================
-- ⚠️ auth.users 테이블 삭제 (선택사항)
-- ========================================
-- 주의: 이 단계는 모든 인증 사용자를 삭제합니다.
-- Supabase 대시보드의 Authentication > Users에서 수동 삭제를 권장합니다.
-- 
-- 실행하려면 아래 주석을 해제하세요:
-- DELETE FROM auth.users WHERE true;

-- ========================================
-- 삭제 후 확인
-- ========================================
DO $$
DECLARE
  profile_count INTEGER;
  hearts_count INTEGER;
  progress_count INTEGER;
  quiz_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM user_profiles;
  SELECT COUNT(*) INTO hearts_count FROM user_hearts;
  SELECT COUNT(*) INTO progress_count FROM user_progress;
  SELECT COUNT(*) INTO quiz_count FROM user_quiz_records;
  
  RAISE NOTICE '삭제 후 데이터 개수:';
  RAISE NOTICE '  - user_profiles: %', profile_count;
  RAISE NOTICE '  - user_hearts: %', hearts_count;
  RAISE NOTICE '  - user_progress: %', progress_count;
  RAISE NOTICE '  - user_quiz_records: %', quiz_count;
  
  IF profile_count = 0 AND hearts_count = 0 AND progress_count = 0 AND quiz_count = 0 THEN
    RAISE NOTICE '✅ 모든 테스트 데이터 삭제 완료!';
  ELSE
    RAISE NOTICE '⚠️ 일부 데이터가 남아있습니다.';
  END IF;
END $$;

-- ========================================
-- 선택사항: 시퀀스 리셋 (AUTO INCREMENT 초기화)
-- ========================================
-- 필요한 경우 아래 주석을 해제하세요:
-- ALTER SEQUENCE IF EXISTS user_quiz_records_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS user_progress_id_seq RESTART WITH 1;


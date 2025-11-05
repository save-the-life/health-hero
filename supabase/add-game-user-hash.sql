-- ============================================
-- 게임 유저 키 (getUserKeyForGame) 지원
-- 프로모션 기능 준비를 위한 스키마 업데이트
-- ============================================
-- 작성일: 2025-01-30
-- 목적: user_profiles 테이블에 game_user_hash 컬럼 추가
-- ============================================

-- 1. game_user_hash 컬럼 추가 (이미 존재하면 무시)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'game_user_hash'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN game_user_hash TEXT;
    
    RAISE NOTICE '✅ game_user_hash 컬럼 추가 완료';
  ELSE
    RAISE NOTICE '⚠️ game_user_hash 컬럼이 이미 존재합니다';
  END IF;
END $$;

-- 2. UNIQUE 제약 조건 추가 (중복 방지)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'user_profiles_game_user_hash_key'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_game_user_hash_key 
    UNIQUE (game_user_hash);
    
    RAISE NOTICE '✅ UNIQUE 제약 조건 추가 완료';
  ELSE
    RAISE NOTICE '⚠️ UNIQUE 제약 조건이 이미 존재합니다';
  END IF;
END $$;

-- 3. 인덱스 생성 (빠른 조회를 위해)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_user_profiles_game_user_hash'
  ) THEN
    CREATE INDEX idx_user_profiles_game_user_hash 
    ON user_profiles(game_user_hash) 
    WHERE game_user_hash IS NOT NULL;
    
    RAISE NOTICE '✅ 인덱스 생성 완료';
  ELSE
    RAISE NOTICE '⚠️ 인덱스가 이미 존재합니다';
  END IF;
END $$;

-- 4. 컬럼 설명 추가
COMMENT ON COLUMN user_profiles.game_user_hash IS 
'게임 미니앱 전용 유저 식별자 (getUserKeyForGame 함수로 획득, 프로모션 기능용)';

-- 5. 현재 스키마 확인
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND column_name = 'game_user_hash';

-- 6. 제약 조건 확인
SELECT 
  conname AS constraint_name,
  contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
  AND conname = 'user_profiles_game_user_hash_key';

-- 7. 인덱스 확인
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'user_profiles'
  AND indexname = 'idx_user_profiles_game_user_hash';

-- ============================================
-- 실행 결과 확인
-- ============================================
-- ✅ 예상 결과:
-- - game_user_hash 컬럼 추가됨 (TEXT, nullable)
-- - UNIQUE 제약 조건 추가됨
-- - 인덱스 생성됨
-- ============================================

-- ============================================
-- 롤백 스크립트 (필요시 사용)
-- ============================================
-- 아래 주석을 제거하고 실행하면 변경사항을 되돌립니다.
-- 
-- DROP INDEX IF EXISTS idx_user_profiles_game_user_hash;
-- ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_game_user_hash_key;
-- ALTER TABLE user_profiles DROP COLUMN IF EXISTS game_user_hash;
-- ============================================


-- 연결 끊기 콜백을 위한 컬럼 추가
-- 사용자가 토스 앱에서 연결을 끊을 때 상태를 관리하기 위함

-- user_profiles 테이블에 status 컬럼 추가
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- user_profiles 테이블에 unlinked_at 컬럼 추가
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS unlinked_at TIMESTAMP WITH TIME ZONE;

-- status 컬럼에 대한 인덱스 추가 (연결 끊긴 유저 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- 코멘트 추가
COMMENT ON COLUMN user_profiles.status IS '사용자 상태: active(활성), unlinked(연결끊김)';
COMMENT ON COLUMN user_profiles.unlinked_at IS '토스 연결 끊기 시각';

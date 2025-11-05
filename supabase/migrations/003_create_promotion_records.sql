-- 프로모션 지급 기록 테이블 생성
CREATE TABLE IF NOT EXISTS promotion_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_user_hash TEXT NOT NULL,
  promotion_code TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reward_key TEXT,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
  error_code TEXT,
  error_message TEXT,
  granted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_promotion_records_user_id ON promotion_records(user_id);
CREATE INDEX idx_promotion_records_game_user_hash ON promotion_records(game_user_hash);
CREATE INDEX idx_promotion_records_condition_type ON promotion_records(condition_type);
CREATE INDEX idx_promotion_records_status ON promotion_records(status);

-- 중복 지급 방지를 위한 유니크 인덱스
CREATE UNIQUE INDEX idx_promotion_records_unique_grant 
ON promotion_records(user_id, game_user_hash, condition_type) 
WHERE status = 'SUCCESS';

-- RLS (Row Level Security) 활성화
ALTER TABLE promotion_records ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 프로모션 기록만 조회 가능
CREATE POLICY "Users can view their own promotion records"
ON promotion_records
FOR SELECT
USING (auth.uid() = user_id);

-- 정책: 서비스 롤은 모든 작업 가능 (서버에서 사용)
CREATE POLICY "Service role can do everything"
ON promotion_records
FOR ALL
USING (auth.role() = 'service_role');

-- 코멘트 추가
COMMENT ON TABLE promotion_records IS '프로모션 리워드 지급 기록';
COMMENT ON COLUMN promotion_records.game_user_hash IS '토스 게임 유저 식별자 (getUserKeyForGame에서 획득)';
COMMENT ON COLUMN promotion_records.condition_type IS '프로모션 지급 조건 (FIRST_LOGIN, FIRST_QUIZ 등)';
COMMENT ON COLUMN promotion_records.reward_key IS '토스에서 발급한 리워드 키';
COMMENT ON COLUMN promotion_records.status IS '지급 상태 (SUCCESS, FAILED, PENDING)';


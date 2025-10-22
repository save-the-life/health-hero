-- ============================================
-- update_user_progress 함수 수정 (모호한 컬럼 참조 해결)
-- ============================================

-- 기존 함수 삭제
DROP FUNCTION IF EXISTS update_user_progress(UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER);

-- 수정된 함수 생성
CREATE FUNCTION update_user_progress(
  p_user_id UUID,
  p_score_to_add INTEGER DEFAULT 0,
  p_exp_to_add INTEGER DEFAULT 0,
  p_new_level INTEGER DEFAULT NULL,
  p_new_stage INTEGER DEFAULT NULL,
  p_new_phase INTEGER DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  current_score INTEGER,
  current_exp INTEGER,
  current_level INTEGER,
  current_stage INTEGER,
  current_phase INTEGER,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile RECORD;
  v_new_score INTEGER;
  v_new_exp INTEGER;
  v_new_level INTEGER;
BEGIN
  -- 현재 프로필 조회
  SELECT * INTO v_profile
  FROM public.user_profiles
  WHERE id = p_user_id;

  -- 사용자가 존재하지 않으면 실패
  IF v_profile IS NULL THEN
    RETURN QUERY
    SELECT FALSE, 0, 0, 0, 0, 0, '사용자를 찾을 수 없습니다';
    RETURN;
  END IF;

  -- 새로운 점수와 경험치 계산
  v_new_score := v_profile.total_score + p_score_to_add;
  v_new_exp := v_profile.current_exp + p_exp_to_add;
  v_new_level := COALESCE(p_new_level, v_profile.level);

  -- 프로필 업데이트 (모호한 컬럼 참조 해결)
  UPDATE public.user_profiles
  SET 
    total_score = v_new_score,
    current_exp = v_new_exp,
    level = v_new_level,
    current_stage = COALESCE(p_new_stage, v_profile.current_stage),
    current_phase = COALESCE(p_new_phase, v_profile.current_phase),
    updated_at = NOW()
  WHERE id = p_user_id;

  -- 성공 반환
  RETURN QUERY
  SELECT 
    TRUE,
    v_new_score,
    v_new_exp,
    v_new_level,
    COALESCE(p_new_stage, v_profile.current_stage),
    COALESCE(p_new_phase, v_profile.current_phase),
    '업데이트 성공';
END;
$$;

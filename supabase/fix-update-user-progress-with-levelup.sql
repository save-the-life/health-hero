-- ============================================
-- 레벨업 로직이 포함된 사용자 진행 상황 업데이트 함수
-- ============================================

-- 기존 함수 삭제
DROP FUNCTION IF EXISTS update_user_progress(UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER);

-- 새로운 함수 생성 (레벨업 로직 포함)
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
  v_current_level INTEGER;
  v_total_exp_for_level INTEGER;
  v_total_exp_for_next_level INTEGER;
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
  v_current_level := v_profile.level;
  v_new_level := v_current_level;

  -- 레벨업 로직 (p_new_level이 NULL인 경우에만 자동 계산)
  IF p_new_level IS NULL THEN
    -- 현재 레벨까지 필요한 총 경험치 계산
    v_total_exp_for_level := 0;
    FOR i IN 1..v_current_level LOOP
      v_total_exp_for_level := v_total_exp_for_level + ROUND(120 * POWER(1.15, i - 1));
    END LOOP;

    -- 다음 레벨까지 필요한 총 경험치 계산
    v_total_exp_for_next_level := 0;
    FOR i IN 1..(v_current_level + 1) LOOP
      v_total_exp_for_next_level := v_total_exp_for_next_level + ROUND(120 * POWER(1.15, i - 1));
    END LOOP;

    -- 레벨업 가능한지 확인 (최대 레벨 20까지)
    IF v_new_exp >= v_total_exp_for_next_level THEN
      FOR level_check IN (v_current_level + 1)..20 LOOP
        v_total_exp_for_level := 0;
        FOR i IN 1..level_check LOOP
          v_total_exp_for_level := v_total_exp_for_level + ROUND(120 * POWER(1.15, i - 1));
        END LOOP;
        
        IF v_new_exp >= v_total_exp_for_level THEN
          v_new_level := level_check;
        ELSE
          EXIT;
        END IF;
      END LOOP;
    END IF;
  ELSE
    -- 명시적으로 레벨이 지정된 경우
    v_new_level := p_new_level;
  END IF;

  -- 프로필 업데이트
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

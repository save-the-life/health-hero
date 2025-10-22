-- ============================================
-- 스테이지 완료 처리 함수
-- ============================================

-- 기존 함수 삭제
DROP FUNCTION IF EXISTS complete_stage(UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER);

-- 새로운 함수 생성
CREATE FUNCTION complete_stage(
  p_user_id UUID,
  p_phase INTEGER,
  p_stage INTEGER,
  p_correct_count INTEGER,
  p_score_earned INTEGER,
  p_exp_earned INTEGER
)
RETURNS TABLE(
  success BOOLEAN,
  stage_cleared BOOLEAN,
  next_stage_unlocked BOOLEAN,
  phase_cleared BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile RECORD;
  v_stage_cleared BOOLEAN := FALSE;
  v_next_stage_unlocked BOOLEAN := FALSE;
  v_phase_cleared BOOLEAN := FALSE;
  v_new_stage INTEGER;
  v_new_phase INTEGER;
BEGIN
  -- 현재 프로필 조회
  SELECT * INTO v_profile
  FROM public.user_profiles
  WHERE id = p_user_id;

  -- 사용자가 존재하지 않으면 실패
  IF v_profile IS NULL THEN
    RETURN QUERY
    SELECT FALSE, FALSE, FALSE, FALSE, '사용자를 찾을 수 없습니다';
    RETURN;
  END IF;

  -- 스테이지 클리어 조건: 3문제 이상 정답
  IF p_correct_count >= 3 THEN
    v_stage_cleared := TRUE;
    
    -- 다음 스테이지 계산
    v_new_stage := p_stage + 1;
    v_new_phase := p_phase;
    
    -- 스테이지 5 완료 시 다음 페이즈로 이동
    IF p_stage >= 5 THEN
      v_new_stage := 1;
      v_new_phase := p_phase + 1;
      
      -- 페이즈 4 완료 시 모든 페이즈 클리어
      IF p_phase >= 4 THEN
        v_phase_cleared := TRUE;
      END IF;
    END IF;
    
    -- 다음 스테이지 잠금 해제 (현재 진행 상황 업데이트)
    IF v_new_stage > v_profile.current_stage OR v_new_phase > v_profile.current_phase THEN
      v_next_stage_unlocked := TRUE;
      
      UPDATE public.user_profiles
      SET 
        current_stage = v_new_stage,
        current_phase = v_new_phase,
        updated_at = NOW()
      WHERE id = p_user_id;
    END IF;
  END IF;

  -- 성공 반환
  RETURN QUERY
  SELECT 
    TRUE,
    v_stage_cleared,
    v_next_stage_unlocked,
    v_phase_cleared,
    CASE 
      WHEN v_stage_cleared THEN '스테이지 클리어!'
      ELSE '스테이지 실패'
    END;
END;
$$;

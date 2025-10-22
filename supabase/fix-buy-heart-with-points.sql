-- ============================================
-- buy_heart_with_points 함수 수정 (ambiguous column reference 해결)
-- ============================================

-- 기존 함수 삭제
DROP FUNCTION IF EXISTS buy_heart_with_points(UUID, INTEGER);

-- 새로운 함수 생성
CREATE FUNCTION buy_heart_with_points(p_user_id UUID, p_cost INTEGER DEFAULT 500)
RETURNS TABLE(
  success BOOLEAN,
  current_hearts INTEGER,
  current_points INTEGER,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_hearts INTEGER;
  v_points INTEGER;
BEGIN
  -- 현재 하트 및 포인트 조회
  SELECT uh.current_hearts, up.total_score
  INTO v_hearts, v_points
  FROM user_hearts uh
  JOIN user_profiles up ON uh.user_id = up.id
  WHERE uh.user_id = p_user_id;

  -- 포인트 부족 확인
  IF v_points < p_cost THEN
    RETURN QUERY
    SELECT FALSE, v_hearts, v_points, '포인트가 부족합니다.'::TEXT;
    RETURN;
  END IF;

  -- 하트가 이미 최대치면 실패
  IF v_hearts >= 5 THEN
    RETURN QUERY
    SELECT FALSE, v_hearts, v_points, '하트가 이미 최대치입니다.'::TEXT;
    RETURN;
  END IF;

  -- 포인트 차감 (테이블 별칭 명시)
  UPDATE user_profiles up
  SET total_score = up.total_score - p_cost
  WHERE up.id = p_user_id;

  -- 하트 추가 (테이블 별칭 명시)
  UPDATE user_hearts uh
  SET current_hearts = LEAST(uh.current_hearts + 1, 5)
  WHERE uh.user_id = p_user_id;

  -- 성공 반환
  RETURN QUERY
  SELECT TRUE, LEAST(v_hearts + 1, 5), v_points - p_cost, '하트를 획득했습니다!'::TEXT;
END;
$$;

-- 함수 테스트
-- SELECT * FROM buy_heart_with_points('your-user-id-here'::UUID, 500);

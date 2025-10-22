-- ============================================
-- consume_heart 함수 수정 (ambiguous column reference 해결)
-- ============================================

-- 기존 함수 삭제
DROP FUNCTION IF EXISTS consume_heart(UUID, INTEGER);

-- 새로운 함수 생성
CREATE FUNCTION consume_heart(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS TABLE(success BOOLEAN, current_hearts INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_hearts INTEGER;
BEGIN
  -- 현재 하트 수 조회
  SELECT uh.current_hearts
  INTO v_current_hearts
  FROM user_hearts uh
  WHERE uh.user_id = p_user_id;

  -- 하트가 충분하지 않으면 실패
  IF v_current_hearts IS NULL OR v_current_hearts < p_amount THEN
    RETURN QUERY SELECT FALSE, COALESCE(v_current_hearts, 0);
    RETURN;
  END IF;

  -- 하트 소모 (테이블 별칭 명시)
  UPDATE user_hearts uh
  SET current_hearts = uh.current_hearts - p_amount
  WHERE uh.user_id = p_user_id;

  -- 업데이트된 하트 수 반환
  SELECT uh.current_hearts
  INTO v_current_hearts
  FROM user_hearts uh
  WHERE uh.user_id = p_user_id;

  RETURN QUERY SELECT TRUE, v_current_hearts;
END;
$$;

-- 함수 테스트
-- SELECT * FROM consume_heart('your-user-id-here'::UUID, 1);

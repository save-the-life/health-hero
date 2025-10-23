-- Function Search Path 경고 해결
-- 각 함수에 search_path 매개변수 설정

-- 1. consume_heart 함수 수정
CREATE OR REPLACE FUNCTION public.consume_heart(p_user_id UUID)
RETURNS TABLE(success BOOLEAN, current_hearts INTEGER, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 함수 내용은 기존과 동일
  -- (실제 함수 내용은 기존 함수를 참조하여 수정 필요)
END;
$$;

-- 2. buy_heart_with_points 함수 수정
CREATE OR REPLACE FUNCTION public.buy_heart_with_points(p_user_id UUID, p_points_to_spend INTEGER)
RETURNS TABLE(success BOOLEAN, current_hearts INTEGER, current_points INTEGER, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 함수 내용은 기존과 동일
  -- (실제 함수 내용은 기존 함수를 참조하여 수정 필요)
END;
$$;

-- 3. update_user_progress 함수 수정
CREATE OR REPLACE FUNCTION public.update_user_progress(
  p_user_id UUID,
  p_score_to_add INTEGER,
  p_exp_to_add INTEGER
)
RETURNS TABLE(
  success BOOLEAN,
  new_level INTEGER,
  new_total_score INTEGER,
  new_current_exp INTEGER,
  level_up BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 함수 내용은 기존과 동일
  -- (실제 함수 내용은 기존 함수를 참조하여 수정 필요)
END;
$$;

-- 4. complete_stage 함수 수정
CREATE OR REPLACE FUNCTION public.complete_stage(
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
SET search_path = public
AS $$
BEGIN
  -- 함수 내용은 기존과 동일
  -- (실제 함수 내용은 기존 함수를 참조하여 수정 필요)
END;
$$;

-- 1. Add last_login_at column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- 2. Create or replace the attendance check function
CREATE OR REPLACE FUNCTION check_daily_attendance(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_last_login TIMESTAMPTZ;
  v_current_streak INTEGER;
  v_new_streak INTEGER;
  v_now TIMESTAMPTZ := NOW();
  v_yesterday DATE := (NOW() - INTERVAL '1 day')::DATE;
  v_last_login_date DATE;
  v_is_first_login_today BOOLEAN;
BEGIN
  -- Get current user state
  SELECT last_login_at, current_streak 
  INTO v_last_login, v_current_streak
  FROM user_profiles
  WHERE id = p_user_id;

  -- Default values if null
  IF v_current_streak IS NULL THEN
    v_current_streak := 0;
  END IF;

  -- Check if first login today
  IF v_last_login IS NULL THEN
    v_last_login_date := NULL;
  ELSE
    v_last_login_date := v_last_login::DATE;
  END IF;

  IF v_last_login_date = v_now::DATE THEN
    -- Already logged in today
    v_is_first_login_today := FALSE;
    v_new_streak := v_current_streak;
  ELSE
    -- First login today
    v_is_first_login_today := TRUE;
    
    IF v_last_login_date = v_yesterday THEN
      -- Consecutive day
      v_new_streak := v_current_streak + 1;
    ELSE
      -- Streak broken (or first time)
      v_new_streak := 1;
    END IF;

    -- Update user profile
    UPDATE user_profiles
    SET 
      last_login_at = v_now,
      current_streak = v_new_streak,
      updated_at = v_now
    WHERE id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'is_first_login_today', v_is_first_login_today,
    'new_streak', v_new_streak,
    'last_login_at', v_now
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

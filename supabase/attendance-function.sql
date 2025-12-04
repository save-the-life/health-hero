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
  
  -- KST variables for date calculation
  v_now_kst TIMESTAMP;
  v_today_kst DATE;
  v_yesterday_kst DATE;
  v_last_login_kst TIMESTAMP;
  v_last_login_date_kst DATE;
  
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

  -- Calculate KST dates (UTC+9)
  -- AT TIME ZONE 'Asia/Seoul' converts TIMESTAMPTZ to TIMESTAMP (wall clock time in Seoul)
  v_now_kst := v_now AT TIME ZONE 'Asia/Seoul';
  v_today_kst := v_now_kst::DATE;
  v_yesterday_kst := (v_now_kst - INTERVAL '1 day')::DATE;

  -- Check if first login today (KST)
  IF v_last_login IS NULL THEN
    v_last_login_date_kst := NULL;
  ELSE
    v_last_login_kst := v_last_login AT TIME ZONE 'Asia/Seoul';
    v_last_login_date_kst := v_last_login_kst::DATE;
  END IF;

  IF v_last_login_date_kst = v_today_kst THEN
    -- Already logged in today (KST)
    v_is_first_login_today := FALSE;
    v_new_streak := v_current_streak;
  ELSE
    -- First login today (KST)
    v_is_first_login_today := TRUE;
    
    IF v_last_login_date_kst = v_yesterday_kst THEN
      -- Consecutive day (KST)
      v_new_streak := v_current_streak + 1;
    ELSE
      -- Streak broken (or first time)
      v_new_streak := 1;
    END IF;

    -- Update user profile
    UPDATE user_profiles
    SET 
      last_login_at = v_now, -- Store actual timestamp (UTC)
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

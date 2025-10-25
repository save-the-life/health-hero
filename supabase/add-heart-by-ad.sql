-- 하트 충전을 위한 광고 보상 RPC 함수
-- 앱인토스 환경에서 광고 시청 후 하트를 충전하는 함수

CREATE OR REPLACE FUNCTION add_heart_by_ad(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_hearts INTEGER;
    v_max_hearts INTEGER := 5;
    v_ad_views_today INTEGER;
    v_ad_reset_at TIMESTAMP;
    v_now TIMESTAMP := NOW();
    v_result JSON;
BEGIN
    -- 사용자 하트 정보 조회
    SELECT current_hearts, ad_views_today, ad_reset_at
    INTO v_current_hearts, v_ad_views_today, v_ad_reset_at
    FROM user_hearts
    WHERE user_id = p_user_id;
    
    -- 사용자 하트 정보가 없으면 기본값으로 생성
    IF NOT FOUND THEN
        INSERT INTO user_hearts (user_id, current_hearts, last_refill_at, ad_views_today, ad_reset_at)
        VALUES (p_user_id, 5, v_now, 0, v_now)
        ON CONFLICT (user_id) DO NOTHING;
        
        SELECT current_hearts, ad_views_today, ad_reset_at
        INTO v_current_hearts, v_ad_views_today, v_ad_reset_at
        FROM user_hearts
        WHERE user_id = p_user_id;
    END IF;
    
    -- 자정이 지났으면 광고 시청 횟수 리셋
    IF v_ad_reset_at < DATE_TRUNC('day', v_now) THEN
        v_ad_views_today := 0;
        v_ad_reset_at := DATE_TRUNC('day', v_now);
    END IF;
    
    -- 일일 광고 시청 제한 체크 (5회)
    IF v_ad_views_today >= 5 THEN
        v_result := json_build_object(
            'success', false,
            'current_hearts', v_current_hearts,
            'ad_views_today', v_ad_views_today,
            'message', '일일 광고 시청 한도를 초과했습니다. 내일 다시 시도해주세요.'
        );
        RETURN v_result;
    END IF;
    
    -- 하트가 이미 최대치인지 확인
    IF v_current_hearts >= v_max_hearts THEN
        v_result := json_build_object(
            'success', false,
            'current_hearts', v_current_hearts,
            'ad_views_today', v_ad_views_today,
            'message', '하트가 이미 최대치입니다.'
        );
        RETURN v_result;
    END IF;
    
    -- 하트 추가 (최대 5개까지)
    v_current_hearts := LEAST(v_current_hearts + 1, v_max_hearts);
    v_ad_views_today := v_ad_views_today + 1;
    
    -- 하트 정보 업데이트
    UPDATE user_hearts
    SET 
        current_hearts = v_current_hearts,
        ad_views_today = v_ad_views_today,
        ad_reset_at = v_ad_reset_at,
        last_refill_at = v_now
    WHERE user_id = p_user_id;
    
    -- 성공 결과 반환
    v_result := json_build_object(
        'success', true,
        'current_hearts', v_current_hearts,
        'ad_views_today', v_ad_views_today,
        'message', '하트가 성공적으로 충전되었습니다!'
    );
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- 에러 발생 시 로그 기록
        RAISE LOG 'add_heart_by_ad error for user %: %', p_user_id, SQLERRM;
        
        -- 에러 결과 반환
        v_result := json_build_object(
            'success', false,
            'current_hearts', COALESCE(v_current_hearts, 0),
            'ad_views_today', COALESCE(v_ad_views_today, 0),
            'message', '하트 충전 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
        
        RETURN v_result;
END;
$$;

-- RLS 정책 설정 (모든 사용자가 실행 가능)
CREATE POLICY "Allow all users to call add_heart_by_ad" ON user_hearts
    FOR ALL USING (true);

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION add_heart_by_ad(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION add_heart_by_ad(UUID) TO anon;

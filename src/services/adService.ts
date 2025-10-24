import { supabase } from "@/lib/supabase";

// 하트 충전 광고 보상 처리
export const addHeartByAd = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('add_heart_by_ad', {
      p_user_id: userId
    });

    if (error) {
      console.error('하트 충전 광고 API 에러:', error);
      return {
        success: false,
        message: error.message || '하트 충전에 실패했습니다.',
        data: null
      };
    }

    if (data && data.length > 0) {
      const result = data[0];
      return {
        success: result.success,
        message: result.message,
        data: {
          current_hearts: result.current_hearts,
          ad_views_today: result.ad_views_today
        }
      };
    }

    return {
      success: false,
      message: '서버 응답이 올바르지 않습니다.',
      data: null
    };
  } catch (error) {
    console.error('하트 충전 광고 서비스 에러:', error);
    return {
      success: false,
      message: '네트워크 오류가 발생했습니다.',
      data: null
    };
  }
};

// 일일 광고 시청 횟수 확인
export const getAdViewsToday = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_hearts')
      .select('ad_views_today, ad_reset_at')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('광고 시청 횟수 조회 에러:', error);
      return 0;
    }

    // 자정이 지났으면 카운트 리셋
    if (data && data.ad_reset_at) {
      const resetDate = new Date(data.ad_reset_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (resetDate < today) {
        // 카운트 리셋
        await supabase
          .from('user_hearts')
          .update({ 
            ad_views_today: 0, 
            ad_reset_at: new Date().toISOString() 
          })
          .eq('user_id', userId);
        
        return 0;
      }
    }

    return data?.ad_views_today || 0;
  } catch (error) {
    console.error('광고 시청 횟수 조회 서비스 에러:', error);
    return 0;
  }
};

// 광고 시청 가능 여부 확인
export const canWatchAd = async (userId: string): Promise<{
  canWatch: boolean;
  reason?: string;
  adViewsToday: number;
  maxAdViews: number;
}> => {
  try {
    const adViewsToday = await getAdViewsToday(userId);
    const maxAdViews = 5; // 일일 최대 광고 시청 횟수

    if (adViewsToday >= maxAdViews) {
      return {
        canWatch: false,
        reason: `오늘의 광고 시청 횟수(${maxAdViews}회)를 모두 사용했습니다.`,
        adViewsToday,
        maxAdViews
      };
    }

    return {
      canWatch: true,
      adViewsToday,
      maxAdViews
    };
  } catch (error) {
    console.error('광고 시청 가능 여부 확인 에러:', error);
    return {
      canWatch: false,
      reason: '광고 시청 가능 여부를 확인할 수 없습니다.',
      adViewsToday: 0,
      maxAdViews: 5
    };
  }
};

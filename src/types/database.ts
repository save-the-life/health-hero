// Supabase 데이터베이스 타입 정의

export interface UserProfile {
  id: string
  email: string | null
  name: string | null
  
  // 토스 관련 필드
  toss_user_key: number | null
  toss_access_token: string | null
  toss_refresh_token: string | null
  toss_token_expires_at: string | null
  toss_referrer: string | null
  
  // 게임 유저 키 (getUserKeyForGame으로 획득, 프로모션용)
  game_user_hash: string | null
  
  // 게임 관련 필드
  level: number
  current_exp: number
  total_score: number
  current_streak: number
  current_stage: number
  current_phase: number
  
  created_at: string
  updated_at: string
}

export interface TossLoginLog {
  id: string
  user_id: string
  toss_user_key: number
  referrer: string
  login_at: string
  ip_address: string | null
  user_agent: string | null
}

// Supabase에서 사용할 INSERT 타입
export type UserProfileInsert = Omit<UserProfile, 'created_at' | 'updated_at'> & {
  created_at?: string
  updated_at?: string
}

export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'created_at'>>


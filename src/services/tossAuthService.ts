import { supabase } from '@/lib/supabase'
import { UserProfile, UserProfileInsert } from '@/types/database'
import { TossLoginResult } from '@/types/toss'

export class TossAuthService {
  // 토스 정보로 Supabase 사용자 생성/로그인
  static async createOrUpdateUser(tossData: TossLoginResult) {
    const { user, token, auth } = tossData
    
    if (!user || !token) {
      throw new Error('토스 사용자 정보가 없습니다.')
    }
    
    // 토스 userKey를 이메일로 변환 (고유 식별자)
    const email = `${user.userKey}@toss.health-hero.app`

    try {
      // 1. 기존 사용자 확인
      const existingProfile = await this.findUserByTossKey(user.userKey)
      
      let userId: string

      if (existingProfile) {
        // 기존 사용자 - 토스 정보로 Supabase 로그인
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: existingProfile.email || email,
          password: `toss_${user.userKey}_permanent`
        })

        if (signInError) {
          // 비밀번호가 틀린 경우, 사용자를 찾아서 세션 생성
          console.log('기존 사용자 재로그인 시도...')
          throw signInError
        }

        userId = signInData.user.id
      } else {
        // 신규 사용자 - Supabase 계정 생성
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: `toss_${user.userKey}_permanent`, // 고정된 비밀번호 사용
          options: {
            data: {
              toss_user_key: user.userKey,
              name: user.name
            }
          }
        })

        if (signUpError) {
          throw signUpError
        }

        if (!signUpData.user) {
          throw new Error('사용자 생성에 실패했습니다.')
        }

        userId = signUpData.user.id
      }

      // 2. 사용자 프로필 업데이트/생성
      const tokenExpiresAt = new Date(Date.now() + token.expiresIn * 1000).toISOString()
      
      const profileData: UserProfileInsert = {
        id: userId,
        email,
        name: user.name,
        toss_user_key: user.userKey,
        toss_access_token: token.accessToken,
        toss_refresh_token: token.refreshToken,
        toss_token_expires_at: tokenExpiresAt,
        toss_referrer: auth.referrer,
        level: existingProfile?.level || 1,
        current_exp: existingProfile?.current_exp || 0,
        total_score: existingProfile?.total_score || 0,
        current_streak: existingProfile?.current_streak || 0,
        current_stage: existingProfile?.current_stage || 1,
        current_phase: existingProfile?.current_phase || 1
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData, {
          onConflict: 'id'
        })
        .select()
        .single()

      if (profileError) {
        console.error('프로필 저장 실패:', profileError)
        throw profileError
      }

      // 3. 로그인 기록 저장
      await supabase
        .from('toss_login_logs')
        .insert({
          user_id: userId,
          toss_user_key: user.userKey,
          referrer: auth.referrer,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
        })

      return {
        userId,
        profile
      }
    } catch (error) {
      console.error('Supabase 사용자 생성/업데이트 실패:', error)
      throw error
    }
  }

  // 토스 userKey로 기존 사용자 찾기
  static async findUserByTossKey(tossUserKey: number): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('toss_user_key', tossUserKey)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // 사용자 없음
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('사용자 조회 실패:', error)
      return null
    }
  }

  // 현재 로그인된 사용자 프로필 가져오기
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return null
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('현재 사용자 프로필 조회 실패:', error)
      return null
    }
  }

  // 사용자 프로필 업데이트
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      throw error
    }
  }
}


import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { TokenManager } from '@/utils/tokenManager'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  attendance: {
    is_first_login_today: boolean;
    new_streak: number;
    last_login_at: string;
  } | null

  // Actions
  setUser: (user: UserProfile | null) => void
  setAttendance: (attendance: {
    is_first_login_today: boolean;
    new_streak: number;
    last_login_at: string;
  } | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  logout: () => Promise<void>
  initialize: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      attendance: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        error: null
      }),

      setAttendance: (attendance) => set({ attendance }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: async () => {
        try {
          console.log('🔓 [authStore] 로그아웃 시작')

          // 1. 토스 토큰 삭제 (재로그인 시 약관 동의 화면 표시를 위해 필수)
          TokenManager.clearTokens()
          console.log('✅ [authStore] 토스 토큰 삭제 완료')

          // 2. Supabase 로그아웃
          await supabase.auth.signOut()
          console.log('✅ [authStore] Supabase 세션 종료 완료')

          // 3. 상태 초기화 (zustand persist가 자동으로 localStorage에서 제거)
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
          console.log('✅ [authStore] 로그아웃 완료')
        } catch (error) {
          console.error('❌ [authStore] 로그아웃 실패:', error)
          // 에러가 발생해도 상태는 초기화
          TokenManager.clearTokens()
          set({
            user: null,
            isAuthenticated: false,
            error: '로그아웃에 실패했습니다.'
          })
        }
      },

      initialize: async () => {
        set({ isLoading: true })

        try {
          // 먼저 로컬 스토리지에서 사용자 정보 확인 (토스 로그인 후 즉시 반영)
          const currentState = get()
          if (currentState.user && currentState.isAuthenticated) {
            console.log('🔧 로컬 스토리지에서 인증 상태 확인됨:', currentState.user.id)
            set({ isLoading: false })
            return
          }

          // Supabase 세션 확인
          const { data: { session } } = await supabase.auth.getSession()

          if (session?.user) {
            // 사용자 프로필 가져오기
            const { data: profile, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (error) {
              console.error('프로필 로드 실패:', error)
              set({ isAuthenticated: false, user: null })
            } else {
              set({ user: profile, isAuthenticated: true })

              // 세션 복구 시 출석 체크 수행
              try {
                const { data: attendanceData, error: attendanceError } = await supabase.rpc('check_daily_attendance', {
                  p_user_id: session.user.id
                })

                if (attendanceError) {
                  console.error('❌ [authStore] 자동 출석 체크 실패:', attendanceError)
                } else {
                  console.log('✅ [authStore] 자동 출석 체크 완료:', attendanceData)
                  set({ attendance: attendanceData })
                }
              } catch (err) {
                console.error('❌ [authStore] 자동 출석 체크 호출 중 예외:', err)
              }
            }
          } else {
            // 세션이 없어도 로컬 스토리지에 사용자 정보가 있으면 인증 상태 유지
            const persistedState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
            if (persistedState.state?.user && persistedState.state?.isAuthenticated) {
              console.log('🔧 로컬 스토리지에서 사용자 정보 복원:', persistedState.state.user.id)
              set({
                user: persistedState.state.user,
                isAuthenticated: true
              })
            } else {
              set({ isAuthenticated: false, user: null })
            }
          }
        } catch (error) {
          console.error('인증 상태 초기화 실패:', error)
          set({ isAuthenticated: false, user: null })
        } finally {
          set({ isLoading: false })
        }
      },

      updateProfile: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates
            }
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        attendance: state.attendance
      })
    }
  )
)

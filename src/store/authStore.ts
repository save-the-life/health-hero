import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@/types/database'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: UserProfile | null) => void
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
      isLoading: false,
      error: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: async () => {
        try {
          // Supabase 로그아웃
          await supabase.auth.signOut()
          
          // 상태 초기화
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
        } catch (error) {
          console.error('로그아웃 실패:', error)
          set({ error: '로그아웃에 실패했습니다.' })
        }
      },

      initialize: async () => {
        set({ isLoading: true })
        
        try {
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
            }
          } else {
            set({ isAuthenticated: false, user: null })
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
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

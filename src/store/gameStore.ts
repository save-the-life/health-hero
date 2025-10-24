import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

interface UserHearts {
  user_id: string
  current_hearts: number
  last_refill_at: string
  ad_views_today: number
  ad_reset_at: string
}

interface GameState {
  // 사용자 데이터
  level: number
  totalScore: number
  currentExp: number
  currentPhase: number
  currentStage: number
  hearts: UserHearts | null
  
  // 하트 타이머
  heartTimer: string
  
  // 로딩 상태
  isLoading: boolean
  error: string | null
  
  // 캐시 관련
  userDataCache: { level: number; totalScore: number; currentExp: number; currentPhase: number; currentStage: number; hearts: UserHearts | null } | null
  cacheTimestamp: number | null
  
  // Actions
  loadUserData: (userId: string) => Promise<void>
  updateHearts: () => Promise<void>
  consumeHeart: (amount?: number) => Promise<boolean>
  addHeartByAd: () => Promise<boolean>
  buyHeartWithPoints: () => Promise<boolean>
  updateScore: (score: number) => void
  updateExp: (exp: number) => void
  updateLevel: (level: number) => void
  addScoreAndExp: (score: number, exp: number) => Promise<boolean>
  completeStage: (phase: number, stage: number, correctCount: number, score: number, exp: number) => Promise<boolean>
  checkLevelUp: (currentExp: number) => { leveledUp: boolean; newLevel: number; expToNext: number }
  getLevelInfo: (level: number) => { totalExpRequired: number; expToNext: number; title: string }
  setError: (error: string | null) => void
  calculateHeartTimer: (lastRefillAt: string, currentHearts: number) => string
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      level: 1,
      totalScore: 0,
      currentExp: 0,
      currentPhase: 1,
      currentStage: 1,
      hearts: null,
      heartTimer: '5분00초',
      isLoading: false,
      error: null,
      userDataCache: null,
      cacheTimestamp: null,

      // 사용자 데이터 로드 (캐싱 적용)
      loadUserData: async (userId: string) => {
        const state = get()
        
        // 이미 로딩 중이면 중복 호출 방지
        if (state.isLoading) {
          console.log('이미 로딩 중입니다. 중복 호출 방지')
          return
        }
        
        // 캐시 확인 (더 짧은 시간으로 변경)
        const lastLoadTime = localStorage.getItem(`userData_${userId}_lastLoad`)
        if (lastLoadTime && state.level > 1) {
          const timeDiff = Date.now() - parseInt(lastLoadTime)
          if (timeDiff < 30 * 1000) { // 30초로 단축
            console.log('캐시된 데이터 사용. 서버 호출 스킵')
            return
          }
        }
        
        set({ isLoading: true, error: null })
        
        try {
          // Supabase 인증 상태 확인
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          console.log('🔍 Supabase 세션 상태:', { 
            hasSession: !!session, 
            userId: session?.user?.id, 
            error: sessionError?.message 
          })
          
          if (sessionError) {
            console.warn('세션 확인 실패:', sessionError.message)
          }
          
          // 사용자 프로필과 하트 데이터를 함께 조회
          const [profileResult, heartsResult] = await Promise.all([
            supabase
              .from('user_profiles')
              .select('level, total_score, current_exp, current_phase, current_stage')
              .eq('id', userId)
              .single(),
            
            supabase
              .from('user_hearts')
              .select('*')
              .eq('user_id', userId)
              .single()
          ])

          if (profileResult.error) {
            console.warn('프로필 로드 실패, 기본값 사용:', profileResult.error.message)
            
            // 프로필이 없으면 기본값으로 생성
            try {
              const defaultProfile = {
                id: userId,
                level: 1,
                total_score: 500,
                current_exp: 0,
                current_phase: 1,
                current_stage: 1,
                email: `user${userId.substring(0, 8)}@health-hero.app`,
                name: '헬스 히어로',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              // 기본 프로필을 데이터베이스에 삽입
              const { error: insertError } = await supabase
                .from('user_profiles')
                .insert(defaultProfile)
              
              if (insertError) {
                console.warn('기본 프로필 삽입 실패:', insertError.message)
              } else {
                console.log('기본 프로필 생성 완료')
              }
              
              set({
                level: defaultProfile.level,
                totalScore: defaultProfile.total_score,
                currentExp: defaultProfile.current_exp,
                currentPhase: defaultProfile.current_phase,
                currentStage: defaultProfile.current_stage,
                isLoading: false
              })
            } catch (insertError) {
              console.error('프로필 생성 중 오류:', insertError)
              // 생성 실패해도 기본값으로 계속 진행
              const defaultProfile = {
                level: 1,
                total_score: 500,
                current_exp: 0,
                current_phase: 1,
                current_stage: 1
              }
              
              set({
                level: defaultProfile.level,
                totalScore: defaultProfile.total_score,
                currentExp: defaultProfile.current_exp,
                currentPhase: defaultProfile.current_phase,
                currentStage: defaultProfile.current_stage,
                isLoading: false
              })
            }
            return
          }

          if (heartsResult.error) {
            console.warn('하트 데이터 로드 실패, 기본값 사용:', heartsResult.error.message)
            
            // 하트 데이터가 없으면 기본값으로 생성
            try {
              const defaultHearts = {
                user_id: userId,
                current_hearts: 5,
                last_refill_at: new Date().toISOString(),
                ad_views_today: 0,
                ad_reset_at: new Date().toISOString()
              }
              
              // 기본 하트 데이터를 데이터베이스에 삽입
              const { error: insertError } = await supabase
                .from('user_hearts')
                .insert(defaultHearts)
              
              if (insertError) {
                console.warn('기본 하트 데이터 삽입 실패:', insertError.message)
              } else {
                console.log('기본 하트 데이터 생성 완료')
              }
              
              const heartTimer = get().calculateHeartTimer(defaultHearts.last_refill_at, defaultHearts.current_hearts)
              
              set({
                hearts: defaultHearts,
                heartTimer,
                isLoading: false
              })
            } catch (insertError) {
              console.error('하트 데이터 생성 중 오류:', insertError)
              // 생성 실패해도 기본값으로 계속 진행
              const defaultHearts = {
                user_id: userId,
                current_hearts: 5,
                last_refill_at: new Date().toISOString(),
                ad_views_today: 0,
                ad_reset_at: new Date().toISOString()
              }
              
              const heartTimer = get().calculateHeartTimer(defaultHearts.last_refill_at, defaultHearts.current_hearts)
              
              set({
                hearts: defaultHearts,
                heartTimer,
                isLoading: false
              })
            }
            return
          }

          const profile = profileResult.data
          const hearts = heartsResult.data

          // 하트 타이머 계산
          const heartTimer = get().calculateHeartTimer(hearts.last_refill_at, hearts.current_hearts)

          set({
            level: profile.level || 1,
            totalScore: profile.total_score || 0,
            currentExp: profile.current_exp || 0,
            currentPhase: profile.current_phase || 1,
            currentStage: profile.current_stage || 1,
            hearts: hearts,
            heartTimer,
            isLoading: false
          })
          
          // 로드 완료 시간 저장
          localStorage.setItem(`userData_${userId}_lastLoad`, Date.now().toString())

        } catch (error) {
          console.error('사용자 데이터 로드 실패:', error)
          set({ 
            error: error instanceof Error ? error.message : '데이터 로드 실패',
            isLoading: false 
          })
        }
      },

      // 하트 업데이트
      updateHearts: async () => {
        const hearts = get().hearts
        if (!hearts) return

        // 하트가 이미 5개면 충전할 필요 없음
        if (hearts.current_hearts >= 5) {
          const heartTimer = get().calculateHeartTimer(hearts.last_refill_at, hearts.current_hearts)
          set({ heartTimer })
          return
        }

        try {
          const { data, error } = await supabase
            .rpc('refill_heart', { p_user_id: hearts.user_id })

          if (error) {
            console.error('하트 업데이트 실패:', error)
            return
          }

          if (data && data.length > 0) {
            const result = data[0]
            const heartTimer = get().calculateHeartTimer(result.last_refill_at, result.current_hearts)
            
            set({
              hearts: {
                ...hearts,
                current_hearts: result.current_hearts,
                last_refill_at: result.last_refill_at
              },
              heartTimer
            })
          }
        } catch (error) {
          console.error('하트 업데이트 실패:', error)
        }
      },

      // 하트 소모
      consumeHeart: async (amount = 1) => {
        const hearts = get().hearts
        if (!hearts) return false

        try {
          const { data, error } = await supabase
            .rpc('consume_heart', { 
              p_user_id: hearts.user_id, 
              p_amount: amount 
            })

          if (error) {
            console.error('하트 소모 실패:', error)
            return false
          }

          if (data && data.length > 0) {
            const result = data[0]
            
            if (result.success) {
              const updatedHearts = {
                ...hearts,
                current_hearts: result.current_hearts
              }
              const heartTimer = get().calculateHeartTimer(hearts.last_refill_at, result.current_hearts)
              
              set({
                hearts: updatedHearts,
                heartTimer
              })
              
              return true
            }
          }
          
          return false
        } catch (error) {
          console.error('하트 소모 실패:', error)
          return false
        }
      },

      // 광고로 하트 획득
      addHeartByAd: async () => {
        const hearts = get().hearts
        if (!hearts) return false

        try {
          const { data, error } = await supabase
            .rpc('add_heart_by_ad', { p_user_id: hearts.user_id })

          if (error) {
            console.error('광고 하트 획득 실패:', error)
            return false
          }

          if (data && data.length > 0) {
            const result = data[0]
            
            if (result.success) {
              set({
                hearts: {
                  ...hearts,
                  current_hearts: result.current_hearts,
                  ad_views_today: result.ad_views_today
                }
              })
              return true
            }
          }
          
          return false
        } catch (error) {
          console.error('광고 하트 획득 실패:', error)
          return false
        }
      },

      // 포인트로 하트 구매
      buyHeartWithPoints: async () => {
        const hearts = get().hearts
        if (!hearts) return false

        try {
          const { data, error } = await supabase
            .rpc('buy_heart_with_points', { 
              p_user_id: hearts.user_id, 
              p_cost: 500 
            })

          if (error) {
            console.error('포인트 하트 구매 실패:', error)
            return false
          }

          if (data && data.length > 0) {
            const result = data[0]
            
            if (result.success) {
              set({
                hearts: {
                  ...hearts,
                  current_hearts: result.current_hearts
                },
                totalScore: result.current_points
              })
              return true
            }
          }
          
          return false
        } catch (error) {
          console.error('포인트 하트 구매 실패:', error)
          return false
        }
      },

      // 점수 업데이트
      updateScore: (score: number) => {
        set({ totalScore: score })
      },

      // 경험치 업데이트
      updateExp: (exp: number) => {
        set({ currentExp: exp })
      },

      // 레벨 업데이트
      updateLevel: (level: number) => {
        set({ level })
      },

      // 점수와 경험치 추가
      addScoreAndExp: async (score: number, exp: number) => {
        const hearts = get().hearts
        if (!hearts) return false

        try {
          const { data, error } = await supabase
            .rpc('update_user_progress', { 
              p_user_id: hearts.user_id, 
              p_score_to_add: score,
              p_exp_to_add: exp
            })

          if (error) {
            console.error('점수/경험치 업데이트 실패:', error)
            return false
          }

          if (data && data.length > 0) {
            const result = data[0]
            
            if (result.success) {
              // 레벨업 체크
              const { leveledUp, newLevel } = get().checkLevelUp(result.current_exp)
              
              set({
                totalScore: result.current_score,
                currentExp: result.current_exp,
                level: result.current_level
              })

              // 레벨업 시 하트 회복 (최대치 초과 불가)
              if (leveledUp && newLevel > get().level) {
                console.log(`레벨업! Lv.${get().level} → Lv.${newLevel}`)
                
                // 하트가 5개 미만일 때만 +1 회복
                if (hearts.current_hearts < 5) {
                  try {
                    const { data: heartData, error: heartError } = await supabase
                      .rpc('refill_heart', { p_user_id: hearts.user_id })
                    
                    if (!heartError && heartData && heartData.length > 0) {
                      const heartResult = heartData[0]
                      if (heartResult.success) {
                        set({
                          hearts: {
                            ...hearts,
                            current_hearts: Math.min(5, hearts.current_hearts + 1)
                          }
                        })
                        console.log(`레벨업 보상: 하트 +1 (현재 ${Math.min(5, hearts.current_hearts + 1)}개)`)
                      }
                    }
                  } catch (heartError) {
                    console.error('레벨업 하트 회복 실패:', heartError)
                  }
                }
              }

              return true
            }
          }
          
          return false
        } catch (error) {
          console.error('점수/경험치 업데이트 실패:', error)
          return false
        }
      },

      // 스테이지 완료 처리
      completeStage: async (phase: number, stage: number, correctCount: number, score: number, exp: number) => {
        const hearts = get().hearts
        if (!hearts) return false

        try {
          // 먼저 점수/경험치 추가
          const scoreExpSuccess = await get().addScoreAndExp(score, exp)
          if (!scoreExpSuccess) return false

          // 스테이지 완료 처리
          const { data, error } = await supabase
            .rpc('complete_stage', { 
              p_user_id: hearts.user_id,
              p_phase: phase,
              p_stage: stage,
              p_correct_count: correctCount,
              p_score_earned: score,
              p_exp_earned: exp
            })

          if (error) {
            console.error('스테이지 완료 처리 실패:', error)
            return false
          }

          if (data && data.length > 0) {
            const result = data[0]
            console.log('스테이지 완료 결과:', result)
            
            // 스테이지 완료 후 캐시 무효화하여 최신 데이터 반영
            if (result.success) {
              set({ 
                userDataCache: null, 
                cacheTimestamp: null,
                // 현재 스테이지 정보도 즉시 업데이트
                currentStage: result.next_stage_unlocked ? stage + 1 : stage,
                currentPhase: result.phase_cleared ? phase + 1 : phase
              })
              console.log('스테이지 완료 후 강제 캐시 무효화 및 상태 업데이트 완료')
              
              // 로컬 스토리지 캐시도 삭제
              localStorage.removeItem(`userData_${hearts.user_id}_lastLoad`)
              console.log('로컬 스토리지 캐시 삭제 완료')
              
              // 사용자 데이터 새로고침 (캐시 무시)
              await get().loadUserData(hearts.user_id)
              console.log('스테이지 완료 후 사용자 데이터 새로고침 완료')
            }
            
            return result.success
          }
          
          return false
        } catch (error) {
          console.error('스테이지 완료 처리 실패:', error)
          return false
        }
      },

      // 레벨업 체크 함수
      checkLevelUp: (currentExp: number) => {
        const currentLevel = get().level;
        let newLevel = currentLevel;
        let totalExpForNextLevel = 0;

        // 다음 레벨까지 필요한 총 경험치 계산
        for (let i = 1; i <= currentLevel + 1; i++) {
          totalExpForNextLevel += Math.round(120 * Math.pow(1.15, i - 1));
        }

        // 레벨업 가능한지 확인
        if (currentExp >= totalExpForNextLevel) {
          // 최대 레벨(20)까지 확인
          for (let level = currentLevel + 1; level <= 20; level++) {
            let totalExpForLevel = 0;
            for (let i = 1; i <= level; i++) {
              totalExpForLevel += Math.round(120 * Math.pow(1.15, i - 1));
            }
            
            if (currentExp >= totalExpForLevel) {
              newLevel = level;
            } else {
              break;
            }
          }
        }

        const leveledUp = newLevel > currentLevel;
        const expToNext = leveledUp ? 
          (() => {
            let totalExpForNext = 0;
            for (let i = 1; i <= newLevel + 1; i++) {
              totalExpForNext += Math.round(120 * Math.pow(1.15, i - 1));
            }
            return totalExpForNext - currentExp;
          })() : 
          totalExpForNextLevel - currentExp;

        return { leveledUp, newLevel, expToNext };
      },

      // 레벨 정보 가져오기 함수
      getLevelInfo: (level: number) => {
        let totalExpRequired = 0;
        for (let i = 1; i <= level; i++) {
          totalExpRequired += Math.round(120 * Math.pow(1.15, i - 1));
        }

        let expToNext = 0;
        if (level < 20) {
          let totalExpForNext = 0;
          for (let i = 1; i <= level + 1; i++) {
            totalExpForNext += Math.round(120 * Math.pow(1.15, i - 1));
          }
          expToNext = totalExpForNext - totalExpRequired;
        }

        const titles = {
          1: "의대 새내기",
          5: "인턴",
          10: "레지던트",
          15: "전문의",
          20: "헬스 히어로"
        };

        const title = titles[level as keyof typeof titles] || `레벨 ${level}`;

        return { totalExpRequired, expToNext, title };
      },

      // 에러 설정
      setError: (error: string | null) => {
        set({ error })
      },

      // 하트 타이머 계산 헬퍼 함수
      calculateHeartTimer: (lastRefillAt: string, currentHearts: number) => {
        // 하트가 5개면 충전 완료
        if (currentHearts >= 5) {
          return '충전 완료'
        }
        
        const now = new Date()
        const lastRefill = new Date(lastRefillAt)
        const diffMs = now.getTime() - lastRefill.getTime()
        const diffSeconds = Math.floor(diffMs / 1000)
        
        // 5분(300초)마다 하트 충전
        const secondsUntilNextRefill = 300 - (diffSeconds % 300)
        
        // 다음 충전까지 남은 시간을 분:초 형식으로 표시
        const minutes = Math.floor(secondsUntilNextRefill / 60)
        const seconds = secondsUntilNextRefill % 60
        
        return `${minutes}분${seconds.toString().padStart(2, '0')}초`
      }
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        level: state.level,
        totalScore: state.totalScore,
        currentExp: state.currentExp,
        currentPhase: state.currentPhase,
        currentStage: state.currentStage,
        hearts: state.hearts
      })
    }
  )
)
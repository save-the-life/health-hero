/**
 * 게임 인증 서비스
 * getUserKeyForGame을 사용한 게임 미니앱 전용 인증
 * 프로모션(토스 포인트) 기능 지원
 */

import { getUserKeyForGame } from '@apps-in-toss/web-framework'
import { supabase } from '@/lib/supabase'

export type GameUserKeyResult = 
  | { success: true; hash: string }
  | { success: false; error: 'UNSUPPORTED_VERSION' | 'INVALID_CATEGORY' | 'ERROR' | 'NO_HASH' }

export type GameUserKeyError = 'UNSUPPORTED_VERSION' | 'INVALID_CATEGORY' | 'ERROR' | 'NO_HASH'

export class GameAuthService {
  /**
   * 게임 유저 키 획득
   * @returns 성공 시 { success: true, hash: string }, 실패 시 { success: false, error: string }
   */
  static async getGameUserKey(): Promise<GameUserKeyResult> {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🎮 [GameAuth] 게임 유저 키 획득 시작')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📱 [GameAuth] 현재 환경:', {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
        isTossApp: typeof navigator !== 'undefined' && navigator.userAgent.includes('TossApp')
      })
      console.log('🔧 [GameAuth] getUserKeyForGame() SDK 함수 호출...')
      
      const result = await getUserKeyForGame()
      console.log('📦 [GameAuth] getUserKeyForGame() 원본 응답:', result)
      console.log('📦 [GameAuth] 응답 타입:', typeof result)
      
      // 앱 버전이 최소 지원 버전보다 낮음 (토스앱 5.232.0 미만)
      if (!result) {
        console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.warn('⚠️ [GameAuth] 케이스: UNSUPPORTED_VERSION')
        console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.warn('📱 [GameAuth] 지원하지 않는 앱 버전')
        console.warn('📱 [GameAuth] 필요 버전: 토스앱 5.232.0 이상')
        console.warn('📱 [GameAuth] getUserKeyForGame() 응답: undefined')
        console.warn('💡 [GameAuth] 해결 방법: 토스앱 업데이트 필요')
        console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        return { success: false, error: 'UNSUPPORTED_VERSION' }
      }
      
      // 게임 카테고리가 아닌 미니앱
      if (result === 'INVALID_CATEGORY') {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.error('❌ [GameAuth] 케이스: INVALID_CATEGORY')
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.error('📱 [GameAuth] 게임 카테고리가 아닌 미니앱')
        console.error('📱 [GameAuth] getUserKeyForGame()은 게임 카테고리 전용')
        console.error('💡 [GameAuth] 해결 방법: 앱인토스 콘솔에서 카테고리를 "게임"으로 설정')
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        return { success: false, error: 'INVALID_CATEGORY' }
      }
      
      // 알 수 없는 오류
      if (result === 'ERROR') {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.error('❌ [GameAuth] 케이스: ERROR')
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.error('📱 [GameAuth] 사용자 키 조회 중 오류 발생')
        console.error('📱 [GameAuth] getUserKeyForGame() 내부 오류')
        console.error('💡 [GameAuth] 해결 방법: 앱 재시작 또는 재로그인 시도')
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        return { success: false, error: 'ERROR' }
      }
      
      // 성공: HASH 타입
      if (result.type === 'HASH') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('✅ [GameAuth] 케이스: SUCCESS')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('🎉 [GameAuth] 게임 유저 키 획득 성공!')
        console.log('🔑 [GameAuth] 유저 해시 (일부):', result.hash.substring(0, 20) + '...')
        console.log('🔑 [GameAuth] 전체 길이:', result.hash.length, '자')
        console.log('💾 [GameAuth] 다음 단계: Supabase에 저장')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        return { success: true, hash: result.hash }
      }
      
      // 예상치 못한 응답
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('❌ [GameAuth] 케이스: NO_HASH (예상치 못한 응답)')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('📱 [GameAuth] 예상치 못한 응답 타입')
      console.error('📦 [GameAuth] 응답 내용:', result)
      console.error('💡 [GameAuth] 해결 방법: SDK 버전 확인 필요')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return { success: false, error: 'NO_HASH' }
      
    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('❌ [GameAuth] 예외 발생!')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('🔥 [GameAuth] getUserKeyForGame() 호출 중 예외 발생')
      console.error('🔥 [GameAuth] 에러 메시지:', error instanceof Error ? error.message : error)
      console.error('🔥 [GameAuth] 스택 트레이스:', error instanceof Error ? error.stack : 'N/A')
      console.error('💡 [GameAuth] 해결 방법: SDK 설치 확인 또는 앱 환경 확인')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return { success: false, error: 'ERROR' }
    }
  }

  /**
   * 게임 유저 키를 Supabase user_profiles에 저장
   * @param userId Supabase Auth 사용자 ID
   * @param gameHash 게임 유저 해시
   * @returns 성공 여부
   */
  static async saveGameUserKey(userId: string, gameHash: string): Promise<boolean> {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('💾 [GameAuth] 게임 유저 키 저장 시작')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('👤 [GameAuth] 사용자 ID:', userId)
      console.log('🔑 [GameAuth] 게임 해시 (일부):', gameHash.substring(0, 20) + '...')
      console.log('🔑 [GameAuth] 게임 해시 길이:', gameHash.length, '자')
      console.log('📡 [GameAuth] Supabase UPDATE 요청 전송...')
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ game_user_hash: gameHash })
        .eq('id', userId)
        .select('id, game_user_hash')
        .single()
      
      if (error) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.error('❌ [GameAuth] 저장 실패!')
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.error('🔥 [GameAuth] Supabase 에러 코드:', error.code)
        console.error('🔥 [GameAuth] 에러 메시지:', error.message)
        console.error('🔥 [GameAuth] 에러 상세:', error)
        console.error('💡 [GameAuth] 해결 방법: RLS 정책 확인 또는 테이블 스키마 확인')
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        return false
      }
      
      // 로컬 스토리지에도 저장 (프로모션 서비스에서 사용)
      if (typeof window !== 'undefined') {
        localStorage.setItem('gameUserHash', gameHash)
        console.log('💾 [GameAuth] 로컬 스토리지에도 저장 완료')
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('✅ [GameAuth] 저장 성공!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('👤 [GameAuth] 저장된 사용자 ID:', data.id)
      console.log('🔑 [GameAuth] 저장된 게임 해시 (일부):', data.game_user_hash?.substring(0, 20) + '...')
      console.log('🔑 [GameAuth] DB 저장 확인됨')
      console.log('🎉 [GameAuth] 프로모션 기능 준비 완료!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      return true
    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('❌ [GameAuth] 예외 발생!')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('🔥 [GameAuth] 게임 유저 키 저장 중 예외')
      console.error('🔥 [GameAuth] 에러 메시지:', error instanceof Error ? error.message : error)
      console.error('🔥 [GameAuth] 스택 트레이스:', error instanceof Error ? error.stack : 'N/A')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return false
    }
  }

  /**
   * 로컬 스토리지에서 게임 유저 키 가져오기
   * @returns 게임 유저 해시 또는 null
   */
  static getGameUserHashFromStorage(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('gameUserHash')
  }

  /**
   * 게임 유저 키로 사용자 프로필 조회
   * @param gameHash 게임 유저 해시
   * @returns 사용자 프로필 또는 null
   */
  static async findUserByGameHash(gameHash: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('game_user_hash', gameHash)
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
      console.error('❌ [GameAuth] 게임 해시로 사용자 조회 실패:', error)
      return null
    }
  }

  /**
   * 게임 유저 키 존재 여부 확인
   * @param userId Supabase Auth 사용자 ID
   * @returns 게임 유저 키 존재 여부
   */
  static async hasGameUserKey(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('game_user_hash')
        .eq('id', userId)
        .single()
      
      if (error) return false
      
      return !!data.game_user_hash
    } catch {
      return false
    }
  }

  /**
   * 에러 메시지 변환
   * @param error 에러 타입
   * @returns 사용자 친화적 에러 메시지
   */
  static getErrorMessage(error: GameUserKeyError): string {
    switch (error) {
      case 'UNSUPPORTED_VERSION':
        return '토스앱 버전이 너무 낮습니다. 앱을 업데이트해주세요. (최소 5.232.0 필요)'
      case 'INVALID_CATEGORY':
        return '게임 카테고리 미니앱에서만 사용할 수 있습니다.'
      case 'ERROR':
        return '사용자 키 조회 중 오류가 발생했습니다.'
      case 'NO_HASH':
        return '사용자 키를 받을 수 없습니다.'
      default:
        return '알 수 없는 오류가 발생했습니다.'
    }
  }
}


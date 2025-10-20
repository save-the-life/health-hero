import { TossTokenResponse } from '@/types/toss'

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'toss_access_token'
  private static readonly REFRESH_TOKEN_KEY = 'toss_refresh_token'
  private static readonly EXPIRES_AT_KEY = 'toss_expires_at'
  private static readonly USER_KEY = 'toss_user_key'

  // 토큰 저장
  static saveTokens(accessToken: string, refreshToken: string, expiresIn: number, userKey?: number) {
    if (typeof window === 'undefined') return
    
    const expiresAt = Date.now() + (expiresIn * 1000)
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString())
    if (userKey) {
      localStorage.setItem(this.USER_KEY, userKey.toString())
    }
  }

  // 토큰 조회
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  static getUserKey(): number | null {
    if (typeof window === 'undefined') return null
    const userKey = localStorage.getItem(this.USER_KEY)
    return userKey ? parseInt(userKey) : null
  }

  // 토큰 만료 확인
  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true
    
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY)
    if (!expiresAt) return true
    
    // 5분 버퍼를 두고 만료 체크 (300,000ms)
    return Date.now() >= parseInt(expiresAt) - 300000
  }

  // 토큰 갱신
  static async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.')
    }

    try {
      const response = await fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken
        })
      })

      if (!response.ok) {
        throw new Error(`토큰 갱신 요청 실패: ${response.status}`)
      }

      const data: TossTokenResponse = await response.json()
      
      if (data.resultType === 'FAILURE') {
        throw new Error(data.failure?.errorMessage || '토큰 갱신 실패')
      }

      if (data.success) {
        // 새 토큰 저장
        this.saveTokens(
          data.success.accessToken,
          data.success.refreshToken,
          data.success.expiresIn
        )
        return data.success.accessToken
      }

      throw new Error('토큰 갱신 응답이 올바르지 않습니다.')
    } catch (error) {
      console.error('토큰 갱신 실패:', error)
      // 토큰 갱신 실패 시 로그아웃 처리
      this.clearTokens()
      throw error
    }
  }

  // 토큰 삭제
  static clearTokens() {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.EXPIRES_AT_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  // 유효한 액세스 토큰 가져오기 (필요시 자동 갱신)
  static async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getAccessToken()
    
    if (!accessToken) {
      return null
    }

    // 토큰이 만료되었으면 갱신
    if (this.isTokenExpired()) {
      try {
        return await this.refreshAccessToken()
      } catch (error) {
        console.error('토큰 자동 갱신 실패:', error)
        return null
      }
    }

    return accessToken
  }
}


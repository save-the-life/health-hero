'use client'

import { useState } from 'react'
import { TossAuthResponse, TossTokenResponse, TossUserInfo, TossLoginResult } from '@/types/toss'
import { TokenManager } from '@/utils/tokenManager'
import { ErrorHandler } from '@/utils/errorHandler'

// 앱인토스 SDK 타입 선언
declare global {
  function appLogin(): Promise<TossAuthResponse>
}

export const useTossAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. 토스 로그인 (인가 코드 받기)
  const tossLogin = async (): Promise<TossAuthResponse> => {
    try {
      if (typeof appLogin === 'undefined') {
        throw new Error('앱인토스 환경에서만 사용할 수 있습니다.')
      }

      const result = await appLogin()
      
      if (!result.authorizationCode) {
        throw new Error('인가 코드를 받을 수 없습니다.')
      }
      
      return result
    } catch (error) {
      console.error('토스 로그인 실패:', error)
      throw error
    }
  }

  // 2. 액세스 토큰 발급
  const getAccessToken = async (authorizationCode: string, referrer: string): Promise<TossTokenResponse> => {
    try {
      const response = await fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorizationCode,
          referrer
        })
      })

      if (!response.ok) {
        throw new Error(`토큰 요청 실패: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('액세스 토큰 발급 실패:', error)
      throw error
    }
  }

  // 3. 사용자 정보 조회
  const getUserInfo = async (accessToken: string): Promise<TossUserInfo> => {
    try {
      const response = await fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`사용자 정보 요청 실패: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error)
      throw error
    }
  }

  // 통합 로그인 함수
  const login = async (): Promise<TossLoginResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. 토스 로그인 (인가 코드 받기)
      const authResult = await tossLogin()
      
      // 2. 액세스 토큰 발급
      const tokenResult = await getAccessToken(
        authResult.authorizationCode,
        authResult.referrer
      )
      
      if (tokenResult.resultType === 'FAILURE') {
        const tossError = ErrorHandler.handleTossError(tokenResult)
        throw new Error(ErrorHandler.getErrorMessage(tossError))
      }

      if (!tokenResult.success) {
        throw new Error('토큰 발급에 실패했습니다.')
      }

      // 3. 사용자 정보 조회
      const userResult = await getUserInfo(tokenResult.success.accessToken)
      
      if (userResult.resultType === 'FAILURE') {
        const tossError = ErrorHandler.handleTossError(userResult)
        throw new Error(ErrorHandler.getErrorMessage(tossError))
      }

      if (!userResult.success) {
        throw new Error('사용자 정보 조회에 실패했습니다.')
      }

      // 4. 토큰 저장
      TokenManager.saveTokens(
        tokenResult.success.accessToken,
        tokenResult.success.refreshToken,
        tokenResult.success.expiresIn,
        userResult.success.userKey
      )

      return {
        auth: authResult,
        token: tokenResult.success,
        user: userResult.success
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 로그아웃
  const logout = () => {
    TokenManager.clearTokens()
    setError(null)
  }

  return {
    login,
    logout,
    isLoading,
    error
  }
}


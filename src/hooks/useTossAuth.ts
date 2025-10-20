'use client'

import { useState } from 'react'
import { appLogin } from '@apps-in-toss/web-framework'
import { TossAuthResponse, TossTokenResponse, TossUserInfo, TossLoginResult } from '@/types/toss'
import { TokenManager } from '@/utils/tokenManager'
import { ErrorHandler } from '@/utils/errorHandler'

export const useTossAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. 토스 로그인 (인가 코드 받기)
  const tossLogin = async (): Promise<TossAuthResponse> => {
    try {
      console.log('[useTossAuth] appLogin 함수 호출 시작...')
      
      const result = await appLogin()
      console.log('[useTossAuth] appLogin() 응답:', result)
      
      if (!result.authorizationCode) {
        throw new Error('인가 코드를 받을 수 없습니다.')
      }
      
      console.log('[useTossAuth] 인가 코드 획득 성공:', {
        authorizationCode: result.authorizationCode.substring(0, 20) + '...',
        referrer: result.referrer
      })
      
      return result as TossAuthResponse
    } catch (error) {
      console.error('[useTossAuth] 토스 로그인 실패:', error)
      throw error
    }
  }

  // 2. 액세스 토큰 발급 (Supabase Edge Function 우선, 백엔드 대체)
  const getAccessToken = async (authorizationCode: string, referrer: string): Promise<TossTokenResponse> => {
    try {
      // Supabase Edge Function 우선 사용 (mTLS 지원)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      
      const useSupabase = !!supabaseUrl
      const url = useSupabase
        ? `${supabaseUrl}/functions/v1/toss-auth`
        : backendUrl
        ? `${backendUrl}/api/toss/generate-token`
        : 'http://localhost:3001/api/toss/generate-token'
      
      const body = useSupabase
        ? { action: 'generate-token', authorizationCode, referrer }
        : { authorizationCode, referrer }
      
      console.log(`[useTossAuth] 액세스 토큰 요청 (${useSupabase ? 'Supabase Edge Function (mTLS)' : 'Node.js 백엔드'}):`, {
        url,
        method: 'POST',
        body: { authorizationCode: authorizationCode.substring(0, 20) + '...', referrer }
      })
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (useSupabase && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      console.log('[useTossAuth] 액세스 토큰 응답:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[useTossAuth] 토큰 요청 실패 응답:', errorText)
        throw new Error(`토큰 요청 실패: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('[useTossAuth] 액세스 토큰 발급 성공:', data.resultType)
      return data
    } catch (error) {
      console.error('[useTossAuth] 액세스 토큰 발급 실패:', error)
      throw error
    }
  }

  // 3. 사용자 정보 조회 (Supabase Edge Function 우선, 백엔드 대체)
  const getUserInfo = async (accessToken: string, referrer: string): Promise<TossUserInfo> => {
    try {
      // Supabase Edge Function 우선 사용 (mTLS 지원)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      
      const useSupabase = !!supabaseUrl
      const url = useSupabase
        ? `${supabaseUrl}/functions/v1/toss-auth`
        : backendUrl
        ? `${backendUrl}/api/toss/user-info`
        : 'http://localhost:3001/api/toss/user-info'
      
      const body = useSupabase
        ? { action: 'get-user-info', accessToken, referrer }
        : { accessToken, referrer }
      
      console.log(`[useTossAuth] 사용자 정보 요청 (${useSupabase ? 'Supabase Edge Function (mTLS)' : 'Node.js 백엔드'}):`, {
        url,
        accessToken: accessToken.substring(0, 20) + '...',
        referrer
      })
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (useSupabase && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
      
      const response = await fetch(url, {
        method: 'POST', // Edge Function은 POST로 액션 전달
        headers,
        body: JSON.stringify(body)
      })

      console.log(`[useTossAuth] 사용자 정보 응답 상태:`, response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[useTossAuth] 사용자 정보 요청 실패:', errorText)
        throw new Error(`사용자 정보 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log('[useTossAuth] 사용자 정보 조회 성공:', data)
      return data
    } catch (error) {
      console.error('[useTossAuth] 사용자 정보 조회 실패:', error)
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
      console.log('[useTossAuth] 사용자 정보 조회 시작 - referrer:', authResult.referrer)
      const userResult = await getUserInfo(tokenResult.success.accessToken, authResult.referrer)
      
      console.log('[useTossAuth] 사용자 정보 조회 결과:', userResult)
      
      if (userResult.resultType === 'FAIL' || userResult.resultType === 'FAILURE') {
        console.error('[useTossAuth] 토스 API 에러:', userResult.error)
        console.error('[useTossAuth] 사용된 referrer:', authResult.referrer)
        const tossError = ErrorHandler.handleTossError(userResult)
        throw new Error(`사용자 정보 조회 실패 (${authResult.referrer}): ${ErrorHandler.getErrorMessage(tossError)}`)
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


// 토스 인증 응답 (appLogin 결과)
export interface TossAuthResponse {
  authorizationCode: string
  referrer: 'DEFAULT' | 'SANDBOX'
}

// 토스 토큰 응답
export interface TossTokenResponse {
  resultType: 'SUCCESS' | 'FAILURE' | 'FAIL'
  success?: {
    tokenType: 'Bearer'
    accessToken: string
    refreshToken: string
    expiresIn: number
    scope: string
  }
  failure?: {
    errorCode: string
    errorMessage: string
  }
  error?: {
    errorType: number
    errorCode: string
    reason: string
    data: Record<string, unknown>
    title: string | null
  }
}

// 토스 사용자 정보 (이름만)
export interface TossUserInfo {
  resultType: 'SUCCESS' | 'FAILURE' | 'FAIL'
  success?: {
    userKey: number
    name: string
  }
  failure?: {
    errorCode: string
    errorMessage: string
  }
  error?: {
    errorType: number
    errorCode: string
    reason: string
    data: Record<string, unknown>
    title: string | null
  }
}

// 토스 에러 코드
export enum TossErrorCode {
  // 인증 관련
  INVALID_AUTHORIZATION_CODE = 'INVALID_AUTHORIZATION_CODE',
  EXPIRED_AUTHORIZATION_CODE = 'EXPIRED_AUTHORIZATION_CODE',
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  EXPIRED_ACCESS_TOKEN = 'EXPIRED_ACCESS_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  EXPIRED_REFRESH_TOKEN = 'EXPIRED_REFRESH_TOKEN',
  
  // 사용자 관련
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // 시스템 관련
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 토스 에러
export interface TossError {
  code: TossErrorCode
  message: string
  details?: unknown
}

// 토스 로그인 결과
export interface TossLoginResult {
  auth: TossAuthResponse
  token: TossTokenResponse['success']
  user: TossUserInfo['success']
}


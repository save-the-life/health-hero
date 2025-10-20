import { TossError, TossErrorCode } from '@/types/toss'

export class ErrorHandler {
  static handleTossError(error: unknown): TossError {
    // 토스 API 에러 처리
    if (error && typeof error === 'object' && 'failure' in error) {
      const errorObj = error as { failure: { errorCode: string; errorMessage: string } }
      return {
        code: this.mapTossErrorCode(errorObj.failure.errorCode),
        message: errorObj.failure.errorMessage,
        details: errorObj.failure
      }
    }

    // 네트워크 에러 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        code: TossErrorCode.NETWORK_ERROR,
        message: '네트워크 연결을 확인해주세요.',
        details: error
      }
    }

    // 알 수 없는 에러
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : '알 수 없는 오류가 발생했습니다.'
    
    return {
      code: TossErrorCode.UNKNOWN_ERROR,
      message: errorMessage,
      details: error
    }
  }

  private static mapTossErrorCode(tossCode: string): TossErrorCode {
    const errorMap: Record<string, TossErrorCode> = {
      'INVALID_AUTHORIZATION_CODE': TossErrorCode.INVALID_AUTHORIZATION_CODE,
      'EXPIRED_AUTHORIZATION_CODE': TossErrorCode.EXPIRED_AUTHORIZATION_CODE,
      'INVALID_ACCESS_TOKEN': TossErrorCode.INVALID_ACCESS_TOKEN,
      'EXPIRED_ACCESS_TOKEN': TossErrorCode.EXPIRED_ACCESS_TOKEN,
      'INVALID_REFRESH_TOKEN': TossErrorCode.INVALID_REFRESH_TOKEN,
      'EXPIRED_REFRESH_TOKEN': TossErrorCode.EXPIRED_REFRESH_TOKEN,
      'USER_NOT_FOUND': TossErrorCode.USER_NOT_FOUND,
      'INTERNAL_SERVER_ERROR': TossErrorCode.INTERNAL_SERVER_ERROR
    }

    return errorMap[tossCode] || TossErrorCode.UNKNOWN_ERROR
  }

  static getErrorMessage(error: TossError): string {
    const errorMessages: Record<TossErrorCode, string> = {
      [TossErrorCode.INVALID_AUTHORIZATION_CODE]: '유효하지 않은 인가 코드입니다.',
      [TossErrorCode.EXPIRED_AUTHORIZATION_CODE]: '인가 코드가 만료되었습니다. 다시 로그인해주세요.',
      [TossErrorCode.INVALID_ACCESS_TOKEN]: '유효하지 않은 액세스 토큰입니다.',
      [TossErrorCode.EXPIRED_ACCESS_TOKEN]: '액세스 토큰이 만료되었습니다.',
      [TossErrorCode.INVALID_REFRESH_TOKEN]: '유효하지 않은 리프레시 토큰입니다.',
      [TossErrorCode.EXPIRED_REFRESH_TOKEN]: '리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.',
      [TossErrorCode.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
      [TossErrorCode.USER_ALREADY_EXISTS]: '이미 존재하는 사용자입니다.',
      [TossErrorCode.INSUFFICIENT_PERMISSIONS]: '권한이 부족합니다.',
      [TossErrorCode.INTERNAL_SERVER_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      [TossErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
      [TossErrorCode.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.'
    }

    return errorMessages[error.code] || error.message
  }
}


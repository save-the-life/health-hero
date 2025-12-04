// Supabase Edge Function: 토스 API mTLS 프록시
// Deno.createHttpClient를 사용하여 mTLS 인증서 지원


import { corsHeaders } from '../_shared/cors.ts'


// Deno.createHttpClient가 반환하는 클라이언트 타입 정의
interface DenoHttpClient {
  close(): void;
}

// fetch 옵션에 client 속성 추가를 위한 인터페이스 확장
interface DenoRequestInit extends RequestInit {
  client?: DenoHttpClient;
}

// mTLS 클라이언트 생성 (환경 변수에서 Base64 인코딩된 인증서 읽기)
const createMtlsClient = () => {
  try {
    const certBase64 = Deno.env.get('TOSS_CERT_BASE64')
    const keyBase64 = Deno.env.get('TOSS_KEY_BASE64')

    if (!certBase64 || !keyBase64) {
      console.error('[mTLS] 인증서 환경 변수가 설정되지 않았습니다.')
      return null
    }

    // Base64 디코딩
    const cert = atob(certBase64)
    const key = atob(keyBase64)

    console.log('[mTLS] 인증서 로드 성공')

    // Deno의 mTLS 클라이언트 생성
    return Deno.createHttpClient({
      cert,
      key,
    })
  } catch (error) {
    console.error('[mTLS] 클라이언트 생성 실패:', error)
    return null
  }
}

// mTLS 클라이언트 초기화
const mtlsClient = createMtlsClient()

Deno.serve(async (req: Request) => {
  // CORS preflight 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, authorizationCode, referrer, accessToken } = await req.json()

    console.log(`[toss-auth] Action: ${action}, Referrer: ${referrer}`)

    // mTLS 클라이언트 확인
    if (!mtlsClient) {
      console.error('[toss-auth] mTLS 클라이언트가 초기화되지 않았습니다.')
      return new Response(
        JSON.stringify({
          resultType: 'FAILURE',
          failure: {
            errorCode: 'MTLS_ERROR',
            errorMessage: 'mTLS 인증서가 설정되지 않았습니다.'
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // 1. AccessToken 발급
    if (action === 'generate-token') {
      console.log('[toss-auth] Requesting access token from Toss API...')

      const fetchOptions: DenoRequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorizationCode,
          referrer,
        }),
        client: mtlsClient,
      }

      const response = await fetch(
        'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token',
        fetchOptions
      )

      console.log(`[toss-auth] Toss API response status: ${response.status}`)

      const data = await response.json()

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      })
    }

    // 2. 사용자 정보 조회
    if (action === 'get-user-info') {
      console.log('[toss-auth] Requesting user info from Toss API...')
      console.log('[toss-auth] AccessToken:', accessToken?.substring(0, 30) + '...')
      console.log('[toss-auth] Referrer:', referrer)

      // 공식 문서 섹션 4: /oauth2/login-me 엔드포인트 사용
      const userApiUrl = 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me'

      console.log('[toss-auth] User API URL:', userApiUrl)

      const fetchOptions: DenoRequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        client: mtlsClient,
      }

      const response = await fetch(
        userApiUrl,
        fetchOptions
      )

      console.log(`[toss-auth] Toss API response status: ${response.status}`)

      const responseText = await response.text()
      console.log(`[toss-auth] Toss API response body:`, responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('[toss-auth] Failed to parse response as JSON:', responseText)
        data = { resultType: 'FAILURE', failure: { errorCode: 'PARSE_ERROR', errorMessage: responseText } }
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      })
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  } catch (error) {
    console.error('[toss-auth] Error:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

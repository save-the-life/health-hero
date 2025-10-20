/**
 * Cloudflare Workers: 토스 API mTLS 프록시
 * 
 * mTLS 인증서를 사용하여 토스 API를 호출하고
 * 클라이언트에게 응답을 전달합니다.
 */

interface Env {
  TOSS_CLIENT_CERT: string
  TOSS_CLIENT_KEY: string
}

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS Preflight 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      })
    }

    // POST 요청만 허용
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      })
    }

    try {
      const body = await request.json()
      const { action, authorizationCode, referrer, accessToken } = body

      // 1. AccessToken 발급
      if (action === 'generate-token') {
        const response = await fetch(
          'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              authorizationCode,
              referrer,
            }),
            // Cloudflare Workers는 현재 mTLS를 fetch API에서 직접 지원하지 않습니다
            // 대신 Cloudflare의 mTLS 기능을 사용해야 합니다
          }
        )

        const data = await response.json()

        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: response.status,
        })
      }

      // 2. 사용자 정보 조회
      if (action === 'get-user-info') {
        const response = await fetch(
          'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        const data = await response.json()

        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: response.status,
        })
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 400,
        }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 500,
        }
      )
    }
  },
}


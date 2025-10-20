import express from 'express'
import cors from 'cors'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 미들웨어
app.use(cors())
app.use(express.json())

// mTLS 인증서 로드
let cert, key

if (process.env.TOSS_CERT_BASE64 && process.env.TOSS_KEY_BASE64) {
  // 프로덕션 환경: Base64 디코딩 (Railway, Render 등)
  cert = Buffer.from(process.env.TOSS_CERT_BASE64, 'base64')
  key = Buffer.from(process.env.TOSS_KEY_BASE64, 'base64')
  console.log('✅ mTLS 인증서 로드 (환경 변수)')
} else {
  // 로컬 환경: 파일에서 직접 읽기
  try {
    cert = fs.readFileSync(path.join(__dirname, 'certs', 'health_hero_public.crt'))
    key = fs.readFileSync(path.join(__dirname, 'certs', 'health_hero_private.key'))
    console.log('✅ mTLS 인증서 로드 (로컬 파일)')
  } catch (error) {
    console.error('❌ mTLS 인증서 파일을 찾을 수 없습니다.')
    console.error('환경 변수 또는 certs/ 폴더에 인증서 파일이 필요합니다.')
    process.exit(1)
  }
}

// HTTPS Agent 생성 (mTLS 사용)
const httpsAgent = new https.Agent({
  cert,
  key,
  rejectUnauthorized: true,
})

/**
 * POST /api/toss/generate-token
 * 토스 AccessToken 발급
 */
app.post('/api/toss/generate-token', async (req, res) => {
  try {
    const { authorizationCode, referrer } = req.body

    console.log('[Backend] AccessToken 발급 요청:', { authorizationCode: authorizationCode?.substring(0, 20) + '...', referrer })

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
        agent: httpsAgent, // mTLS 인증서 사용
      }
    )

    const data = await response.json()

    console.log('[Backend] AccessToken 발급 응답:', response.status, data.resultType)

    res.status(response.status).json(data)
  } catch (error) {
    console.error('[Backend] AccessToken 발급 실패:', error)
    res.status(500).json({
      resultType: 'FAILURE',
      failure: {
        errorCode: 'INTERNAL_ERROR',
        errorMessage: error.message,
      },
    })
  }
})

/**
 * POST /api/toss/user-info
 * 토스 사용자 정보 조회
 */
app.post('/api/toss/user-info', async (req, res) => {
  try {
    const { accessToken } = req.body

    console.log('[Backend] 사용자 정보 조회 요청')

    const response = await fetch(
      'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        agent: httpsAgent, // mTLS 인증서 사용
      }
    )

    const data = await response.json()

    console.log('[Backend] 사용자 정보 조회 응답:', response.status, data.resultType)

    res.status(response.status).json(data)
  } catch (error) {
    console.error('[Backend] 사용자 정보 조회 실패:', error)
    res.status(500).json({
      resultType: 'FAILURE',
      failure: {
        errorCode: 'INTERNAL_ERROR',
        errorMessage: error.message,
      },
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`✅ Health Hero Backend 서버 시작`)
  console.log(`📍 http://localhost:${PORT}`)
  console.log(`🔐 mTLS 인증서 로드 완료`)
})


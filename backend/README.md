# Health Hero Backend Server

mTLS 인증서를 사용하여 토스 API를 호출하는 백엔드 서버입니다.

## 📁 폴더 구조

```
backend/
├── certs/
│   ├── health_hero_private.key   # mTLS 개인키
│   └── health_hero_public.crt    # mTLS 인증서
├── server.js                      # Express 서버
├── package.json
└── README.md
```

## 🔐 인증서 설정

1. 앱인토스 콘솔에서 다운로드한 인증서 파일을 `certs/` 폴더에 복사:
   ```
   backend/certs/health_hero_private.key
   backend/certs/health_hero_public.crt
   ```

2. 인증서 파일 권한 확인 (Linux/Mac):
   ```bash
   chmod 600 certs/health_hero_private.key
   chmod 644 certs/health_hero_public.crt
   ```

## 🚀 실행 방법

### 1. 의존성 설치

```bash
cd backend
npm install
```

### 2. 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3001`에서 실행됩니다.

### 3. 테스트

```bash
# Health check
curl http://localhost:3001/health

# AccessToken 발급 테스트
curl -X POST http://localhost:3001/api/toss/generate-token \
  -H "Content-Type: application/json" \
  -d '{"authorizationCode":"test","referrer":"SANDBOX"}'
```

## 📡 API 엔드포인트

### POST /api/toss/generate-token

토스 AccessToken 발급

**Request:**
```json
{
  "authorizationCode": "string",
  "referrer": "DEFAULT" | "SANDBOX"
}
```

**Response:**
```json
{
  "resultType": "SUCCESS",
  "success": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": number,
    "scope": "string",
    "tokenType": "Bearer"
  }
}
```

### POST /api/toss/user-info

토스 사용자 정보 조회

**Request:**
```json
{
  "accessToken": "string"
}
```

**Response:**
```json
{
  "resultType": "SUCCESS",
  "success": {
    "userKey": number,
    "name": "string"
  }
}
```

## 🌐 프로덕션 배포

### Vercel

Vercel은 Serverless Functions를 지원하지만, mTLS 인증서 사용이 제한적일 수 있습니다.

### Railway.app (권장)

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 생성
railway init

# 배포
railway up
```

### AWS EC2 / DigitalOcean

전통적인 VPS 서버에 배포하는 것이 가장 안정적입니다.

## 🔒 보안 고려사항

1. **인증서 파일 보안**
   - `.gitignore`에 `certs/` 폴더 추가
   - 절대 Git에 커밋하지 마세요

2. **CORS 설정**
   - 프로덕션에서는 특정 도메인만 허용
   ```javascript
   app.use(cors({
     origin: 'https://your-app-domain.com'
   }))
   ```

3. **환경 변수**
   - `.env` 파일 사용
   - 민감한 정보는 환경 변수로 관리


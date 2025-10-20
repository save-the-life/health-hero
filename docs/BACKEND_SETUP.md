# 백엔드 서버 설정 가이드 (mTLS 인증서)

## 📋 개요

토스 API는 mTLS 인증서가 필요하므로, Node.js Express 백엔드 서버를 통해 호출합니다.

---

## 🔐 1. mTLS 인증서 준비

### 1-1. 앱인토스 콘솔에서 인증서 다운로드

1. **앱인토스 개발자 콘솔** 접속
   - https://developers-apps-in-toss.toss.im/

2. **서버 인증서 발급**
   - 프로젝트 선택 → 설정 → 서버 mTLS 인증서
   - "인증서 발급" 클릭
   - `health_hero_private.key` (개인키)
   - `health_hero_public.crt` (인증서)
   - 두 파일 다운로드

### 1-2. 인증서 파일 배치

```bash
# 프로젝트 루트에서
mkdir -p backend/certs

# 다운로드한 파일을 backend/certs/로 복사
# - health_hero_private.key
# - health_hero_public.crt
```

**폴더 구조**:
```
backend/
├── certs/
│   ├── health_hero_private.key   # mTLS 개인키
│   └── health_hero_public.crt    # mTLS 인증서
├── server.js
├── package.json
└── README.md
```

---

## 🚀 2. 백엔드 서버 실행

### 2-1. 의존성 설치

```powershell
cd backend
npm install
```

### 2-2. 서버 실행

```powershell
npm run dev
```

서버가 `http://localhost:3001`에서 실행됩니다.

### 2-3. 서버 동작 확인

```powershell
# Health check
curl http://localhost:3001/health

# 응답: {"status":"ok"}
```

---

## 🔧 3. 환경 변수 설정

### 3-1. 프론트엔드 (.env.local)

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 토스
NEXT_PUBLIC_TOSS_APP_KEY=health-hero

# 백엔드 서버 URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**프로덕션**:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```

---

## 📡 4. API 엔드포인트

### POST /api/toss/generate-token

**Request**:
```json
{
  "authorizationCode": "SNQbKUb0ZPrpZZBuGg9pT9Led__onkA...",
  "referrer": "DEFAULT"
}
```

**Response**:
```json
{
  "resultType": "SUCCESS",
  "success": {
    "tokenType": "Bearer",
    "accessToken": "eyJraWQiOiJjZXJ0IiwiYWxnIjoiUlMyNTYifQ...",
    "refreshToken": "...",
    "expiresIn": 3600,
    "scope": "user_name"
  }
}
```

### POST /api/toss/user-info

**Request**:
```json
{
  "accessToken": "eyJraWQiOiJjZXJ0IiwiYWxnIjoiUlMyNTYifQ..."
}
```

**Response**:
```json
{
  "resultType": "SUCCESS",
  "success": {
    "userKey": 123456789,
    "name": "홍길동"
  }
}
```

---

## 🧪 5. 전체 플로우 테스트

### 5-1. 백엔드 서버 실행

```powershell
cd backend
npm run dev
```

### 5-2. 프론트엔드 실행

```powershell
# 다른 터미널에서
npm run dev
```

### 5-3. 샌드박스 앱 빌드 및 업로드

```powershell
npm run build
npx @apps-in-toss/cli build
```

### 5-4. 샌드박스 앱에서 테스트

1. "토스로 시작하기" 버튼 클릭
2. 약관 동의 (첫 로그인 시)
3. Eruda Console 확인:

```
[useTossAuth] appLogin 함수 호출 시작...
[useTossAuth] appLogin() 응답: {...}
[useTossAuth] 인가 코드 획득 성공
[useTossAuth] 액세스 토큰 요청 (백엔드 서버)
[useTossAuth] 액세스 토큰 응답: {ok: true, status: 200}
[useTossAuth] 액세스 토큰 발급 성공: SUCCESS
[useTossAuth] 사용자 정보 요청 (백엔드 서버)
[useTossAuth] 사용자 정보 조회 성공: SUCCESS
✅ [TossLogin] 토스 로그인 성공
```

---

## 🌐 6. 프로덕션 배포

### 옵션 1: Railway.app (권장)

```powershell
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 백엔드 폴더에서
cd backend
railway init
railway up

# 환경 변수 설정
railway variables set PORT=3001

# URL 확인
railway domain
# → https://your-app.up.railway.app
```

`.env.local` 업데이트:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-app.up.railway.app
```

### 옵션 2: AWS EC2

1. EC2 인스턴스 생성
2. Node.js 설치
3. PM2로 서버 실행
4. Nginx로 리버스 프록시 설정
5. SSL 인증서 설정 (Let's Encrypt)

### 옵션 3: DigitalOcean App Platform

1. GitHub 저장소 연결
2. `backend/` 폴더를 서비스로 추가
3. 환경 변수 설정
4. 배포

---

## 🔒 7. 보안 고려사항

### 7-1. 인증서 파일 보안

**절대 Git에 커밋하지 마세요!**

`.gitignore`:
```
backend/certs/
*.key
*.crt
*.pem
```

### 7-2. CORS 설정

프로덕션에서는 특정 도메인만 허용:

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://your-app-domain.com',
    'https://lucky-dice.private-apps.tossmini.com'  // 앱인토스 도메인
  ]
}))
```

### 7-3. Rate Limiting

```powershell
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // 최대 100 요청
})

app.use('/api', limiter)
```

---

## 🐛 8. 트러블슈팅

### 인증서 파일을 찾을 수 없음

```
Error: ENOENT: no such file or directory, open '.../health_hero_private.key'
```

**해결**:
- `backend/certs/` 폴더에 파일이 있는지 확인
- 파일 이름이 정확한지 확인 (대소문자 포함)

### mTLS 인증 실패

```
Error: unable to verify the first certificate
```

**해결**:
- 인증서 파일이 유효한지 확인
- 토스 API 도메인이 정확한지 확인
- `rejectUnauthorized: true` 설정 확인

### CORS 에러

```
Access to fetch at '...' from origin '...' has been blocked by CORS
```

**해결**:
- 백엔드 서버의 CORS 설정 확인
- `origin` 설정에 프론트엔드 도메인 추가

---

## 📚 참고 자료

- [Node.js HTTPS 모듈](https://nodejs.org/api/https.html)
- [Express.js 문서](https://expressjs.com/)
- [토스 API 문서](https://developers-apps-in-toss.toss.im/api/overview.html)


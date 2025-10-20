# 프로덕션 배포 가이드 (mTLS 인증서 필수)

## 🚨 중요: mTLS 인증서 필수

토스 API 공식 문서:
> 앱인토스 API 사용을 위해서는 **필수로 mTLS(mutual TLS, 양방향 인증) 인증서를 설정**해야 합니다.

따라서 **반드시 Node.js 백엔드 서버를 배포**해야 합니다.

---

## 📊 배포 옵션 비교

| 옵션 | 난이도 | 비용 | mTLS 지원 | 권장도 |
|------|--------|------|-----------|--------|
| Railway.app | ⭐ 쉬움 | 무료~$5/월 | ✅ | 🌟🌟🌟🌟🌟 |
| Render | ⭐⭐ 보통 | 무료~$7/월 | ✅ | 🌟🌟🌟🌟 |
| AWS EC2 | ⭐⭐⭐⭐ 어려움 | ~$10/월 | ✅ | 🌟🌟🌟 |
| DigitalOcean | ⭐⭐⭐ 보통 | $5/월 | ✅ | 🌟🌟🌟 |

---

## 🚀 옵션 1: Railway.app (가장 권장 🌟)

### 장점
- ✅ 가장 쉬운 배포
- ✅ GitHub 자동 배포
- ✅ 무료 티어 제공 ($5 크레딧/월)
- ✅ HTTPS 자동 설정
- ✅ 환경 변수 관리 편리

### 배포 단계

#### 1. Railway 계정 생성
- https://railway.app 접속
- GitHub로 로그인

#### 2. 프로젝트 준비

```powershell
# backend/ 폴더를 별도 Git 저장소로 분리하거나
# 전체 프로젝트를 Push

git add .
git commit -m "Add backend server with mTLS"
git push origin main
```

#### 3. Railway에서 프로젝트 생성

1. **New Project** 클릭
2. **Deploy from GitHub repo** 선택
3. 저장소 선택
4. **Add variables** 클릭

#### 4. 환경 변수 설정

Railway Dashboard에서:

```
PORT=3001
NODE_ENV=production
```

#### 5. Root Directory 설정

**Settings** → **Root Directory** → `backend`

#### 6. 인증서 파일 업로드

**⚠️ 중요**: 인증서 파일은 Git에 커밋하면 안 됩니다!

**방법 1: Railway CLI 사용**

```powershell
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 연결
railway link

# 인증서 파일을 Base64로 인코딩하여 환경 변수로 설정
$cert = [Convert]::ToBase64String([IO.File]::ReadAllBytes("backend/certs/health_hero_public.crt"))
$key = [Convert]::ToBase64String([IO.File]::ReadAllBytes("backend/certs/health_hero_private.key"))

railway variables set TOSS_CERT_BASE64=$cert
railway variables set TOSS_KEY_BASE64=$key
```

**방법 2: Railway Volume 사용**

1. Railway Dashboard → Storage → **New Volume**
2. Volume 생성 후 Mount Path: `/app/certs`
3. 로컬에서 파일 업로드 (Railway CLI 필요)

#### 7. server.js 수정 (Base64 환경 변수 사용)

```javascript
// backend/server.js
import fs from 'fs'
import path from 'path'

// 환경 변수에서 Base64 인코딩된 인증서 읽기
let cert, key

if (process.env.TOSS_CERT_BASE64 && process.env.TOSS_KEY_BASE64) {
  // Railway 환경: Base64 디코딩
  cert = Buffer.from(process.env.TOSS_CERT_BASE64, 'base64')
  key = Buffer.from(process.env.TOSS_KEY_BASE64, 'base64')
  console.log('✅ mTLS 인증서 로드 (환경 변수)')
} else {
  // 로컬 환경: 파일에서 직접 읽기
  cert = fs.readFileSync(path.join(__dirname, 'certs', 'health_hero_public.crt'))
  key = fs.readFileSync(path.join(__dirname, 'certs', 'health_hero_private.key'))
  console.log('✅ mTLS 인증서 로드 (로컬 파일)')
}

// ... 나머지 코드
```

#### 8. 배포 확인

Railway가 자동으로 배포합니다.

**URL 확인**:
```
https://your-app.railway.app
```

#### 9. 프론트엔드 환경 변수 업데이트

`.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_TOSS_APP_KEY=health-hero
```

---

## 🚀 옵션 2: Render

### 배포 단계

1. **Render 계정 생성**: https://render.com
2. **New** → **Web Service**
3. GitHub 저장소 연결
4. **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. **Environment Variables**:
   ```
   PORT=10000
   TOSS_CERT_BASE64=...
   TOSS_KEY_BASE64=...
   ```

---

## 🚀 옵션 3: AWS EC2 (고급)

### 배포 단계

#### 1. EC2 인스턴스 생성

- AMI: Ubuntu 22.04 LTS
- 인스턴스 타입: t3.micro (프리 티어)
- 보안 그룹: HTTP (80), HTTPS (443), SSH (22)

#### 2. 서버 설정

```bash
# SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2

# 프로젝트 클론
git clone https://github.com/your-repo/health-hero.git
cd health-hero/backend

# 의존성 설치
npm install

# 인증서 파일 업로드 (scp 사용)
# 로컬에서 실행:
scp -i your-key.pem backend/certs/* ubuntu@your-ec2-ip:~/health-hero/backend/certs/

# PM2로 실행
pm2 start server.js --name health-hero-backend
pm2 save
pm2 startup
```

#### 3. Nginx 설정 (HTTPS)

```bash
# Nginx 설치
sudo apt-get install nginx

# Let's Encrypt SSL 인증서
sudo apt-get install certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com
```

Nginx 설정 (`/etc/nginx/sites-available/health-hero`):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 보안 체크리스트

### ✅ 배포 전

- [ ] `.gitignore`에 `certs/` 폴더 추가
- [ ] 인증서 파일을 Git에 커밋하지 않았는지 확인
- [ ] 환경 변수로 인증서 관리 설정
- [ ] CORS 설정 (특정 도메인만 허용)
- [ ] Rate Limiting 설정

### ✅ 배포 후

- [ ] HTTPS 적용 확인
- [ ] 백엔드 서버 Health Check (`/health`)
- [ ] 토스 로그인 테스트 (샌드박스 → 프로덕션)
- [ ] 에러 로그 모니터링 설정
- [ ] 백업 전략 수립

---

## 📊 비용 예상

### Railway.app
- 무료 티어: $5 크레딧/월
- 소규모 서비스: 충분
- Pro: $20/월 (필요 시)

### Render
- 무료 티어: 제한적 (750시간/월)
- Starter: $7/월

### AWS EC2
- t3.micro: 프리 티어 (1년)
- 이후: ~$10/월

### DigitalOcean
- Basic Droplet: $5/월

---

## 🧪 테스트

### 1. 로컬 테스트

```powershell
# 백엔드 실행
cd backend
npm run dev

# 프론트엔드 실행 (다른 터미널)
npm run dev
```

### 2. 프로덕션 테스트

```powershell
# .env.local에 프로덕션 URL 설정
NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app

# 빌드
npm run build
npx @apps-in-toss/cli build

# .ait 파일 업로드 및 테스트
```

---

## 🐛 트러블슈팅

### 1. mTLS 인증서 에러

```
Error: unable to verify the first certificate
```

**해결**:
- 인증서 파일이 올바른지 확인
- 환경 변수 Base64 인코딩 확인
- Railway Dashboard에서 환경 변수 재설정

### 2. CORS 에러

```
Access to fetch blocked by CORS
```

**해결**:
- `backend/server.js`의 CORS origin 설정 확인
- 프론트엔드 도메인이 허용 목록에 있는지 확인

### 3. 연결 타임아웃

```
Error: connect ETIMEDOUT
```

**해결**:
- 방화벽 설정 확인
- 토스 API IP 화이트리스트 확인
- Railway/Render의 Outbound IP 확인

---

## 📚 참고 자료

- [Railway 문서](https://docs.railway.app/)
- [Render 문서](https://render.com/docs)
- [토스 API 문서](https://developers-apps-in-toss.toss.im/api/overview.html)
- [Express.js mTLS 설정](https://nodejs.org/api/https.html)

---

## ✅ 최종 권장 사항

### 1단계: Railway.app으로 배포 (추천 🌟)
- 가장 쉽고 빠름
- 무료 티어로 시작
- GitHub 자동 배포

### 2단계: 도메인 연결 (선택)
- Railway에서 커스텀 도메인 설정
- 또는 Cloudflare Workers로 프록시

### 3단계: 모니터링 설정
- Railway Dashboard에서 로그 확인
- Sentry 연동 (에러 추적)
- Uptime Robot (다운타임 모니터링)

**프로덕션 준비 완료!** 🚀


# Health Hero 배포 가이드

## 🚨 중요: mTLS 인증서 필수

토스 API는 **mTLS 인증서가 필수**입니다.  
따라서 **반드시 백엔드 서버를 배포**해야 합니다.

---

## 📊 배포 구조

```
[사용자] 
   ↓
[토스 앱 (WebView)]
   ↓
[Next.js 프론트엔드 (.ait 파일)]
   ↓
[백엔드 서버 (mTLS 인증서)]
   ↓
[토스 API]
   ↓
[Supabase (데이터베이스)]
```

---

## 🚀 배포 단계 (Railway.app 기준)

### 1️⃣ 백엔드 서버 배포

#### Step 1: 인증서 준비

```powershell
# backend/certs/ 폴더에 인증서 복사
backend/certs/health_hero_private.key
backend/certs/health_hero_public.crt
```

#### Step 2: Railway 계정 생성

https://railway.app 접속 후 GitHub 로그인

#### Step 3: 프로젝트 배포

```powershell
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 생성 (backend 폴더에서)
cd backend
railway init
railway up
```

#### Step 4: 인증서를 Base64로 인코딩

```powershell
# PowerShell (Windows)
cd backend/scripts
.\encode-certs.ps1

# 또는 Bash (Mac/Linux)
chmod +x encode-certs.sh
./encode-certs.sh
```

스크립트가 출력한 명령어를 실행:
```powershell
railway variables set TOSS_CERT_BASE64="..."
railway variables set TOSS_KEY_BASE64="..."
```

#### Step 5: 환경 변수 설정

Railway Dashboard에서:
```
PORT=3001
NODE_ENV=production
```

#### Step 6: 배포 확인

Railway가 자동으로 배포합니다.

URL 확인:
```
https://your-app.railway.app
```

Health Check:
```powershell
curl https://your-app.railway.app/health
# 응답: {"status":"ok"}
```

---

### 2️⃣ 프론트엔드 배포

#### Step 1: 환경 변수 설정

`.env.local` 파일 생성:
```env
# Supabase (데이터베이스)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 토스
NEXT_PUBLIC_TOSS_APP_KEY=health-hero

# 백엔드 서버 URL ⭐ (Railway에서 배포한 URL)
NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app
```

#### Step 2: 빌드

```powershell
npm run build
npx @apps-in-toss/cli build
```

#### Step 3: .ait 파일 업로드

1. 앱인토스 개발자 콘솔 접속
2. 프로젝트 선택 → 테스트
3. 생성된 `.ait` 파일 업로드

---

### 3️⃣ 테스트

#### 샌드박스 앱에서 테스트

1. 샌드박스 앱 실행
2. "토스로 시작하기" 버튼 클릭
3. Eruda Console 확인

**성공 로그**:
```
[useTossAuth] appLogin 함수 호출 시작...
[useTossAuth] appLogin() 응답: {...}
[useTossAuth] 액세스 토큰 요청 (mTLS 백엔드 서버)
→ url: https://your-app.railway.app/api/toss/generate-token
[useTossAuth] 액세스 토큰 응답: {ok: true, status: 200}
[useTossAuth] 액세스 토큰 발급 성공: SUCCESS
✅ [TossLogin] 토스 로그인 성공
```

---

## 📁 필수 파일 체크리스트

### ✅ 백엔드

- [ ] `backend/server.js` - Express 서버
- [ ] `backend/package.json` - 의존성
- [ ] `backend/certs/health_hero_private.key` - mTLS 개인키 ⚠️
- [ ] `backend/certs/health_hero_public.crt` - mTLS 인증서 ⚠️
- [ ] `backend/.gitignore` - certs/ 폴더 제외
- [ ] `backend/scripts/encode-certs.ps1` - 인증서 인코딩 스크립트

### ✅ 프론트엔드

- [ ] `.env.local` - 환경 변수
- [ ] `src/hooks/useTossAuth.ts` - 토스 인증 로직
- [ ] `src/components/TossLoginButton.tsx` - 로그인 버튼
- [ ] `supabase/schema.sql` - 데이터베이스 스키마

---

## 🔒 보안 주의사항

### ⚠️ 절대 Git에 커밋하지 마세요!

- `backend/certs/` 폴더
- `.env.local` 파일
- mTLS 인증서 파일 (`.key`, `.crt`, `.pem`)

### ✅ .gitignore 확인

```gitignore
# backend/.gitignore
certs/
*.key
*.crt
*.pem

# 프로젝트 루트 .gitignore
.env.local
backend/certs/
```

---

## 💰 예상 비용

### Railway.app
- **무료 티어**: $5 크레딧/월
- 소규모 서비스에 충분
- 트래픽 증가 시 추가 요금

### Supabase
- **무료 티어**: 충분
  - Database: 500MB
  - API 요청: 무제한
  - 스토리지: 1GB

### 총 예상 비용
- **무료 ~ $5/월** (소규모)
- **$10 ~ $20/월** (중규모)

---

## 🐛 트러블슈팅

### 1. mTLS 인증서 에러

```
Error: unable to verify the first certificate
```

**해결**:
- Railway Dashboard → Variables에서 `TOSS_CERT_BASE64`, `TOSS_KEY_BASE64` 확인
- Base64 인코딩이 올바른지 확인
- 인증서 파일이 유효한지 확인

### 2. 백엔드 연결 실패

```
TypeError: Failed to fetch
```

**해결**:
- `.env.local`의 `NEXT_PUBLIC_BACKEND_URL` 확인
- Railway 서버가 실행 중인지 확인
- CORS 설정 확인

### 3. 토스 로그인 실패

```
Error: 앱인토스 환경에서만 사용할 수 있습니다
```

**해결**:
- 샌드박스 앱 또는 토스 앱에서만 테스트 가능
- 로컬 브라우저에서는 작동하지 않음
- `.ait` 파일을 업로드했는지 확인

---

## 📚 관련 문서

- [백엔드 서버 설정](docs/BACKEND_SETUP.md)
- [프로덕션 배포 상세](docs/PRODUCTION_DEPLOYMENT.md)
- [Supabase 배포 (참고용)](docs/SUPABASE_DEPLOYMENT.md)
- [환경 변수 설정](docs/ENV_SETUP.md)

---

## ✅ 배포 완료 후

### 1. 모니터링 설정
- Railway Dashboard에서 로그 확인
- Sentry 연동 (에러 추적)

### 2. 도메인 연결 (선택)
- Railway에서 커스텀 도메인 설정
- 또는 Cloudflare로 프록시

### 3. 프로덕션 전환
- 앱인토스 콘솔에서 프로덕션 배포
- 토스 앱 심사 신청

**축하합니다! 배포 완료!** 🎉


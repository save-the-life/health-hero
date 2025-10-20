# 🔐 보안 관련 FAQ

## Q1: Client ID와 Client Secret은 어떻게 관리해야 하나요?

### A: Client Secret은 사용하지 않습니다! ✅

현재 토스 로그인 구현에서는 **Client Secret을 사용하지 않습니다**.

#### 왜 안전한가요?

토스 앱인토스의 OAuth 플로우는 다음과 같이 설계되어 있습니다:

```typescript
// ✅ 현재 구현 (안전)
const response = await fetch('토스 API', {
  body: JSON.stringify({
    authorizationCode,  // 10분 유효, 1회용
    referrer           // 'sandbox' 또는 'DEFAULT'
  })
})
```

**보안 메커니즘:**
1. `authorizationCode`는 10분간만 유효
2. 1회만 사용 가능
3. 앱인토스 SDK를 통해서만 발급
4. 토스 앱 내부에서만 생성 가능

따라서 **Client Secret 없이도 충분히 안전**합니다!

---

## Q2: NEXT_PUBLIC_ 접두사가 붙은 환경 변수는 안전한가요?

### A: 네, 공개되어도 안전하도록 설계되었습니다 ✅

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- Row Level Security (RLS)로 보호됨
- 사용자는 자신의 데이터만 접근 가능
- 모든 테이블에 RLS 정책 적용

```sql
-- 예시: 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
```

#### NEXT_PUBLIC_TOSS_CLIENT_ID
- 공개되어도 안전
- 앱인토스 콘솔에 등록된 앱만 사용 가능
- 도메인 화이트리스트로 보호

---

## Q3: 토큰은 어디에 저장되나요?

### A: localStorage에 저장됩니다

```typescript
// src/utils/tokenManager.ts
localStorage.setItem('toss_access_token', accessToken)
localStorage.setItem('toss_refresh_token', refreshToken)
```

#### 보안 고려사항

**장점:**
- ✅ 앱 종료 후에도 로그인 유지
- ✅ 간단한 구현

**단점:**
- ⚠️ XSS 공격에 취약할 수 있음

**완화 방법:**
1. Next.js의 자동 XSS 방지 활용
2. Content Security Policy (CSP) 설정
3. 토큰 만료 시간 제한 (1시간)
4. 민감한 작업은 서버 사이드에서 처리

---

## Q4: Supabase 데이터는 어떻게 보호되나요?

### A: Row Level Security (RLS)로 보호됩니다 ✅

#### RLS 정책 예시

```sql
-- 사용자 프로필
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 로그인 기록
CREATE POLICY "Users can view own login logs" ON toss_login_logs
  FOR SELECT USING (auth.uid() = user_id);
```

**의미:**
- 사용자 A는 사용자 B의 데이터를 볼 수 없음
- `anon key`가 노출되어도 안전
- 모든 쿼리에 자동으로 적용

---

## Q5: 프로덕션 환경에서 추가로 해야 할 보안 설정은?

### A: 다음 항목들을 권장합니다

#### 1. HTTPS 강제
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
  }
}
```

#### 2. Content Security Policy (CSP)
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  connect-src 'self' https://apps-in-toss-api.toss.im https://*.supabase.co;
`
```

#### 3. 환경 변수 검증
```typescript
// src/lib/supabase.ts
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
```

#### 4. 토큰 갱신 자동화
- 백그라운드에서 자동 갱신
- 만료 5분 전 갱신
- 실패 시 자동 로그아웃

---

## Q6: 앱인토스 샌드박스와 프로덕션의 차이는?

### A: referrer 값이 다릅니다

```typescript
// 샌드박스
{ authorizationCode, referrer: 'sandbox' }

// 프로덕션 (토스앱)
{ authorizationCode, referrer: 'DEFAULT' }
```

**보안적 의미:**
- 샌드박스와 프로덕션 토큰이 분리됨
- 테스트 데이터와 실제 데이터 분리
- 각 환경에 맞는 Client ID 사용

---

## Q7: 민감한 정보는 어떻게 처리해야 하나요?

### A: 서버 사이드에서 처리하세요

**클라이언트에서 절대 하면 안 되는 것:**
- ❌ 결제 처리
- ❌ 관리자 권한 확인
- ❌ 민감한 데이터 조회

**서버 사이드에서 처리:**
- ✅ API Route (Next.js)
- ✅ Supabase Edge Functions
- ✅ Supabase RLS 정책

#### 예시: API Route

```typescript
// app/api/admin/route.ts (서버 사이드)
export async function GET(request: Request) {
  // 서버에서 토큰 검증
  const token = request.headers.get('Authorization')
  
  // 관리자 권한 확인
  const isAdmin = await checkAdminRole(token)
  
  if (!isAdmin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 민감한 데이터 반환
  return Response.json({ data: sensitiveData })
}
```

---

## Q8: XSS 공격은 어떻게 방지하나요?

### A: Next.js의 자동 방어 + 추가 조치

#### Next.js 자동 방어
```tsx
// ✅ 자동으로 이스케이프됨
<div>{user.name}</div>

// ⚠️ 위험: dangerouslySetInnerHTML 사용 자제
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

#### 추가 방어
1. **사용자 입력 검증**
```typescript
const sanitize = (input: string) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
```

2. **CSP 헤더 설정**
3. **토큰 HttpOnly 쿠키 사용 (선택)**

---

## Q9: 토큰이 탈취되면 어떻게 하나요?

### A: 다음 메커니즘으로 피해를 최소화합니다

#### 자동 만료
- Access Token: 1시간 후 자동 만료
- Refresh Token: 재발급으로 이전 토큰 무효화

#### 수동 무효화
```typescript
// 로그아웃 시 토큰 삭제
TokenManager.clearTokens()
await supabase.auth.signOut()
```

#### Supabase RLS
- 탈취된 토큰으로도 다른 사용자 데이터 접근 불가
- RLS 정책이 모든 쿼리에 자동 적용

---

## Q10: 보안 체크리스트

### 개발 단계
- [x] Client Secret 사용 안 함
- [x] 환경 변수 `.gitignore`에 포함
- [x] `NEXT_PUBLIC_` 접두사 올바르게 사용
- [x] Supabase RLS 활성화
- [x] 토큰 만료 시간 설정

### 프로덕션 배포 전
- [ ] HTTPS 강제
- [ ] CSP 헤더 설정
- [ ] 환경 변수 배포 플랫폼에서 관리
- [ ] 에러 로깅 설정
- [ ] 토큰 자동 갱신 테스트

### 운영 중
- [ ] 로그인 기록 모니터링
- [ ] 의심스러운 활동 감지
- [ ] 정기적인 보안 업데이트
- [ ] 토큰 갱신 성공률 모니터링

---

## 📚 추가 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js 보안 가이드](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Supabase 보안 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [토스 앱인토스 보안 가이드](https://developers-apps-in-toss.toss.im/)

---

**Last Updated**: 2024-01-20  
**보안 검토**: 통과 ✅


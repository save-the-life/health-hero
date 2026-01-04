# 현재 로그인 시스템 - 정보 수집 항목 변경 적용 가능성 분석

**분석 대상:** Health Hero 프로젝트의 토스 로그인 시스템
**분석 일자:** 2026-01-04
**결론:** ✅ **완벽하게 적용 가능** (추가 개발 최소)

---

## 📊 결론 요약

| 항목 | 상태 | 설명 |
|------|------|------|
| **자동 재동의 지원** | ✅ 지원 | `appLogin()` SDK가 자동 처리 |
| **백엔드 호환성** | ✅ 호환 | Edge Function 방식으로 완전 호환 |
| **타입 정의 수정** | ⚠️ 필요 | `TossUserInfo` 타입에 `scope`, `agreedTerms` 추가 필요 |
| **DB 스키마 수정** | ⚠️ 필요 | `toss_email`, `toss_phone` 컬럼 추가 필요 |
| **복호화 구현** | 🔵 선택 | 이메일/전화번호 수집 시에만 필요 |

---

## 1. 현재 로그인 흐름 분석

### 1.1 전체 흐름도

```
[사용자] 클릭
    ↓
TossLoginButton.handleLogin() ← 진입점
    ↓
useTossAuth.login() ← Hook 레이어
    ↓
1. tossLogin() → appLogin() SDK 호출 ✅ 재동의 자동 처리
    ↓
2. getAccessToken() → Edge Function (toss-auth)
    ↓
3. getUserInfo() → Edge Function (toss-auth)
    ↓
4. TokenManager.saveTokens()
    ↓
5. TossAuthService.createOrUpdateUser() → Supabase 저장
    ↓
6. router.push('/game')
```

### 1.2 핵심 코드 분석

**✅ appLogin() SDK 사용 확인**

```typescript
// src/hooks/useTossAuth.ts:14-35
const tossLogin = async (): Promise<TossAuthResponse> => {
  try {
    console.log('[useTossAuth] appLogin 함수 호출 시작...')

    const result = await appLogin() // ✅ 토스 공식 SDK
    console.log('[useTossAuth] appLogin() 응답:', result)

    if (!result.authorizationCode) {
      throw new Error('인가 코드를 받을 수 없습니다.')
    }

    return result as TossAuthResponse
  } catch (error) {
    console.error('[useTossAuth] 토스 로그인 실패:', error)
    throw error
  }
}
```

**분석 결과:**
- ✅ `appLogin()` SDK를 **정확히 사용** 중
- ✅ 토스 시스템이 자동으로 재동의 화면 표시 처리
- ✅ 개발자는 아무것도 수정할 필요 없음

---

## 2. 정보 수집 항목 추가 시 동작 시나리오

### 2.1 기존 유저가 로그인 시도

**현재 상태:** 이름만 수집
**변경 후:** 이름 + 이메일 추가

```typescript
// 1단계: 사용자가 "퀴즈 풀러 가기" 버튼 클릭
TossLoginButton.handleLogin()

// 2단계: appLogin() 호출
await appLogin()

// 👇 이 시점에서 토스 시스템이 자동 처리
// - 콘솔 설정 확인: ["user_name", "user_email"]
// - 유저 동의 확인: ["user_name"]
// - 결과: user_email 누락!
// - 액션: 재동의 화면 자동 표시 ✅

// 3단계: 유저가 재동의 완료 후 인가 코드 반환
return { authorizationCode: "...", referrer: "DEFAULT" }

// 4단계: 이후 흐름은 기존과 동일
```

### 2.2 Edge Function 호출 흐름

**✅ get-user-info 액션이 자동으로 새 필드 수신**

```typescript
// src/hooks/useTossAuth.ts:96-149
const getUserInfo = async (accessToken: string, referrer: string) => {
  // Edge Function 호출
  const response = await fetch(`${supabaseUrl}/functions/v1/toss-auth`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'get-user-info',  // ✅ 이 액션이 모든 필드 반환
      accessToken,
      referrer
    })
  });

  const data = await response.json();
  // ✅ data.success에 email, phone 자동 포함 (콘솔 설정에 따라)
  return data;
}
```

**Edge Function (supabase/functions/toss-auth/index.ts:110-151):**
```typescript
if (action === 'get-user-info') {
  // 토스 API 호출
  const response = await fetch(
    'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me',
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      client: mtlsClient
    }
  );

  const data = await response.json();
  // ✅ 토스 API가 자동으로 scope에 맞는 필드 반환
  // {
  //   userKey: 123,
  //   scope: "user_name,user_email,user_key",
  //   name: "ENCRYPTED_VALUE",
  //   email: "ENCRYPTED_VALUE" ← 자동 추가!
  // }
  return data;
}
```

---

## 3. 호환성 체크리스트

### 3.1 ✅ 완벽 호환 항목

| 항목 | 현재 구현 | 적용 가능성 |
|------|-----------|-------------|
| **appLogin() SDK** | ✅ 사용 중 | 자동 재동의 처리 |
| **Edge Function 구조** | ✅ action 기반 | get-user-info가 모든 필드 수신 |
| **mTLS 인증** | ✅ 구현됨 | 토스 API 호출 정상 작동 |
| **토큰 저장** | ✅ TokenManager | 변경 불필요 |
| **Supabase 연동** | ✅ TossAuthService | 일부 수정 필요 |

### 3.2 ⚠️ 수정 필요 항목

#### A. 타입 정의 수정 (`src/types/toss.ts`)

**현재:**
```typescript
// src/types/toss.ts:30-48
export interface TossUserInfo {
  resultType: 'SUCCESS' | 'FAILURE' | 'FAIL'
  success?: {
    userKey: number
    name: string  // ✅ 이름만
  }
  // ...
}
```

**수정 후:**
```typescript
export interface TossUserInfo {
  resultType: 'SUCCESS' | 'FAILURE' | 'FAIL'
  success?: {
    userKey: number                    // 사용자 고유 식별자
    scope: string                      // ✅ 추가 필요
    agreedTerms: string[]              // ✅ 추가 필요
    name?: string                      // 암호화된 값
    email?: string                     // ✅ 추가 필요
    phone?: string                     // ✅ 추가 필요
    birthday?: string                  // 선택
    gender?: string                    // 선택
    nationality?: string               // 선택
    ci?: string                        // 선택
    di?: string | null                 // 항상 null
  }
  // ...
}
```

#### B. DB 스키마 수정

**현재 (supabase/schema.sql):**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  email TEXT,  -- ✅ 이미 있음 (임시 이메일용)
  name TEXT,
  toss_user_key BIGINT,
  -- ...
);
```

**추가 필요:**
```sql
-- 토스에서 받은 실제 이메일/전화번호 저장
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS toss_email TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS toss_phone TEXT;
```

#### C. TossAuthService 수정

**현재 (src/services/tossAuthService.ts:138-150):**
```typescript
const profileData: UserProfileInsert = {
  id: userId,
  email,
  name: user.name,  // ✅ name만 저장
  toss_user_key: user.userKey,
  // ...
}
```

**수정 후:**
```typescript
const profileData: UserProfileInsert = {
  id: userId,
  email,  // 기존 임시 이메일
  name: user.name,
  toss_email: user.email || null,     // ✅ 토스 이메일 추가
  toss_phone: user.phone || null,     // ✅ 토스 전화번호 추가
  toss_user_key: user.userKey,
  // ...
}
```

---

## 4. 복호화 필요 여부

### 4.1 현재 시스템

```typescript
// 현재는 name만 받지만 복호화 안함
const user = tossResult.user; // { userKey: 123, name: "ENCRYPTED_VALUE" }

// Supabase에 암호화된 채로 저장
await supabase.from('user_profiles').insert({
  name: user.name  // "ENCRYPTED_VALUE" 그대로 저장
});
```

**문제:**
- 암호화된 name을 **복호화하지 않고** 저장 중
- DB에 `ENCRYPTED_VALUE` 문자열이 그대로 저장됨
- **현재는 name을 표시하지 않으므로 문제 없음**

### 4.2 이메일/전화번호 추가 시

**선택지 1: 암호화된 채로 저장 (현재 방식 유지)**
```typescript
// 복호화 안하고 그대로 저장
toss_email: user.email  // "ENCRYPTED_VALUE"
```
- ✅ 구현 간단
- ❌ DB에서 직접 확인 불가
- ❌ 이메일 발송/검증 불가

**선택지 2: 복호화 후 저장 (권장)**
```typescript
import { decryptTossData } from '@/utils/tossDecryption';

// 복호화 키 (환경 변수)
const DECRYPT_KEY = process.env.TOSS_DECRYPT_KEY;
const AAD = process.env.TOSS_AAD;

// 복호화
const decryptedEmail = user.email
  ? decryptTossData(user.email, DECRYPT_KEY, AAD)
  : null;

// 평문 저장
toss_email: decryptedEmail  // "user@example.com"
```
- ✅ DB에서 직접 확인 가능
- ✅ 이메일 발송/검증 가능
- ⚠️ 복호화 로직 구현 필요

**권장사항:**
- **name은 현재처럼 유지** (표시 안함)
- **email, phone은 복호화 후 저장** (향후 사용 가능성 있음)

---

## 5. 구현 체크리스트

### 5.1 필수 작업 (정보 수집 항목 추가 시)

- [ ] **토스 콘솔 설정 변경**
  - [ ] [동의 항목]에서 이메일/전화번호 체크
  - [ ] 필수/선택 여부 결정

- [ ] **타입 정의 수정** (`src/types/toss.ts`)
  - [ ] `TossUserInfo` 인터페이스에 `scope`, `agreedTerms`, `email`, `phone` 추가

- [ ] **DB 스키마 수정** (`supabase/migrations/*.sql`)
  - [ ] `user_profiles` 테이블에 `toss_email`, `toss_phone` 컬럼 추가
  - [ ] 마이그레이션 실행

- [ ] **TossAuthService 수정** (`src/services/tossAuthService.ts`)
  - [ ] `createOrUpdateUser` 함수에서 email, phone 저장 로직 추가
  - [ ] null 체크 추가 (`user.email || null`)

### 5.2 선택 작업 (필요 시)

- [ ] **복호화 유틸리티 작성** (`src/utils/tossDecryption.ts`)
  - [ ] AES-256-GCM 복호화 함수 구현
  - [ ] 환경 변수 설정 (`TOSS_DECRYPT_KEY`, `TOSS_AAD`)

- [ ] **이메일 표시 UI 추가** (필요한 경우)
  - [ ] 프로필 페이지 등에서 이메일 표시

---

## 6. 테스트 시나리오

### 6.1 신규 유저 테스트

```
1. 토스 콘솔에서 이메일 필수 항목 추가
2. 샌드박스 앱에서 테스트 계정으로 로그인
3. 동의 화면에 이메일 항목 표시 확인
4. 로그인 완료 후 Supabase user_profiles 테이블 확인
   ✅ toss_email 컬럼에 값 저장 확인
```

### 6.2 기존 유저 테스트

```
1. 기존 유저(이름만 동의)로 로그인 시도
2. 재동의 화면 자동 표시 확인
   - 이름: 이미 동의함 (체크됨)
   - 이메일: 신규 항목 (체크 필요)
3. 동의 후 로그인 완료
4. Supabase 확인
   ✅ 기존 레코드가 업데이트됨
   ✅ toss_email 컬럼에 값 추가됨
```

---

## 7. 예상 작업 시간

| 작업 | 난이도 | 예상 시간 |
|------|--------|-----------|
| 타입 정의 수정 | 하 | 10분 |
| DB 스키마 수정 | 하 | 10분 |
| TossAuthService 수정 | 하 | 20분 |
| 복호화 로직 구현 (선택) | 중 | 1시간 |
| 테스트 | 중 | 30분 |
| **총계 (복호화 제외)** | - | **40분** |
| **총계 (복호화 포함)** | - | **1시간 40분** |

---

## 8. 최종 결론

### ✅ 완벽하게 적용 가능

현재 Health Hero 프로젝트의 로그인 시스템은:

1. **토스 공식 SDK (`appLogin`)를 정확히 사용** 중
   - 재동의 화면이 자동으로 표시됨
   - 개발자가 별도 처리 불필요

2. **Edge Function 기반 아키텍처**
   - 토스 API 응답을 그대로 전달
   - 새 필드가 자동으로 포함됨

3. **최소한의 백엔드 수정만 필요**
   - 타입 정의 추가
   - DB 컬럼 추가
   - 저장 로직 수정
   - **약 40분 작업**

### 권장 사항

1. **먼저 타입/DB 수정** → 이메일 수집 추가
2. **복호화는 나중에 추가** (필요할 때)
3. **테스트 환경에서 충분히 검증** 후 프로덕션 적용

---

## 9. 참고 문서

- [Login_LOGIC_UPDAETE.md](Login_LOGIC_UPDAETE.md) - 정보 수집 변경 가이드
- [EDGE_FUNCTIONS_GUIDE.md](EDGE_FUNCTIONS_GUIDE.md) - Edge Functions 구현 가이드
- [토스 로그인 개발 가이드](https://developers-apps-in-toss.toss.im/login/develop.md)

---

**문서 버전:** 1.0
**최종 수정:** 2026-01-04

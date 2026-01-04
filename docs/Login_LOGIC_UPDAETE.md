# 토스 로그인 연동 가이드: 수집 정보 변경 및 콜백 처리

본 문서는 **Health Hero (헬스 히어로)** 프로젝트의 토스 로그인 연동 시, 수집 정보 확대에 따른 정책 및 '연결 끊기' 콜백 구현(Supabase) 방법을 정리한 문서입니다.

## 현재 시스템 구조

- **인증 서비스**: `src/services/tossAuthService.ts`
- **타입 정의**: `src/types/toss.ts`
- **DB 스키마**: `supabase/schema.sql`
- **테이블명**: `user_profiles` (문서 예시의 `profiles`가 아님)
- **Edge Functions**: `supabase/functions/`

---

## 1. 개인정보 수집 항목 추가 시 정책

현재 '이름'만 수집 중인 상태에서 **이메일** 혹은 **전화번호**를 추가 수집할 경우의 동작 방식입니다.

### 1.1 동작 메커니즘

토스 로그인은 앱이 요구하는 **필수 권한(Scope)**과 유저가 **기 동의한 권한**을 비교합니다.

- **변경 사항:** 개발자 콘솔에서 `이메일` 또는 `전화번호`를 **[필수]** 항목으로 설정.
- **기존 유저 동작:**
  1. 기존 유저(이름만 동의함)가 로그인을 시도 (`appLogin`).
  2. 토스 시스템이 새로운 필수 권한(이메일 등)이 누락되었음을 감지.
  3. **제3자 정보 제공 동의 창이 자동으로 재노출됨.**
  4. 유저가 추가 항목에 동의해야만 로그인이 완료됨.

### 1.2 개발 대응 사항

1. **Scope 처리:** 사용자 정보 조회 API 응답 내 `scope` 필드에 새로 추가된 항목이 포함되는지 확인.
   - 공식 scope 명칭: `user_name`, `user_email`, `user_phone`, `user_gender`, `user_birthday`, `user_nationality`, `user_ci`
   - **2026년 1월 2일부터 `user_key` 항목이 scope에 추가됨** (공식 문서 참고)
2. **복호화 로직 업데이트:**
   - `email`, `phone` 필드 또한 `name`과 마찬가지로 **암호화된 값(`ENCRYPTED_VALUE`)**으로 전달됨.
   - **AES-256-GCM** 복호화 필요 (복호화 키는 토스 콘솔에서 이메일로 발급)
   - **AAD(Additional Authenticated Data)** 값도 함께 필요 (이메일로 전달됨)
3. **이메일 필드 주의사항:**
   - 토스 가입 시 이메일은 필수가 아니므로 **값이 없을 수 있음 (null 반환)**
   - 점유 인증을 하지 않은 값임

### 1.3 타입 정의 수정 (`src/types/toss.ts`)

공식 문서의 사용자 정보 응답 스펙에 맞게 타입 수정 필요:

```typescript
// 현재 타입 (이름만)
export interface TossUserInfo {
  resultType: 'SUCCESS' | 'FAILURE' | 'FAIL'
  success?: {
    userKey: number
    name: string
  }
  // ...
}

// 수정 후 타입 (공식 문서 스펙 반영)
export interface TossUserInfo {
  resultType: 'SUCCESS' | 'FAILURE' | 'FAIL'
  success?: {
    userKey: number                    // 사용자 고유 식별자 (암호화 안됨)
    scope: string                      // 인가된 scope 목록 (예: "user_name,user_email,user_key")
    agreedTerms: string[]              // 사용자가 동의한 약관 목록
    name?: string                      // 암호화된 값 (복호화 필요)
    email?: string                     // 암호화된 값 (복호화 필요, null 가능)
    phone?: string                     // 암호화된 값 (복호화 필요)
    birthday?: string                  // 암호화된 값 (yyyyMMdd 형식)
    gender?: string                    // 암호화된 값 (MALE/FEMALE)
    nationality?: string               // 암호화된 값 (LOCAL/FOREIGNER)
    ci?: string                        // 암호화된 값 (Connection Information)
    di?: string | null                 // 항상 null로 반환됨
  }
  failure?: {
    errorCode: string
    errorMessage: string
  }
  error?: {
    errorCode: string
    reason: string
  }
}
```

### 1.4 복호화 로직 구현 (필요 시)

토스에서 제공하는 복호화 키와 AAD를 사용하여 AES-256-GCM 복호화 구현:

```typescript
// 복호화 예시 (Node.js/Edge Function용)
import * as crypto from 'crypto';

function decryptTossData(
  encryptedText: string,
  base64EncodedAesKey: string,
  aad: string
): string {
  const IV_LENGTH = 12;
  const decoded = Buffer.from(encryptedText, 'base64');
  const keyByteArray = Buffer.from(base64EncodedAesKey, 'base64');

  const iv = decoded.subarray(0, IV_LENGTH);
  const ciphertext = decoded.subarray(IV_LENGTH, decoded.length - 16);
  const authTag = decoded.subarray(decoded.length - 16);

  const decipher = crypto.createDecipheriv('aes-256-gcm', keyByteArray, iv);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(aad));

  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}
```

### 1.5 DB 스키마 수정 (`supabase/schema.sql`)

이메일/전화번호 저장 시 컬럼 추가 필요:

```sql
-- user_profiles 테이블에 추가
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS toss_email TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS toss_phone TEXT;
```

---

## 2. 연결 끊기 콜백 (Callback URL) 구현

사용자가 토스 앱 설정에서 직접 연결을 해제할 경우, 우리 서비스(Supabase DB)의 데이터를 동기화하기 위한 구현입니다.

### 2.1 연결 끊기 이벤트 경로 (공식 문서)

사용자가 토스앱에서 로그인 연결을 해제하는 경로는 **3가지**이며, `referrer` 값으로 구분됩니다:

| referrer | 설명 | 경로 |
|----------|------|------|
| `UNLINK` | 사용자가 **앱에서 직접 연결을 끊었을 때** | 토스앱 → 설정 → 인증 및 보안 → 토스로 로그인한 서비스 → '연결 끊기' |
| `WITHDRAWAL_TERMS` | 사용자가 **로그인 서비스 약관을 철회할 때** | 토스앱 → 설정 → 법적 정보 및 기타 → 약관 및 개인정보 처리 동의 → 서비스별 동의 내용 : "토스 로그인" → '동의 철회하기' |
| `WITHDRAWAL_TOSS` | 사용자가 **토스 회원을 탈퇴할 때** | 토스앱 회원 탈퇴 |

> **주의:** 서비스에서 직접 로그인 연결 끊기 API(`/remove-by-access-token`, `/remove-by-user-key`)를 호출한 경우에는 **콜백이 호출되지 않습니다.**

### 2.2 아키텍처 정보

- **서버 환경:** Supabase Edge Functions
- **HTTP 메서드:** `GET` 또는 `POST` (콘솔에서 선택)
- **보안:** Basic Auth 헤더 검증 (base64 인코딩됨, 디코딩 후 검증 필요)

### 2.3 콜백 요청 형식 (공식 문서)

**POST 방식 (권장):**
```json
// 요청 body
{
  "userKey": 443731103,
  "referrer": "UNLINK"
}
```

**GET 방식:**
```
GET $callback_url?userKey=443731103&referrer=UNLINK
```

### 2.4 DB 스키마 추가 (사전 작업)

연결 끊기 상태를 저장하기 위해 `user_profiles` 테이블에 컬럼 추가 필요:

```sql
-- supabase/migrations/add_unlink_columns.sql
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS unlinked_at TIMESTAMP WITH TIME ZONE;

-- 인덱스 추가 (연결 끊긴 유저 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
```

### 2.5 구현 코드 (`supabase/functions/toss-unlink/index.ts`)

> **Pre-requisite:**
>
> 1. `supabase functions new toss-unlink` 명령어로 함수 생성.
> 2. `user_profiles` 테이블에 `toss_user_key`, `status`, `unlinked_at` 컬럼이 존재해야 함.

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS 헤더 (기존 toss-auth 함수와 동일 패턴)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight 처리
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 1. Method 검증
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  // 2. 보안: Basic Auth 헤더 검증 (공식 문서: base64로 인코딩되어 전달됨)
  const authHeader = req.headers.get("Authorization");
  const TOSS_SECRET = Deno.env.get("TOSS_CALLBACK_SECRET");

  if (TOSS_SECRET) {
    // Basic Auth 헤더에서 credentials 추출 및 base64 디코딩
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const base64Credentials = authHeader.slice(6); // "Basic " 제거
      const decodedCredentials = atob(base64Credentials);

      // 디코딩된 값이 TOSS_CALLBACK_SECRET과 일치하는지 확인
      if (decodedCredentials !== TOSS_SECRET && !decodedCredentials.includes(TOSS_SECRET)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  try {
    // 3. 요청 데이터 파싱
    const { userKey, referrer } = await req.json();
    console.log(`[Toss Unlink] UserKey: ${userKey}, Referrer: ${referrer}`);

    // 4. Supabase Admin 클라이언트 초기화
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 5. 유저 검색 (toss_user_key 기준) - Health Hero는 user_profiles 테이블 사용
    const { data: user, error: findError } = await supabaseAdmin
      .from("user_profiles")  // ⚠️ 테이블명: user_profiles (profiles 아님)
      .select("id, email")
      .eq("toss_user_key", userKey)
      .single();

    if (findError || !user) {
      console.warn("User not found or already unlinked.");
      return new Response(
        JSON.stringify({ result: "User not found but handled" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // 6. 연결 끊기 처리 (DB 업데이트)
    const { error: updateError } = await supabaseAdmin
      .from("user_profiles")  // ⚠️ 테이블명: user_profiles
      .update({
        toss_user_key: null,
        toss_access_token: null,
        toss_refresh_token: null,
        toss_token_expires_at: null,
        status: "unlinked",
        unlinked_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // 7. 연결 끊기 로그 기록
    await supabaseAdmin
      .from("toss_login_logs")
      .insert({
        user_id: user.id,
        toss_user_key: userKey,
        referrer: referrer || "UNLINK_CALLBACK",
        user_agent: "Toss Unlink Callback"
      });

    console.log(`User ${user.id} unlinked successfully.`);

    // 8. 성공 응답
    return new Response(JSON.stringify({ result: "Success" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing unlink:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

### 2.6 배포 및 설정 순서

1. **DB 마이그레이션 실행:**
   ```bash
   # Supabase Dashboard SQL Editor에서 실행 또는
   supabase db push
   ```

2. **Edge Function 생성 및 배포:**
   ```bash
   supabase functions new toss-unlink
   supabase functions deploy toss-unlink
   ```

3. **환경변수 설정 (Supabase Dashboard > Settings > Edge Functions):**
   - `TOSS_CALLBACK_SECRET`: 토스 콘솔에 입력할 임의의 비밀키 (예: `health_hero_unlink_secret_2024`)
   - `SUPABASE_URL`: 자동 설정됨
   - `SUPABASE_SERVICE_ROLE_KEY`: 자동 설정됨

4. **토스 개발자 콘솔 설정:**
   - **메뉴:** [연결 끊기 콜백 정보]
   - **HTTP 메서드:** `POST`
   - **콜백 URL:** `https://uasphzqbluxctnukoazy.supabase.co/functions/v1/toss-unlink`
   - **Basic Auth 헤더:** 위 환경변수(`TOSS_CALLBACK_SECRET`)에 설정한 값 입력

---

## 3. 체크리스트

### DB 스키마
- [ ] `user_profiles` 테이블에 `toss_user_key` 컬럼이 존재하는가? ✅ (이미 존재)
- [ ] `user_profiles` 테이블에 `status` 컬럼이 추가되었는가?
- [ ] `user_profiles` 테이블에 `unlinked_at` 컬럼이 추가되었는가?

### Edge Function
- [ ] `supabase/functions/toss-unlink/index.ts` 파일이 생성되었는가?
- [ ] Edge Function이 Supabase에 배포되었는가?

### 환경 변수
- [ ] Supabase Function Secrets에 `TOSS_CALLBACK_SECRET`이 등록되었는가?

### 토스 콘솔
- [ ] 토스 개발자 센터에 콜백 URL이 정확히 입력되었는가?
- [ ] Basic Auth 값이 `TOSS_CALLBACK_SECRET`과 일치하는가?

### 테스트
- [ ] 실제 앱에서 토스 로그인 수행 후, 토스 앱 설정에서 연결 끊기 시 Supabase 로그에 정상 기록되는가?
- [ ] 연결 끊기 후 `user_profiles.status`가 `unlinked`로 변경되는가?
- [ ] 연결 끊기 후 `toss_user_key`, `toss_access_token` 등이 `null`로 변경되는가?

---

## 4. 관련 파일 목록

| 파일 | 용도 |
|------|------|
| `src/services/tossAuthService.ts` | 토스 로그인 처리 서비스 |
| `src/types/toss.ts` | 토스 API 타입 정의 |
| `supabase/schema.sql` | user_profiles 테이블 스키마 |
| `supabase/functions/toss-auth/index.ts` | 토스 토큰 교환 Edge Function |
| `supabase/functions/toss-unlink/index.ts` | 연결 끊기 콜백 Edge Function (신규) |

---

## 5. 현재 시스템 분석 결과

### 5.1 구현 완료 항목

| 항목 | 상태 | 비고 |
|------|------|------|
| Toss OAuth 2.0 로그인 | ✅ 완료 | `appLogin` → `generate-token` → `login-me` |
| mTLS 인증서 기반 API 호출 | ✅ 완료 | Edge Function에서 처리 |
| AccessToken 발급 | ✅ 완료 | `/oauth2/generate-token` |
| 사용자 정보 조회 | ✅ 완료 | `/oauth2/login-me` |
| 토큰 저장 | ✅ 완료 | `user_profiles` 테이블 |

### 5.2 미구현/개선 필요 항목

| 항목 | 상태 | 우선순위 |
|------|------|----------|
| 연결 끊기 콜백 | ❌ 미구현 | 🔴 높음 |
| AccessToken 재발급 (refresh) | ❌ 미구현 | 🟡 중간 |
| 사용자 정보 복호화 | ❌ 미구현 | 🟡 중간 (필요 시) |
| 로그인 끊기 API 호출 | ❌ 미구현 | 🟢 낮음 |
| `scope`, `agreedTerms` 필드 처리 | ⚠️ 타입 미반영 | 🟡 중간 |

### 5.3 API 엔드포인트 정리 (공식 문서 기준)

| 기능 | Method | URL | 구현 상태 |
|------|--------|-----|-----------|
| AccessToken 발급 | POST | `/api-partner/v1/apps-in-toss/user/oauth2/generate-token` | ✅ |
| AccessToken 재발급 | POST | `/api-partner/v1/apps-in-toss/user/oauth2/refresh-token` | ❌ |
| 사용자 정보 조회 | GET | `/api-partner/v1/apps-in-toss/user/oauth2/login-me` | ✅ |
| 로그인 끊기 (토큰) | POST | `/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token` | ❌ |
| 로그인 끊기 (userKey) | POST | `/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key` | ❌ |

---

## 6. 공식 문서 참조

- [토스 로그인 이해하기](https://developers-apps-in-toss.toss.im/login/intro.md)
- [토스 로그인 콘솔 가이드](https://developers-apps-in-toss.toss.im/login/console.md)
- [토스 로그인 개발하기](https://developers-apps-in-toss.toss.im/login/develop.md)

### 주요 참고 사항

1. **인가코드 유효시간**: 10분
2. **AccessToken 유효시간**: 1시간
3. **RefreshToken 유효시간**: 14일
4. **복호화 알고리즘**: AES-256-GCM (키 길이 256비트)
5. **2026년 1월 2일**: `scope`에 `user_key` 항목 추가 예정

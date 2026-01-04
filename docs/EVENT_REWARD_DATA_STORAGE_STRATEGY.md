# 이벤트 상품 전달을 위한 사용자 정보 저장 전략

**목적:** 사용자가 특정 이벤트를 성공하면 상품(경품)을 전달하기 위해 이메일/휴대전화 정보를 수집
**분석 일자:** 2026-01-04
**최종 업데이트:** 2026-01-04

---

## 🎯 최종 결론 (업데이트)

### 상품 유형별 권장 전략

| 상품 유형 | 필요 정보 | 토스 정보 활용 | 권장 방식 |
|-----------|-----------|----------------|-----------|
| **디지털 상품** (쿠폰, 포인트) | 이메일/전화 | 🟡 신중히 | 별도 수집 권장 |
| **물리적 상품** (스마트 워치) | 배송지 주소 | ✅ **적극 활용** | **링크 발송 방식 (베스트)** |

### 🌟 물리적 상품의 경우: 링크 발송 방식이 베스트!

```
1. 이벤트 달성 → "배송지 입력 안내를 보내드립니다" 모달
2. 토스 이메일/전화로 링크 발송 (DB 저장 안함)
3. 사용자가 링크 클릭 → 배송지만 별도 입력
4. 배송 처리
5. 배송 완료 후 30일 뒤 정보 자동 삭제
```

**장점:**
- ✅ 토스 이메일/전화를 DB에 저장하지 않음 (최소 수집)
- ✅ 계약 이행 목적으로 활용 가능 (법적 안정성)
- ✅ 배송지만 별도 동의 받아 저장
- ✅ 사용자가 정확한 배송지 직접 입력
- ✅ 일회용 토큰 링크로 보안 강화

---

## 1. 개인정보 보호법 관점

### 1.1 개인정보 수집 원칙

**개인정보 보호법 제15조 (개인정보의 수집·이용)**
```
개인정보처리자는 다음 각 호의 어느 하나에 해당하는 경우에는
개인정보를 수집할 수 있으며 그 수집 목적의 범위에서 이용할 수 있다.

1. 정보주체의 동의를 받은 경우
2. 법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우
3. 공공기관이 법령 등에서 정하는 소관 업무의 수행을 위하여 불가피한 경우
4. 정보주체와의 계약의 체결 및 이행을 위하여 불가피하게 필요한 경우
```

### 1.2 목적 외 사용 금지

**핵심 원칙:**
- 수집 시 명시한 **목적 범위 내**에서만 사용 가능
- 목적이 변경되면 **재동의** 필요

**토스 로그인 약관 예시:**
```
[제3자 정보 제공 동의]
- 제공받는 자: Health Hero (헬스 히어로)
- 제공 목적: 서비스 이용, 본인 확인
- 제공 항목: 이름, 이메일
```

→ **"이벤트 상품 배송"은 명시되지 않음** ⚠️

---

## 2. 문제점 분석

### 2.1 토스 로그인 정보 활용 시 문제

| 문제 | 설명 | 법적 리스크 |
|------|------|------------|
| **목적 외 사용** | 로그인 목적 ≠ 상품 배송 목적 | 🔴 높음 |
| **동의 범위 초과** | 토스 동의는 "서비스 이용"용 | 🔴 높음 |
| **정보 정확성** | 토스 이메일은 점유 인증 안됨 | 🟡 중간 |
| **배송 불가 시** | 사용자에게 추가 정보 요청 불가 | 🟡 중간 |

**예시 시나리오:**
```
1. 사용자가 토스 로그인 시 이메일 동의 (목적: 서비스 이용)
2. 이벤트 달성 후 토스 이메일로 상품 발송
3. 사용자: "나는 상품 배송 동의 안했는데?" ← 민원 발생
4. 법적 분쟁 가능성 ⚠️
```

### 2.2 토스 이메일의 특수성

**공식 문서 경고:**
> 이메일은 토스 가입 시 필수가 아니므로 **값이 없을 수 있음 (null 반환)**
> **점유 인증을 하지 않은 값임**

**문제점:**
```typescript
// 토스에서 받은 이메일
toss_email: "user@example.com"

// 하지만...
1. 실제 소유 여부 확인 안됨 (점유 인증 X)
2. 오타 가능성 (가입 시 직접 입력)
3. null일 수 있음
```

→ **상품 배송용으로 부적합** ⚠️

---

## 3. 권장 저장 방식

> **⚠️ 중요 업데이트:**
> 물리적 상품(스마트 워치 등)의 경우, **"링크 발송 방식"**이 베스트입니다.
> 상세 내용은 [PHYSICAL_REWARD_DELIVERY_STRATEGY.md](PHYSICAL_REWARD_DELIVERY_STRATEGY.md) 참고

### 3.1 물리적 상품: 링크 발송 방식 (베스트) ⭐

**event_winners 테이블 사용**

```sql
CREATE TABLE event_winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 이벤트 정보
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  reward_type TEXT NOT NULL,

  -- 당첨 정보
  won_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_sent_at TIMESTAMP WITH TIME ZONE,

  -- 배송지 입력 링크
  shipping_token TEXT UNIQUE,
  shipping_link_expires_at TIMESTAMP WITH TIME ZONE,

  -- 배송 정보 (사용자가 별도 입력) ⬅️ 이것만 저장
  recipient_name TEXT,
  recipient_phone TEXT,
  shipping_address TEXT,
  shipping_zipcode TEXT,

  -- 배송지 입력 동의
  shipping_consent_at TIMESTAMP WITH TIME ZONE,
  shipping_consent_ip INET,

  -- 배송 상태
  status TEXT DEFAULT 'pending',

  UNIQUE(user_id, event_id)
);
```

**핵심:**
- ❌ 토스 이메일/전화번호는 DB에 저장 안함
- ✅ 배송지 주소만 별도 동의 받아 저장
- ✅ 일회용 토큰 링크로 보안 강화

### 3.2 디지털 상품: 별도 테이블 생성 (강력 권장)

**새 테이블: `event_reward_contacts`**

```sql
-- 이벤트 상품 전달용 연락처 테이블
CREATE TABLE event_reward_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 연락 정보
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone')),
  contact_value TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,           -- 인증 여부

  -- 수집 동의 정보
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consent_purpose TEXT DEFAULT 'event_reward_delivery',  -- 수집 목적
  consent_ip INET,                             -- 동의한 IP
  consent_user_agent TEXT,                     -- 동의한 환경

  -- 이벤트 정보
  event_id TEXT,                               -- 어떤 이벤트인지
  event_name TEXT,                             -- 이벤트명

  -- 상품 배송 정보
  reward_status TEXT DEFAULT 'pending' CHECK (reward_status IN (
    'pending',      -- 대기 중
    'processing',   -- 처리 중
    'delivered',    -- 전달 완료
    'failed'        -- 실패
  )),
  reward_type TEXT,                            -- 상품 종류
  reward_delivered_at TIMESTAMP WITH TIME ZONE,
  delivery_note TEXT,                          -- 배송 메모

  -- 감사 로그
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 유니크 제약 (중복 방지)
  UNIQUE(user_id, event_id)
);

-- 인덱스
CREATE INDEX idx_event_reward_contacts_user_id ON event_reward_contacts(user_id);
CREATE INDEX idx_event_reward_contacts_event_id ON event_reward_contacts(event_id);
CREATE INDEX idx_event_reward_contacts_status ON event_reward_contacts(reward_status);

-- RLS 정책
ALTER TABLE event_reward_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contacts" ON event_reward_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts" ON event_reward_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3.2 UI 흐름 (별도 수집)

```
[사용자가 이벤트 달성]
   ↓
[축하 메시지 표시]
"🎉 이벤트를 달성했습니다!"
   ↓
[상품 수령 모달]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  상품 수령을 위한 정보 입력

  상품: [경품명]

  ☐ 이메일로 받기
    📧 이메일: [          ]
    [인증번호 받기] 버튼
    인증번호: [      ]

  ☐ 휴대전화로 받기
    📱 전화번호: [          ]
    [인증번호 받기] 버튼
    인증번호: [      ]

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ☑ [필수] 상품 전달을 위한 개인정보 수집·이용 동의
      (수집 항목: 이메일 또는 휴대전화번호)
      (수집 목적: 이벤트 상품 전달)
      (보유 기간: 전달 완료 후 30일)
      [상세 보기]

  [제출하기] 버튼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.3 인증 프로세스

**이메일 인증:**
```typescript
// 1. 인증번호 발송 API
async function sendEmailVerification(email: string, userId: string) {
  const verificationCode = generateRandomCode(6); // 6자리 숫자

  // Supabase Edge Function으로 이메일 발송
  await fetch(`${SUPABASE_URL}/functions/v1/send-verification-email`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      code: verificationCode,
      userId
    })
  });

  // 인증번호 임시 저장 (5분 유효)
  await supabase.from('email_verifications').insert({
    user_id: userId,
    email,
    code: verificationCode,
    expires_at: new Date(Date.now() + 5 * 60 * 1000)
  });
}

// 2. 인증번호 확인 API
async function verifyEmailCode(email: string, code: string, userId: string) {
  const { data } = await supabase
    .from('email_verifications')
    .select('*')
    .eq('user_id', userId)
    .eq('email', email)
    .eq('code', code)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (!data) {
    throw new Error('인증번호가 일치하지 않거나 만료되었습니다.');
  }

  // 인증 완료 처리
  return true;
}
```

**휴대전화 인증:**
```typescript
// SMS 인증 (외부 서비스 활용)
// 예: NHN Cloud SMS, 알리고, 카카오톡 알림톡 등
async function sendSmsVerification(phone: string, userId: string) {
  const verificationCode = generateRandomCode(6);

  // SMS 발송 API 호출
  await smsService.send({
    to: phone,
    message: `[헬스히어로] 인증번호: ${verificationCode}`
  });

  // 인증번호 저장
  await supabase.from('phone_verifications').insert({
    user_id: userId,
    phone,
    code: verificationCode,
    expires_at: new Date(Date.now() + 5 * 60 * 1000)
  });
}
```

---

## 4. 토스 이메일 활용 방식 (차선책)

**토스 이메일을 참고용으로만 사용:**

```typescript
// 1. 이벤트 달성 시 모달 표시
function showRewardModal(user: UserProfile) {
  // 토스 이메일이 있으면 미리 채워놓기 (편의성)
  const suggestedEmail = user.toss_email || '';

  return (
    <RewardModal>
      <input
        type="email"
        defaultValue={suggestedEmail}  // 미리 채워놓지만
        placeholder="상품 수령용 이메일"
        required
      />
      <p className="text-xs text-gray-500">
        ⚠️ 토스 가입 이메일과 다를 수 있습니다.
        정확한 이메일을 입력해주세요.
      </p>

      <label>
        <input type="checkbox" required />
        [필수] 상품 전달을 위한 이메일 수집·이용에 동의합니다.
      </label>

      <button onClick={() => submitRewardContact()}>
        제출하기
      </button>
    </RewardModal>
  );
}

// 2. 제출 시 별도 테이블에 저장
async function submitRewardContact(
  userId: string,
  email: string,
  eventId: string
) {
  // ✅ event_reward_contacts 테이블에 저장
  await supabase.from('event_reward_contacts').insert({
    user_id: userId,
    contact_type: 'email',
    contact_value: email,  // 사용자가 입력/확인한 값
    event_id: eventId,
    consent_date: new Date().toISOString(),
    consent_purpose: 'event_reward_delivery'
  });
}
```

**장점:**
- 사용자 편의성 향상 (이메일 미리 채워짐)
- 별도 동의 받음 (법적 문제 해결)
- 사용자가 수정 가능

**단점:**
- 여전히 인증 필요 (점유 확인)

---

## 5. 저장 방식 비교표

| 저장 방식 | 장점 | 단점 | 권장도 |
|-----------|------|------|--------|
| **A. user_profiles에 저장** | - 간편함<br>- 추가 테이블 불필요 | - 목적 외 사용 위험<br>- 법적 리스크<br>- 목적별 관리 어려움 | 🔴 비권장 |
| **B. 링크 발송 방식 (물리적 상품)** | - 토스 정보 DB 저장 안함<br>- 법적 안정성 최고<br>- 사용자 편의성<br>- 정확성 확보 | - 이메일/SMS 발송 필요<br>- 링크 페이지 구현 | ✅ **베스트 (물리적 상품)** |
| **C. 별도 테이블 (디지털 상품)** | - 목적별 명확한 동의<br>- 법적 안정성<br>- 감사 추적 용이<br>- 다양한 이벤트 대응 | - 추가 개발 필요<br>- 사용자 추가 입력 | ✅ **강력 권장 (디지털 상품)** |
| **D. 토스 이메일 참고 + 별도 저장** | - 사용자 편의성<br>- 법적 안정성<br>- 정확성 확보 | - 중간 수준 복잡도 | 🟢 권장 |

---

## 6. 구현 체크리스트

### 6.1 DB 구조

```sql
-- ✅ 권장: 별도 테이블 생성
□ event_reward_contacts 테이블 생성
□ email_verifications 테이블 생성 (이메일 인증용)
□ phone_verifications 테이블 생성 (휴대전화 인증용)

-- ❌ 비권장: user_profiles 확장
□ user_profiles에 reward_email, reward_phone 컬럼 추가
```

### 6.2 UI/UX

```
□ 이벤트 달성 시 상품 수령 모달 구현
□ 이메일/휴대전화 선택 옵션
□ 인증번호 입력 UI
□ 개인정보 수집 동의 체크박스
□ 약관 상세 보기 모달
```

### 6.3 백엔드

```
□ 이메일 인증번호 발송 Edge Function
□ SMS 인증번호 발송 API 연동
□ 인증번호 확인 API
□ 상품 전달 정보 저장 API
□ 상품 배송 상태 업데이트 API
```

### 6.4 법적 대응

```
□ 개인정보 처리방침 업데이트
  - 수집 항목: 이메일 또는 휴대전화번호
  - 수집 목적: 이벤트 상품 전달
  - 보유 기간: 전달 완료 후 30일
□ 약관 동의 화면 구현
□ 감사 로그 저장 (IP, User-Agent, 동의 시각)
```

---

## 7. 예시 코드

### 7.1 상품 수령 모달 컴포넌트

```typescript
// src/components/RewardCollectionModal.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RewardCollectionModalProps {
  userId: string;
  eventId: string;
  eventName: string;
  rewardType: string;
  suggestedEmail?: string; // 토스 이메일 (참고용)
  onClose: () => void;
}

export function RewardCollectionModal({
  userId,
  eventId,
  eventName,
  rewardType,
  suggestedEmail,
  onClose
}: RewardCollectionModalProps) {
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [contactValue, setContactValue] = useState(suggestedEmail || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 인증번호 발송
  const sendVerification = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke(
        contactType === 'email' ? 'send-email-verification' : 'send-sms-verification',
        {
          body: {
            userId,
            [contactType]: contactValue
          }
        }
      );

      if (error) throw error;
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      alert('인증번호 발송 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 확인
  const verifyCode = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: {
          userId,
          contactType,
          contactValue,
          code: verificationCode
        }
      });

      if (error) throw error;
      if (data.verified) {
        setIsVerified(true);
        alert('인증되었습니다!');
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert('인증 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 제출
  const handleSubmit = async () => {
    if (!isVerified) {
      alert('인증을 먼저 완료해주세요.');
      return;
    }

    if (!agreed) {
      alert('개인정보 수집·이용에 동의해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // event_reward_contacts 테이블에 저장
      const { error } = await supabase.from('event_reward_contacts').insert({
        user_id: userId,
        contact_type: contactType,
        contact_value: contactValue,
        is_verified: true,
        event_id: eventId,
        event_name: eventName,
        reward_type: rewardType,
        consent_date: new Date().toISOString(),
        consent_purpose: 'event_reward_delivery',
        consent_ip: await fetch('https://api.ipify.org?format=json')
          .then(r => r.json())
          .then(d => d.ip)
          .catch(() => null),
        consent_user_agent: navigator.userAgent
      });

      if (error) throw error;

      alert('상품 수령 정보가 등록되었습니다!');
      onClose();
    } catch (error) {
      alert('등록 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">🎉 상품 수령 정보 입력</h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            이벤트: {eventName}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            상품: {rewardType}
          </p>
        </div>

        {/* 연락처 타입 선택 */}
        <div className="mb-4">
          <label className="flex items-center mb-2">
            <input
              type="radio"
              checked={contactType === 'email'}
              onChange={() => setContactType('email')}
              className="mr-2"
            />
            이메일로 받기
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={contactType === 'phone'}
              onChange={() => setContactType('phone')}
              className="mr-2"
            />
            휴대전화로 받기
          </label>
        </div>

        {/* 연락처 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {contactType === 'email' ? '이메일' : '휴대전화번호'}
          </label>
          <div className="flex gap-2">
            <input
              type={contactType === 'email' ? 'email' : 'tel'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={
                contactType === 'email'
                  ? 'email@example.com'
                  : '010-0000-0000'
              }
              className="flex-1 px-3 py-2 border rounded"
              disabled={isVerified}
            />
            <button
              onClick={sendVerification}
              disabled={isLoading || isVerified || !contactValue}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isVerified ? '인증완료' : '인증번호'}
            </button>
          </div>
          {suggestedEmail && contactType === 'email' && (
            <p className="text-xs text-gray-500 mt-1">
              💡 토스 가입 이메일: {suggestedEmail}
            </p>
          )}
        </div>

        {/* 인증번호 입력 */}
        {!isVerified && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              인증번호
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6자리 숫자"
                className="flex-1 px-3 py-2 border rounded"
                maxLength={6}
              />
              <button
                onClick={verifyCode}
                disabled={isLoading || !verificationCode}
                className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* 개인정보 동의 */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <label className="flex items-start text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2 mt-1"
              required
            />
            <span>
              [필수] 상품 전달을 위한 개인정보 수집·이용에 동의합니다.
              <br />
              <span className="text-xs text-gray-600">
                • 수집 항목: {contactType === 'email' ? '이메일' : '휴대전화번호'}
                <br />
                • 수집 목적: 이벤트 상품 전달
                <br />
                • 보유 기간: 전달 완료 후 30일
              </span>
            </span>
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isVerified || !agreed}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? '처리중...' : '제출하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. 최종 권장사항 (업데이트)

### ✅ DO (권장)

#### 물리적 상품 (스마트 워치 등) - 베스트 방식 ⭐

1. **event_winners 테이블 생성** (링크 발송 방식)
2. **토스 이메일/전화로 링크 발송** (DB 저장 안함)
3. **배송지만 별도 수집** (사용자가 링크에서 입력)
4. **일회용 토큰 사용** (7일 만료)
5. **배송 완료 후 30일 뒤 자동 삭제**

**핵심 장점:**
- 토스 정보를 DB에 저장하지 않음 (최소 수집 원칙)
- 계약 이행 목적으로 활용 가능 (법적 안정성)
- 사용자가 정확한 배송지 입력 가능

#### 디지털 상품 (쿠폰, 포인트 등)

1. **별도 테이블 생성** (`event_reward_contacts`)
2. **명확한 목적으로 동의 받기** (이벤트 상품 전달용)
3. **인증 절차 추가** (이메일/SMS 인증)
4. **토스 이메일은 참고용으로만 활용** (미리 채워놓기)
5. **감사 로그 저장** (IP, User-Agent, 동의 시각)
6. **보유 기간 명시** (전달 완료 후 30일)

### ❌ DON'T (비권장)

1. ❌ 토스 로그인 정보를 DB에 저장하여 상품 배송에 사용
2. ❌ `user_profiles` 테이블에 상품 수령 정보 저장
3. ❌ 인증 없이 이메일/전화번호 수집 (디지털 상품의 경우)
4. ❌ 목적 외 사용 동의 없이 활용

### 📋 상품 유형별 최종 선택 가이드

| 상품 유형 | 권장 방식 | 문서 참고 |
|-----------|-----------|-----------|
| 스마트 워치, 가전제품 등 | 링크 발송 방식 ⭐ | [PHYSICAL_REWARD_DELIVERY_STRATEGY.md](PHYSICAL_REWARD_DELIVERY_STRATEGY.md) |
| 쿠폰, 포인트, 디지털 코드 | 별도 테이블 수집 | 본 문서 3.2절 참고 |

---

## 9. 참고 자료

- [개인정보 보호법](https://www.law.go.kr/)
- [개인정보 보호위원회 가이드라인](https://www.pipc.go.kr/)
- [토스 로그인 개발 가이드](https://developers-apps-in-toss.toss.im/login/develop.md)

---

**문서 버전:** 1.0
**최종 수정:** 2026-01-04

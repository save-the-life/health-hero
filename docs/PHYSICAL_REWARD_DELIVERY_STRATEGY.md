# 물리적 상품(스마트 워치) 배송 전략

**상품 유형:** 스마트 워치 (물리적 배송 필요)
**배송 프로세스:** 이벤트 달성 → 고지 → 배송지 입력 → 배송
**분석 일자:** 2026-01-04

---

## 🎯 핵심 인사이트

**질문:** "이메일/전화번호로 먼저 고지한 후 배송하면 되지 않을까?"

**답변:** ✅ **맞습니다!** 이 방식이 훨씬 합리적입니다.

### 저장 방식 재평가

| 시나리오 | 필요 정보 | 토스 이메일 활용 | 권장도 |
|----------|-----------|------------------|--------|
| **디지털 상품** (쿠폰, 포인트) | 이메일/전화번호 | 🟡 신중히 | 별도 수집 |
| **물리적 상품** (스마트 워치) | 배송지 주소 | ✅ **적극 활용** | 토스 정보 활용 가능 |

---

## 1. 물리적 상품 배송 프로세스

### 1.1 권장 흐름

```
[사용자가 이벤트 달성]
   ↓
[축하 모달 표시]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎉 이벤트를 달성했습니다!

  당첨 상품: 스마트 워치

  📧 당첨 안내는 이메일/문자로 발송됩니다.
  배송지 입력 안내 문자를 받으시면
  링크를 통해 배송 정보를 입력해주세요.

  예상 발송 시간: 2~3일 이내

  [확인] 버튼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ↓
[관리자가 당첨자 확인]
   ↓
[토스 이메일/전화번호로 고지]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [헬스히어로] 이벤트 당첨을 축하드립니다!

  당첨 상품: 스마트 워치

  아래 링크에서 배송지 정보를 입력해주세요.
  🔗 https://health-hero.app/reward/shipping/[토큰]

  ※ 링크 유효기간: 7일
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ↓
[사용자가 링크 클릭]
   ↓
[배송지 입력 페이지]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  배송 정보 입력

  받는 사람: [홍길동]
  전화번호: [010-0000-0000]
  주소: [서울시 강남구...]

  ☑ 개인정보 수집·이용 동의 (배송 목적)

  [제출하기]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ↓
[관리자가 배송 처리]
   ↓
[배송 완료]
```

---

## 2. 토스 이메일/전화번호 활용 가능 여부

### 2.1 법적 검토

**개인정보 보호법 제15조 제1항 제4호:**
> 계약의 체결 및 이행을 위하여 **불가피하게 필요한 경우**

**해석:**
```
[이벤트 당첨 = 계약 체결]
- 사용자: 이벤트 참여 (계약 신청)
- 서비스: 상품 제공 약속 (계약 수락)
- 상품 배송: 계약 이행

→ 배송을 위한 연락은 "계약 이행에 불가피"
→ 토스 이메일/전화번호 활용 가능 ✅
```

### 2.2 조건부 활용 가능

| 조건 | 필요성 | 설명 |
|------|--------|------|
| **1. 명확한 고지** | ✅ 필수 | 이벤트 규정에 "당첨 시 연락처로 고지" 명시 |
| **2. 최소한의 사용** | ✅ 필수 | 배송지 입력 안내 목적으로만 사용 |
| **3. 즉시 폐기** | ✅ 필수 | 배송 완료 후 정보 삭제 |

### 2.3 이벤트 규정 예시

```markdown
## 이벤트 참여 약관

### 제1조 (당첨자 발표 및 상품 지급)
1. 당첨자는 앱 내 공지 및 **등록된 이메일/휴대전화번호로 개별 안내**됩니다.
2. 당첨자는 안내 문자/이메일의 링크를 통해 **배송지 정보를 입력**해야 합니다.
3. 배송지 정보 미입력 시 당첨이 취소될 수 있습니다.

### 제2조 (개인정보 처리)
1. 당첨 안내를 위해 회원가입 시 제공한 **이메일 또는 휴대전화번호를 활용**합니다.
2. 배송을 위한 주소, 수령인 정보는 **별도 수집**하며, 배송 완료 후 즉시 파기합니다.
```

---

## 3. DB 스키마 설계

### 3.1 간소화된 테이블 구조

```sql
-- 이벤트 당첨자 및 배송 관리 테이블
CREATE TABLE event_winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 이벤트 정보
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  reward_type TEXT NOT NULL,  -- 'smart_watch'

  -- 당첨 정보
  won_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_sent_at TIMESTAMP WITH TIME ZONE,  -- 고지 발송 시각
  notification_method TEXT,  -- 'email' | 'sms' | 'both'

  -- 배송지 입력 링크
  shipping_token TEXT UNIQUE,  -- 배송지 입력용 토큰
  shipping_link_expires_at TIMESTAMP WITH TIME ZONE,  -- 링크 만료 시각

  -- 배송 정보 (사용자가 별도 입력)
  recipient_name TEXT,
  recipient_phone TEXT,
  shipping_address TEXT,
  shipping_address_detail TEXT,
  shipping_zipcode TEXT,
  shipping_memo TEXT,

  -- 배송지 입력 동의
  shipping_consent_at TIMESTAMP WITH TIME ZONE,
  shipping_consent_ip INET,

  -- 배송 상태
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',          -- 대기 (고지 전)
    'notified',         -- 고지 완료
    'shipping_info_received',  -- 배송지 입력 완료
    'shipped',          -- 배송 중
    'delivered',        -- 배송 완료
    'expired',          -- 링크 만료 (미입력)
    'cancelled'         -- 취소
  )),

  -- 배송 추적
  tracking_number TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,

  -- 감사 로그
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, event_id)
);

-- 인덱스
CREATE INDEX idx_event_winners_status ON event_winners(status);
CREATE INDEX idx_event_winners_token ON event_winners(shipping_token);
CREATE INDEX idx_event_winners_event_id ON event_winners(event_id);

-- RLS 정책
ALTER TABLE event_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own winner records" ON event_winners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own shipping info" ON event_winners
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 4. 구현 단계별 가이드

### 4.1 이벤트 달성 시 (즉시 처리)

```typescript
// src/services/eventService.ts

async function handleEventSuccess(userId: string, eventId: string) {
  // 1. event_winners 테이블에 당첨자 등록
  const shippingToken = generateSecureToken(); // UUID 또는 랜덤 토큰
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 후

  const { data: winner, error } = await supabase
    .from('event_winners')
    .insert({
      user_id: userId,
      event_id: eventId,
      event_name: '스마트 워치 이벤트',
      reward_type: 'smart_watch',
      status: 'pending',
      shipping_token: shippingToken,
      shipping_link_expires_at: expiresAt.toISOString()
    })
    .select()
    .single();

  if (error) throw error;

  // 2. 사용자에게 당첨 모달 표시
  return {
    success: true,
    message: '당첨을 축하드립니다! 배송지 입력 안내를 곧 받으실 수 있습니다.',
    winner
  };
}
```

### 4.2 관리자 고지 발송 (수동/자동)

```typescript
// src/services/notificationService.ts

async function sendWinnerNotification(winnerId: string) {
  // 1. 당첨자 정보 조회
  const { data: winner } = await supabase
    .from('event_winners')
    .select(`
      *,
      user:user_profiles(toss_email, toss_phone, name)
    `)
    .eq('id', winnerId)
    .single();

  if (!winner) throw new Error('당첨자를 찾을 수 없습니다.');

  // 2. 배송지 입력 링크 생성
  const shippingLink = `https://health-hero.app/reward/shipping/${winner.shipping_token}`;

  // 3. 이메일 발송 (토스 이메일 활용)
  if (winner.user.toss_email) {
    await sendEmail({
      to: winner.user.toss_email,
      subject: '[헬스히어로] 이벤트 당첨을 축하드립니다! 🎉',
      html: `
        <h2>🎉 ${winner.user.name}님, 당첨을 축하드립니다!</h2>
        <p>당첨 상품: <strong>${winner.reward_type}</strong></p>
        <p>아래 링크에서 배송지 정보를 입력해주세요:</p>
        <a href="${shippingLink}">${shippingLink}</a>
        <p>※ 링크 유효기간: 7일</p>
        <p>기간 내 미입력 시 당첨이 취소될 수 있습니다.</p>
      `
    });
  }

  // 4. SMS 발송 (토스 전화번호 활용)
  if (winner.user.toss_phone) {
    await sendSMS({
      to: winner.user.toss_phone,
      message: `[헬스히어로] ${winner.user.name}님 당첨 축하드립니다! 배송지 입력: ${shippingLink} (유효기간 7일)`
    });
  }

  // 5. 발송 기록 업데이트
  await supabase
    .from('event_winners')
    .update({
      status: 'notified',
      notification_sent_at: new Date().toISOString(),
      notification_method: winner.user.toss_email && winner.user.toss_phone
        ? 'both'
        : winner.user.toss_email
        ? 'email'
        : 'sms'
    })
    .eq('id', winnerId);

  return { success: true };
}
```

### 4.3 배송지 입력 페이지

```typescript
// src/app/reward/shipping/[token]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ShippingInfoPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [winner, setWinner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_phone: '',
    shipping_zipcode: '',
    shipping_address: '',
    shipping_address_detail: '',
    shipping_memo: ''
  });
  const [agreed, setAgreed] = useState(false);

  // 토큰으로 당첨자 정보 조회
  useEffect(() => {
    async function loadWinner() {
      try {
        const { data, error } = await supabase
          .from('event_winners')
          .select('*')
          .eq('shipping_token', token)
          .single();

        if (error) throw error;

        // 만료 확인
        if (new Date(data.shipping_link_expires_at) < new Date()) {
          alert('링크가 만료되었습니다.');
          return;
        }

        // 이미 입력 완료
        if (data.status === 'shipping_info_received') {
          alert('이미 배송지 정보를 입력하셨습니다.');
          return;
        }

        setWinner(data);
      } catch (error) {
        console.error('당첨자 정보 조회 실패:', error);
        alert('유효하지 않은 링크입니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadWinner();
  }, [token]);

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      alert('개인정보 수집·이용에 동의해주세요.');
      return;
    }

    try {
      // IP 주소 가져오기
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      // 배송지 정보 저장
      const { error } = await supabase
        .from('event_winners')
        .update({
          ...formData,
          status: 'shipping_info_received',
          shipping_consent_at: new Date().toISOString(),
          shipping_consent_ip: ip
        })
        .eq('shipping_token', token);

      if (error) throw error;

      alert('배송지 정보가 등록되었습니다! 곧 상품이 배송될 예정입니다.');
      router.push('/game');
    } catch (error) {
      console.error('배송지 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  if (!winner) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">유효하지 않은 링크입니다</h2>
        <button
          onClick={() => router.push('/game')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          게임으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🎉 당첨을 축하드립니다!</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">당첨 상품</p>
        <p className="text-lg font-bold">{winner.reward_type}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            받는 사람 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.recipient_name}
            onChange={(e) =>
              setFormData({ ...formData, recipient_name: e.target.value })
            }
            placeholder="홍길동"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.recipient_phone}
            onChange={(e) =>
              setFormData({ ...formData, recipient_phone: e.target.value })
            }
            placeholder="010-0000-0000"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            우편번호 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.shipping_zipcode}
              onChange={(e) =>
                setFormData({ ...formData, shipping_zipcode: e.target.value })
              }
              placeholder="12345"
              className="flex-1 px-3 py-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => {
                /* 다음 우편번호 API 연동 */
              }}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              주소 검색
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.shipping_address}
            onChange={(e) =>
              setFormData({ ...formData, shipping_address: e.target.value })
            }
            placeholder="서울시 강남구 테헤란로 123"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            상세 주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.shipping_address_detail}
            onChange={(e) =>
              setFormData({
                ...formData,
                shipping_address_detail: e.target.value
              })
            }
            placeholder="101동 202호"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            배송 메모 (선택)
          </label>
          <textarea
            value={formData.shipping_memo}
            onChange={(e) =>
              setFormData({ ...formData, shipping_memo: e.target.value })
            }
            placeholder="예: 부재 시 경비실에 맡겨주세요"
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>

        <div className="bg-gray-50 border rounded p-4">
          <label className="flex items-start text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2 mt-1"
              required
            />
            <span>
              <strong>[필수]</strong> 상품 배송을 위한 개인정보 수집·이용에
              동의합니다.
              <br />
              <span className="text-xs text-gray-600">
                • 수집 항목: 수령인명, 전화번호, 배송지 주소
                <br />
                • 수집 목적: 이벤트 상품 배송
                <br />
                • 보유 기간: 배송 완료 후 30일
                <br />• 거부권 및 불이익: 동의하지 않을 수 있으나, 상품 수령이
                불가합니다.
              </span>
            </span>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push('/game')}
            className="flex-1 px-4 py-3 border rounded"
          >
            나중에 입력
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={!agreed}
          >
            제출하기
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        ※ 링크 유효기간:{' '}
        {new Date(winner.shipping_link_expires_at).toLocaleDateString()}까지
      </p>
    </div>
  );
}
```

---

## 5. 관리자 페이지

```typescript
// src/app/admin/winners/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function WinnersManagementPage() {
  const [winners, setWinners] = useState<any[]>([]);

  useEffect(() => {
    loadWinners();
  }, []);

  async function loadWinners() {
    const { data } = await supabase
      .from('event_winners')
      .select(`
        *,
        user:user_profiles(name, toss_email, toss_phone)
      `)
      .order('won_at', { ascending: false });

    setWinners(data || []);
  }

  async function sendNotification(winnerId: string) {
    try {
      await fetch('/api/admin/send-winner-notification', {
        method: 'POST',
        body: JSON.stringify({ winnerId })
      });
      alert('고지가 발송되었습니다.');
      loadWinners();
    } catch (error) {
      alert('발송 실패');
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">당첨자 관리</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">이름</th>
            <th className="p-2 border">당첨일</th>
            <th className="p-2 border">상품</th>
            <th className="p-2 border">상태</th>
            <th className="p-2 border">이메일</th>
            <th className="p-2 border">전화번호</th>
            <th className="p-2 border">배송지</th>
            <th className="p-2 border">관리</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner) => (
            <tr key={winner.id}>
              <td className="p-2 border">{winner.user?.name}</td>
              <td className="p-2 border">
                {new Date(winner.won_at).toLocaleDateString()}
              </td>
              <td className="p-2 border">{winner.reward_type}</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    winner.status === 'pending'
                      ? 'bg-yellow-100'
                      : winner.status === 'notified'
                      ? 'bg-blue-100'
                      : winner.status === 'shipping_info_received'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {winner.status}
                </span>
              </td>
              <td className="p-2 border text-xs">
                {winner.user?.toss_email || '-'}
              </td>
              <td className="p-2 border text-xs">
                {winner.user?.toss_phone || '-'}
              </td>
              <td className="p-2 border text-xs">
                {winner.shipping_address || '-'}
              </td>
              <td className="p-2 border">
                {winner.status === 'pending' && (
                  <button
                    onClick={() => sendNotification(winner.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    고지 발송
                  </button>
                )}
                {winner.status === 'shipping_info_received' && (
                  <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                    배송 처리
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 6. 최종 정리

### 6.1 토스 이메일/전화번호 활용 가능

| 항목 | 내용 |
|------|------|
| **활용 목적** | 당첨 안내 및 배송지 입력 링크 발송 |
| **법적 근거** | 계약 이행에 불가피 (개인정보 보호법 제15조 제1항 제4호) |
| **조건** | 이벤트 규정에 명시 + 최소한 사용 + 즉시 폐기 |
| **실제 저장** | ❌ 배송지 주소만 별도 수집 저장 |

### 6.2 프로세스 요약

```
1. 이벤트 달성 → event_winners 테이블 등록
2. 토스 이메일/전화번호로 고지 발송 (배송지 입력 링크)
3. 사용자가 링크 접속 → 배송지 정보 별도 입력
4. 배송지 정보만 DB에 저장 (별도 동의)
5. 배송 처리
6. 배송 완료 후 30일 뒤 정보 자동 삭제
```

### 6.3 장점

✅ 토스 이메일/전화번호를 DB에 저장하지 않음 (최소 수집)
✅ 배송지 정보만 별도 동의 받아 저장
✅ 사용자가 정확한 배송지 입력 가능
✅ 법적 리스크 최소화
✅ 관리자 배송 처리 편리

---

## 7. 체크리스트

### 구현 필요 항목

```
□ DB 스키마
  □ event_winners 테이블 생성
  □ 토큰 생성 로직 구현

□ 고지 발송
  □ 이메일 발송 API (Supabase Edge Function)
  □ SMS 발송 API (외부 서비스 연동)
  □ 관리자 페이지 (고지 발송 버튼)

□ 배송지 입력 페이지
  □ /reward/shipping/[token] 페이지 구현
  □ 다음 우편번호 API 연동
  □ 배송지 저장 API

□ 이벤트 규정
  □ 약관에 "당첨 시 연락처로 고지" 명시
  □ "배송지 정보 별도 수집" 명시

□ 자동화
  □ 링크 만료 시 자동 취소 (배치 작업)
  □ 배송 완료 후 30일 자동 삭제 (배치 작업)
```

---

**문서 버전:** 1.0
**최종 수정:** 2026-01-04

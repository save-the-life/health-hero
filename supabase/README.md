# Supabase 설정 가이드

## 1. Supabase 프로젝트 설정

### 환경 변수 확인
1. [Supabase 콘솔](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Project Settings** > **API** 메뉴로 이동
4. 다음 값을 복사:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 위 값을 입력하세요:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_TOSS_CLIENT_ID=your-toss-client-id
TOSS_CLIENT_SECRET=your-toss-client-secret
NEXT_PUBLIC_TOSS_APP_KEY=health-hero
```

## 2. 데이터베이스 스키마 생성

### SQL Editor에서 실행
1. Supabase 콘솔에서 **SQL Editor** 메뉴로 이동
2. **New query** 버튼 클릭
3. `supabase/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행

### 생성되는 테이블
- `user_profiles`: 사용자 프로필 및 게임 진행 상태
- `toss_login_logs`: 토스 로그인 기록

### Row Level Security (RLS)
- 사용자는 자신의 프로필과 로그만 조회/수정 가능
- 보안이 자동으로 적용됨

## 3. 확인

### Table Editor에서 확인
1. **Table Editor** 메뉴로 이동
2. `user_profiles`, `toss_login_logs` 테이블이 생성되었는지 확인
3. **Policies** 탭에서 RLS 정책이 활성화되었는지 확인

## 4. Supabase 클라이언트 초기화

프로젝트에 Supabase 클라이언트가 이미 설정되어 있는지 확인:
- `src/lib/supabase.ts` 또는 `src/utils/supabase.ts`

없다면 다음 단계에서 생성됩니다.


-- 프로모션 기록 RLS 정책 수정
-- 사용자가 자신의 프로모션 기록을 INSERT할 수 있도록 허용

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own promotion records" ON promotion_records;
DROP POLICY IF EXISTS "Service role can do everything" ON promotion_records;

-- 새로운 정책 추가

-- 1. 사용자는 자신의 기록만 조회 가능
CREATE POLICY "Users can view their own promotion records"
ON promotion_records
FOR SELECT
USING (auth.uid() = user_id);

-- 2. 사용자는 자신의 기록을 삽입할 수 있음 (중요!)
CREATE POLICY "Users can insert their own promotion records"
ON promotion_records
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. 서비스 롤은 모든 작업 가능
CREATE POLICY "Service role can do everything"
ON promotion_records
FOR ALL
USING (auth.role() = 'service_role');

-- 확인 메시지
SELECT 'RLS 정책이 성공적으로 업데이트되었습니다!' as status;


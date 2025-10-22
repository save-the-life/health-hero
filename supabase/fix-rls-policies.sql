-- ============================================
-- RLS 정책 확인 및 수정 스크립트 (2025-01-27)
-- quiz_submission_logs 테이블 RLS 정책 문제 해결
-- ============================================

-- 1. 현재 RLS 정책 확인
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('quiz_submission_logs', 'user_quiz_records');

-- 2. 테이블별 RLS 활성화 상태 확인
-- ============================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('quiz_submission_logs', 'user_quiz_records');

-- 3. quiz_submission_logs 테이블 RLS 정책 수정
-- ============================================
-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "quiz_submission_logs_insert_policy" ON quiz_submission_logs;
DROP POLICY IF EXISTS "quiz_submission_logs_select_policy" ON quiz_submission_logs;

-- 새로운 INSERT 정책 생성 (인증된 사용자는 자신의 레코드만 삽입 가능)
CREATE POLICY "quiz_submission_logs_insert_policy" ON quiz_submission_logs
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

-- 새로운 SELECT 정책 생성 (인증된 사용자는 자신의 레코드만 조회 가능)
CREATE POLICY "quiz_submission_logs_select_policy" ON quiz_submission_logs
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

-- 4. user_quiz_records 테이블 RLS 정책도 확인 및 수정
-- ============================================
-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "user_quiz_records_insert_policy" ON user_quiz_records;
DROP POLICY IF EXISTS "user_quiz_records_select_policy" ON user_quiz_records;

-- 새로운 INSERT 정책 생성
CREATE POLICY "user_quiz_records_insert_policy" ON user_quiz_records
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

-- 새로운 SELECT 정책 생성
CREATE POLICY "user_quiz_records_select_policy" ON user_quiz_records
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

-- 5. 정책 적용 확인
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('quiz_submission_logs', 'user_quiz_records')
ORDER BY tablename, policyname;
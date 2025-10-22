-- ============================================
-- RLS 일시 비활성화 스크립트 (2025-01-27)
-- 개발/테스트 환경에서만 사용
-- ============================================

-- 1. quiz_submission_logs 테이블 RLS 일시 비활성화
-- ============================================
ALTER TABLE quiz_submission_logs DISABLE ROW LEVEL SECURITY;

-- 2. user_quiz_records 테이블 RLS 일시 비활성화
-- ============================================
ALTER TABLE user_quiz_records DISABLE ROW LEVEL SECURITY;

-- 3. 확인
-- ============================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('quiz_submission_logs', 'user_quiz_records');

-- 주의: 프로덕션 환경에서는 보안상 RLS를 다시 활성화해야 합니다!
-- 다시 활성화하려면:
-- ALTER TABLE quiz_submission_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_quiz_records ENABLE ROW LEVEL SECURITY;

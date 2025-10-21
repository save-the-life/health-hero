-- ============================================
-- 트리거 중복 오류 해결용 SQL
-- ============================================

-- 기존 트리거 삭제 후 재생성
DROP TRIGGER IF EXISTS update_user_hearts_updated_at ON user_hearts;
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;

-- 트리거 재생성
CREATE TRIGGER update_user_hearts_updated_at
  BEFORE UPDATE ON user_hearts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

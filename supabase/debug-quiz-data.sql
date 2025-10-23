-- 퀴즈 데이터 디버깅 쿼리 (스키마 수정)
-- 이 쿼리를 Supabase SQL Editor에서 실행하여 데이터 확인

-- 1. 전체 퀴즈 개수 확인
SELECT COUNT(*) as total_quizzes FROM quizzes;

-- 2. 난이도별 퀴즈 개수 확인
SELECT difficulty_label, COUNT(*) as count 
FROM quizzes 
GROUP BY difficulty_label 
ORDER BY difficulty_label;

-- 3. 첫 10개 퀴즈의 상세 정보 확인
SELECT 
  id,
  qnum,
  topic,
  difficulty_label,
  difficulty_level,
  jsonb_array_length(choices) as choice_count,
  answer_index
FROM quizzes 
ORDER BY qnum 
LIMIT 10;

-- 4. 쉬움 난이도 퀴즈만 확인
SELECT 
  id,
  qnum,
  topic,
  difficulty_label,
  difficulty_level
FROM quizzes 
WHERE difficulty_label = '쉬움'
ORDER BY qnum
LIMIT 10;

-- 5. choices 필드 형식 확인
SELECT 
  id,
  qnum,
  choices,
  jsonb_typeof(choices) as choices_type
FROM quizzes 
WHERE difficulty_label = '쉬움'
LIMIT 5;

-- 6. RLS 정책 확인을 위한 테이블 정보
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'quizzes';

-- 정답 인덱스 디버깅 쿼리
-- 이 쿼리를 Supabase SQL Editor에서 실행하여 데이터 확인

-- 1. 전체 answer_index 분포 확인
SELECT answer_index, COUNT(*) as count 
FROM quizzes 
GROUP BY answer_index 
ORDER BY answer_index;

-- 2. answer_index 범위 확인 (0-3이어야 함)
SELECT 
  MIN(answer_index) as min_index,
  MAX(answer_index) as max_index,
  COUNT(*) as total_quizzes
FROM quizzes;

-- 3. 첫 10개 문제의 상세 정보 확인
SELECT 
  qnum,
  topic,
  prompt,
  choices,
  answer_index,
  difficulty_label
FROM quizzes 
ORDER BY qnum 
LIMIT 10;

-- 4. 잘못된 answer_index가 있는지 확인
SELECT 
  qnum,
  answer_index,
  array_length(choices, 1) as choice_count
FROM quizzes 
WHERE answer_index < 0 OR answer_index >= array_length(choices, 1)
ORDER BY qnum;

-- 5. 힌트가 있는 문제 확인
SELECT 
  COUNT(*) as total_with_hints
FROM quizzes 
WHERE hint IS NOT NULL AND hint != '';

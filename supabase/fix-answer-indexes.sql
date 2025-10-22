-- ============================================
-- 잘못된 answer_index 값 수정 스크립트
-- ============================================

-- 문제 17번 (팔 골절 응급처치)의 정답 인덱스 수정
-- 현재: answer_index = 2 (온찜질로 풀어준다) - 잘못됨
-- 수정: answer_index = 1 (부목으로 고정·움직임 최소화 후 의료기관으로 이동) - 올바름

UPDATE quizzes 
SET answer_index = 1 
WHERE qnum = 17 
AND prompt = '팔 골절이 의심될 때?';

-- 다른 잘못된 answer_index가 있는지 확인
-- 문제별로 정답을 확인하고 필요시 수정

-- 확인용 쿼리
SELECT 
  qnum,
  topic,
  prompt,
  choices,
  answer_index,
  explanation
FROM quizzes 
WHERE qnum = 17;

-- 모든 퀴즈의 answer_index 확인 (문제가 있는 것들 찾기)
SELECT 
  qnum,
  topic,
  prompt,
  choices,
  answer_index
FROM quizzes 
ORDER BY qnum;

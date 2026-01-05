-- ============================================================
-- 유저 통계 확인 스크립트
-- 이 스크립트를 Supabase SQL Editor에서 실행하여 통계를 확인하세요.
-- ============================================================

-- 1. 전체 유저 수 확인
SELECT COUNT(*) AS "전체 유저 수" 
FROM user_profiles;

-- 2. 레벨별 유저 분포 확인 (레벨 오름차순)
SELECT 
  level AS "레벨", 
  COUNT(*) AS "유저 수" 
FROM user_profiles 
GROUP BY level 
ORDER BY level ASC;

-- 3. 스테이지 진행도 분포 (현재 진행 중인 페이즈/스테이지 기준)
SELECT 
  current_phase AS "현재 페이즈", 
  current_stage AS "현재 스테이지", 
  COUNT(*) AS "유저 수"
FROM user_profiles
GROUP BY current_phase, current_stage
ORDER BY current_phase ASC, current_stage ASC;

-- 4. 상위 레벨 유저 TOP 10 (참고용)
SELECT 
  name, 
  level, 
  current_phase, 
  current_stage, 
  total_score 
FROM user_profiles 
ORDER BY level DESC, total_score DESC 
LIMIT 10;

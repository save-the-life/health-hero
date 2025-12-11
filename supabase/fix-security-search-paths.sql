-- Fix 'Function Search Path Mutable' warnings by setting search_path = public
-- This prevents the function from executing with the invoker's search_path or a default insecure path.

-- 1. check_daily_attendance
ALTER FUNCTION public.check_daily_attendance(UUID) SET search_path = public;

-- 2. add_heart_by_ad
ALTER FUNCTION public.add_heart_by_ad(UUID) SET search_path = public;

-- 3. buy_heart_with_points
ALTER FUNCTION public.buy_heart_with_points(UUID, INTEGER) SET search_path = public;

-- 4. update_user_progress
-- There were multiple versions, we target the one with full arguments from 'fix-update-user-progress-with-levelup.sql'
ALTER FUNCTION public.update_user_progress(UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER) SET search_path = public;

-- 5. complete_stage
-- Based on complete-stage.sql content which we are about to see
ALTER FUNCTION public.complete_stage(UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER) SET search_path = public;

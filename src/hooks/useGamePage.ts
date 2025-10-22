import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";

/**
 * 게임 페이지에서 공통으로 사용하는 로직을 담은 커스텀 훅
 * 중복된 useEffect 로직을 제거하고 성능을 최적화
 */
export function useGamePage() {
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { hearts, isLoading, error, loadUserData, updateHearts } = useGameStore();
  
  // 화면 높이 감지
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerHeight < 700);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 인증 상태 초기화 (한 번만 실행)
  useEffect(() => {
    const initData = async () => {
      await initialize();
    };
    initData();
  }, [initialize]);

  // 사용자 데이터 로드 (캐싱 적용됨)
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserData(user.id);
    }
  }, [isAuthenticated, user?.id, loadUserData]);

  // 하트 타이머 업데이트 (30초마다)
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !hearts) return;

    const interval = setInterval(() => {
      if (hearts.current_hearts < 5) {
        updateHearts();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, hearts, updateHearts]);

  return {
    user,
    isAuthenticated,
    hearts,
    isLoading,
    error,
    isSmallScreen,
  };
}

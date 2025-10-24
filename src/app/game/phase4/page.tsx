"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import StageButton from "@/components/StageButton";
import { SoundButton } from "@/components/SoundButton";

export default function Phase4Page() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const {
    hearts,
    isLoading,
    error,
    currentStage,
    currentPhase,
    loadUserData,
    updateHearts,
  } = useGameStore();

  // 화면 높이 감지
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerHeight < 700); // 700px 미만을 작은 화면으로 판단
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 컴포넌트 마운트 시 인증 상태 초기화 및 데이터 로드
  useEffect(() => {
    const initData = async () => {
      await initialize();
    };
    initData();
  }, [initialize]);

  // 사용자 데이터 로드
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserData(user.id);
    }
  }, [isAuthenticated, user?.id, loadUserData]);

  // 페이지 포커스 시 사용자 데이터 새로고침 (스테이지 완료 후 돌아올 때)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && user?.id) {
        loadUserData(user.id);
        console.log("페이즈 페이지 가시성 변경 - 사용자 데이터 새로고침");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAuthenticated, user?.id, loadUserData]);

  // 하트 타이머 업데이트 (30초마다)
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !hearts) return;

    const interval = setInterval(() => {
      // 하트가 5개 미만일 때만 서버 업데이트 호출
      if (hearts.current_hearts < 5) {
        updateHearts();
      }
    }, 30000); // 30초마다 (하트 충전 주기 고려)

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, hearts, updateHearts]);

  // 스테이지 잠금 상태 확인
  const isStageLocked = (stageNumber: number) => {
    // 현재 페이즈가 4보다 낮으면 모든 스테이지 잠금
    if (currentPhase < 4) {
      return true;
    }

    // 현재 페이즈가 4이고, 현재 스테이지보다 높은 스테이지는 잠금
    if (currentPhase === 4) {
      return stageNumber > currentStage;
    }

    // 현재 페이즈가 4보다 높으면 모든 스테이지 열림
    return false;
  };

  // 스테이지 클릭 핸들러
  const handleStageClick = (stageNumber: number) => {
    // 잠금된 스테이지는 클릭 불가
    if (isStageLocked(stageNumber)) {
      return;
    }

    // 퀴즈 페이지로 이동 (쿼리 파라미터로 페이즈와 스테이지 정보 전달)
    router.push(`/game/quiz?phase=4&stage=${stageNumber}`);
  };

  // 로딩 중이거나 에러가 있으면 표시
  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/background-phase4.png"
            alt="페이즈 4 배경"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 로딩 텍스트 */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl font-medium">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/background-phase4.png"
            alt="페이즈 4 배경"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 에러 텍스트 */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl font-medium">에러: {error}</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="text-white text-xl">로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/background-phase4.png"
          alt="페이즈 4 배경"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full h-screen">
        {/* 뒤로가기 버튼 */}
        <div className="absolute top-4 left-4 z-20">
          <SoundButton
            onClick={() => router.push("/game")}
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity px-3 py-2 rounded-lg"
          >
            <Image
              src="/images/items/icon-backspace.png"
              alt="뒤로가기"
              width={24}
              height={24}
            />
          </SoundButton>
        </div>

        {/* 스테이지 버튼들 - 화면 크기에 따른 조건부 배치 */}
        <div className="absolute inset-0 flex flex-col justify-center items-center mb-5">
          {isSmallScreen ? (
            // 작은 화면용 배치
            <>
              {/* 스테이지 1 - 하단 */}
              <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2">
                <StageButton
                  stageNumber={1}
                  isLocked={isStageLocked(1)}
                  onClick={() => handleStageClick(1)}
                />
              </div>

              {/* 스테이지 2 - 스테이지 1 위 */}
              <div className="absolute bottom-[180px] left-5/9 transform -translate-x-1/2">
                <StageButton
                  stageNumber={2}
                  isLocked={isStageLocked(2)}
                  onClick={() => handleStageClick(2)}
                />
              </div>

              {/* 스테이지 3 - 스테이지 2 위 */}
              <div className="absolute bottom-[300px] left-4/10 transform -translate-x-1/2">
                <StageButton
                  stageNumber={3}
                  isLocked={isStageLocked(3)}
                  onClick={() => handleStageClick(3)}
                />
              </div>

              {/* 스테이지 4 - 스테이지 3 위 */}
              <div className="absolute bottom-[400px] left-5/9 transform -translate-x-1/2">
                <StageButton
                  stageNumber={4}
                  isLocked={isStageLocked(4)}
                  onClick={() => handleStageClick(4)}
                />
              </div>

              {/* 스테이지 5 - 스테이지 4 위 */}
              <div className="absolute bottom-[520px] left-1/2 transform -translate-x-1/2">
                <StageButton
                  stageNumber={5}
                  isLocked={isStageLocked(5)}
                  onClick={() => handleStageClick(5)}
                />
              </div>
            </>
          ) : (
            // 일반 화면용 배치
            <>
              {/* 스테이지 1 - 하단 */}
              <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2">
                <StageButton
                  stageNumber={1}
                  isLocked={isStageLocked(1)}
                  onClick={() => handleStageClick(1)}
                />
              </div>

              {/* 스테이지 2 - 스테이지 1 위 */}
              <div className="absolute bottom-[200px] left-5/9 transform -translate-x-1/2">
                <StageButton
                  stageNumber={2}
                  isLocked={isStageLocked(2)}
                  onClick={() => handleStageClick(2)}
                />
              </div>

              {/* 스테이지 3 - 스테이지 2 위 */}
              <div className="absolute bottom-[340px] left-4/10 transform -translate-x-1/2">
                <StageButton
                  stageNumber={3}
                  isLocked={isStageLocked(3)}
                  onClick={() => handleStageClick(3)}
                />
              </div>

              {/* 스테이지 4 - 스테이지 3 위 */}
              <div className="absolute bottom-[440px] left-6/9 transform -translate-x-1/2">
                <StageButton
                  stageNumber={4}
                  isLocked={isStageLocked(4)}
                  onClick={() => handleStageClick(4)}
                />
              </div>

              {/* 스테이지 5 - 스테이지 4 위 */}
              <div className="absolute bottom-[580px] left-1/2 transform -translate-x-1/2">
                <StageButton
                  stageNumber={5}
                  isLocked={isStageLocked(5)}
                  onClick={() => handleStageClick(5)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

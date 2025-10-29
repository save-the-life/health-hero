"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import GameHeader from "@/components/GameHeader";
import { Clickable } from "@/components/SoundButton";
import { useAudio } from "@/hooks/useAudio";

export default function GamePage() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { currentPhase, hearts, isLoading, error, loadUserData, updateHearts } =
    useGameStore();
  const { playBackgroundMusic } = useAudio();

  // 화면 높이 감지
  const [screenHeight, setScreenHeight] = useState(0);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setScreenHeight(window.innerHeight);
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

  // 배경음악 재생 (메인 페이지 진입 시 - 이미 재생 중이면 스킵)
  useEffect(() => {
    // 배경음악이 이미 재생 중인지 확인 (로그인 버튼 클릭 시 이미 재생됨)
    const checkAndPlay = async () => {
      // AudioService의 배경음악 상태 확인은 내부에서 처리하므로
      // 여기서는 재생 시도만 함 (재생 중이면 자동으로 스킵됨)
      console.log("🎵 [게임페이지] 배경음악 상태 확인 및 재생 시도");
      await playBackgroundMusic();
    };
    
    checkAndPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // 반응형 스타일 계산
  const getResponsiveStyle = () => {
    const baseHeight = 700; // 기준 화면 높이 (700px 이상)

    if (screenHeight === 0) {
      return {
        phase1: {
          bottom: 20,
          right: 24,
          size: { width: 150, height: 160 },
        },
        phase2: {
          bottom: 180,
          left: 24,
          size: { width: 150, height: 160 },
        },
        phase3: {
          bottom: 340,
          right: 24,
          size: { width: 150, height: 160 },
        },
        phase4: {
          bottom: 500,
          left: 24,
          size: { width: 150, height: 160 },
        },
        scale: 1,
        spacing: 1,
        blockSize: 1,
      };
    }

    // 화면이 700px 이상이면 정상 크기
    if (screenHeight >= 700) {
      return {
        phase1: {
          bottom: 20,
          right: 24,
          size: { width: 150, height: 160 },
        },
        phase2: {
          bottom: 180,
          left: 24,
          size: { width: 150, height: 160 },
        },
        phase3: {
          bottom: 340,
          right: 24,
          size: { width: 150, height: 160 },
        },
        phase4: {
          bottom: 500,
          left: 24,
          size: { width: 150, height: 160 },
        },
        scale: 1,
        spacing: 1,
        blockSize: 1,
      };
    }

    // 화면이 700px 미만이면 축소
    const scale = Math.max(0.7, screenHeight / baseHeight);
    const spacing = screenHeight < 600 ? 0.8 : 0.9;
    const blockSize = screenHeight < 600 ? 0.85 : 0.95;

    return {
      phase1: {
        bottom: 20 * spacing,
        right: 30 * blockSize,
        size: { width: 130 * blockSize, height: 140 * blockSize },
      },
      phase2: {
        bottom: 160 * spacing,
        left: 30 * blockSize,
        size: { width: 130 * blockSize, height: 140 * blockSize },
      },
      phase3: {
        bottom: 320 * spacing,
        right: 30 * blockSize,
        size: { width: 130 * blockSize, height: 140 * blockSize },
      },
      phase4: {
        bottom: 480 * spacing,
        left: 30 * blockSize,
        size: { width: 130 * blockSize, height: 140 * blockSize },
      },
      scale,
      spacing,
      blockSize,
    };
  };

  const responsiveStyle = getResponsiveStyle();

  // 페이즈 상태에 따른 이미지 경로 반환
  const getPhaseImage = (phaseNumber: number): string => {
    // 페이즈 1은 항상 활성화
    if (phaseNumber === 1) {
      return "/images/items/icon-phase1.png";
    }

    // 사용자의 현재 페이즈를 기반으로 활성화 상태 결정
    // 현재 페이즈보다 낮은 페이즈는 모두 클리어된 것으로 간주
    if (phaseNumber <= currentPhase) {
      return `/images/items/icon-phase${phaseNumber}.png`;
    }

    // 현재 페이즈보다 높은 페이즈는 잠금 상태
    return "/images/items/icon-locked-phase.png";
  };

  // 페이즈 클릭 핸들러
  const handlePhaseClick = (phaseNumber: number) => {
    // 현재 페이즈와 동일한 페이즈만 클릭 가능 (클리어된 페이즈는 접근 불가)
    if (phaseNumber !== currentPhase) {
      return;
    }

    // 스테이지 맵 페이지로 이동
    router.push(`/game/phase${phaseNumber}`);
  };

  // 로딩 중이거나 에러가 있으면 표시
  if (isLoading) {
    return (
      <div className="relative h-screen overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/background-main.png"
            alt="헬스 히어로 메인 배경"
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
      <div className="relative h-screen overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/background-main.png"
            alt="헬스 히어로 메인 배경"
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
      <div className="relative h-screen overflow-hidden flex items-center justify-center" style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="text-center">
          <div className="text-white text-xl mb-4">로그인이 필요합니다</div>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
              홈으로 돌아가기
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-screen overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/background-main.png"
          alt="헬스 히어로 메인 배경"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 고정 헤더 */}
      <GameHeader pageType="main" />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full h-screen pt-[20px] pb-4 overflow-hidden">
        {/* 페이즈 블록들 */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            height: "100%",
          }}
        >
          {/* 페이즈 1 - 우측 하단 */}
          <Clickable
            as="div"
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${
              currentPhase === 1
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "cursor-not-allowed"
            }`}
            onClick={() => handlePhaseClick(1)}
            playClickSound={currentPhase === 1}
            style={{
              bottom: `${responsiveStyle.phase1.bottom}px`,
              right: `${responsiveStyle.phase1.right}px`,
              width: `${responsiveStyle.phase1.size.width}px`,
              height: `${responsiveStyle.phase1.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <Image
                src={getPhaseImage(1)}
                alt="페이즈 1"
                width={120}
                height={120}
                className={`${currentPhase > 1 ? "blur-sm" : ""}`}
                style={{
                  transform: `scale(${responsiveStyle.blockSize})`,
                }}
              />
              {/* 클리어 체크 아이콘 */}
              {currentPhase > 1 && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <Image
                    src="/images/items/icon-check.png"
                    alt="클리어"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          </Clickable>

          {/* 페이즈 2 - 좌측 중앙 */}
          <Clickable
            as="div"
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${
              currentPhase === 2
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "cursor-not-allowed"
            }`}
            onClick={() => handlePhaseClick(2)}
            playClickSound={currentPhase === 2} // 현재 페이즈인 경우에만 클릭 사운드 재생
            style={{
              bottom: `${responsiveStyle.phase2.bottom}px`,
              left: `${responsiveStyle.phase2.left}px`,
              width: `${responsiveStyle.phase2.size.width}px`,
              height: `${responsiveStyle.phase2.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <Image
                src={getPhaseImage(2)}
                alt="페이즈 2"
                width={120}
                height={120}
                className={`${currentPhase > 2 ? "blur-sm" : ""}`}
                style={{
                  transform: `scale(${responsiveStyle.blockSize})`,
                }}
              />
              {/* 클리어 체크 아이콘 */}
              {currentPhase > 2 && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <Image
                    src="/images/items/icon-check.png"
                    alt="클리어"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          </Clickable>

          {/* 페이즈 3 - 우측 상단 */}
          <Clickable
            as="div"
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${
              currentPhase === 3
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "cursor-not-allowed"
            }`}
            onClick={() => handlePhaseClick(3)}
            playClickSound={currentPhase === 3} // 현재 페이즈인 경우에만 클릭 사운드 재생
            style={{
              bottom: `${responsiveStyle.phase3.bottom}px`,
              right: `${responsiveStyle.phase3.right}px`,
              width: `${responsiveStyle.phase3.size.width}px`,
              height: `${responsiveStyle.phase3.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <Image
                src={getPhaseImage(3)}
                alt="페이즈 3"
                width={120}
                height={120}
                className={`${currentPhase > 3 ? "blur-sm" : ""}`}
                style={{
                  transform: `scale(${responsiveStyle.blockSize})`,
                }}
              />
              {/* 클리어 체크 아이콘 */}
              {currentPhase > 3 && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <Image
                    src="/images/items/icon-check.png"
                    alt="클리어"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          </Clickable>

          {/* 페이즈 4 - 좌측 상단 */}
          <Clickable
            as="div"
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${
              currentPhase === 4
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "cursor-not-allowed"
            }`}
            onClick={() => handlePhaseClick(4)}
            playClickSound={currentPhase === 4} // 현재 페이즈인 경우에만 클릭 사운드 재생
            style={{
              bottom: `${responsiveStyle.phase4.bottom}px`,
              left: `${responsiveStyle.phase4.left}px`,
              width: `${responsiveStyle.phase4.size.width}px`,
              height: `${responsiveStyle.phase4.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <Image
                src={getPhaseImage(4)}
                alt="페이즈 4"
                width={120}
                height={120}
                className={`${currentPhase > 4 ? "blur-sm" : ""}`}
                style={{
                  transform: `scale(${responsiveStyle.blockSize})`,
                }}
              />
              {/* 클리어 체크 아이콘 */}
              {currentPhase > 4 && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <Image
                    src="/images/items/icon-check.png"
                    alt="클리어"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          </Clickable>

          {/* 페이즈 간 연결선 */}
          {/* 페이즈 1 → 페이즈 2 */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-0"
            style={{
              bottom: `${120 * responsiveStyle.spacing}px`,
            }}
          >
            <Image
              src="/images/ui/vector1.png"
              alt="페이즈 연결선"
              width={170}
              height={60}
              className="opacity-80"
              style={{
                transform: `scale(${responsiveStyle.blockSize})`,
              }}
            />
          </div>

          {/* 페이즈 2 → 페이즈 3 */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-0"
            style={{
              bottom: `${280 * responsiveStyle.spacing}px`,
            }}
          >
            <Image
              src="/images/ui/vector2.png"
              alt="페이즈 연결선"
              width={170}
              height={60}
              className="opacity-80"
              style={{
                transform: `scale(${responsiveStyle.blockSize})`,
              }}
            />
          </div>

          {/* 페이즈 3 → 페이즈 4 */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-0"
            style={{
              bottom: `${440 * responsiveStyle.spacing}px`,
            }}
          >
            <Image
              src="/images/ui/vector1.png"
              alt="페이즈 연결선"
              width={170}
              height={60}
              className="opacity-80"
              style={{
                transform: `scale(${responsiveStyle.blockSize})`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

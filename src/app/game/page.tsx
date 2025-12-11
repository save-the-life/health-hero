"use client";

import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import GameHeader from "@/components/GameHeader";
import { Clickable } from "@/components/SoundButton";
import { useAudio } from "@/hooks/useAudio";
import AttendanceModal from "@/components/AttendanceModal";
import { promotionService } from "@/services/promotionService";
import { GameAuthService } from "@/services/gameAuthService";

export default function GamePage() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { currentPhase, hearts, isLoading, error, loadUserData, updateHearts } =
    useGameStore();
  const { playBackgroundMusic } = useAudio();

  // 출석 모달 상태
  const { attendance, setAttendance } = useAuthStore();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceReward] = useState(false);

  const handleAttendanceReward = useCallback(async () => {
    if (!user?.id) return;

    // 3일 연속 출석 보상 지급 (20원)
    try {
      console.log("🎉 3일 연속 출석 보상 지급 시도");

      // 1. 게임 유저 해시 가져오기
      const gameUserHash = GameAuthService.getGameUserHashFromStorage();

      if (!gameUserHash) {
        console.warn("⚠️ 게임 유저 해시가 로컬 스토리지에 없습니다. DB에서 조회 시도...");
        // DB에서 조회
        // const profile = await GameAuthService.findUserByGameHash(user.id); 
        // 대신 user_profiles에서 직접 조회해야 함. 하지만 여기서는 간단히 로컬 스토리지 의존.
        // 만약 없다면 지급 불가
        console.error("❌ 게임 유저 해시를 찾을 수 없어 보상을 지급할 수 없습니다.");
        return;
      }

      // 2. 프로모션 지급 요청
      // 테스트를 위해 isTest=true로 설정하거나, 설정된 코드를 사용
      // 사용자가 "아직 코드를 발급받지 않았다"고 했으므로, 기존 FIRST_QUIZ 코드를 사용하는 현재 설정(ATTENDANCE_3DAY -> FIRST_QUIZ)을 그대로 이용.
      // 실제 지급이 실패하더라도 로직 흐름은 확인 가능.
      const result = await promotionService.grantReward(
        user.id,
        gameUserHash,
        'ATTENDANCE_3DAY',
        false // 운영 모드 (실제 코드 사용)
      );

      if (result.success) {
        console.log("✅ 보상 지급 성공:", result.rewardKey);
        // 성공 처리 (예: 토스트 메시지 등)
      } else {
        console.warn("⚠️ 보상 지급 실패:", result.message);
        // 실패 처리
      }
    } catch (error) {
      console.error("보상 지급 실패:", error);
    }
  }, [user?.id]);

  // 출석 체크 확인
  useEffect(() => {
    const checkAttendance = async () => {
      if (attendance) {
        // 3일 연속 출석인 경우
        if (attendance.new_streak === 3) {
          if (!user?.id) return;

          // 이미 보상을 받았는지 확인
          const gameUserHash = GameAuthService.getGameUserHashFromStorage();
          if (gameUserHash) {
            const isGranted = await promotionService.checkAlreadyGranted(
              user.id,
              gameUserHash,
              'ATTENDANCE_3DAY'
            );

            if (isGranted) {
              console.log("📅 [GamePage] 이미 3일 출석 보상을 받았습니다. 모달 표시 안함.");
              return;
            }
          }

          // 보상을 아직 안 받았다면 모달 표시 및 보상 지급 시도
          console.log("📅 [GamePage] 3일 출석 달성! 모달 표시 및 보상 지급 시도");
          setShowAttendanceModal(true);
          handleAttendanceReward();
        } else {
          // 3일차가 아니면 그냥 모달 표시
          console.log("📅 [GamePage] 출석 체크 모달 표시:", attendance);
          setShowAttendanceModal(true);
        }
      }
    };

    checkAttendance();
  }, [attendance, handleAttendanceReward, user?.id]);

  const closeAttendanceModal = () => {
    setShowAttendanceModal(false);
    // setAttendance(null); // 모달 닫으면 상태 초기화하여 다시 안 뜨게 함 -> 버그 수정: null로 초기화하면 설정 메뉴에서도 사라짐

    // 대신 is_first_login_today만 false로 변경하여 오늘 다시 안 뜨게 함
    // setAttendance({
    //   ...attendance,
    //   is_first_login_today: false
    // });
  };

  // 화면 높이 감지
  const [screenHeight, setScreenHeight] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setScreenHeight(window.innerHeight);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 초기 로드 시 및 화면 크기 변경 시 스크롤 최하단으로 이동
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [screenHeight, isLoading]); // 화면 크기가 변경되거나 로딩이 끝났을 때 스크롤 이동

  // 컴포넌트 마운트 시 인증 상태 초기화 및 데이터 로드
  useEffect(() => {
    initialize();
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

    // 공통 설정
    const getPhaseStyle = (index: number, isSmallScreen: boolean, spacing: number = 1, blockSize: number = 1) => {
      const baseBottom = 20 + (index - 1) * 160;
      const isRight = index % 2 !== 0;

      if (!isSmallScreen) {
        return {
          bottom: baseBottom,
          [isRight ? 'right' : 'left']: 24,
          size: { width: 150, height: 160 },
        };
      } else {
        return {
          bottom: baseBottom * spacing,
          [isRight ? 'right' : 'left']: 30 * blockSize,
          size: { width: 130 * blockSize, height: 140 * blockSize },
        };
      }
    };

    if (screenHeight === 0 || screenHeight >= 815) {
      return {
        phase1: getPhaseStyle(1, false),
        phase2: getPhaseStyle(2, false),
        phase3: getPhaseStyle(3, false),
        phase4: getPhaseStyle(4, false),
        phase5: getPhaseStyle(5, false),
        phase6: getPhaseStyle(6, false),
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
      phase1: getPhaseStyle(1, true, spacing, blockSize),
      phase2: getPhaseStyle(2, true, spacing, blockSize),
      phase3: getPhaseStyle(3, true, spacing, blockSize),
      phase4: getPhaseStyle(4, true, spacing, blockSize),
      phase5: getPhaseStyle(5, true, spacing, blockSize),
      phase6: getPhaseStyle(6, true, spacing, blockSize),
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
          <SafeImage
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
          <SafeImage
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
        <SafeImage
          src="/images/backgrounds/background-main.png"
          alt="헬스 히어로 메인 배경"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 고정 헤더 */}
      <GameHeader
        pageType="main"
        onShowAttendance={() => setShowAttendanceModal(true)}
      />

      {/* 메인 콘텐츠 */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full h-screen pt-[20px] pb-4 overflow-y-auto no-scrollbar"
      >
        {/* 페이즈 블록들 */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            height: "1100px",
          }}
        >
          {/* 페이즈 1 - 우측 하단 */}
          <Clickable
            as="div"
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${currentPhase === 1
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
              <SafeImage
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
                  <SafeImage
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
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${currentPhase === 2
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : "cursor-not-allowed"
              }`}
            onClick={() => handlePhaseClick(2)}
            playClickSound={currentPhase === 2}
            style={{
              bottom: `${responsiveStyle.phase2.bottom}px`,
              left: `${responsiveStyle.phase2.left}px`,
              width: `${responsiveStyle.phase2.size.width}px`,
              height: `${responsiveStyle.phase2.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <SafeImage
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
                  <SafeImage
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
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${currentPhase === 3
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : "cursor-not-allowed"
              }`}
            onClick={() => handlePhaseClick(3)}
            playClickSound={currentPhase === 3}
            style={{
              bottom: `${responsiveStyle.phase3.bottom}px`,
              right: `${responsiveStyle.phase3.right}px`,
              width: `${responsiveStyle.phase3.size.width}px`,
              height: `${responsiveStyle.phase3.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <SafeImage
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
                  <SafeImage
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
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${currentPhase === 4
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : "cursor-not-allowed"
              }`}
            onClick={() => handlePhaseClick(4)}
            playClickSound={currentPhase === 4}
            style={{
              bottom: `${responsiveStyle.phase4.bottom}px`,
              left: `${responsiveStyle.phase4.left}px`,
              width: `${responsiveStyle.phase4.size.width}px`,
              height: `${responsiveStyle.phase4.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <SafeImage
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
                  <SafeImage
                    src="/images/items/icon-check.png"
                    alt="클리어"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          </Clickable>

          {/* 페이즈 5 - 우측 */}
          <Clickable
            as="div"
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${currentPhase === 5
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : "cursor-not-allowed"
              }`}
            onClick={() => handlePhaseClick(5)}
            playClickSound={currentPhase === 5}
            style={{
              bottom: `${responsiveStyle.phase5.bottom}px`,
              right: `${responsiveStyle.phase5.right}px`,
              width: `${responsiveStyle.phase5.size.width}px`,
              height: `${responsiveStyle.phase5.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <SafeImage
                src={getPhaseImage(5)}
                alt="페이즈 5"
                width={120}
                height={120}
                className={`${currentPhase > 5 ? "blur-sm" : ""}`}
                style={{
                  transform: `scale(${responsiveStyle.blockSize})`,
                }}
              />
              {/* 클리어 체크 아이콘 */}
              {currentPhase > 5 && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <SafeImage
                    src="/images/items/icon-check.png"
                    alt="클리어"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          </Clickable>

          {/* 페이즈 6 - 좌측 */}
          <Clickable
            as="div"
            className={`absolute rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ${currentPhase === 6
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : "cursor-not-allowed"
              }`}
            onClick={() => handlePhaseClick(6)}
            playClickSound={currentPhase === 6}
            style={{
              bottom: `${responsiveStyle.phase6.bottom}px`,
              left: `${responsiveStyle.phase6.left}px`,
              width: `${responsiveStyle.phase6.size.width}px`,
              height: `${responsiveStyle.phase6.size.height}px`,
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <SafeImage
                src={getPhaseImage(6)}
                alt="페이즈 6"
                width={120}
                height={120}
                className={`${currentPhase > 6 ? "blur-sm" : ""}`}
                style={{
                  transform: `scale(${responsiveStyle.blockSize})`,
                }}
              />
              {/* 클리어 체크 아이콘 */}
              {currentPhase > 6 && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <SafeImage
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
            <SafeImage
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
            <SafeImage
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
            <SafeImage
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

          {/* 페이즈 4 → 페이즈 5 */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-0"
            style={{
              bottom: `${600 * responsiveStyle.spacing}px`,
            }}
          >
            <SafeImage
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

          {/* 페이즈 5 → 페이즈 6 */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-0"
            style={{
              bottom: `${760 * responsiveStyle.spacing}px`,
            }}
          >
            <SafeImage
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

      {/* 출석 체크 모달 */}
      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={closeAttendanceModal}
        streak={attendance?.new_streak || 1}
        isReward={attendanceReward}
        rewardAmount={20}
      />

    </div>
  );
}

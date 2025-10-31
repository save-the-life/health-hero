"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import SettingsDropdown from "./SettingsDropdown";
import ItemInfoModal from "./ItemInfoModal";
import ItemUseModal from "./ItemUseModal";
import { SoundButton } from "./SoundButton";
import { SafeImage } from "./SafeImage";

interface GameHeaderProps {
  pageType?: "main" | "quiz"; // 페이지 타입 추가
  onItemUse?: (itemId: string) => void; // 아이템 사용 콜백 추가
  onShowItemUseModal?: (showModal: (itemId: string) => void) => void; // 아이템 사용 모달 표시 콜백 추가
}

export default function GameHeader({
  pageType = "quiz",
  onItemUse,
  onShowItemUseModal,
}: GameHeaderProps) {
  const router = useRouter();
  const {
    level,
    totalScore,
    hearts,
    heartTimer,
    updateHearts,
    calculateHeartTimer,
  } = useGameStore();

  const [currentTimer, setCurrentTimer] = useState(heartTimer);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showItemInfoModal, setShowItemInfoModal] = useState(false);
  const [showItemUseModal, setShowItemUseModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  
  // 화면 너비 감지
  const [screenWidth, setScreenWidth] = useState(0);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setScreenWidth(window.innerWidth);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 아이템 사용 핸들러
  const handleItemUse = (itemId: string) => {
    console.log(`${itemId}이 사용되었습니다.`);
    onItemUse?.(itemId);
  };

  // 아이템 사용 모달 표시 함수
  const showItemUseModalForItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowItemUseModal(true);
  };

  // 외부에서 아이템 사용 모달을 표시할 수 있도록 콜백 설정
  useEffect(() => {
    if (onShowItemUseModal) {
      onShowItemUseModal(showItemUseModalForItem);
    }
  }, [onShowItemUseModal]);
  useEffect(() => {
    if (!hearts || hearts.current_hearts >= 5) {
      setCurrentTimer("충전 완료");
      return;
    }

    const updateTimer = () => {
      const timer = calculateHeartTimer(
        hearts.last_refill_at,
        hearts.current_hearts
      );
      setCurrentTimer(timer);

      // 타이머가 0이 되면 하트 업데이트 시도
      if (timer === "충전 완료") {
        updateHearts();
      }
    };

    // 즉시 업데이트
    updateTimer();

    // 1초마다 업데이트
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [hearts, calculateHeartTimer, updateHearts]);

  // 레벨에 따른 캐릭터 이미지 경로 반환
  const getCharacterImage = (level: number): string => {
    // 레벨 범위별로 명시적 매핑
    let imagePath: string;
    if (level >= 20) {
      imagePath = "/images/characters/level-20.png";
    } else if (level >= 15) {
      imagePath = "/images/characters/level-15.png";
    } else if (level >= 10) {
      imagePath = "/images/characters/level-10.png";
    } else if (level >= 5) {
      imagePath = "/images/characters/level-5.png";
    } else {
      // 1-4 레벨은 모두 level-1.png 사용
      imagePath = "/images/characters/level-1.png";
    }

    // 캐시 문제 해결을 위한 쿼리 파라미터 추가
    return `${imagePath}?v=${level}`;
  };

  // 하트 타이머 텍스트 반환
  const getHeartTimerText = (): string => {
    if (!hearts) return "로딩 중...";
    return currentTimer;
  };

  // 반응형 스타일 계산 (너비 기반)
  const getResponsiveStyle = () => {
    if (screenWidth === 0) {
      return {
        container: {
          padding: "px-6",
          height: "h-[60px]",
        },
        character: {
          background: { width: 40, height: 40 },
          image: { width: 30, height: 30 },
          levelBlock: { width: 70, height: 24, left: "left-6" },
          levelText: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-6" },
        },
        heart: {
          icon: { width: 48, height: 48 },
          number: { fontSize: "text-base" },
          timerBlock: { width: 70, height: 24, left: "left-6" },
          timerText: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-6" },
        },
        score: {
          icon: { width: 40, height: 40 },
          block: { width: 70, height: 24, left: "left-4" },
          text: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-4" },
        },
        settings: {
          button: { width: 24, height: 24 },
        },
        gap: "gap-5",
      };
    }

    // 작은 화면 (320px ~ 375px): iPhone SE, 작은 모바일
    if (screenWidth <= 360) {
      return {
        container: {
          padding: "px-4",
          height: "h-[50px]",
        },
        character: {
          background: { width: 34, height: 34 },
          image: { width: 26, height: 26 },
          levelBlock: { width: 55, height: 20, left: "left-[20px]" },
          levelText: { fontSize: "text-[9px]", width: "w-[55px]", left: "left-[22px]" },
        },
        heart: {
          icon: { width: 38, height: 38 },
          number: { fontSize: "text-sm" },
          timerBlock: { width: 55, height: 20, left: "left-[20px]" },
          timerText: { fontSize: "text-[9px]", width: "w-[55px]", left: "left-[20px]" },
        },
        score: {
          icon: { width: 34, height: 34 },
          block: { width: 55, height: 20, left: "left-[18px]" },
          text: { fontSize: "text-[9px]", width: "w-[55px]", left: "left-[18px]" },
        },
        settings: {
          button: { width: 20, height: 20 },
        },
        gap: "gap-2",
      };
    }

    // 중간 화면 (375px ~ 640px): 일반 모바일
    if (screenWidth <= 640) {
      return {
        container: {
          padding: "px-6",
          height: "h-[55px]",
        },
        character: {
          background: { width: 40, height: 40 },
          image: { width: 30, height: 30 },
          levelBlock: { width: 70, height: 24, left: "left-6" },
          levelText: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-6" },
        },
        heart: {
          icon: { width: 48, height: 48 },
          number: { fontSize: "text-[15px]" },
          timerBlock: { width: 70, height: 24, left: "left-6" },
          timerText: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-6" },
        },
        score: {
          icon: { width: 40, height: 40 },
          block: { width: 70, height: 24, left: "left-4" },
          text: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-4" },
        },
        settings: {
          button: { width: 24, height: 24 },
        },
        gap: "gap-5",
      };
    }

    // 큰 화면 (640px 이상): 태블릿, 데스크탑
    return {
      container: {
        padding: "px-6",
        height: "h-[60px]",
      },
      character: {
        background: { width: 40, height: 40 },
        image: { width: 30, height: 30 },
        levelBlock: { width: 70, height: 24, left: "left-6" },
        levelText: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-6" },
      },
      heart: {
        icon: { width: 48, height: 48 },
        number: { fontSize: "text-base" },
        timerBlock: { width: 70, height: 24, left: "left-6" },
        timerText: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-6" },
      },
      score: {
        icon: { width: 40, height: 40 },
        block: { width: 70, height: 24, left: "left-4" },
        text: { fontSize: "text-[10px]", width: "w-[70px]", left: "left-4" },
      },
      settings: {
        button: { width: 24, height: 24 },
      },
      gap: "gap-5",
    };
  };

  const responsiveStyle = getResponsiveStyle();

  return (
    <div className="fixed top-20 left-0 right-0 z-30 bg-transparent">
      <div className={`flex items-center justify-between ${responsiveStyle.container.padding} py-3 ${responsiveStyle.container.height}`}>
        {/* 캐릭터 & 레벨 */}
        <div className={`flex items-center ${responsiveStyle.gap}`}>
          <div className="relative">
            {/* 캐릭터 원형 배경 */}
            <SafeImage
              src="/images/ui/block02.png"
              alt="캐릭터 배경"
              width={responsiveStyle.character.background.width}
              height={responsiveStyle.character.background.height}
              className="relative z-10"
              style={{
                width: `${responsiveStyle.character.background.width}px`,
                height: `${responsiveStyle.character.background.height}px`,
              }}
              priority
            />
            {/* 캐릭터 이미지 */}
            <SafeImage
              key={`character-${level}`}
              src={getCharacterImage(level)}
              alt="캐릭터"
              width={responsiveStyle.character.image.width}
              height={responsiveStyle.character.image.height}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                width: `${responsiveStyle.character.image.width}px`,
                height: `${responsiveStyle.character.image.height}px`,
              }}
              priority
            />
            {/* 레벨 블록 */}
            <SafeImage
              src="/images/ui/block01.png"
              alt="레벨 배경"
              width={responsiveStyle.character.levelBlock.width}
              height={responsiveStyle.character.levelBlock.height}
              className={`absolute top-1/2 ${responsiveStyle.character.levelBlock.left} transform -translate-y-1/2 z-0`}
              style={{
                width: `${responsiveStyle.character.levelBlock.width}px`,
                height: `${responsiveStyle.character.levelBlock.height}px`,
                minWidth: `${responsiveStyle.character.levelBlock.width}px`,
                minHeight: `${responsiveStyle.character.levelBlock.height}px`,
              }}
              priority
            />
            {/* 레벨 텍스트 */}
            <span 
              className={`no-text-stroke absolute top-1/2 ${responsiveStyle.character.levelText.left} transform -translate-y-1/2 z-10 ${responsiveStyle.character.levelText.fontSize} font-bold whitespace-nowrap flex items-center justify-center ${responsiveStyle.character.levelText.width} ml-1`}
              style={{ color: '#683A11' }}
            >
              Lv.{level}
            </span>
          </div>
        </div>

        {/* 하트 */}
        <div className={`flex items-center ${responsiveStyle.gap}`}>
          <div className="relative">
            {/* 하트 아이콘 */}
            <SafeImage
              src="/images/items/icon-heart.png"
              alt="하트"
              width={responsiveStyle.heart.icon.width}
              height={responsiveStyle.heart.icon.height}
              className="relative z-10"
              style={{
                width: `${responsiveStyle.heart.icon.width}px`,
                height: `${responsiveStyle.heart.icon.height}px`,
              }}
              priority
            />
            {/* 하트 내부 숫자 */}
            <span 
              className={`no-text-stroke absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 ${responsiveStyle.heart.number.fontSize} font-normal`}
              style={{ color: '#ffffff' }}
            >
              {hearts?.current_hearts ?? 0}
            </span>
            {/* 광고 버튼 */}
            {/* <SafeImage
              src="/images/items/button-ad.png"
              alt="광고 버튼"
              width={16}
              height={16}
              className="absolute bottom-1 right-1 z-20"
            /> */}
            {/* 타이머 블록 */}
            <SafeImage
              src="/images/ui/block01.png"
              alt="타이머 배경"
              width={responsiveStyle.heart.timerBlock.width}
              height={responsiveStyle.heart.timerBlock.height}
              className={`absolute top-1/2 ${responsiveStyle.heart.timerBlock.left} transform -translate-y-1/2 z-0`}
              style={{
                width: `${responsiveStyle.heart.timerBlock.width}px`,
                height: `${responsiveStyle.heart.timerBlock.height}px`,
                minWidth: `${responsiveStyle.heart.timerBlock.width}px`,
                minHeight: `${responsiveStyle.heart.timerBlock.height}px`,
              }}
              priority
            />
            {/* 타이머 텍스트 */}
            <span 
              className={`no-text-stroke absolute top-1/2 ${responsiveStyle.heart.timerText.left} transform -translate-y-1/2 z-10 ${responsiveStyle.heart.timerText.fontSize} font-bold whitespace-nowrap flex items-center justify-center ${responsiveStyle.heart.timerText.width} ml-1`}
              style={{ color: '#683A11' }}
            >
              {getHeartTimerText()}
            </span>
          </div>
        </div>

        {/* 점수 */}
        <div className={`flex items-center ${responsiveStyle.gap}`}>
          <div className="relative">
            {/* 별 아이콘 */}
            <SafeImage
              src="/images/items/Icon-star.png"
              alt="별"
              width={responsiveStyle.score.icon.width}
              height={responsiveStyle.score.icon.height}
              className="relative z-10"
              style={{
                width: `${responsiveStyle.score.icon.width}px`,
                height: `${responsiveStyle.score.icon.height}px`,
              }}
              priority
            />
            {/* 점수 블록 */}
            <SafeImage
              src="/images/ui/block01.png"
              alt="점수 배경"
              width={responsiveStyle.score.block.width}
              height={responsiveStyle.score.block.height}
              className={`absolute top-1/2 ${responsiveStyle.score.block.left} transform -translate-y-1/2 z-0`}
              style={{
                width: `${responsiveStyle.score.block.width}px`,
                height: `${responsiveStyle.score.block.height}px`,
                minWidth: `${responsiveStyle.score.block.width}px`,
                minHeight: `${responsiveStyle.score.block.height}px`,
              }}
              priority
            />
            {/* 점수 텍스트 */}
            <span 
              className={`no-text-stroke absolute top-1/2 ${responsiveStyle.score.text.left} transform -translate-y-1/2 z-10 ${responsiveStyle.score.text.fontSize} font-bold whitespace-nowrap flex items-center justify-center ${responsiveStyle.score.text.width} ml-1`}
              style={{ color: '#683A11' }}
            >
              {totalScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 설정 버튼 */}
        {!showSettingsMenu && (
          <div className="flex items-center">
            <SoundButton
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="hover:opacity-80 transition-opacity"
            >
              <SafeImage
                src="/images/items/button-setting.png"
                alt="설정"
                width={responsiveStyle.settings.button.width}
                height={responsiveStyle.settings.button.height}
                className="cursor-pointer"
                style={{
                  width: `${responsiveStyle.settings.button.width}px`,
                  height: `${responsiveStyle.settings.button.height}px`,
                }}
              />
            </SoundButton>
          </div>
        )}
      </div>

      {/* 설정 드롭다운 메뉴 */}
      <SettingsDropdown
        isOpen={showSettingsMenu}
        onClose={() => setShowSettingsMenu(false)}
        onShowExitModal={() => setShowExitModal(true)}
        onShowItemInfoModal={() => setShowItemInfoModal(true)}
        pageType={pageType}
      />

      {/* 나가기 확인 모달 */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 블러 오버레이 */}
          <div className="absolute inset-0 backdrop-blur-md" />

          {/* 모달 컨테이너 */}
          <div className="relative z-10">
            <SafeImage
              src="/images/ui/popup-failed.png"
              alt="나가기 확인"
              width={324}
              height={440}
              className="object-cover"
              priority
            />

            {/* X 닫기 버튼 - 우측 상단 */}
            <SoundButton
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <span className="text-white text-xl font-bold">×</span>
            </SoundButton>

            {/* 종료할까요? 텍스트 - 상단으로부터 38px */}
            <div className="absolute top-[38px] left-1/2 transform -translate-x-1/2">
              <h2 className="text-white text-stroke text-[32px] font-normal whitespace-nowrap">
                종료할까요?
              </h2>
            </div>

            {/* 하트 아이콘과 -1 텍스트 - 종료할까요? 텍스트로부터 80px 아래 */}
            <div className="absolute top-[150px] left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <SafeImage
                  src="/images/items/icon-heart.png"
                  alt="하트"
                  width={100}
                  height={100}
                  className="relative z-10"
                  priority
                />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-2xl font-bold" style={{ textShadow: 'none' }}>
                  -1
                </span>
              </div>
            </div>

            {/* 경고 메시지 - 하트 아이콘 바로 아래 */}
            <div className="absolute top-[250px] left-1/2 transform -translate-x-1/2">
              <p className="text-white text-stroke text-[18px] font-normal whitespace-nowrap">
                지금 나가면 하트를 잃게 돼요!
              </p>
            </div>

            {/* 나가기 버튼 - 하단 */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
              <SoundButton
                onClick={() => {
                  setShowExitModal(false);
                  // 현재 페이즈로 이동 (router.push 사용으로 더 빠른 네비게이션)
                  const currentPhase = useGameStore.getState().currentPhase;
                  router.push(`/game/phase${currentPhase}`);
                }}
                className="font-medium h-[56px] w-[160px] rounded-[10px] relative cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  background:
                    "linear-gradient(180deg, #50B0FF 0%, #50B0FF 50%, #008DFF 50%, #008DFF 100%)",
                  border: "2px solid #76C1FF",
                  outline: "2px solid #000000",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: "400",
                  WebkitTextStroke: "1px #000000",
                }}
              >
                {/* 버튼 포인트 이미지 */}
                <SafeImage
                  src="/images/items/button-point-blue.png"
                  alt="button-point-blue"
                  width={8.47}
                  height={6.3}
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    pointerEvents: "none",
                  }}
                />

                {/* 버튼 텍스트 */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 whitespace-nowrap"
                  style={{
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: "16px",
                      fontWeight: "400",
                      WebkitTextStroke: "1px #000000",
                      lineHeight: "1.2",
                    }}
                  >
                    나가기
                  </span>
                </div>
              </SoundButton>
            </div>
          </div>
        </div>
      )}

      {/* 아이템 설명 모달 */}
      <ItemInfoModal
        isOpen={showItemInfoModal}
        onClose={() => setShowItemInfoModal(false)}
      />

      {/* 아이템 사용 모달 */}
      <ItemUseModal
        isOpen={showItemUseModal}
        onClose={() => setShowItemUseModal(false)}
        itemId={selectedItemId}
        onUseItem={handleItemUse}
      />
    </div>
  );
}

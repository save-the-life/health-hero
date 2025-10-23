"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import SettingsDropdown from "./SettingsDropdown";
import ItemInfoModal from "./ItemInfoModal";
import ItemUseModal from "./ItemUseModal";

interface GameHeaderProps {
  pageType?: "main" | "quiz"; // 페이지 타입 추가
  onItemUse?: (itemId: string) => void; // 아이템 사용 콜백 추가
  onShowItemUseModal?: (showModal: (itemId: string) => void) => void; // 아이템 사용 모달 표시 콜백 추가
}

export default function GameHeader({ pageType = "quiz", onItemUse, onShowItemUseModal }: GameHeaderProps) {
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

  return (
    <div className="fixed top-6 left-0 right-0 z-30 bg-transparent">
      <div className="flex items-center justify-between px-6 py-3 h-[60px]">
        {/* 캐릭터 & 레벨 */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {/* 캐릭터 원형 배경 */}
            <Image
              src="/images/ui/block02.png"
              alt="캐릭터 배경"
              width={40}
              height={40}
              className="relative z-10"
            />
            {/* 캐릭터 이미지 */}
            <Image
              key={`character-${level}`}
              src={getCharacterImage(level)}
              alt="캐릭터"
              width={30}
              height={30}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            />
            {/* 레벨 블록 */}
            <Image
              src="/images/ui/block01.png"
              alt="레벨 배경"
              width={70}
              height={24}
              className="absolute top-1/2 left-6 transform -translate-y-1/2 z-0"
              style={{
                width: "70px",
                height: "24px",
                minWidth: "70px",
                minHeight: "24px",
              }}
            />
            {/* 레벨 텍스트 */}
            <span className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1">
              Lv.{level}
            </span>
          </div>
        </div>

        {/* 하트 */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {/* 하트 아이콘 */}
            <Image
              src="/images/items/icon-heart.png"
              alt="하트"
              width={44}
              height={44}
              className="relative z-10"
            />
            {/* 하트 내부 숫자 */}
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-base font-normal">
              {hearts?.current_hearts ?? 0}
            </span>
            {/* 광고 버튼 */}
            <Image
              src="/images/items/button-ad.png"
              alt="광고 버튼"
              width={16}
              height={16}
              className="absolute bottom-1 right-1 z-20"
            />
            {/* 타이머 블록 */}
            <Image
              src="/images/ui/block01.png"
              alt="타이머 배경"
              width={70}
              height={24}
              className="absolute top-1/2 left-6 transform -translate-y-1/2 z-0"
              style={{
                width: "70px",
                height: "24px",
                minWidth: "70px",
                minHeight: "24px",
              }}
            />
            {/* 타이머 텍스트 */}
            <span className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1">
              {getHeartTimerText()}
            </span>
          </div>
        </div>

        {/* 점수 */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {/* 별 아이콘 */}
            <Image
              src="/images/items/Icon-star.png"
              alt="별"
              width={40}
              height={40}
              className="relative z-10"
            />
            {/* 점수 블록 */}
            <Image
              src="/images/ui/block01.png"
              alt="점수 배경"
              width={70}
              height={24}
              className="absolute top-1/2 left-6 transform -translate-y-1/2 z-0"
              style={{
                width: "70px",
                height: "24px",
                minWidth: "70px",
                minHeight: "24px",
              }}
            />
            {/* 점수 텍스트 */}
            <span className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1">
              {totalScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 설정 버튼 */}
        {!showSettingsMenu && (
          <div className="flex items-center">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/items/button-setting.png"
                alt="설정"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </button>
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
            <Image
              src="/images/ui/popup-failed.png"
              alt="나가기 확인"
              width={324}
              height={440}
              className="object-cover"
            />

            {/* 종료할까요? 텍스트 - 상단으로부터 38px */}
            <div className="absolute top-[38px] left-1/2 transform -translate-x-1/2">
              <h2 className="text-black text-[32px] font-normal whitespace-nowrap">
                종료할까요?
              </h2>
            </div>

            {/* 하트 아이콘과 -1 텍스트 - 종료할까요? 텍스트로부터 80px 아래 */}
            <div className="absolute top-[150px] left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <Image
                  src="/images/items/icon-heart.png"
                  alt="하트"
                  width={100}
                  height={100}
                  className="relative z-10"
                />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-2xl font-bold">
                  -1
                </span>
              </div>
            </div>

            {/* 경고 메시지 - 하트 아이콘 바로 아래 */}
            <div className="absolute top-[250px] left-1/2 transform -translate-x-1/2">
              <p className="text-black text-[18px] font-normal whitespace-nowrap">
                지금 나가면 하트를 잃게 돼요!
              </p>
            </div>

            {/* 나가기 버튼 - 하단 */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
              <button
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
                <Image
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
              </button>
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

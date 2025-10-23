"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

interface HeartShortageModalProps {
  isOpen: boolean;
  currentPhase: number;
  onClose: () => void;
}

export default function HeartShortageModal({
  isOpen,
  currentPhase,
  onClose,
}: HeartShortageModalProps) {
  const router = useRouter();
  const { totalScore, buyHeartWithPoints } = useGameStore();

  if (!isOpen) return null;

  const handleBuyHeart = async () => {
    try {
      const success = await buyHeartWithPoints();
      if (success) {
        console.log("500 포인트로 하트 구매 성공");
        onClose();
      } else {
        console.log("하트 구매 실패");
      }
    } catch (error) {
      console.error("하트 구매 중 오류:", error);
    }
  };

  const handleExit = () => {
    onClose();
    // 현재 페이즈 페이지로 이동
    router.push(`/game/phase${currentPhase}`);
  };

  const handleAdClick = () => {
    console.log("광고 버튼 클릭.");
    // TODO: 광고 시청 로직 구현
  };

  const canBuyHeart = totalScore && totalScore >= 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 오버레이 */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* 모달 컨테이너 */}
      <div className="relative z-10">
        {/* 칠판 배경 */}
        <div className="relative">
          <Image
            src="/images/items/blackboard.png"
            alt="칠판"
            width={342}
            height={282}
            className="object-cover"
          />

          {/* 칠판 내용 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {/* 텍스트 */}
            <div className="text-center mb-4">
              <p
                className="text-white text-center font-normal leading-relaxed"
                style={{
                  fontSize: "18px",
                  fontWeight: "400",
                  lineHeight: "1.4",
                }}
              >
                이런,
                <br />
                퀴즈를 풀기 위한 하트가 부족해요!
              </p>
            </div>

            {/* 하트 이미지 */}
            <div className="relative mb-4">
              <Image
                src="/images/items/icon-heart.png"
                alt="하트"
                width={100}
                height={100}
                className="object-cover"
              />

              {/* 하트 중앙의 0 텍스트 */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  color: "#FFFFFF",
                  fontSize: "32px",
                  fontWeight: "bold",
                  textShadow: "2px 2px 0px #000000",
                }}
              >
                0
              </div>
            </div>

            {/* 타이머 영역 */}
            <div className="relative mb-6">
              {/* block01.png 배경 */}
              <Image
                src="/images/ui/block01.png"
                alt="타이머 배경"
                width={120}
                height={32}
                className="object-cover"
              />

              {/* 타이머 내용 */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* 타이머 아이콘 */}
                <Image
                  src="/images/items/icon-timer.png"
                  alt="타이머"
                  width={16}
                  height={16}
                  className="mr-2"
                />

                {/* 충전까지 남은 시간 */}
                <span
                  style={{
                    color: "#8B4513",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  4분 12초
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-4 justify-center mt-4">
          {/* 500 포인트 버튼 또는 나가기 버튼 */}
          {canBuyHeart ? (
            <button
              className="font-medium h-[56px] w-[140px] rounded-[10px] relative cursor-pointer hover:opacity-80 transition-opacity"
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
              onClick={handleBuyHeart}
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

              {/* 별 아이콘과 텍스트 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
                <Image
                  src="/images/items/Icon-star.png"
                  alt="별"
                  width={20}
                  height={20}
                />
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: "400",
                    WebkitTextStroke: "1px #000000",
                    lineHeight: "1.2",
                  }}
                >
                  500
                </span>
              </div>
            </button>
          ) : (
            <button
              className="font-medium h-[56px] w-[140px] rounded-[10px] relative cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background:
                  "linear-gradient(180deg, #FF6B6B 0%, #FF6B6B 50%, #E53E3E 50%, #E53E3E 100%)",
                border: "2px solid #FF8E8E",
                outline: "2px solid #000000",
                boxShadow:
                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: "400",
                WebkitTextStroke: "1px #000000",
              }}
              onClick={handleExit}
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

              {/* 나가기 텍스트 */}
              <span
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
            </button>
          )}

          {/* 광고 버튼 */}
          <button
            className="font-medium h-[56px] w-[140px] rounded-[10px] relative cursor-pointer hover:opacity-80 transition-opacity"
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
            onClick={handleAdClick}
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

            {/* 플레이 아이콘과 텍스트 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
              <div
                className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center"
                style={{
                  background: "#FF6B35",
                }}
              >
                <div
                  className="w-0 h-0 border-l-2 border-r-0 border-t-1 border-b-1 border-transparent border-l-white"
                  style={{
                    marginLeft: "2px",
                  }}
                />
              </div>
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: "400",
                  WebkitTextStroke: "1px #000000",
                  lineHeight: "1.2",
                }}
              >
                하트 받기
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

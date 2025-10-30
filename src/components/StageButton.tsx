"use client";

import { SafeImage } from "./SafeImage";
import { SoundButton } from "./SoundButton";

interface StageButtonProps {
  stageNumber: number;
  isLocked: boolean;
  onClick: () => void;
}

export default function StageButton({
  stageNumber,
  isLocked,
  onClick,
}: StageButtonProps) {
  return (
    <SoundButton
      className={`font-medium h-[64px] w-[64px] rounded-[10px] relative ${
        isLocked
          ? "cursor-not-allowed"
          : "cursor-pointer hover:opacity-80 transition-opacity"
      }`}
      style={{
        background:
          "linear-gradient(180deg, #50B0FF 0%, #50B0FF 50%, #008DFF 50%, #008DFF 100%)",
        border: "2px solid #76C1FF",
        outline: "2px solid #000000",
        boxShadow:
          "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
        color: "#FFFFFF",
        fontSize: "18px",
        fontWeight: "400",
        WebkitTextStroke: "1px #000000",
      }}
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      playClickSound={!isLocked} // 잠금 해제된 경우에만 클릭 사운드 재생
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

      {/* 잠금 아이콘 또는 스테이지 번호 */}
      {isLocked ? (
        <SafeImage
          src="/images/items/icon-lock.png"
          alt="잠금"
          width={40}
          height={40}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      ) : (
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "32px",
            fontWeight: "bold",
            color: "#FFFFFF",
            textShadow: "2px 2px 2px 2px #000000",
            pointerEvents: "none",
          }}
        >
          {stageNumber}
        </span>
      )}
    </SoundButton>
  );
}

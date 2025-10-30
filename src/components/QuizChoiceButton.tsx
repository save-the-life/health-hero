"use client";

import { SafeImage } from "./SafeImage";
import { SoundButton } from "./SoundButton";

interface QuizChoiceButtonProps {
  choice: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  width?: number;
  height?: number;
}

export default function QuizChoiceButton({
  choice,
  isSelected = false,
  isDisabled = false,
  onClick,
  width = 300,
  height = 56,
}: QuizChoiceButtonProps) {
  return (
    <SoundButton
      className={`font-medium rounded-[10px] relative transition-opacity ${
        isSelected ? "ring-2 ring-purple-400" : ""
      } ${
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:opacity-80"
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
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
      onClick={onClick}
      disabled={isDisabled}
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

      {/* 선택지 텍스트 */}
      <span
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          pointerEvents: "none",
          textAlign: "center",
          lineHeight: "1.2",
          width: "100%",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        {choice}
      </span>
    </SoundButton>
  );
}

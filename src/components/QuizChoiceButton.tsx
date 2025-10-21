'use client'

import Image from "next/image";

interface QuizChoiceButtonProps {
  choice: string;
  index: number;
  isSelected?: boolean;
  onClick: () => void;
}

export default function QuizChoiceButton({ 
  choice, 
  index, 
  isSelected = false, 
  onClick 
}: QuizChoiceButtonProps) {
  return (
    <button
      className={`font-medium h-[56px] w-[300px] rounded-[10px] relative cursor-pointer hover:opacity-80 transition-opacity ${
        isSelected ? 'ring-2 ring-purple-400' : ''
      }`}
      style={{
        background: "linear-gradient(180deg, #50B0FF 0%, #50B0FF 50%, #008DFF 50%, #008DFF 100%)",
        border: "2px solid #76C1FF",
        outline: "2px solid #000000",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "400",
        WebkitTextStroke: "1px #000000",
      }}
      onClick={onClick}
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
    </button>
  );
}

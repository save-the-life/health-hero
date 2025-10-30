"use client";

import { SafeImage } from "./SafeImage";
import { useState } from "react";
import { SoundButton } from "./SoundButton";

interface ItemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ItemData {
  id: string;
  icon: string;
  name: string;
  description: string;
  cost: number;
}

const items: ItemData[] = [
  {
    id: "remove-wrong",
    icon: "/images/items/icon-remove-wrong.png",
    name: "오답 삭제",
    description: "보기 중 오답 하나를 제거합니다.",
    cost: 50,
  },
  {
    id: "hint",
    icon: "/images/items/icon-hint.png",
    name: "힌트",
    description: "현재 문제의 힌트를 제공합니다.",
    cost: 80,
  },
  {
    id: "double-score",
    icon: "/images/items/icon-double.png",
    name: "점수 2배",
    description: "정답시 점수를 2배로 지급합니다.",
    cost: 100,
  },
  {
    id: "auto-answer",
    icon: "/images/items/icon-auto-answer.png",
    name: "자동 정답",
    description: "자동으로 정답을 알려줍니다.",
    cost: 200,
  },
];

export default function ItemInfoModal({ isOpen, onClose }: ItemInfoModalProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  if (!isOpen) return null;

  const currentItem = items[currentItemIndex];

  const handlePrevious = () => {
    setCurrentItemIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentItemIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 오버레이 */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* 모달 컨테이너 */}
      <div className="relative z-10">
        <SafeImage
          src="/images/ui/popup-success.png"
          alt="아이템 사용법"
          width={324}
          height={440}
          className="object-cover"
        />

        {/* 아이템 사용법 텍스트 - 상단으로부터 38px */}
        <div className="absolute top-[38px] left-1/2 transform -translate-x-1/2">
          <h2 className="text-white text-stroke text-[32px] font-normal whitespace-nowrap">
            아이템 사용법
          </h2>
        </div>

        {/* 닫기 버튼 - 우측 상단 */}
        <SoundButton
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <span className="text-white text-xl font-bold">×</span>
        </SoundButton>

        {/* 아이템 박스와 네비게이션 버튼 - 텍스트로부터 86px 아래 */}
        <div className="absolute top-[156px] left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          {/* 왼쪽 네비게이션 버튼 */}
          <SoundButton
            onClick={handlePrevious}
            className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <SafeImage
              src="/images/ui/block02.png"
              alt="이전"
              width={32}
              height={32}
              className="absolute"
            />
            <SafeImage
              src="/images/items/icon-left.png"
              alt="왼쪽"
              width={20}
              height={20}
              className="relative z-10"
            />
          </SoundButton>

          {/* 아이템 박스 */}
          <div
            className="w-[80px] h-[80px] bg-[#F5E6D3] rounded-lg flex items-center justify-center relative"
            style={{
              boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <SafeImage
              src={currentItem.icon}
              alt={currentItem.name}
              width={60}
              height={60}
              className="object-cover"
            />
          </div>

          {/* 오른쪽 네비게이션 버튼 */}
          <SoundButton
            onClick={handleNext}
            className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <SafeImage
              src="/images/ui/block02.png"
              alt="다음"
              width={32}
              height={32}
              className="absolute"
            />
            <SafeImage
              src="/images/items/icon-right.png"
              alt="오른쪽"
              width={20}
              height={20}
              className="relative z-10"
            />
          </SoundButton>
        </div>

        {/* 아이템 설명 텍스트 - 아이템 박스 아래 */}
        <div className="absolute top-[260px] left-1/2 transform -translate-x-1/2 w-[280px]">
          <p className="text-white text-stroke text-center text-base font-normal leading-relaxed">
            {currentItem.description}
          </p>
        </div>

        {/* 소모 점수 표시 - 하단 */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <button
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
              textShadow: "1px 1px 0px black",
            }}
          >
            {/* 버튼 포인트 이미지 */}
            <SafeImage
              src="/images/items/button-point-blue.png"
              alt="버튼 포인트"
              width={8.47}
              height={6.3}
              className="absolute top-[3px] left-[3px]"
            />

            {/* 텍스트와 별 아이콘 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <SafeImage
                src="/images/items/Icon-star.png"
                alt="별"
                width={20}
                height={20}
                className="object-cover"
              />
              <span className="whitespace-nowrap">{currentItem.cost}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

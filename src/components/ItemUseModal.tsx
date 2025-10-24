"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { SoundButton } from "./SoundButton";

interface ItemUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onUseItem: (itemId: string) => void;
}

const items = [
  {
    id: "remove-wrong",
    icon: "/images/items/icon-remove-wrong.png",
    name: "오답 제거",
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
    description: "정답 시 점수를 2배로 지급합니다.",
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

export default function ItemUseModal({
  isOpen,
  onClose,
  itemId,
  onUseItem,
}: ItemUseModalProps) {
  const [skipPopup, setSkipPopup] = useState(false);

  // 현재 아이템 정보 가져오기
  const currentItem = items.find((item) => item.id === itemId);

  // 체크박스 상태 로컬 스토리지에서 불러오기
  useEffect(() => {
    if (isOpen && currentItem) {
      const savedSkipState = localStorage.getItem(
        `item_skip_popup_${currentItem.id}`
      );
      setSkipPopup(savedSkipState === "true");
    }
  }, [isOpen, currentItem]);

  if (!isOpen || !currentItem) return null;

  const handleUseItem = () => {
    // 체크박스가 체크되어 있으면 로컬 스토리지에 저장
    if (skipPopup) {
      localStorage.setItem(`item_skip_popup_${currentItem.id}`, "true");
    }

    // 아이템 사용 처리
    onUseItem(currentItem.id);

    // 모달 닫기
    onClose();
  };

  const handleSkipPopupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkipPopup(e.target.checked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 오버레이 */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* 모달 컨테이너 */}
      <div className="relative z-10">
        <Image
          src="/images/ui/popup-success.png"
          alt="아이템 사용 배경"
          width={324}
          height={440}
          className="object-cover"
        />

        {/* 아이템 사용 텍스트 - 상단으로부터 38px */}
        <div className="absolute top-[38px] left-1/2 transform -translate-x-1/2">
          <h2 className="text-black text-[32px] font-normal whitespace-nowrap">
            아이템 사용
          </h2>
        </div>

        {/* 닫기 버튼 - 우측 상단 */}
        <SoundButton
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <span className="text-white text-xl font-bold">×</span>
        </SoundButton>

        {/* 아이템 박스 - 텍스트로부터 86px 아래 */}
        <div className="absolute top-[156px] left-1/2 transform -translate-x-1/2">
          <div
            className="w-[80px] h-[80px] flex items-center justify-center relative"
            style={{
              background:
                "linear-gradient(180deg, #B97951 0%, #B97951 50%, #A06A41 50%, #A06A41 100%)",
              border: "2px solid #D2A679",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <Image
              src={currentItem.icon}
              alt={currentItem.name}
              width={60}
              height={60}
              className="object-cover"
            />
          </div>
        </div>

        {/* 아이템 설명 텍스트 */}
        <div className="absolute top-[260px] left-1/2 transform -translate-x-1/2 w-[280px] text-center">
          <p className="text-black text-center text-sm font-normal leading-relaxed">
            {currentItem.description}
          </p>
        </div>

        {/* 사용 버튼 - 하단 */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <SoundButton
            onClick={handleUseItem}
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
            <Image
              src="/images/items/button-point-blue.png"
              alt="버튼 포인트"
              width={8.47}
              height={6.3}
              className="absolute top-[3px] left-[3px]"
            />

            {/* 텍스트와 별 아이콘 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <Image
                src="/images/items/Icon-star.png"
                alt="별"
                width={20}
                height={20}
                className="object-cover"
              />
              <span className="whitespace-nowrap">{currentItem.cost}</span>
            </div>
          </SoundButton>
        </div>

        {/* 체크박스 - 하단 */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <input
            type="checkbox"
            id="skip-popup"
            checked={skipPopup}
            onChange={handleSkipPopupChange}
            className="w-4 h-4 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="skip-popup"
            className="text-black text-sm font-normal cursor-pointer whitespace-nowrap"
          >
            다음 사용부터 팝업 표시 안함
          </label>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: string;
}

export default function HintModal({ isOpen, onClose, hint }: HintModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 오버레이 */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* 모달 컨테이너 */}
      <div className="relative z-10">
        <Image
          src="/images/ui/popup-success.png"
          alt="힌트 배경"
          width={324}
          height={440}
          className="object-cover"
        />

        {/* 힌트 텍스트 - 상단으로부터 38px */}
        <div className="absolute top-[38px] left-1/2 transform -translate-x-1/2">
          <h2 className="text-black text-[32px] font-normal whitespace-nowrap">
            힌트
          </h2>
        </div>

        {/* 닫기 버튼 - 우측 상단 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <span className="text-white text-xl font-bold">×</span>
        </button>

        {/* 힌트 내용 */}
        <div className="absolute top-[160px] left-1/2 transform -translate-x-1/2 w-[220px] text-center">
          <p className="text-black text-center text-base font-normal leading-relaxed">
            {hint}
          </p>
        </div>
      </div>
    </div>
  );
}

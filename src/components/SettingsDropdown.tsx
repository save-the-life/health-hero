"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onShowExitModal: () => void;
  onShowItemInfoModal: () => void;
  pageType?: "main" | "quiz"; // 페이지 타입 추가
}

export default function SettingsDropdown({
  isOpen,
  onClose,
  onShowExitModal,
  onShowItemInfoModal,
  pageType = "quiz", // 기본값은 quiz
}: SettingsDropdownProps) {
  const [isClosing, setIsClosing] = useState(false);

  // 닫기 애니메이션 처리
  const handleClose = () => {
    setIsClosing(true);
    // 애니메이션 완료 후 실제 닫기
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500); // 애니메이션 지속 시간을 500ms로 증가
  };

  // 컴포넌트가 닫힐 때 애니메이션 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMuteClick = () => {
    console.log("음소거 버튼 클릭");
    handleClose();
  };

  const handleItemInfoClick = () => {
    handleClose();
    setTimeout(() => {
      onShowItemInfoModal();
    }, 500);
  };

  const handleExitClick = () => {
    // 설정 메뉴를 닫고 나가기 모달 표시
    handleClose();
    // 설정 메뉴 닫기 애니메이션 완료 후 나가기 모달 표시
    setTimeout(() => {
      onShowExitModal();
    }, 500); // 애니메이션 지속 시간과 동일
  };


  return (
    <>
      {/* 배경 블러 오버레이 */}
      <div className="fixed inset-0 backdrop-blur-md z-30" />

      {/* 설정 버튼과 드롭다운 메뉴 */}
      <div className="fixed top-[48px] right-6 z-40">
        {/* 설정 버튼 */}
        <div className="flex justify-end mb-2">
          <button
            onClick={handleClose}
            className={`w-9 h-9 flex items-center justify-center hover:opacity-80 transition-all duration-300 ease-out ${
              isClosing ? "animate-button-shrink" : "animate-button-expand"
            }`}
          >
            <Image
              src="/images/items/button-setting.png"
              alt="설정"
              width={36}
              height={36}
              className="object-cover"
            />
          </button>
        </div>

        {/* 드롭다운 메뉴 */}
        <div
          className={`flex flex-col gap-2 ${
            isClosing
              ? "animate-slide-up-delayed"
              : "animate-slide-down-delayed"
          }`}
        >
          {/* 음소거 버튼 - 모든 페이지에서 표시 */}
          <button
            onClick={handleMuteClick}
            className={`w-9 h-9 flex items-center justify-center hover:opacity-80 transition-opacity ${
              isClosing ? "animate-fade-out" : "animate-fade-in"
            }`}
            style={{ animationDelay: isClosing ? "0.2s" : "0.1s" }}
          >
            <Image
              src="/images/items/button-mute.png"
              alt="음소거"
              width={36}
              height={36}
              className="object-cover"
            />
          </button>

          {/* 아이템 정보 버튼 - 퀴즈 페이지에서만 표시 */}
          {pageType === "quiz" && (
            <button
              onClick={handleItemInfoClick}
              className={`w-9 h-9 flex items-center justify-center hover:opacity-80 transition-opacity ${
                isClosing ? "animate-fade-out" : "animate-fade-in"
              }`}
              style={{ animationDelay: isClosing ? "0.1s" : "0.2s" }}
            >
              <Image
                src="/images/items/button-info.png"
                alt="아이템 정보"
                width={36}
                height={36}
                className="object-cover"
              />
            </button>
          )}

          {/* 나가기 버튼 - 퀴즈 페이지에서만 표시 */}
          {pageType === "quiz" && (
            <button
              onClick={handleExitClick}
              className={`w-9 h-9 flex items-center justify-center hover:opacity-80 transition-opacity ${
                isClosing ? "animate-fade-out" : "animate-fade-in"
              }`}
              style={{ animationDelay: isClosing ? "0s" : "0.3s" }}
            >
              <Image
                src="/images/items/button-exit.png"
                alt="나가기"
                width={36}
                height={36}
                className="object-cover"
              />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

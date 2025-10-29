"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/hooks/useAudio";
import { audioService } from "@/services/audioService";
import { useAuthStore } from "@/store/authStore";
import { SoundButton } from "./SoundButton";

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
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isClosing, setIsClosing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { toggleMute } = useAudio();

  // 닫기 애니메이션 처리
  const handleClose = () => {
    setIsClosing(true);
    // 애니메이션 완료 후 실제 닫기
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500); // 애니메이션 지속 시간을 500ms로 증가
  };

  // 음소거 상태 업데이트 - 메뉴가 열릴 때마다 최신 상태 가져오기
  useEffect(() => {
    if (isOpen) {
      setIsMuted(audioService.getMuteState());
    }
  }, [isOpen]);

  // 컴포넌트가 닫힐 때 애니메이션 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // 외부 클릭 감지로 메뉴 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // 메뉴 컨테이너 요소 찾기
      const menuContainer = document.querySelector("[data-menu-container]");
      const settingButton = document.querySelector("[data-setting-button]");

      // 클릭된 요소가 메뉴 안이나 설정 버튼이면 무시
      if (
        menuContainer?.contains(event.target as Node) ||
        settingButton?.contains(event.target as Node)
      ) {
        return;
      }

      // 외부를 클릭했으면 메뉴 닫기
      handleClose();
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isClosing]);

  if (!isOpen) return null;

  const handleMuteClick = async () => {
    console.log("🔇 [SettingsDropdown] 음소거 버튼 클릭");
    const newMuteState = await toggleMute();
    console.log("🔇 [SettingsDropdown] 음소거 상태 변경:", newMuteState);
    setIsMuted(newMuteState);
    // 음소거 버튼 클릭 시에는 메뉴를 닫지 않음
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

  const handleLogoutClick = async () => {
    console.log("🔓 [SettingsDropdown] 로그아웃 버튼 클릭");
    handleClose();
    
    try {
      await logout();
      console.log("✅ [SettingsDropdown] 로그아웃 완료, 시작 페이지로 이동");
      // 로그아웃 후 시작 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("❌ [SettingsDropdown] 로그아웃 실패:", error);
    }
  };

  return (
    <>
      {/* 배경 블러 오버레이 */}
      <div className="fixed inset-0 backdrop-blur-md z-30" />

      {/* 설정 버튼과 드롭다운 메뉴 */}
      <div className="fixed top-[48px] right-6 z-40" data-menu-container>
        {/* 설정 버튼 */}
        <div className="flex justify-end mb-2">
          <SoundButton
            onClick={handleClose}
            data-setting-button
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
          </SoundButton>
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
          <SoundButton
            onClick={handleMuteClick}
            playClickSound={false} // 음소거 버튼은 클릭 사운드 재생 안함
            className={`w-9 h-9 flex items-center justify-center hover:opacity-80 transition-opacity ${
              isClosing ? "animate-fade-out" : "animate-fade-in"
            }`}
            style={{ animationDelay: isClosing ? "0.2s" : "0.1s" }}
          >
            <Image
              src={
                isMuted
                  ? "/images/items/button-mute-off.png"
                  : "/images/items/button-mute.png"
              }
              alt={isMuted ? "음소거 해제" : "음소거"}
              width={36}
              height={36}
              className="object-cover"
            />
          </SoundButton>

          {/* 아이템 정보 버튼 - 퀴즈 페이지에서만 표시 */}
          {pageType === "quiz" && (
            <SoundButton
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
            </SoundButton>
          )}

          {/* 나가기 버튼 - 퀴즈 페이지에서만 표시 */}
          {pageType === "quiz" && (
            <SoundButton
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
            </SoundButton>
          )}

          {/* 로그아웃 버튼 - 모든 페이지에서 표시 */}
          <SoundButton
            onClick={handleLogoutClick}
            className={`w-9 h-9 flex items-center justify-center hover:opacity-80 transition-opacity bg-red-500 rounded-lg ${
              isClosing ? "animate-fade-out" : "animate-fade-in"
            }`}
            style={{ animationDelay: isClosing ? "0s" : pageType === "quiz" ? "0.4s" : "0.3s" }}
          >
            <span className="text-white text-xs font-bold">로그아웃</span>
          </SoundButton>
        </div>
      </div>
    </>
  );
}

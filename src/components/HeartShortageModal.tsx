"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { useAdMob } from "@/hooks/useAdMob";
import { canWatchAd } from "@/services/adService";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { SoundButton } from "./SoundButton";

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
  console.log("🎭 HeartShortageModal 컴포넌트 렌더링됨");
  console.log("🎭 props - isOpen:", isOpen, "currentPhase:", currentPhase);
  console.log("🎭 현재 시간:", new Date().toISOString());

  // Apps-in-Toss 환경에서 기본 로그 테스트
  if (typeof window !== "undefined") {
    console.log("🎭 window 객체 존재 - HeartShortageModal 로드됨");
    console.log("🎭 현재 시간:", new Date().toLocaleTimeString());

    // document.title 변경으로 로그 실행 확인
    document.title =
      "HeartShortageModal 로드됨 - " + new Date().toLocaleTimeString();

    // Eruda 콘솔 로그 강제 출력 테스트
    console.error("🔴 HeartShortageModal ERROR 테스트");
    console.warn("🟡 HeartShortageModal WARN 테스트");
    console.info("🔵 HeartShortageModal INFO 테스트");
  }

  const router = useRouter();
  const { totalScore, buyHeartWithPoints, updateHearts } = useGameStore();
  const { user } = useAuthStore();

  console.log("🎭 사용자 정보:", user?.id);
  console.log("🎭 총 점수:", totalScore);
  console.log("🎭 useAdMob 훅 호출 시작 - userId:", user?.id);
  const {
    getAdStatus,
    showAd,
    autoLoadAd,
    reloadAd,
    resetAdInstance,
    isSupported,
  } = useAdMob(user?.id);
  console.log("🎭 useAdMob 훅 호출 완료 - isSupported:", isSupported);

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adStatus, setAdStatus] = useState<"loading" | "ready" | "failed">(
    "loading"
  );

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

  // 모달이 열릴 때 광고 로드
  useEffect(() => {
    console.log("🔍 HeartShortageModal useEffect 실행됨 - isOpen:", isOpen);
    console.log("🔍 isSupported 값:", isSupported);
    console.log("🔍 autoLoadAd 함수:", typeof autoLoadAd);

    if (isOpen) {
      console.log("🎯 HeartShortageModal 열림 - 광고 로드 시작");
      console.log("📱 Apps-in-Toss 지원 여부:", isSupported);
      console.log(
        "🌐 window.appsInToss 존재 여부:",
        typeof window !== "undefined" && !!window.appsInToss
      );
      console.log(
        "📺 GoogleAdMob 존재 여부:",
        typeof window !== "undefined" && !!window.appsInToss?.GoogleAdMob
      );

      if (isSupported) {
        console.log("✅ 광고 지원됨 - 자동 로드 시작");
        autoLoadAd("HEART_REFILL")
          .then(() => {
            console.log("✅ 광고 자동 로드 완료");
          })
          .catch((error) => {
            console.error("❌ 광고 자동 로드 실패:", error);
          });
      } else {
        console.log("❌ 광고 미지원 환경");
        console.log("🔍 디버깅 정보:");
        console.log("- window:", typeof window);
        console.log(
          "- appsInToss:",
          typeof window !== "undefined" ? window.appsInToss : "undefined"
        );
        console.log(
          "- GoogleAdMob:",
          typeof window !== "undefined" && window.appsInToss
            ? window.appsInToss.GoogleAdMob
            : "undefined"
        );
        console.log(
          "- loadAppsInTossAdMob:",
          typeof window !== "undefined" && window.appsInToss?.GoogleAdMob
            ? window.appsInToss.GoogleAdMob.loadAppsInTossAdMob
            : "undefined"
        );
        console.log(
          "- isSupported:",
          typeof window !== "undefined" &&
            window.appsInToss?.GoogleAdMob?.loadAppsInTossAdMob
            ? window.appsInToss.GoogleAdMob.loadAppsInTossAdMob.isSupported()
            : "undefined"
        );
      }
    }
  }, [isOpen, isSupported, autoLoadAd]);

  // 광고 상태 모니터링
  useEffect(() => {
    const checkAdStatus = () => {
      const status = getAdStatus("HEART_REFILL");
      console.log("📊 광고 상태 체크:", status);

      switch (status) {
        case "loading":
          if (adStatus !== "loading") {
            console.log("🔄 광고 로딩 중...");
            setAdStatus("loading");
          }
          break;
        case "loaded":
          if (adStatus !== "ready") {
            console.log("✅ 광고 로드 완료 - 버튼 활성화");
            setAdStatus("ready");
          }
          break;
        case "failed":
          if (adStatus !== "failed") {
            console.log("❌ 광고 로드 실패");
            setAdStatus("failed");
          }
          break;
        case "not_loaded":
          if (adStatus !== "loading") {
            console.log("⏳ 광고 로드 대기 중...");
            setAdStatus("loading");
          }
          break;
        default:
          console.log("❓ 알 수 없는 광고 상태:", status);
          setAdStatus("loading");
      }
    };

    checkAdStatus();
    const interval = setInterval(checkAdStatus, 1000);
    return () => clearInterval(interval);
  }, [getAdStatus, adStatus]);

  const handleAdClick = async () => {
    console.log("🎬 광고 버튼 클릭됨");
    console.log("👤 사용자 ID:", user?.id);
    console.log("📊 현재 광고 상태:", adStatus);
    console.log("🎥 광고 시청 중 여부:", isWatchingAd);

    if (!user?.id) {
      console.error("❌ 사용자 정보가 없습니다.");
      return;
    }

    if (isWatchingAd) {
      console.log("⏳ 이미 광고 시청 중입니다.");
      return;
    }

    try {
      console.log("🎬 광고 시청 시작");
      setIsWatchingAd(true);

      // 광고 시청 가능 여부 확인
      console.log("🔍 광고 시청 가능 여부 확인 중...");
      const canWatch = await canWatchAd(user.id);
      console.log("📋 광고 시청 가능 여부:", canWatch);

      if (!canWatch.canWatch) {
        console.log("❌ 광고 시청 불가:", canWatch.reason);
        alert(canWatch.reason || "광고를 시청할 수 없습니다.");
        return;
      }

      console.log("✅ 광고 시청 가능 - 광고 표시 시작");
      // 광고 시청
      const result = await showAd("HEART_REFILL");
      console.log("📺 광고 시청 결과:", result);

      if (result.success) {
        console.log("🎉 하트 충전 성공!");
        // 하트 충전 성공
        alert("하트를 획득했습니다!");

        // 하트 상태 업데이트
        console.log("💖 하트 상태 업데이트 중...");
        await updateHearts();

        // 모달 닫기
        console.log("🚪 모달 닫기");
        onClose();

        // 광고 재로드
        console.log("🔄 광고 재로드 예약");
        setTimeout(() => {
          reloadAd("HEART_REFILL");
        }, 1000);
      } else {
        console.log("❌ 하트 획득 실패:", result.message);
        alert(result.message || "하트 획득에 실패했습니다.");
      }
    } catch (error: unknown) {
      console.error("💥 광고 시청 에러:", error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("간격이 너무 짧습니다")) {
        console.log("⏰ 광고 시청 간격이 너무 짧음");
        alert("광고 시청 간격이 너무 짧습니다. 잠시 후 다시 시도해주세요.");
      } else if (errorMessage.includes("광고가 로드되지 않았습니다")) {
        console.log("📡 광고가 로드되지 않음");
        alert("광고를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      } else {
        console.log("❌ 기타 광고 시청 실패");
        alert("광고 시청에 실패했습니다.");
      }

      // 에러 발생 시 광고 리셋 및 재로드
      console.log("🔄 광고 인스턴스 리셋 및 재로드");
      resetAdInstance("HEART_REFILL");
      setTimeout(() => {
        reloadAd("HEART_REFILL");
      }, 2000);
    } finally {
      console.log("🏁 광고 시청 프로세스 완료");
      setIsWatchingAd(false);
    }
  };

  const canBuyHeart = totalScore && totalScore >= 500;
  console.log("🎭 canBuyHeart:", canBuyHeart);

  console.log("🎭 모달 렌더링 조건 확인 - isOpen:", isOpen);
  if (!isOpen) {
    console.log("🎭 모달이 닫혀있음 - 렌더링하지 않음");
    return null;
  }

  console.log("🎭 모달이 열려있음 - 렌더링 시작");

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
            <SoundButton
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
            </SoundButton>
          ) : (
            <SoundButton
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
            </SoundButton>
          )}

          {/* 광고 버튼 */}
          <SoundButton
            className={`font-medium h-[56px] w-[140px] rounded-[10px] relative transition-opacity ${
              !isSupported || adStatus === "loading" || isWatchingAd
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:opacity-80"
            }`}
            style={{
              background:
                !isSupported || adStatus === "loading" || isWatchingAd
                  ? "linear-gradient(180deg, #9CA3AF 0%, #9CA3AF 50%, #6B7280 50%, #6B7280 100%)"
                  : "linear-gradient(180deg, #50B0FF 0%, #50B0FF 50%, #008DFF 50%, #008DFF 100%)",
              border:
                !isSupported || adStatus === "loading" || isWatchingAd
                  ? "2px solid #D1D5DB"
                  : "2px solid #76C1FF",
              outline: "2px solid #000000",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "400",
              WebkitTextStroke: "1px #000000",
            }}
            onClick={handleAdClick}
            disabled={!isSupported || adStatus === "loading" || isWatchingAd}
            playClickSound={
              isSupported && adStatus === "ready" && !isWatchingAd
            } // 광고 버튼은 준비된 상태에서만 클릭 사운드 재생
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
                {!isSupported
                  ? "광고 미지원"
                  : adStatus === "loading"
                  ? "로딩 중..."
                  : isWatchingAd
                  ? "광고 시청 중..."
                  : "하트 받기"}
              </span>
            </div>
          </SoundButton>
        </div>
      </div>
    </div>
  );
}

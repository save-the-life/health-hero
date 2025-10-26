"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { useAdMob } from "@/hooks/useAdMob";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect, useRef } from "react";
import { SoundButton } from "./SoundButton";
import { AdErrorBoundary } from "@/components/ErrorBoundary";
import { adLogger } from "@/utils/adLogger";

interface HeartShortageModalProps {
  isOpen: boolean;
  currentPhase: number;
  onClose: () => void;
}

function HeartShortageModalContent({
  isOpen,
  currentPhase,
  onClose,
}: HeartShortageModalProps) {
  // 컴포넌트 렌더링 (로그 제거)

  const router = useRouter();
  const { totalScore, buyHeartWithPoints, updateHearts } = useGameStore();
  const { user } = useAuthStore();

  const {
    getAdStatus,
    showAd,
    autoLoadAd,
    reloadAd,
    resetAdInstance,
    isSupported,
  } = useAdMob();

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adStatus, setAdStatus] = useState<
    "loading" | "ready" | "failed" | "cleaning"
  >("loading");

  // 중복 호출 방지를 위한 ref
  const isProcessingRef = useRef(false);
  const hasUpdatedHeartsRef = useRef(false);

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

  // 모달이 열릴 때 광고 로드 (한 번만 실행)
  useEffect(() => {
    if (isOpen && isSupported) {
      const currentStatus = getAdStatus("HEART_REFILL");

      // 이미 로드되었거나 로딩 중이면 재로드하지 않음
      if (currentStatus === "loaded" || currentStatus === "loading") {
        console.log(
          "🎯 HeartShortageModal 열림 - 광고 이미 로드됨:",
          currentStatus
        );
        return;
      }

      console.log("🎯 HeartShortageModal 열림 - 광고 로드 시작");
      console.log("✅ 광고 지원됨 - 자동 로드 시작");

      autoLoadAd("HEART_REFILL")
        .then(() => {
          console.log("✅ 광고 자동 로드 완료");
        })
        .catch((error) => {
          console.error("❌ 광고 자동 로드 실패:", error);
        });
    } else if (isOpen && !isSupported) {
      console.log("❌ 광고 미지원 환경");
    }
  }, [isOpen, isSupported, autoLoadAd, getAdStatus]); // 필요한 의존성 추가

  // 광고 상태 모니터링 (상태 변경 시에만 실행)
  useEffect(() => {
    const checkAdStatus = () => {
      const status = getAdStatus("HEART_REFILL");

      // 상태가 실제로 변경될 때만 업데이트
      if (status !== adStatus) {
        switch (status) {
          case "loading":
            console.log("🔄 광고 로딩 중...");
            setAdStatus("loading");
            break;
          case "loaded":
            console.log("✅ 광고 로드 완료 - 버튼 활성화");
            setAdStatus("ready");
            break;
          case "failed":
            console.log("❌ 광고 로드 실패");
            setAdStatus("failed");
            break;
          case "not_loaded":
            console.log("⏳ 광고 로드 대기 중...");
            setAdStatus("loading");
            break;
          case "cleaning":
            console.log("🧹 광고 정리 중");
            setAdStatus("cleaning");
            break;
          default:
            console.log("❓ 알 수 없는 광고 상태:", status);
            setAdStatus("loading");
        }
      }
    };

    // 모달이 열려있을 때만 상태 체크
    if (isOpen) {
      checkAdStatus();
      const interval = setInterval(checkAdStatus, 3000); // 2초 → 3초로 변경
      return () => clearInterval(interval);
    }
  }, [isOpen, getAdStatus, adStatus]);

  const handleAdClick = async () => {
    adLogger.log("info", "🎬 광고 버튼 클릭됨", { userId: user?.id });
    console.log("🎬 광고 버튼 클릭됨");

    // 중복 호출 방지
    if (isProcessingRef.current) {
      adLogger.log("warning", "⏳ 이미 처리 중입니다. 중복 호출 무시");
      console.log("⏳ 이미 처리 중입니다. 중복 호출 무시");
      return;
    }

    if (!user?.id) {
      adLogger.log("error", "❌ 사용자 정보가 없습니다.");
      console.error("❌ 사용자 정보가 없습니다.");
      return;
    }

    if (isWatchingAd) {
      adLogger.log("warning", "⏳ 이미 광고 시청 중입니다.");
      console.log("⏳ 이미 광고 시청 중입니다.");
      return;
    }

    // 처리 시작 표시
    isProcessingRef.current = true;
    hasUpdatedHeartsRef.current = false;

    try {
      adLogger.log("info", "🎬 광고 시청 시작");
      console.log("🎬 광고 시청 시작");
      setIsWatchingAd(true);

      adLogger.log("info", "✅ 광고 시청 가능 - 광고 표시 시작");
      console.log("✅ 광고 시청 가능 - 광고 표시 시작");
      // 광고 시청
      const result = await showAd("HEART_REFILL");
      adLogger.log("info", "📺 광고 시청 결과", { result });
      console.log("📺 광고 시청 결과:", result);

      if (result.success) {
        adLogger.log("success", "🎉 하트 충전 성공!");
        console.log("🎉 하트 충전 성공!");

        // 중복 업데이트 방지
        if (!hasUpdatedHeartsRef.current) {
          hasUpdatedHeartsRef.current = true;

          // 하트 충전 성공
          alert("하트를 획득했습니다!");

          // 하트 상태 업데이트 (한 번만)
          adLogger.log("info", "💖 하트 상태 업데이트 중...");
          console.log("💖 하트 상태 업데이트 중...");
          await updateHearts();
          adLogger.log("success", "✅ 하트 상태 업데이트 완료");
        } else {
          adLogger.log(
            "warning",
            "⚠️ 하트 업데이트 이미 완료됨 - 중복 호출 방지"
          );
          console.log("⚠️ 하트 업데이트 이미 완료됨");
        }

        // 모달 닫기
        adLogger.log("info", "🚪 모달 닫기");
        console.log("🚪 모달 닫기");
        onClose();

        // 광고 재로드
        adLogger.log("info", "🔄 광고 재로드 예약");
        console.log("🔄 광고 재로드 예약");
        setTimeout(() => {
          reloadAd("HEART_REFILL");
        }, 1000);
      } else {
        adLogger.log("error", "❌ 하트 획득 실패", { message: result.message });
        console.log("❌ 하트 획득 실패:", result.message);
        alert(result.message || "하트 획득에 실패했습니다.");
      }
    } catch (error: unknown) {
      adLogger.log("error", "💥 광고 시청 에러", { error });
      console.error("💥 광고 시청 에러:", error);

      // 에러 정보를 안전하게 수집
      let errorMessage = "광고 시청에 실패했습니다.";
      let errorType = "unknown";

      try {
        if (error instanceof Error) {
          errorMessage = error.message;
          errorType = "Error";
          const errorDetails = {
            message: error.message,
            stack: error.stack,
            errorType: "Error",
          };
          adLogger.log("error", "❌ 에러 상세 정보", errorDetails);
          console.error("❌ 에러 상세 정보:", errorDetails);
        } else if (typeof error === "string") {
          errorMessage = error;
          errorType = "string";
          adLogger.log("error", "❌ 에러 발생", { errorMessage, errorType });
        } else if (error && typeof error === "object" && "message" in error) {
          errorMessage = String(error.message);
          errorType = "object";
          adLogger.log("error", "❌ 에러 발생", { errorMessage, errorType });
        }
      } catch (logError) {
        adLogger.log("error", "❌ 에러 로깅 실패", { logError });
        console.error("❌ 에러 로깅 실패:", logError);
        errorMessage = "알 수 없는 오류가 발생했습니다.";
      }

      // 사용자에게 안전한 메시지 표시
      try {
        if (errorMessage.includes("간격이 너무 짧습니다")) {
          adLogger.log("warning", "⏰ 광고 시청 간격이 너무 짧음");
          console.log("⏰ 광고 시청 간격이 너무 짧음");
          alert("광고 시청 간격이 너무 짧습니다. 잠시 후 다시 시도해주세요.");
        } else if (errorMessage.includes("광고가 로드되지 않았습니다")) {
          adLogger.log("warning", "📡 광고가 로드되지 않음");
          console.log("📡 광고가 로드되지 않음");
          alert("광고를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        } else if (errorMessage.includes("로그인")) {
          adLogger.log("warning", "🔐 로그인 필요");
          console.log("🔐 로그인 필요");
          alert("로그인이 필요합니다. 다시 로그인해주세요.");
        } else if (errorMessage.includes("세션")) {
          adLogger.log("warning", "🔐 세션 만료");
          console.log("🔐 세션 만료");
          alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        } else if (errorMessage.includes("Auth session missing")) {
          adLogger.log("warning", "🔐 인증 세션 없음");
          console.log("🔐 인증 세션 없음");
          alert("인증 세션이 없습니다. 다시 로그인해주세요.");
        } else if (errorMessage.includes("timeout")) {
          adLogger.log("warning", "⏰ 광고 시청 시간 초과");
          console.log("⏰ 광고 시청 시간 초과");
          alert("광고 시청 시간이 초과되었습니다. 다시 시도해주세요.");
        } else {
          adLogger.log("error", "❌ 기타 광고 시청 실패", { errorMessage });
          console.log("❌ 기타 광고 시청 실패");
          alert("광고 시청에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      } catch (alertError) {
        adLogger.log("error", "❌ 알림 표시 실패", { alertError });
        console.error("❌ 알림 표시 실패:", alertError);
        // 알림 표시도 실패하면 조용히 넘어감
      }

      // 에러 발생 시 광고 리셋 및 재로드
      adLogger.log("info", "🔄 광고 인스턴스 리셋 및 재로드");
      console.log("🔄 광고 인스턴스 리셋 및 재로드");
      resetAdInstance("HEART_REFILL");
      setTimeout(() => {
        reloadAd("HEART_REFILL");
      }, 2000);
    } finally {
      // 처리 완료 표시
      isProcessingRef.current = false;

      adLogger.log("info", "🏁 광고 시청 프로세스 완료");
      console.log("🏁 광고 시청 프로세스 완료");
      setIsWatchingAd(false);
    }
  };

  const canBuyHeart = totalScore && totalScore >= 500;

  if (!isOpen) {
    return null;
  }

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

// 에러 바운더리로 감싼 컴포넌트 export
export default function HeartShortageModal(props: HeartShortageModalProps) {
  return (
    <AdErrorBoundary>
      <HeartShortageModalContent {...props} />
    </AdErrorBoundary>
  );
}

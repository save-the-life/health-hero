"use client";

import { SafeImage } from "./SafeImage";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import { SoundButton } from "./SoundButton";

interface StageResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  earnedExp: number;
  earnedScore: number;
  currentPhase: number;
  phaseCleared: boolean;
  nextPhase: number;
  onClose: () => void;
}

export default function StageResultModal({
  isOpen,
  isSuccess,
  earnedExp,
  earnedScore,
  currentPhase,
  phaseCleared,
  nextPhase,
  onClose,
}: StageResultModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { loadUserData } = useGameStore();

  if (!isOpen) return null;

  const handleRewardClick = async () => {
    onClose();

    // 사용자 데이터를 다시 로드하여 최신 진행 상황 반영
    if (user?.id) {
      try {
        // 앱인토스 환경을 고려한 타임아웃 설정
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("데이터 로드 타임아웃")), 10000)
        );

        await Promise.race([loadUserData(user.id), timeoutPromise]);
        console.log("스테이지 완료 후 사용자 데이터 새로고침 완료");
      } catch (error) {
        console.error("사용자 데이터 새로고침 실패:", error);
        // 실패해도 페이지 이동은 계속 진행
      }
    }

    // 페이즈가 클리어되었으면 다음 페이즈로, 아니면 현재 페이즈로 이동
    const targetPhase = phaseCleared ? nextPhase : currentPhase;
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`🎯 [StageResult] 페이지 이동: Phase ${targetPhase}`);
    if (phaseCleared) {
      console.log(`🎊 [StageResult] 페이즈 ${currentPhase} 클리어! 다음 페이즈로 이동`);
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    router.push(`/game/phase${targetPhase}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 오버레이 - 검정색 대신 블러만 적용 */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* 모달 컨테이너 */}
      <div className="relative z-10">
        {/* 모달 배경 이미지 */}
        <SafeImage
          src={
            isSuccess
              ? "/images/ui/popup-success.png"
              : "/images/ui/popup-failed.png"
          }
          alt="스테이지 결과 모달"
          width={324}
          height={440}
          className="object-cover"
        />

        {/* 모달 내용 */}
        <div className="absolute inset-0 flex flex-col items-center">
          {/* 스테이지 성공/실패 텍스트 */}
          <div
            className="mt-[38px] text-center text-stroke"
            style={{
              fontSize: "32px",
              fontWeight: "400",
              color: "#FDE047",
            }}
          >
            {isSuccess ? "스테이지 성공!" : "스테이지 실패!"}
          </div>

          {/* 보상 헤더 */}
          <div
            className="mt-[90px] text-center text-stroke"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            보상
          </div>

          {/* 획득 보상 박스들 */}
          <div className="mt-4 flex gap-4">
            {/* 경험치 박스 */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                width: "70px",
                height: "70px",
                backgroundColor: "#B97951",
                border: "1px solid #B68B64",
                borderRadius: "8px",
                boxShadow: `
                  inset -2px 0px 2px 0px #BF845D,
                  inset 2px 0px 2px 0px #C0855C,
                  inset 0px -4px 2px 0px #D09B71,
                  inset 0px 3px 2px 0px #B7764E
                `,
              }}
            >
              {/* 경험치 아이콘 */}
              <SafeImage
                src="/images/items/icon-exp.png"
                alt="경험치"
                width={40}
                height={40}
                className="mb-1"
              />

              {/* 획득 경험치 텍스트 */}
              <span
                className="text-stroke"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#ffffff",
                }}
              >
                +{earnedExp}
              </span>
            </div>

            {/* 점수 박스 */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                width: "70px",
                height: "70px",
                backgroundColor: "#B97951",
                border: "1px solid #B68B64",
                borderRadius: "8px",
                boxShadow: `
                  inset -2px 0px 2px 0px #BF845D,
                  inset 2px 0px 2px 0px #C0855C,
                  inset 0px -4px 2px 0px #D09B71,
                  inset 0px 3px 2px 0px #B7764E
                `,
              }}
            >
              {/* 점수 아이콘 */}
              <SafeImage
                src="/images/items/Icon-star.png"
                alt="점수"
                width={40}
                height={40}
                className="mb-1"
              />

              {/* 획득 점수 텍스트 */}
              <span
                className="text-stroke"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#ffffff",
                }}
              >
                +{earnedScore}
              </span>
            </div>
          </div>

          {/* 보상 받기 버튼 */}
          <SoundButton
            className="mt-8 font-medium rounded-[10px] relative cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              width: "160px",
              height: "56px",
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
            onClick={handleRewardClick}
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

            {/* 버튼 텍스트 */}
            <span
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                pointerEvents: "none",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: "400",
                WebkitTextStroke: "1px #000000",
                lineHeight: "1.2",
              }}
            >
              보상 받기
            </span>
          </SoundButton>
        </div>
      </div>
    </div>
  );
}

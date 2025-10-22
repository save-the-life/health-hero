"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface StageResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  correctCount: number;
  totalQuestions: number;
  earnedExp: number;
  earnedScore: number;
  currentPhase: number;
  onClose: () => void;
}

export default function StageResultModal({
  isOpen,
  isSuccess,
  correctCount,
  totalQuestions,
  earnedExp,
  earnedScore,
  currentPhase,
  onClose,
}: StageResultModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleRewardClick = () => {
    onClose();
    // 현재 페이즈에 따라 해당 페이즈 페이지로 이동
    router.push(`/game/phase${currentPhase}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 오버레이 - 검정색 대신 블러만 적용 */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* 모달 컨테이너 */}
      <div className="relative z-10">
        {/* 모달 배경 이미지 */}
        <Image
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
            className="mt-[38px] text-center"
            style={{
              fontSize: "32px",
              fontWeight: "400",
              color: "#8B4513", // 나무색 텍스트
              textShadow: "2px 2px 0px #FFD700", // 노란색 테두리 효과
            }}
          >
            {isSuccess ? "스테이지 성공!" : "스테이지 실패!"}
          </div>

          {/* 보상 헤더 */}
          <div
            className="mt-[90px] text-center"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#8B4513",
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
              <Image
                src="/images/items/icon-exp.png"
                alt="경험치"
                width={40}
                height={40}
                className="mb-1"
              />

              {/* 획득 경험치 텍스트 */}
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#8B4513",
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
              <Image
                src="/images/items/icon-star.png"
                alt="점수"
                width={40}
                height={40}
                className="mb-1"
              />

              {/* 획득 점수 텍스트 */}
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#8B4513",
                }}
              >
                +{earnedScore}
              </span>
            </div>
          </div>

          {/* 보상 받기 버튼 */}
          <button
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
          </button>
        </div>
      </div>
    </div>
  );
}

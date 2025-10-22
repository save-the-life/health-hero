"use client";

import { useEffect, useState } from "react";
import "@/styles/fireworks.css";

interface FireworksAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function FireworksAnimation({
  isVisible,
  onComplete,
}: FireworksAnimationProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    // 애니메이션 시작
    setAnimationKey((prev) => prev + 1);

    // 2.5초 후 완료 콜백 호출
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />

      {/* 폭죽 파티클들 */}
      {Array.from({ length: 60 }, (_, i) => (
        <div
          key={`${animationKey}-${i}`}
          className="firework-particle absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: [
              "#ff6b6b",
              "#4ecdc4",
              "#45b7d1",
              "#96ceb4",
              "#feca57",
              "#ff9ff3",
              "#ff7675",
              "#74b9ff",
              "#fd79a8",
              "#fdcb6e",
              "#6c5ce7",
              "#a29bfe",
            ][Math.floor(Math.random() * 12)],
            animationDelay: `${Math.random() * 1.5}s`,
            transform: "scale(0)",
          }}
        />
      ))}

      {/* 중앙 폭죽 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="firework-center w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
          style={{
            boxShadow: "0 0 30px #ffd700, 0 0 60px #ffd700, 0 0 90px #ffd700",
          }}
        />
      </div>

      {/* 추가 스파클 효과 */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={`sparkle-${animationKey}-${i}`}
          className="firework-sparkle absolute w-1 h-1 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            transform: "scale(0)",
          }}
        />
      ))}
    </div>
  );
}

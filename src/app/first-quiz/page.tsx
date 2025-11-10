/**
 * 혜택 탭 프로모션 진입 페이지
 * intoss://lucky-dice/first-quiz 로 접근 시 실행
 * 
 * UI: 시작 페이지(/)와 완전히 동일
 * 동작: 프로모션 플래그만 자동 설정
 */

"use client";

import { useEffect } from "react";
import { SafeImage } from "@/components/SafeImage";
import TossLoginButton from "@/components/TossLoginButton";

export default function FirstQuizPage() {
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎁 [FirstQuiz] 혜택 탭에서 진입 (/first-quiz)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 프로모션 지급 플래그 설정
    localStorage.setItem('shouldGrantPromotion', 'true');
    console.log('✅ [FirstQuiz] 프로모션 플래그 설정 완료');
    console.log('💡 [FirstQuiz] 퀴즈 풀러가기 버튼 클릭 시 프로모션 지급됩니다');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, []);

  return (
    <div className="relative h-screen overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src="/images/backgrounds/background-start.png"
          alt="헬스 히어로 시작 배경"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 게임 등급 이미지 (우측 상단) */}
      <div className="absolute top-4 right-4 z-20">
        <SafeImage
          src="/images/ui/game-rating.png"
          alt="게임 등급"
          width={60}
          height={70}
          priority
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen pt-8">
        {/* 상단 타이틀 */}
        <div className="text-center pt-12">
          <p className="text-[24px] font-[400] text-white text-stroke">
            첫걸음은 퀴즈부터!
          </p>
          <p className="text-[24px] font-[400] text-white text-stroke">
            퀴즈 풀며 함께
          </p>
          <p className="text-[24px] font-[400] text-white text-stroke">
            헬스히어로로 레벨업!
          </p>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="flex items-center justify-center">
          <div style={{ width: "420px", height: "420px" }}>
            <SafeImage
              src="/images/characters/level-20.png"
              alt="헬스 히어로"
              width={450}
              height={450}
              style={{ width: "420px", height: "420px" }}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full max-w-sm px-4 space-y-3 -mt-10 mb-10 z-10">
          <TossLoginButton />
        </div>
      </div>
    </div>
  );
}


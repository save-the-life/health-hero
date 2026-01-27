"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { SoundButton } from "./SoundButton";
import { audioService } from "@/services/audioService";

export default function GuestLoginButton() {
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleGuestLogin = async () => {
    // 배경음악 재생 시작 (사용자 클릭이므로 브라우저 자동 재생 정책 통과)
    console.log("🎵 [GuestLogin] 배경음악 재생 시작");
    try {
      await audioService.playBackgroundMusic();
      console.log("✅ [GuestLogin] 배경음악 재생 성공");
    } catch (error) {
      console.log("⚠️ [GuestLogin] 배경음악 재생 실패 (무시):", error);
    }
    
    try {
      setLoading(true);
      setIsNavigating(true);

      // Supabase 익명 인증
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) throw error;

      console.log("Guest login successful:", data);

      // 게스트 사용자 프로필 생성
      if (data.user) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: "게스트",
            level: 1,
            current_exp: 0,
            total_score: 500, // 최초 회원가입 시 500포인트 지급
            current_stage: 1,
            current_phase: 1,
          });

        if (profileError) {
          console.error("프로필 생성 실패:", profileError);
          // 프로필 생성 실패해도 게임은 진행 가능하도록 함
        } else {
          console.log("게스트 프로필 생성 완료 (500포인트 지급)");
        }
      }

      // 게임 페이지로 이동 (로딩 상태 유지)
      router.push("/game");
      // 페이지 이동이 완료될 때까지 로딩 상태 유지
    } catch (error) {
      console.error("Guest login error:", error);
      alert("게스트 로그인 실패");
      setIsNavigating(false);
      setLoading(false);
    }
    // finally 블록 제거하여 에러가 아닌 경우 로딩 상태 유지
  };

  return (
    <SoundButton
      onClick={handleGuestLogin}
      disabled={loading || isNavigating}
      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading || isNavigating ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          로딩 중...
        </span>
      ) : (
        "게스트로 시작하기"
      )}
    </SoundButton>
  );
}

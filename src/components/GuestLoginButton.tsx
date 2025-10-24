"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { SoundButton } from "./SoundButton";

export default function GuestLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGuestLogin = async () => {
    try {
      setLoading(true);

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
            current_streak: 0,
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

      // 게임 페이지로 이동
      router.push("/game");
    } catch (error) {
      console.error("Guest login error:", error);
      alert("게스트 로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SoundButton
      onClick={handleGuestLogin}
      disabled={loading}
      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "로그인 중..." : "게스트로 시작하기"}
    </SoundButton>
  );
}

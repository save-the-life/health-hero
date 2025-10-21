"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
    <button
      onClick={handleGuestLogin}
      disabled={loading}
      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "로그인 중..." : "게스트로 시작하기"}
    </button>
  );
}

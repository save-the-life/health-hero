"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTossAuth } from "@/hooks/useTossAuth";
import { TossAuthService } from "@/services/tossAuthService";
import { useAuthStore } from "@/store/authStore";
import { SoundButton } from "./SoundButton";

// 앱인토스 환경 확인을 위한 타입 선언
declare global {
  interface Window {
    appLogin?: () => Promise<unknown>;
  }
}

export default function TossLoginButton() {
  const router = useRouter();
  const { login, isLoading: tossLoading, error: tossError } = useTossAuth();
  const {
    setUser,
    setLoading,
    setError,
    isLoading: authLoading,
  } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Hydration 에러 방지: 클라이언트에서만 렌더링
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async () => {
    console.log("🚀 [TossLogin] 로그인 시작");
    setLocalError(null);
    setError(null);
    setLoading(true);
    setIsNavigating(true);

    try {
      // 1. 토스 로그인
      console.log("📝 [TossLogin] 토스 로그인 SDK 호출 중...");
      const tossResult = await login();
      console.log("✅ [TossLogin] 토스 로그인 성공:", {
        userKey: tossResult.user?.userKey,
        name: tossResult.user?.name,
        referrer: tossResult.auth.referrer,
        accessToken: tossResult.token?.accessToken.substring(0, 20) + "...",
      });

      // 2. Supabase 연동
      console.log("💾 [TossLogin] Supabase에 사용자 정보 저장 중...");
      const supabaseResult = await TossAuthService.createOrUpdateUser(
        tossResult
      );
      console.log("✅ [TossLogin] Supabase 연동 성공:", {
        userId: supabaseResult.profile?.id,
        tossUserKey: supabaseResult.profile?.toss_user_key,
      });

      // 3. 사용자 정보 저장
      if (supabaseResult.profile) {
        setUser(supabaseResult.profile);
        console.log("✅ [TossLogin] Zustand store 업데이트 완료");

        // 추가: 인증 상태 강제 업데이트 (세션 생성 실패 대비)
        console.log("🔧 [TossLogin] 인증 상태 강제 업데이트");
        setTimeout(() => {
          setUser(supabaseResult.profile); // 다시 한 번 설정하여 확실히 업데이트
        }, 100);
      }

      // 4. 게임 페이지로 이동 (로딩 상태 유지)
      console.log("🎮 [TossLogin] 게임 페이지로 이동");
      router.push("/game");
      // 페이지 이동이 완료될 때까지 로딩 상태 유지
      // setLoading(false)는 finally 블록에서 제거하여 페이지 이동 중에도 로딩 표시
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "로그인에 실패했습니다.";
      console.error("❌ [TossLogin] 로그인 실패:", {
        message: errorMessage,
        error: error,
        stack: error instanceof Error ? error.stack : undefined,
      });
      setLocalError(errorMessage);
      setError(errorMessage);
      setIsNavigating(false);
      setLoading(false);
      console.log("🏁 [TossLogin] 로그인 플로우 종료");
    }
    // finally 블록 제거하여 에러가 아닌 경우 로딩 상태 유지
  };

  const displayError = tossError || localError;

  return (
    <div className="w-full space-y-4">
      <SoundButton
        onClick={handleLogin}
        disabled={tossLoading || authLoading || isNavigating}
        className="w-full bg-[#3182F6] hover:bg-[#2C5FCC] text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {tossLoading || authLoading || isNavigating ? (
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
            로그인 중...
          </span>
        ) : (
          "토스로 시작하기"
        )}
      </SoundButton>

      {displayError && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-500 text-sm text-center">{displayError}</p>
        </div>
      )}

      {/* 개발 환경 안내 */}
      {isClient &&
        typeof window !== "undefined" &&
        typeof window.appLogin === "undefined" && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
            <p className="text-yellow-600 text-xs text-center">
              💡 토스 로그인은 앱인토스 환경에서만 사용할 수 있습니다.
              <br />
              샌드박스 앱 또는 토스앱에서 테스트해주세요.
            </p>
          </div>
        )}
    </div>
  );
}

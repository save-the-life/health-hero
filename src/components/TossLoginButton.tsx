"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SafeImage } from "./SafeImage";
import { useTossAuth } from "@/hooks/useTossAuth";
import { TossAuthService } from "@/services/tossAuthService";
import { useAuthStore } from "@/store/authStore";
import { SoundButton } from "./SoundButton";
import { audioService } from "@/services/audioService";

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
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLogin = async () => {
    console.log("🚀 [TossLogin] 로그인 시작");
    
    // 배경음악 재생 시작 (사용자 클릭이므로 브라우저 자동 재생 정책 통과)
    console.log("🎵 [TossLogin] 배경음악 재생 시작");
    try {
      await audioService.playBackgroundMusic();
      console.log("✅ [TossLogin] 배경음악 재생 성공");
    } catch (error) {
      console.log("⚠️ [TossLogin] 배경음악 재생 실패 (무시):", error);
    }
    
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
        className="w-full font-medium rounded-[10px] relative transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:opacity-80"
        style={{
          height: "56px",
          background:
            "linear-gradient(180deg, #50B0FF 0%, #50B0FF 50%, #008DFF 50%, #008DFF 100%)",
          border: "2px solid #76C1FF",
          outline: "2px solid #000000",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
          color: "#FFFFFF",
          fontSize: "18px",
          fontWeight: "400",
          WebkitTextStroke: "1px #000000",
        }}
      >
        {/* 버튼 포인트 이미지 */}
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: "3px",
            pointerEvents: "none",
          }}
        >
          <SafeImage
            src="/images/items/button-point-blue.png"
            alt="button-point-blue"
            width={8.47}
            height={6.3}
          />
        </div>

        {/* 버튼 텍스트 */}
        <span
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            pointerEvents: "none",
            textAlign: "center",
            lineHeight: "1.2",
            width: "100%",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
          {tossLoading || authLoading || isNavigating
            ? "로딩 중..."
            : "퀴즈 풀러 가기"}
        </span>
      </SoundButton>

      {displayError && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-500 text-sm text-center">{displayError}</p>
        </div>
      )}

      {/* 개발 환경 안내 */}
      {/* {isClient &&
        typeof window !== "undefined" &&
        typeof window.appLogin === "undefined" && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
            <p className="text-yellow-600 text-xs text-center">
              💡 토스 로그인은 앱인토스 환경에서만 사용할 수 있습니다.
              <br />
              샌드박스 앱 또는 토스앱에서 테스트해주세요.
            </p>
          </div>
        )} */}
    </div>
  );
}

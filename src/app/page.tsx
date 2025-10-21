import Image from "next/image";
import TossLoginButton from "@/components/TossLoginButton";
import GuestLoginButton from "@/components/GuestLoginButton";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/background-start.png"
          alt="헬스 히어로 시작 배경"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-8">
        {/* 상단 타이틀 */}
        <div className="text-center pt-12">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            헬스 히어로
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md">
            의료 상식 퀴즈 게임
          </p>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="flex items-center justify-center">
          <div style={{ width: "450px", height: "450px" }}>
            <Image
              src="/images/characters/level-20.png"
              alt="헬스 히어로"
              width={450}
              height={450}
              style={{ width: "450px", height: "450px" }}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full max-w-sm px-4 pb-8 space-y-3">
          <TossLoginButton />
          <GuestLoginButton />
        </div>
      </div>
    </div>
  );
}

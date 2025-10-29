import Image from "next/image";
import TossLoginButton from "@/components/TossLoginButton";
import GuestLoginButton from "@/components/GuestLoginButton";

export default function Home() {
  return (
    <div className="relative h-screen overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
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

      {/* 게임 등급 이미지 (우측 상단) */}
      <div className="absolute top-4 right-4 z-20">
        <Image
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
          {/* <h1 className="text-4xl font-bold text-white text-stroke mb-2">
            헬스 히어로
          </h1> */}
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
            <Image
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
          {/* <GuestLoginButton /> */}
        </div>
      </div>
    </div>
  );
}

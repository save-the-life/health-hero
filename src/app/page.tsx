import Image from "next/image";
import Link from "next/link";

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
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen">
        {/* 캐릭터 이미지 - 버튼 뒤쪽에 위치 */}
        <div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-0"
          style={{ width: "450px", height: "450px" }}
        >
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

        {/* 시작 버튼 - 캐릭터 앞쪽에 위치 */}
        <div
          className="relative z-10 w-full max-w-sm px-4"
          style={{ paddingBottom: "64px" }}
        >
          <Link href="/intro">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              퀴즈 풀러 가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

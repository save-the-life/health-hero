import Image from "next/image";
import Link from "next/link";

export default function GamePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/background-main.png"
          alt="헬스 히어로 메인 배경"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* 상단 상태 바 */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 text-white text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Lv.1</span>
            <span className="text-sm">의대 새내기</span>
          </div>
          <div className="flex items-center gap-2">
            <span>❤️ 5</span>
            <span>⭐ 0</span>
          </div>
        </div>

        {/* 중앙 맵 영역 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold mb-8 drop-shadow-lg">
              게임 맵 (개발 예정)
            </h1>
            <p className="text-white text-lg mb-8 drop-shadow-lg">
              페이즈와 스테이지가 여기에 표시됩니다
            </p>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-center gap-4">
            <Link href="/">
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
                홈으로
              </button>
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
              첫 번째 스테이지 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

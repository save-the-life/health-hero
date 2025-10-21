'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";

export default function GamePage() {
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { 
    level, 
    totalScore, 
    currentPhase,
    hearts, 
    heartTimer, 
    isLoading, 
    error,
    loadUserData,
    updateHearts 
  } = useGameStore();

  // 컴포넌트 마운트 시 인증 상태 초기화 및 데이터 로드
  useEffect(() => {
    const initData = async () => {
      await initialize();
    };
    initData();
  }, [initialize]);

  // 사용자 데이터 로드
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserData(user.id);
    }
  }, [isAuthenticated, user?.id, loadUserData]);

  // 하트 타이머 업데이트 (30초마다)
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !hearts) return;

    const interval = setInterval(() => {
      // 하트가 5개 미만일 때만 서버 업데이트 호출
      if (hearts.current_hearts < 5) {
        updateHearts();
      }
    }, 30000); // 30초마다 (하트 충전 주기 고려)

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, hearts, updateHearts]);

  // 스크롤을 하단에 고정하는 useEffect
  useEffect(() => {
    const scrollToBottom = () => {
      const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement;
      if (scrollContainer) {
        // 스크롤을 맨 아래로 이동 (페이즈 1이 보이도록)
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    };

    // 즉시 실행
    scrollToBottom();

    // 이미지 로딩 완료 후에도 실행 (여러 번 시도)
    const timeoutIds = [
      setTimeout(scrollToBottom, 100),
      setTimeout(scrollToBottom, 500),
      setTimeout(scrollToBottom, 1000)
    ];
    
    // 윈도우 리사이즈 시에도 실행
    window.addEventListener('resize', scrollToBottom);
    
    // 페이지 로드 완료 후에도 실행
    window.addEventListener('load', scrollToBottom);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      window.removeEventListener('resize', scrollToBottom);
      window.removeEventListener('load', scrollToBottom);
    };
  }, [isLoading]); // 로딩 상태가 변경될 때마다 실행

  // 레벨에 따른 캐릭터 이미지 경로 반환
  const getCharacterImage = (level: number): string => {
    if (level >= 20) return '/images/characters/level-20.png';
    if (level >= 15) return '/images/characters/level-15.png';
    if (level >= 10) return '/images/characters/level-10.png';
    if (level >= 5) return '/images/characters/level-5.png';
    return '/images/characters/level-1.png';
  };

  // 페이즈 상태에 따른 이미지 경로 반환
  const getPhaseImage = (phaseNumber: number): string => {
    // 페이즈 1은 항상 활성화
    if (phaseNumber === 1) {
      return '/images/items/icon-phase1.png';
    }
    
    // 사용자의 현재 페이즈를 기반으로 활성화 상태 결정
    // 현재 페이즈보다 낮은 페이즈는 모두 클리어된 것으로 간주
    if (phaseNumber <= currentPhase) {
      return `/images/items/icon-phase${phaseNumber}.png`;
    }
    
    // 현재 페이즈보다 높은 페이즈는 잠금 상태
    return '/images/items/icon-locked-phase.png';
  };

  // 로딩 중이거나 에러가 있으면 표시
  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="text-red-500 text-xl">에러: {error}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">로그인이 필요합니다</div>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
              홈으로 돌아가기
            </button>
          </Link>
        </div>
      </div>
    );
  }
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

      {/* 고정 헤더 */}
      <div className="fixed top-6 left-0 right-0 z-30 bg-transparent">
        <div className="flex items-center justify-between px-6 py-3 h-[60px]">
          {/* 캐릭터 & 레벨 */}
          <div className="flex items-center gap-5">
            <div className="relative">
              {/* 캐릭터 원형 배경 */}
              <Image
                src="/images/ui/block02.png"
                alt="캐릭터 배경"
                width={40}
                height={40}
                className="relative z-10"
              />
              {/* 캐릭터 이미지 */}
              <Image
                src={getCharacterImage(level)}
                alt="캐릭터"
                width={30}
                height={30}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              />
              {/* 레벨 블록 */}
              <Image
                src="/images/ui/block01.png"
                alt="레벨 배경"
                width={70}
                height={24}
                className="absolute top-1/2 left-6 transform -translate-y-1/2 z-0"
                style={{ width: '70px', height: '24px', minWidth: '70px', minHeight: '24px' }}
              />
              {/* 레벨 텍스트 */}
              <span className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1">
                Lv.{level}
              </span>
            </div>
          </div>

          {/* 하트 */}
          <div className="flex items-center gap-5">
            <div className="relative">
              {/* 하트 아이콘 */}
              <Image
                src="/images/items/icon-heart.png"
                alt="하트"
                width={44}
                height={44}
                className="relative z-10"
              />
              {/* 하트 내부 숫자 */}
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-base font-normal">
                {hearts?.current_hearts || 5}
              </span>
              {/* 광고 버튼 */}
              <Image
                src="/images/items/button-ad.png"
                alt="광고 버튼"
                width={16}
                height={16}
                className="absolute bottom-0 right-0 z-20"
              />
              {/* 타이머 블록 */}
              <Image
                src="/images/ui/block01.png"
                alt="타이머 배경"
                width={70}
                height={24}
                className="absolute top-1/2 left-6 transform -translate-y-1/2 z-0"
                style={{ width: '70px', height: '24px', minWidth: '70px', minHeight: '24px' }}
              />
              {/* 타이머 텍스트 */}
              <span className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1">
                {heartTimer}
              </span>
            </div>
          </div>

          {/* 점수 */}
          <div className="flex items-center gap-5">
            <div className="relative">
              {/* 별 아이콘 */}
              <Image
                src="/images/items/Icon-star.png"
                alt="별"
                width={40}
                height={40}
                className="relative z-10"
              />
              {/* 점수 블록 */}
              <Image
                src="/images/ui/block01.png"
                alt="점수 배경"
                width={70}
                height={24}
                className="absolute top-1/2 left-6 transform -translate-y-1/2 z-0"
                style={{ width: '70px', height: '24px', minWidth: '70px', minHeight: '24px' }}
              />
              {/* 점수 텍스트 */}
              <span className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1">
                {totalScore.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 설정 버튼 */}
          <div className="flex items-center">
            <Image
              src="/images/items/button-setting.png"
              alt="설정"
              width={24}
              height={24}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full h-screen pt-[60px] pb-4 overflow-y-auto">

        {/* 페이즈 블록들 */}
        <div className="relative w-full" style={{ height: 'calc(100vh + 0px)' }}>
          
          {/* 페이즈 1 - 우측 하단 */}
          <div className="absolute bottom-[20px] right-[24px] w-[150px] h-[160px] rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                src={getPhaseImage(1)}
                alt="페이즈 1"
                width={120}
                height={120}
                className="mb-2"
              />
            </div>
          </div>

          {/* 페이즈 2 - 좌측 중앙 */}
          <div className="absolute bottom-[180px] left-[24px] w-[150px] h-[160px] rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                src={getPhaseImage(2)}
                alt="페이즈 2"
                width={120}
                height={120}
                className="mb-2"
              />
            </div>
          </div>

          {/* 페이즈 3 - 우측 상단 */}
          <div className="absolute bottom-[340px] right-[24px] w-[150px] h-[160px] rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                src={getPhaseImage(3)}
                alt="페이즈 3"
                width={120}
                height={120}
                className="mb-2"
              />
            </div>
          </div>

          {/* 페이즈 4 - 좌측 상단 */}
          <div className="absolute bottom-[500px] left-[24px] w-[150px] h-[160px] rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                src={getPhaseImage(4)}
                alt="페이즈 4"
                width={120}
                height={120}
                className="mb-2"
              />
            </div>
          </div>

          {/* 페이즈 간 연결선 */}
          {/* 페이즈 1 → 페이즈 2 */}
          <div className="absolute bottom-[120px] left-1/2 transform -translate-x-1/2 z-0">
            <Image
              src="/images/ui/vector1.png"
              alt="페이즈 연결선"
              width={170}
              height={60}
              className="opacity-80"
            />
          </div>

          {/* 페이즈 2 → 페이즈 3 */}
          <div className="absolute bottom-[280px] left-1/2 transform -translate-x-1/2 z-0">
            <Image
              src="/images/ui/vector2.png"
              alt="페이즈 연결선"
              width={170}
              height={60}
              className="opacity-80"
            />
          </div>

          {/* 페이즈 3 → 페이즈 4 */}
          <div className="absolute bottom-[440px] left-1/2 transform -translate-x-1/2 z-0">
            <Image
              src="/images/ui/vector1.png"
              alt="페이즈 연결선"
              width={170}
              height={60}
              className="opacity-80"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
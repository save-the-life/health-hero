'use client'

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import GameHeader from "@/components/GameHeader";
import { QuizService, QuizQuestion } from "@/services/quizService";
import QuizChoiceButton from "@/components/QuizChoiceButton";

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { 
    level, 
    totalScore, 
    currentPhase,
    currentStage,
    hearts, 
    heartTimer, 
    isLoading, 
    error,
    loadUserData,
    updateHearts 
  } = useGameStore();

  // URL 파라미터에서 현재 퀴즈 정보 가져오기
  const quizPhase = parseInt(searchParams.get('phase') || '1');
  const quizStage = parseInt(searchParams.get('stage') || '1');

  // 퀴즈 데이터 상태
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // 텍스트 길이에 따른 동적 폰트 크기 계산
  const getDynamicFontSize = (text: string, maxWidth: number = 245): string => {
    const textLength = text.length;
    
    // 텍스트 길이에 따른 폰트 크기 결정
    if (textLength <= 20) {
      return 'text-2xl'; // 24px
    } else if (textLength <= 30) {
      return 'text-xl'; // 20px
    } else if (textLength <= 40) {
      return 'text-lg'; // 18px
    } else if (textLength <= 50) {
      return 'text-base'; // 16px
    } else if (textLength <= 60) {
      return 'text-sm'; // 14px
    } else {
      return 'text-xs'; // 12px
    }
  };

  // 선택지 클릭 핸들러
  const handleChoiceClick = (choiceIndex: number) => {
    setSelectedAnswer(choiceIndex);
    // TODO: 답안 제출 로직 구현
    console.log('선택된 답안:', choiceIndex);
  };

  // 컴포넌트 마운트 시 인증 상태 초기화 및 데이터 로드
  useEffect(() => {
    const initData = async () => {
      await initialize();
      if (user?.id) {
        await loadUserData(user.id);
      }
    };
    initData();
  }, [initialize, user?.id, loadUserData]);

  // 퀴즈 데이터 로드
  useEffect(() => {
    const loadQuizData = async () => {
      if (!isAuthenticated) return;
      
      setQuizLoading(true);
      setQuizError(null);
      
      try {
        const question = await QuizService.getQuizQuestion(quizPhase, quizStage);
        if (question) {
          setCurrentQuestion(question);
        } else {
          setQuizError('퀴즈 문제를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('퀴즈 데이터 로드 실패:', error);
        setQuizError('퀴즈 데이터를 불러오는데 실패했습니다.');
      } finally {
        setQuizLoading(false);
      }
    };

    loadQuizData();
  }, [isAuthenticated, quizPhase, quizStage]);

  // 인증되지 않은 경우 리다이렉트
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // 하트 타이머 업데이트 (30초마다)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const interval = setInterval(() => {
      if (hearts && hearts.current_hearts < 5) {
        updateHearts(user.id);
      }
    }, 30000); // 30초마다 실행

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, hearts, updateHearts]);


  // 로딩 중
  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/background-quiz.png"
            alt="퀴즈 배경"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* 로딩 텍스트 */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl font-medium">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/background-quiz.png"
            alt="퀴즈 배경"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* 에러 텍스트 */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl font-medium">에러: {error}</div>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로딩 표시
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/background-quiz.png"
            alt="퀴즈 페이지 배경"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl font-medium">로그인 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/background-quiz.png"
          alt="퀴즈 배경"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 상단 헤더 */}
      <GameHeader />

      {/* 스테이지 진행 프로그래스바 */}
      <div className="fixed top-[84px] left-0 right-0 z-10 flex justify-center">
        <div className="relative">
          {/* 프로그래스바 테두리 */}
          <Image
            src="/images/ui/progressbar01.png"
            alt="프로그래스바 테두리"
            width={310}
            height={24}
            className="object-cover"
          />
          
          {/* 프로그래스바 내부 */}
          <div className="absolute top-1 left-1">
            <Image
              src="/images/ui/progressbar02.png"
              alt="프로그래스바 내부"
              width={300}
              height={16}
              className="object-cover"
            />
            
            {/* 진행률 표시 (현재 스테이지에 따라) */}
            <div 
              className="absolute top-0 left-0 h-4 rounded-lg"
              style={{
                width: `${(quizStage / 5) * 300}px`,
                background: 'linear-gradient(to bottom, #9DF544, #63D42A)',
                border: '1px solid rgba(47, 153, 21, 0.8)',
                boxShadow: 'inset -2px 0px 2px 0px #65D925, inset 2px 0px 2px 0px #67D721'
              }}
            />
            
            {/* 스테이지 정보 텍스트 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-white font-bold text-sm">
                STAGE {quizPhase}-{quizStage}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative z-10 pt-[120px] px-4">
        {/* 퀴즈 로딩 중 */}
        {quizLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-white text-xl font-medium">퀴즈 로딩 중...</div>
          </div>
        )}

        {/* 퀴즈 에러 */}
        {quizError && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-500 text-xl font-medium">{quizError}</div>
          </div>
        )}

        {/* 퀴즈 문제 표시 */}
        {!quizLoading && !quizError && currentQuestion && (
          <div className="flex flex-col items-center">
            {/* 칠판 */}
            <div className="relative mb-6">
              <Image
                src="/images/items/blackboard.png"
                alt="칠판"
                width={342}
                height={282}
                className="object-cover"
              />
              
              {/* 문제 및 토픽 텍스트 컨테이너 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {/* 토픽 텍스트 */}
                <p className={`text-white text-center font-normal leading-relaxed w-[245px] mb-2 ${getDynamicFontSize(`[${currentQuestion.topic}]`)}`}>
                  [{currentQuestion.topic}]
                </p>
                {/* 문제 텍스트 */}
                <p className={`text-white text-center font-normal leading-relaxed w-[245px] ${getDynamicFontSize(currentQuestion.prompt)}`}>
                  {currentQuestion.prompt}
                </p>
              </div>
            </div>

            {/* 선택지 버튼들 */}
            <div className="flex flex-col gap-4">
              {currentQuestion.choices.map((choice, index) => (
                <QuizChoiceButton
                  key={index}
                  choice={choice}
                  index={index}
                  isSelected={selectedAnswer === index}
                  onClick={() => handleChoiceClick(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

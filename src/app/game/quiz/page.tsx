"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import GameHeader from "@/components/GameHeader";
import { QuizService, QuizQuestion } from "@/services/quizService";
import QuizChoiceButton from "@/components/QuizChoiceButton";
import StageResultModal from "@/components/StageResultModal";
import HeartShortageModal from "@/components/HeartShortageModal";
import ItemUseModal from "@/components/ItemUseModal";
import HintModal from "@/components/HintModal";

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const {
    level,
    totalScore,
    hearts,
    isLoading,
    error,
    loadUserData,
    updateHearts,
    consumeHeart,
    updateScore,
    addScoreAndExp,
    completeStage,
    checkLevelUp,
    getLevelInfo,
  } = useGameStore();

  // URL 파라미터에서 현재 퀴즈 정보 가져오기
  const quizPhase = parseInt(searchParams.get("phase") || "1");
  const quizStage = parseInt(searchParams.get("stage") || "1");

  // 레벨에 따른 캐릭터 이미지 경로 반환
  const getCharacterImage = (level: number): string => {
    // 레벨 범위별로 명시적 매핑
    let imagePath: string;
    if (level >= 20) {
      imagePath = "/images/characters/level-20.png";
    } else if (level >= 15) {
      imagePath = "/images/characters/level-15.png";
    } else if (level >= 10) {
      imagePath = "/images/characters/level-10.png";
    } else if (level >= 5) {
      imagePath = "/images/characters/level-5.png";
    } else {
      // 1-4 레벨은 모두 level-1.png 사용
      imagePath = "/images/characters/level-1.png";
    }

    // 캐시 문제 해결을 위한 쿼리 파라미터 추가
    return `${imagePath}?v=${level}`;
  };

  // 퀴즈 데이터 상태
  const [stageQuestions, setStageQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // 사용자 답안 추적 및 점수/경험치 계산
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [userItemsUsed, setUserItemsUsed] = useState<(string | null)[]>([]);
  const [stageScore, setStageScore] = useState(0);
  const [stageExp, setStageExp] = useState(0);

  // 레벨업 관련 상태
  const [levelUpInfo, setLevelUpInfo] = useState<{
    leveledUp: boolean;
    newLevel: number;
    expToNext: number;
    title: string;
  } | null>(null);

  // 스테이지 결과 모달 상태
  const [showStageResultModal, setShowStageResultModal] = useState(false);
  const [stageResultData, setStageResultData] = useState<{
    isSuccess: boolean;
    correctCount: number;
    earnedExp: number;
    earnedScore: number;
  } | null>(null);

  // 하트 부족 모달 상태
  const [showHeartShortageModal, setShowHeartShortageModal] = useState(false);

  // 아이템 사용 모달 상태
  const [showItemUseModal, setShowItemUseModal] = useState<string | null>(null);

  // 아이템 사용 관련 상태
  const [usedItem, setUsedItem] = useState<string | null>(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [doubleScoreActive, setDoubleScoreActive] = useState(false);
  const [removedChoices, setRemovedChoices] = useState<number[]>([]);

  // 중복 실행 방지를 위한 ref
  const heartDeductedRef = useRef(false);

  // 현재 문제 가져오기
  const currentQuestion = stageQuestions[currentQuestionIndex] || null;

  // 난이도별 점수/경험치 계산 함수
  const getDifficultyByStage = (stage: number): "쉬움" | "보통" | "어려움" => {
    if (stage <= 2) return "쉬움";
    if (stage <= 4) return "보통";
    return "어려움";
  };

  const calculateScoreAndExp = (
    difficulty: "쉬움" | "보통" | "어려움",
    isCorrect: boolean
  ) => {
    if (!isCorrect) return { score: 0, exp: 0 };

    const scoreMap = { 쉬움: 10, 보통: 30, 어려움: 50 };
    const expMap = { 쉬움: 12, 보통: 18, 어려움: 26 };

    let score = scoreMap[difficulty];
    const exp = expMap[difficulty];

    // 점수 2배 아이템 효과 적용
    if (doubleScoreActive) {
      score *= 2;
    }

    return { score, exp };
  };

  // 텍스트 길이에 따른 동적 폰트 크기 계산
  const getDynamicFontSize = (text: string): string => {
    const textLength = text.length;

    // 텍스트 길이에 따른 폰트 크기 결정
    if (textLength <= 20) {
      return "text-2xl"; // 24px
    } else if (textLength <= 30) {
      return "text-xl"; // 20px
    } else if (textLength <= 40) {
      return "text-lg"; // 18px
    } else if (textLength <= 50) {
      return "text-base"; // 16px
    } else if (textLength <= 60) {
      return "text-sm"; // 14px
    } else {
      return "text-xs"; // 12px
    }
  };

  // 선택지 클릭 핸들러
  const handleChoiceClick = async (choiceIndex: number) => {
    setSelectedAnswer(choiceIndex);

    if (currentQuestion) {
      console.log("=== 퀴즈 디버깅 정보 ===");
      console.log("문제 번호:", currentQuestion.qnum);
      console.log("문제:", currentQuestion.prompt);
      console.log("선택지들:", currentQuestion.choices);
      console.log("선택한 인덱스:", choiceIndex);
      console.log("선택한 답안:", currentQuestion.choices[choiceIndex]);
      console.log("데이터베이스 정답 인덱스:", currentQuestion.answer_index);
      console.log("데이터베이스 정답 인덱스 타입:", typeof currentQuestion.answer_index);
      console.log(
        "데이터베이스 정답:",
        currentQuestion.choices[currentQuestion.answer_index]
      );
      console.log("정답 여부:", choiceIndex === currentQuestion.answer_index);
      console.log("정답 인덱스 범위 확인:", currentQuestion.answer_index >= 0 && currentQuestion.answer_index <= 3);
      console.log("========================");

      const correct = choiceIndex === currentQuestion.answer_index;
      setIsCorrect(correct);

      // 사용자 답안 저장
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = choiceIndex;
      setUserAnswers(newAnswers);

      // 점수/경험치 계산
      const difficulty = getDifficultyByStage(quizStage);
      const { score, exp } = calculateScoreAndExp(difficulty, correct);

      if (correct) {
        setStageScore((prev) => prev + score);
        setStageExp((prev) => prev + exp);
        console.log(`정답! +${score}점, +${exp}경험치 (${difficulty})`);
      }

      // 퀴즈 기록 저장 (중복 방지용)
      if (user?.id) {
        try {
          await QuizService.submitQuizAnswer(
            user.id,
            currentQuestion.id,
            choiceIndex,
            correct,
            correct ? score : 0,
            quizPhase,
            quizStage
          );
        } catch (error) {
          console.error("퀴즈 기록 저장 실패:", error);
        }
      }

      // 오답인 경우 하트 차감
      if (!correct && user?.id) {
        console.log("오답! 하트 차감");
        // 하트 차감 로직 (하트가 0보다 클 때만 차감)
        if (hearts && hearts.current_hearts > 0) {
          try {
            const success = await consumeHeart(1);
            if (success) {
              console.log(
                `하트 차감 성공: ${hearts.current_hearts} → ${
                  hearts.current_hearts - 1
                }`
              );

              // 하트 차감 후 하트가 0이 되었는지 체크
              if (hearts.current_hearts - 1 <= 0) {
                console.log("하트가 0이 되었습니다. 하트 부족 모달 표시");
                setShowHeartShortageModal(true);
              }
            } else {
              console.log("하트 차감 실패");
            }
          } catch (error) {
            console.error("하트 차감 중 오류:", error);
          }
        } else {
          console.log("하트가 없어서 차감할 수 없습니다");
          // 하트가 0일 때 하트 부족 모달 표시
          setShowHeartShortageModal(true);
        }
      }

      // 결과 표시
      setShowResult(true);
    }
  };

  // 아이템 사용 핸들러
  const handleItemUse = async (itemId: string) => {
    if (usedItem) return; // 이미 아이템을 사용했으면 무시

    const itemCosts = {
      "remove-wrong": 50,
      "hint": 80,
      "double-score": 100,
      "auto-answer": 200,
    };

    const cost = itemCosts[itemId as keyof typeof itemCosts];
    
    // 점수 부족 체크
    if (!totalScore || totalScore < cost) {
      console.log("점수가 부족합니다.");
      return;
    }

    // 점수 차감
    const newScore = totalScore - cost;
    updateScore(newScore);

    // 아이템별 기능 실행
    switch (itemId) {
      case "remove-wrong":
        handleRemoveWrongAnswer();
        break;
      case "hint":
        handleShowHint();
        break;
      case "double-score":
        handleDoubleScore();
        break;
      case "auto-answer":
        handleAutoAnswer();
        break;
    }

    // 아이템 사용 상태 설정
    setUsedItem(itemId);
    console.log(`${itemId}이 사용되었습니다. (${cost}점 차감)`);
  };

  // 아이템 사용 모달 닫기 핸들러
  const handleCloseItemUseModal = () => {
    setShowItemUseModal(null);
  };

  // 오답 제거 아이템 핸들러
  const handleRemoveWrongAnswer = () => {
    if (!currentQuestion) return;
    
    const correctAnswerIndex = currentQuestion.answer_index;
    const wrongAnswers = currentQuestion.choices
      .map((_, index) => index)
      .filter(index => index !== correctAnswerIndex);
    
    // 이미 제거된 선택지 제외
    const availableWrongAnswers = wrongAnswers.filter(index => !removedChoices.includes(index));
    
    if (availableWrongAnswers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWrongAnswers.length);
      const toRemove = availableWrongAnswers[randomIndex];
      setRemovedChoices(prev => [...prev, toRemove]);
    }
  };

  // 힌트 아이템 핸들러
  const handleShowHint = () => {
    setShowHintModal(true);
  };

  // 점수 2배 아이템 핸들러
  const handleDoubleScore = () => {
    setDoubleScoreActive(true);
  };

  // 자동 정답 아이템 핸들러
  const handleAutoAnswer = () => {
    if (!currentQuestion) return;
    
    const correctAnswerIndex = currentQuestion.answer_index;
    setSelectedAnswer(correctAnswerIndex);
    setIsCorrect(true);
    setShowResult(true);
  };

  // 아이템 클릭 핸들러
  const handleItemClick = (itemType: string) => {
    // 체크박스가 체크되어 있으면 바로 사용, 아니면 모달 표시
    const skipPopup = localStorage.getItem(`item_skip_popup_${itemType}`) === 'true';
    
    if (skipPopup) {
      // 바로 아이템 사용
      handleItemUse(itemType);
    } else {
      // 모달 표시
      setShowItemUseModal(itemType);
    }
  };

  // 스테이지 결과 모달 닫기 핸들러
  const handleCloseStageResultModal = () => {
    setShowStageResultModal(false);
    setStageResultData(null);
  };

  // 하트 부족 모달 닫기 핸들러
  const handleCloseHeartShortageModal = () => {
    setShowHeartShortageModal(false);
  };

  // 다음 문제로 넘어가는 핸들러
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < stageQuestions.length - 1) {
      // 다음 문제로 이동
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
      setSelectedAnswer(null);
      
      // 아이템 상태 초기화
      setUsedItem(null);
      setShowHintModal(false);
      setDoubleScoreActive(false);
      setRemovedChoices([]);
      
      // 아이템 사용 정보 초기화
      setUserItemsUsed(prev => [...prev, usedItem]);
    } else {
      // 모든 문제 완료 - 스테이지 결과 계산
      console.log("스테이지 완료!");

      // 마지막 문제의 아이템 사용 정보 저장
      if (usedItem) {
        setUserItemsUsed(prev => [...prev, usedItem]);
      }

      // 정답 개수 계산
      const correctCount = userAnswers.filter((answer, index) => {
        const question = stageQuestions[index];
        return question && answer === question.answer_index;
      }).length;

      // 보너스 점수/경험치 계산
      let bonusScore = 0;
      let bonusExp = 0;

      if (correctCount === 5) {
        bonusScore = 50;
        bonusExp = 100;
      } else if (correctCount === 4) {
        bonusScore = 30;
        bonusExp = 60;
      } else if (correctCount === 3) {
        bonusExp = 25;
      }

      const totalScore = stageScore + bonusScore;
      const totalExp = stageExp + bonusExp;

      console.log(`스테이지 결과: ${correctCount}/5 정답`);
      console.log(
        `기본 점수: ${stageScore}, 보너스: ${bonusScore}, 총합: ${totalScore}`
      );
      console.log(
        `기본 경험치: ${stageExp}, 보너스: ${bonusExp}, 총합: ${totalExp}`
      );

      // 아이템 사용 정보 로그
      console.log("아이템 사용 내역:");
      userItemsUsed.forEach((item, index) => {
        if (item) {
          const questionNum = index + 1;
          const itemNames = {
            "remove-wrong": "오답 제거",
            "hint": "힌트",
            "double-score": "점수 2배",
            "auto-answer": "자동 정답"
          };
          const itemName = itemNames[item as keyof typeof itemNames] || item;
          
          if (item === "double-score") {
            console.log(`  문제 ${questionNum}: ${itemName} 사용 (점수 2배 획득!)`);
          } else {
            console.log(`  문제 ${questionNum}: ${itemName} 사용`);
          }
        }
      });

      // 데이터베이스에 스테이지 완료 처리
      if (user?.id) {
        try {
          const success = await completeStage(
            quizPhase,
            quizStage,
            correctCount,
            totalScore,
            totalExp
          );
          if (success) {
            console.log("스테이지 완료 데이터 저장 성공");

            // 레벨업 체크는 addScoreAndExp에서 이미 처리됨
            // 여기서는 UI 표시용으로만 체크
            const levelUpCheck = checkLevelUp(stageExp + bonusExp);
            if (levelUpCheck.leveledUp) {
              const levelInfo = getLevelInfo(levelUpCheck.newLevel);
              setLevelUpInfo({
                leveledUp: true,
                newLevel: levelUpCheck.newLevel,
                expToNext: levelUpCheck.expToNext,
                title: levelInfo.title,
              });
              console.log(
                `레벨업! Lv.${level} → Lv.${levelUpCheck.newLevel} (${levelInfo.title})`
              );
            }

            // 스테이지 결과 모달 표시
            const isSuccess = correctCount >= 3;
            setStageResultData({
              isSuccess,
              correctCount,
              earnedExp: totalExp,
              earnedScore: totalScore,
            });
            setShowStageResultModal(true);
          } else {
            console.log("스테이지 완료 데이터 저장 실패");
          }
        } catch (error) {
          console.error("스테이지 완료 처리 중 오류:", error);
        }
      }
    }
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
      heartDeductedRef.current = false; // 새로운 스테이지 진입 시 플래그 리셋

      try {
        const questions = await QuizService.getStageQuestions(
          quizPhase,
          quizStage,
          user?.id
        );
        if (questions && questions.length > 0) {
          setStageQuestions(questions);
          setCurrentQuestionIndex(0);
          // 사용자 답안 배열 초기화
          setUserAnswers(new Array(questions.length).fill(null));
          setStageScore(0);
          setStageExp(0);
        } else {
          setQuizError("퀴즈 문제를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("퀴즈 데이터 로드 실패:", error);
        setQuizError("퀴즈 데이터를 불러오는데 실패했습니다.");
      } finally {
        setQuizLoading(false);
      }
    };

    loadQuizData();
  }, [isAuthenticated, quizPhase, quizStage]);

  // 스테이지 진입 시 하트 차감 (별도 useEffect로 분리)
  useEffect(() => {
    const deductHeartOnStageEntry = async () => {
      if (!isAuthenticated || !user?.id || !hearts) return;

      // 이미 하트가 차감되었는지 확인 (중복 차감 방지)
      if (heartDeductedRef.current) {
        console.log("이미 하트가 차감되었습니다. 중복 실행 방지");
        return;
      }

      if (hearts.current_hearts <= 0) {
        console.log("하트가 없어서 스테이지에 진입할 수 없습니다");
        setShowHeartShortageModal(true);
        return;
      }

      try {
        console.log("스테이지 진입! 하트 차감");
        heartDeductedRef.current = true; // 차감 시작 표시

        const success = await consumeHeart(1);
        if (success) {
          console.log(
            `스테이지 진입 하트 차감 성공: ${hearts.current_hearts} → ${
              hearts.current_hearts - 1
            }`
          );
        } else {
          console.log("스테이지 진입 하트 차감 실패");
          heartDeductedRef.current = false; // 실패 시 플래그 리셋
        }
      } catch (error) {
        console.error("스테이지 진입 하트 차감 중 오류:", error);
        heartDeductedRef.current = false; // 에러 시 플래그 리셋
      }
    };

    // 퀴즈 데이터가 로드된 후에만 하트 차감 실행
    if (
      stageQuestions.length > 0 &&
      !quizLoading &&
      !heartDeductedRef.current
    ) {
      deductHeartOnStageEntry();
    }
  }, [
    isAuthenticated,
    user?.id,
    hearts,
    stageQuestions.length,
    quizLoading,
    consumeHeart,
  ]);

  // 인증되지 않은 경우 리다이렉트
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // 하트 타이머 업데이트 (30초마다)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const interval = setInterval(() => {
      if (hearts && hearts.current_hearts < 5) {
        updateHearts();
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
          src={
            showResult
              ? isCorrect
                ? "/images/backgrounds/background-answer.png"
                : "/images/backgrounds/background-wrong.png"
              : "/images/backgrounds/background-quiz.png"
          }
          alt="퀴즈 배경"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 상단 헤더 */}
      <GameHeader pageType="quiz" />

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

            {/* 진행률 표시 (현재 문제 진행 상황에 따라) */}
            <div
              className="absolute top-0 left-0 h-4 rounded-lg"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / stageQuestions.length) * 300
                }px`,
                background: "linear-gradient(to bottom, #9DF544, #63D42A)",
                border: "1px solid rgba(47, 153, 21, 0.8)",
                boxShadow:
                  "inset -2px 0px 2px 0px #65D925, inset 2px 0px 2px 0px #67D721",
              }}
            />

            {/* 스테이지 정보 텍스트 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-white font-bold text-sm">
                STAGE {quizPhase}-{quizStage} ({currentQuestionIndex + 1}/
                {stageQuestions.length})
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
            <div className="text-white text-xl font-medium">
              퀴즈 로딩 중...
            </div>
          </div>
        )}

        {/* 퀴즈 에러 */}
        {quizError && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-500 text-xl font-medium">{quizError}</div>
          </div>
        )}

        {/* 퀴즈 문제 표시 */}
        {!quizLoading && !quizError && currentQuestion && !showResult && (
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
                <p
                  className={`text-white text-center font-normal leading-relaxed w-[245px] mb-2 ${getDynamicFontSize(
                    `[${currentQuestion.topic}]`
                  )}`}
                >
                  [{currentQuestion.topic}]
                </p>
                {/* 문제 텍스트 */}
                <p
                  className={`text-white text-center font-normal leading-relaxed w-[245px] ${getDynamicFontSize(
                    currentQuestion.prompt
                  )}`}
                >
                  {currentQuestion.prompt}
                </p>
              </div>
            </div>

            {/* 선택지 버튼들 */}
            <div className="flex flex-col gap-4 mb-[80px]">
              {currentQuestion.choices
                .map((choice, index) => ({ choice, index }))
                .filter(({ index }) => !removedChoices.includes(index))
                .map(({ choice, index }) => (
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

        {/* 결과 페이지 표시 */}
        {!quizLoading && !quizError && currentQuestion && showResult && (
          <div className="flex flex-col items-center">
            {/* 칠판 */}
            <div className="relative mb-2">
              <Image
                src="/images/items/blackboard.png"
                alt="칠판"
                width={342}
                height={282}
                className="object-cover"
              />

              {/* 결과 텍스트 컨테이너 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {/* 정답/오답 텍스트 */}
                <p
                  className={`text-white text-center font-normal leading-relaxed w-[245px] mb-2 ${getDynamicFontSize(
                    isCorrect ? "정답입니다!" : "아쉽네요! 정답은,"
                  )}`}
                >
                  {isCorrect ? "정답입니다!" : "아쉽네요! 정답은,"}
                </p>

                {/* 정답 및 설명 텍스트 */}
                <p
                  className={`text-white text-center font-normal leading-relaxed w-[245px] mb-4 ${getDynamicFontSize(
                    isCorrect
                      ? currentQuestion.explanation
                      : `${
                          currentQuestion.choices[currentQuestion.answer_index]
                        }. ${currentQuestion.explanation}`
                  )}`}
                >
                  {isCorrect
                    ? currentQuestion.explanation
                    : `${
                        currentQuestion.choices[currentQuestion.answer_index]
                      }. ${currentQuestion.explanation}`}
                </p>

                {/* 다음 문제 버튼 */}
                <button
                  className="font-medium h-[56px] w-[160px] rounded-[10px] relative cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(180deg, #50B0FF 0%, #50B0FF 50%, #008DFF 50%, #008DFF 100%)",
                    border: "2px solid #76C1FF",
                    outline: "2px solid #000000",
                    boxShadow:
                      "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
                    color: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: "400",
                    WebkitTextStroke: "1px #000000",
                  }}
                  onClick={handleNextQuestion}
                >
                  {/* 버튼 포인트 이미지 */}
                  <Image
                    src="/images/items/button-point-blue.png"
                    alt="button-point-blue"
                    width={8.47}
                    height={6.3}
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: "3px",
                      pointerEvents: "none",
                    }}
                  />

                  {/* 버튼 텍스트 및 아이콘 */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 whitespace-nowrap"
                    style={{
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        color: "#FFFFFF",
                        fontSize: "16px",
                        fontWeight: "400",
                        WebkitTextStroke: "1px #000000",
                        lineHeight: "1.2",
                      }}
                    >
                      {currentQuestionIndex < stageQuestions.length - 1
                        ? "다음 문제"
                        : "결과 보기"}
                    </span>
                    <Image
                      src="/images/items/icon-next.png"
                      alt="다음"
                      width={24}
                      height={24}
                      style={{
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* 캐릭터 이미지 */}
            <div className="relative -mb-8">
              <Image
                src={getCharacterImage(level || 1)}
                alt="캐릭터"
                width={390}
                height={390}
                className="object-cover"
              />
            </div>

            {/* 선택한 답안 버튼 (표시용) */}
            <div className="relative">
              <button
                className="font-medium h-[56px] w-[300px] rounded-[10px] relative cursor-default"
                style={{
                  background: isCorrect
                    ? "linear-gradient(180deg, #00C951 0%, #00C951 50%, #00A041 50%, #00A041 100%)"
                    : "linear-gradient(180deg, #FF2F32 0%, #FF2F32 50%, #CC2528 50%, #CC2528 100%)",
                  border: isCorrect ? "2px solid #4DDD7A" : "2px solid #FF6D70",
                  outline: "2px solid #000000",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: "400",
                  WebkitTextStroke: "1px #000000",
                }}
              >
                {/* 버튼 포인트 이미지 */}
                <Image
                  src={
                    isCorrect
                      ? "/images/items/button-point-blue.png"
                      : "/images/items/button-point-blue.png"
                  }
                  alt="button-point"
                  width={8.47}
                  height={6.3}
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    pointerEvents: "none",
                  }}
                />

                {/* 선택한 답안 텍스트 */}
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
                  {selectedAnswer !== null
                    ? currentQuestion.choices[selectedAnswer]
                    : ""}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 하단 아이템 바 */}
      {!showResult && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 mb-10">
          <div className="flex gap-5">
            {/* 오답 삭제 아이템 */}
            <button
              onClick={() => handleItemClick("remove-wrong")}
              className={`w-[60px] h-[60px] flex items-center justify-center ${
                usedItem && usedItem !== "remove-wrong" ? "opacity-50" : ""
              }`}
              disabled={!totalScore || totalScore < 50 || (usedItem ? usedItem !== "remove-wrong" : false)}
            >
              <Image
                src={
                  totalScore && totalScore >= 50 && (!usedItem || usedItem === "remove-wrong")
                    ? "/images/items/item-remove-wrong-able.png"
                    : "/images/items/item-remove-wrong-disable.png"
                }
                alt="오답 삭제 아이템"
                width={60}
                height={60}
                className="object-cover"
              />
            </button>

            {/* 힌트 아이템 */}
            <button
              onClick={() => handleItemClick("hint")}
              className={`w-[60px] h-[60px] flex items-center justify-center ${
                usedItem && usedItem !== "hint" ? "opacity-50" : ""
              }`}
              disabled={!totalScore || totalScore < 80 || (usedItem ? usedItem !== "hint" : false)}
            >
              <Image
                src={
                  totalScore && totalScore >= 80 && (!usedItem || usedItem === "hint")
                    ? "/images/items/item-hint-able.png"
                    : "/images/items/item-hint-disable.png"
                }
                alt="힌트 아이템"
                width={60}
                height={60}
                className="object-cover"
              />
            </button>

            {/* 점수 2배 아이템 */}
            <button
              onClick={() => handleItemClick("double-score")}
              className={`w-[60px] h-[60px] flex items-center justify-center ${
                usedItem && usedItem !== "double-score" ? "opacity-50" : ""
              } ${
                usedItem === "double-score" ? "animate-pulse" : ""
              }`}
              disabled={!totalScore || totalScore < 100 || (usedItem ? usedItem !== "double-score" : false)}
            >
              <Image
                src={
                  totalScore && totalScore >= 100 && (!usedItem || usedItem === "double-score")
                    ? "/images/items/item-double-able.png"
                    : "/images/items/item-double-disable.png"
                }
                alt="점수 2배 아이템"
                width={60}
                height={60}
                className="object-cover"
              />
            </button>

            {/* 자동 정답 아이템 */}
            <button
              onClick={() => handleItemClick("auto-answer")}
              className={`w-[60px] h-[60px] flex items-center justify-center ${
                usedItem && usedItem !== "auto-answer" ? "opacity-50" : ""
              }`}
              disabled={!totalScore || totalScore < 200 || (usedItem ? usedItem !== "auto-answer" : false)}
            >
              <Image
                src={
                  totalScore && totalScore >= 200 && (!usedItem || usedItem === "auto-answer")
                    ? "/images/items/item-auto-answer-able.png"
                    : "/images/items/item-auto-answer-disable.png"
                }
                alt="자동 정답 아이템"
                width={60}
                height={60}
                className="object-cover"
              />
            </button>
          </div>
        </div>
      )}

      {/* 스테이지 결과 모달 */}
      {stageResultData && (
        <StageResultModal
          isOpen={showStageResultModal}
          isSuccess={stageResultData.isSuccess}
          correctCount={stageResultData.correctCount}
          totalQuestions={stageQuestions.length}
          earnedExp={stageResultData.earnedExp}
          earnedScore={stageResultData.earnedScore}
          currentPhase={quizPhase}
          onClose={handleCloseStageResultModal}
        />
      )}

      {/* 하트 부족 모달 */}
      <HeartShortageModal
        isOpen={showHeartShortageModal}
        currentPhase={quizPhase}
        onClose={handleCloseHeartShortageModal}
      />

      {/* 아이템 사용 모달 */}
      {showItemUseModal && (
        <ItemUseModal
          isOpen={true}
          onClose={handleCloseItemUseModal}
          itemId={showItemUseModal}
          onUseItem={handleItemUse}
        />
      )}

      {/* 힌트 모달 */}
      {currentQuestion && (
        <HintModal
          isOpen={showHintModal}
          onClose={() => setShowHintModal(false)}
          hint={currentQuestion.hint || "힌트가 없습니다."}
        />
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="text-white text-xl">로딩 중...</div>
    </div>}>
      <QuizPageContent />
    </Suspense>
  );
}

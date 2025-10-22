import { supabase } from '@/lib/supabase';

export interface QuizQuestion {
  id: string;
  qnum: number;
  topic: string;
  prompt: string;
  choices: string[];
  answer_index: number;
  hint: string;
  explanation: string;
  difficulty_label: string;
  difficulty_level: number;
}

export interface QuizAnswer {
  question_id: string;
  answer_index: number;
}

export class QuizService {
  // 스테이지별 난이도 매핑
  private static getDifficultyByStage(stage: number): string {
    if (stage <= 2) return '쉬움';
    if (stage <= 4) return '보통';
    return '어려움';
  }

  // 특정 페이즈와 스테이지의 랜덤 퀴즈 문제 5개 가져오기 (중복 방지)
  static async getStageQuestions(phase: number, stage: number, userId?: string): Promise<QuizQuestion[]> {
    try {
      const difficulty = this.getDifficultyByStage(stage);
      
      // 먼저 해당 난이도의 모든 문제를 가져온 후 클라이언트에서 랜덤 선택
      let query = supabase
        .from('quizzes')
        .select('id, qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level')
        .eq('difficulty_label', difficulty);

      // 사용자가 이미 푼 문제 제외 (중복 방지)
      if (userId) {
        const { data: solvedQuestions } = await supabase
          .from('user_quiz_records')
          .select('quiz_id')
          .eq('user_id', userId);

        if (solvedQuestions && solvedQuestions.length > 0) {
          const solvedIds = solvedQuestions.map(record => record.quiz_id);
          query = query.not('id', 'in', `(${solvedIds.join(',')})`);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('스테이지 퀴즈 문제 가져오기 실패:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.warn(`난이도 ${difficulty}에 해당하는 문제가 없거나 모든 문제를 이미 풀었습니다.`);
        return [];
      }

      // 클라이언트에서 랜덤 셔플링하여 5개 선택
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, 5);

      console.log(`스테이지 ${stage} (${difficulty}) 문제 ${selectedQuestions.length}개 선택됨`);
      return selectedQuestions;
    } catch (error) {
      console.error('스테이지 퀴즈 문제 가져오기 중 오류:', error);
      return [];
    }
  }

  // 특정 페이즈와 스테이지의 퀴즈 문제 가져오기 (정답 정보 제외) - 기존 메서드 유지
  static async getQuizQuestion(phase: number, stage: number): Promise<QuizQuestion | null> {
    try {
      // qnum을 phase와 stage로 계산 (예: phase 1, stage 1 = qnum 1)
      const qnum = (phase - 1) * 5 + stage;
      
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level')
        .eq('qnum', qnum)
        .single();

      if (error) {
        console.error('퀴즈 문제 가져오기 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('퀴즈 문제 가져오기 중 오류:', error);
      return null;
    }
  }

  // 특정 페이즈의 모든 스테이지 문제 가져오기 (정답 정보 제외)
  static async getPhaseQuestions(phase: number): Promise<QuizQuestion[]> {
    try {
      const startQnum = (phase - 1) * 5 + 1;
      const endQnum = phase * 5;
      
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level')
        .gte('qnum', startQnum)
        .lte('qnum', endQnum)
        .order('qnum', { ascending: true });

      if (error) {
        console.error('페이즈 퀴즈 문제 가져오기 실패:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('페이즈 퀴즈 문제 가져오기 중 오류:', error);
      return [];
    }
  }

  // 모든 퀴즈 문제 가져오기 (정답 정보 제외)
  static async getAllQuestions(): Promise<QuizQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level')
        .order('qnum', { ascending: true });

      if (error) {
        console.error('모든 퀴즈 문제 가져오기 실패:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('모든 퀴즈 문제 가져오기 중 오류:', error);
      return [];
    }
  }

  // 답안 제출 및 정답 확인 (Edge Function 사용)
  static async submitAnswer(questionId: string, userAnswer: number, userId: string): Promise<{
    isCorrect: boolean;
    explanation: string;
    correctAnswer: number;
    scoreEarned: number;
    difficultyLevel: number;
  } | null> {
    try {
      const { data, error } = await supabase.functions.invoke('quiz-submit', {
        body: {
          questionId,
          userAnswer,
          userId
        }
      });

      if (error) {
        console.error('정답 확인 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('정답 확인 중 오류:', error);
      return null;
    }
  }

  // 퀴즈 답안 제출 및 기록 저장 (중복 방지용)
  static async submitQuizAnswer(
    userId: string,
    questionId: string,
    answerIndex: number,
    isCorrect: boolean,
    scoreEarned: number,
    phase: number,
    stage: number,
    timeTaken?: number
  ): Promise<boolean> {
    try {
      // 퀴즈 기록 저장 (중복 방지를 위해)
      const { error: recordError } = await supabase
        .from('user_quiz_records')
        .insert({
          user_id: userId,
          quiz_id: questionId,
          phase: phase,
          stage: stage,
          is_correct: isCorrect,
          score_earned: scoreEarned,
          time_taken: timeTaken,
        });

      if (recordError) {
        console.error('퀴즈 기록 저장 실패:', recordError);
        return false;
      }

      // 기존 제출 로그도 유지 (호환성)
      const { error: logError } = await supabase
        .from('quiz_submission_logs')
        .insert({
          user_id: userId,
          question_id: questionId,
          user_answer: answerIndex,
          is_correct: isCorrect,
          submitted_at: new Date().toISOString(),
        });

      if (logError) {
        console.warn('퀴즈 제출 로그 저장 실패:', logError);
        // 로그 실패는 치명적이지 않으므로 계속 진행
      }

      return true;
    } catch (error) {
      console.error('퀴즈 답안 제출 중 오류:', error);
      return false;
    }
  }
}

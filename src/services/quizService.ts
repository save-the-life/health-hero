import { supabase } from '@/lib/supabase';

export interface QuizQuestion {
  id: string;
  qnum: number;
  topic: string;
  prompt: string;
  choices: string[];
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
  // 특정 페이즈와 스테이지의 퀴즈 문제 가져오기 (정답 정보 제외)
  static async getQuizQuestion(phase: number, stage: number): Promise<QuizQuestion | null> {
    try {
      // qnum을 phase와 stage로 계산 (예: phase 1, stage 1 = qnum 1)
      const qnum = (phase - 1) * 5 + stage;
      
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, qnum, topic, prompt, choices, hint, explanation, difficulty_label, difficulty_level')
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
        .select('id, qnum, topic, prompt, choices, hint, explanation, difficulty_label, difficulty_level')
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
        .select('id, qnum, topic, prompt, choices, hint, explanation, difficulty_label, difficulty_level')
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
}

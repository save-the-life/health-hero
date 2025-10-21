import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Supabase 클라이언트 생성
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 요청 데이터 파싱
    const { questionId, userAnswer, userId } = await req.json()

    if (!questionId || userAnswer === undefined || !userId) {
      return new Response(
        JSON.stringify({ error: '필수 파라미터가 누락되었습니다.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 정답 정보 조회 (서버 사이드에서만 접근 가능)
    const { data: question, error: questionError } = await supabaseClient
      .from('quizzes')
      .select('answer_index, explanation, difficulty_level')
      .eq('id', questionId)
      .single()

    if (questionError || !question) {
      return new Response(
        JSON.stringify({ error: '문제를 찾을 수 없습니다.' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 정답 확인
    const isCorrect = question.answer_index === userAnswer

    // 점수 계산 (난이도에 따라 차등)
    let scoreEarned = 0
    if (isCorrect) {
      switch (question.difficulty_level) {
        case 1: scoreEarned = 100  // 쉬움
          break
        case 2: scoreEarned = 150  // 보통
          break
        case 3: scoreEarned = 200  // 어려움
          break
        default: scoreEarned = 100
      }
    }

    // 퀴즈 기록 저장
    const { error: recordError } = await supabaseClient
      .from('user_quiz_records')
      .insert({
        user_id: userId,
        quiz_id: questionId,
        is_correct: isCorrect,
        score_earned: scoreEarned,
        time_taken: null, // TODO: 시간 측정 로직 추가
      })

    if (recordError) {
      console.error('퀴즈 기록 저장 실패:', recordError)
    }

    // 감사 로그 저장
    const { error: logError } = await supabaseClient
      .from('quiz_submission_logs')
      .insert({
        user_id: userId,
        question_id: questionId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
      })

    if (logError) {
      console.error('감사 로그 저장 실패:', logError)
    }

    // 응답 반환
    return new Response(
      JSON.stringify({
        isCorrect,
        explanation: question.explanation,
        correctAnswer: question.answer_index,
        scoreEarned,
        difficultyLevel: question.difficulty_level,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge Function 오류:', error)
    return new Response(
      JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

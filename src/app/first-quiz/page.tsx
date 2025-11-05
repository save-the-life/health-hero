/**
 * 혜택 탭 프로모션 진입 페이지
 * intoss://lucky-dice/first-quiz 로 접근 시 실행
 * 
 * 역할:
 * 1. 프로모션 플래그를 로컬 스토리지에 저장
 * 2. 시작 페이지(/)로 리다이렉트
 * 3. 시작 페이지의 "퀴즈 풀러가기" 버튼이 프로모션을 지급
 */

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FirstQuizPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎁 [FirstQuiz] 혜택 탭에서 진입');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 프로모션 지급 플래그 설정
    localStorage.setItem('shouldGrantPromotion', 'true');
    console.log('✅ [FirstQuiz] 프로모션 플래그 설정 완료');
    
    // 시작 페이지로 리다이렉트
    console.log('🔄 [FirstQuiz] 시작 페이지로 리다이렉트');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">프로모션 페이지로 이동 중...</p>
      </div>
    </div>
  );
}


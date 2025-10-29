"use client";

import { Button } from '@toss/tds-mobile';
import Image from 'next/image';

interface AdRewardDialogProps {
  open: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
}

export function AdRewardDialog({
  open,
  onClose,
  success,
  message,
}: AdRewardDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* 다이얼로그 */}
      <div className="relative z-10 bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
        {/* 아이콘 */}
        <div className="flex justify-center mb-2">
          <Image
            src={success ? "/images/items/icon-heart.png" : "/images/ui/icon-heart.png"}
            alt={success ? "하트" : "알림"}
            width={80}
            height={80}
          />
        </div>
        
        {/* 제목 */}
        <h2 className="text-xl font-bold text-center mb-2 text-gray-900">
          {success ? "하트 획득!" : "알림"}
        </h2>
        
        {/* 메시지 */}
        <p className="text-center text-gray-700 mb-3 whitespace-pre-wrap">
          {message}
        </p>
        
        {/* TDS 버튼 */}
          <Button
            display="full"
            variant="fill"
            color="primary"
            size="xlarge"
            onClick={onClose}
            style={{
              backgroundColor: 'white',
              color: '#000',
              border: '0px solid #000',
              fontWeight: 'bold',
              borderRadius: '12px',
            }}
          >
            확인
          </Button>
      </div>
    </div>
  );
}


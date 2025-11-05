"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * 재시도 로직과 에러 핸들링이 포함된 안전한 이미지 컴포넌트
 * 
 * @param fallbackSrc - 로딩 실패 시 표시할 대체 이미지
 * @param maxRetries - 최대 재시도 횟수 (기본값: 3)
 * @param retryDelay - 재시도 간격 (밀리초, 기본값: 1000)
 */
export function SafeImage({
  src,
  fallbackSrc,
  maxRetries = 3,
  retryDelay = 1000,
  priority = false,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  // src가 변경되면 상태 초기화
  useEffect(() => {
    setCurrentSrc(src);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    console.warn(`이미지 로딩 실패 (시도 ${retryCount + 1}/${maxRetries}):`, currentSrc);

    // 최대 재시도 횟수에 도달하지 않았으면 재시도
    if (retryCount < maxRetries) {
      setTimeout(() => {
        console.log(`이미지 재시도 중... (${retryCount + 1}/${maxRetries}):`, src);
        setRetryCount((prev) => prev + 1);
        // 캐시 우회를 위해 timestamp 추가
        const timestamp = new Date().getTime();
        const separator = typeof src === "string" && src.includes("?") ? "&" : "?";
        setCurrentSrc(typeof src === "string" ? `${src}${separator}_t=${timestamp}` : src);
      }, retryDelay);
    } else {
      // 최대 재시도 횟수 초과 시 fallback 이미지 사용
      console.error(`이미지 로딩 최종 실패, fallback 사용:`, currentSrc);
      if (fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      }
    }
  };

  const handleLoad = () => {
    // 성공적으로 로드되면 재시도 카운트 초기화
    if (retryCount > 0) {
      console.log(`이미지 로딩 성공 (재시도 ${retryCount}회 후):`, currentSrc);
    }
  };

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={props.alt || ""}
      onError={handleError}
      onLoad={handleLoad}
      priority={priority}
      // 중요 이미지는 eager 로딩
      loading={priority ? "eager" : props.loading}
    />
  );
}


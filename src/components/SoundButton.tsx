import React, { forwardRef, ElementType } from "react";
import { useAudio } from "@/hooks/useAudio";

interface ClickableProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: React.ReactNode;
  disabled?: boolean;
  playClickSound?: boolean;
}

export const Clickable = forwardRef<HTMLElement, ClickableProps>(
  (
    {
      as: Component = "div",
      children,
      disabled,
      playClickSound = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const { playClickSound: playSound } = useAudio();

    const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
      // 클릭 사운드 재생
      if (playClickSound && !disabled) {
        await playSound();
      }

      // 원래 onClick 핸들러 실행
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <Component ref={ref} onClick={handleClick} {...props}>
        {children}
      </Component>
    );
  }
);

Clickable.displayName = "Clickable";

// 버튼 전용 컴포넌트
interface SoundButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  playClickSound?: boolean;
}

export const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ children, playClickSound = true, onClick, ...props }, ref) => {
    const { playClickSound: playSound } = useAudio();

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // 클릭 사운드 재생
      if (playClickSound && !props.disabled) {
        await playSound();
      }

      // 원래 onClick 핸들러 실행
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <button ref={ref} onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);

SoundButton.displayName = "SoundButton";

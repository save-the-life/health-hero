import { useEffect, useCallback } from "react";
import { audioService, AudioFile } from "@/services/audioService";
import { useAuthStore } from "@/store/authStore";

export const useAudio = () => {
  const { user } = useAuthStore();

  // 사용자 ID 설정
  useEffect(() => {
    if (user?.id) {
      audioService.setUserId(user.id);
    }
  }, [user?.id]);

  // 오디오 재생 함수들
  const playAudio = useCallback(async (audioFile: AudioFile) => {
    await audioService.play(audioFile);
  }, []);

  const playClickSound = useCallback(async () => {
    await audioService.playClickSound();
  }, []);

  const playQuizRightSound = useCallback(async () => {
    await audioService.playQuizRightSound();
  }, []);

  const playQuizWrongSound = useCallback(async () => {
    await audioService.playQuizWrongSound();
  }, []);

  const playLevelUpSound = useCallback(async () => {
    await audioService.playLevelUpSound();
  }, []);

  const playStageClearSound = useCallback(async () => {
    await audioService.playStageClearSound();
  }, []);

  const playStageFailedSound = useCallback(async () => {
    await audioService.playStageFailedSound();
  }, []);

  const playNextPhaseSound = useCallback(async () => {
    await audioService.playNextPhaseSound();
  }, []);

  // 음소거 관련 함수들
  const toggleMute = useCallback(async () => {
    return await audioService.toggleMute();
  }, []);

  const isMuted = useCallback(() => {
    return audioService.getMuteState();
  }, []);

  const setVolume = useCallback((volume: number) => {
    audioService.setVolume(volume);
  }, []);

  const getVolume = useCallback(() => {
    return audioService.getVolume();
  }, []);

  return {
    // 오디오 재생 함수들
    playAudio,
    playClickSound,
    playQuizRightSound,
    playQuizWrongSound,
    playLevelUpSound,
    playStageClearSound,
    playStageFailedSound,
    playNextPhaseSound,
    
    // 음소거 관련 함수들
    toggleMute,
    isMuted,
    setVolume,
    getVolume,
  };
};

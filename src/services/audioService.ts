import { supabase } from "@/lib/supabase";

// 오디오 파일 경로 매핑
const AUDIO_FILES = {
  buttonClick: "/sounds/button-click.mp3",
  levelUp: "/sounds/level-up.mp3",
  nextPhase: "/sounds/next-phase.mp3",
  quizRight: "/sounds/quiz-right.mp3",
  quizWrong: "/sounds/quiz-wrong.mp3",
  stageClear: "/sounds/stage-clear.mp3",
  stageFailed: "/sounds/stage-failed.mp3",
} as const;

export type AudioFile = keyof typeof AUDIO_FILES;

class AudioService {
  private audioInstances: Map<AudioFile, HTMLAudioElement> = new Map();
  private audioBuffers: Map<AudioFile, AudioBuffer> = new Map();
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.3; // 기본 볼륨 30%
  private userId: string | null = null;
  private initialized: boolean = false;
  private webAudioInitialized: boolean = false;

  constructor() {
    // 서버 사이드에서는 초기화하지 않음
    if (typeof window !== "undefined") {
      this.initializeAudioInstances();
      this.loadMuteState();
    }
  }

  // 오디오 인스턴스 초기화
  private initializeAudioInstances() {
    if (typeof window === "undefined" || this.initialized) return;
    
    Object.entries(AUDIO_FILES).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.volume = this.volume;
      // 오디오 로딩 최적화
      audio.load();
      this.audioInstances.set(key as AudioFile, audio);
    });
    
    this.initialized = true;
  }

  // Web Audio API 초기화
  private async initializeWebAudio() {
    if (typeof window === "undefined" || this.webAudioInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
      
      // 오디오 버퍼 로드
      await this.loadAudioBuffers();
      this.webAudioInitialized = true;
    } catch (error) {
      console.error("Web Audio API 초기화 실패:", error);
    }
  }

  // 오디오 버퍼 로드
  private async loadAudioBuffers() {
    if (!this.audioContext) return;
    
    const promises = Object.entries(AUDIO_FILES).map(async ([key, path]) => {
      try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(key as AudioFile, audioBuffer);
      } catch (error) {
        console.error(`오디오 버퍼 로드 실패 (${key}):`, error);
      }
    });
    
    await Promise.all(promises);
  }

  // Web Audio API로 사운드 재생 (더 빠름)
  private playWithWebAudio(audioFile: AudioFile): void {
    if (!this.audioContext || !this.gainNode || this.isMuted) return;
    
    const audioBuffer = this.audioBuffers.get(audioFile);
    if (!audioBuffer) return;
    
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);
      source.start(0);
    } catch (error) {
      console.error(`Web Audio 재생 실패 (${audioFile}):`, error);
    }
  }

  // 클라이언트 사이드에서 초기화 확인
  private ensureInitialized() {
    if (typeof window !== "undefined" && !this.initialized) {
      this.initializeAudioInstances();
    }
  }

  // Web Audio 초기화 확인
  private async ensureWebAudioInitialized() {
    if (typeof window !== "undefined" && !this.webAudioInitialized) {
      await this.initializeWebAudio();
    }
  }

  // 사용자 ID 설정
  setUserId(userId: string) {
    this.userId = userId;
    this.ensureInitialized();
    this.loadMuteState();
    // Web Audio도 초기화
    this.ensureWebAudioInitialized();
  }

  // 음소거 상태 로드
  private async loadMuteState() {
    if (!this.userId) return;

    try {
      const { data, error } = await supabase
        .from("user_item_settings")
        .select("show_popup")
        .eq("user_id", this.userId)
        .eq("item_type", "audio_mute")
        .single();

      if (!error && data) {
        this.isMuted = !data.show_popup; // show_popup이 false면 음소거
      }
    } catch (error) {
      console.error("음소거 상태 로드 실패:", error);
    }
  }

  // 음소거 상태 저장
  private async saveMuteState() {
    if (!this.userId) return;

    try {
      await supabase
        .from("user_item_settings")
        .upsert({
          user_id: this.userId,
          item_type: "audio_mute",
          show_popup: !this.isMuted, // 음소거가 아니면 show_popup true
        });
    } catch (error) {
      console.error("음소거 상태 저장 실패:", error);
    }
  }

  // 음소거 토글
  async toggleMute(): Promise<boolean> {
    this.ensureInitialized();
    await this.ensureWebAudioInitialized();
    this.isMuted = !this.isMuted;
    
    // Web Audio API 볼륨 조정
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
    }
    
    // 기존 HTML Audio 볼륨도 조정
    this.audioInstances.forEach((audio) => {
      audio.volume = this.isMuted ? 0 : this.volume;
    });

    await this.saveMuteState();
    return this.isMuted;
  }

  // 음소거 상태 조회
  getMuteState(): boolean {
    return this.isMuted;
  }

  // 볼륨 설정
  setVolume(volume: number) {
    this.ensureInitialized();
    this.volume = Math.max(0, Math.min(1, volume)); // 0-1 범위로 제한
    
    // Web Audio API 볼륨 설정
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
    }
    
    // 기존 HTML Audio 볼륨도 설정
    this.audioInstances.forEach((audio) => {
      audio.volume = this.isMuted ? 0 : this.volume;
    });
  }

  // 볼륨 조회
  getVolume(): number {
    return this.volume;
  }

  // 오디오 재생 (Web Audio API 우선 사용)
  async play(audioFile: AudioFile): Promise<void> {
    this.ensureInitialized();
    await this.ensureWebAudioInitialized();
    
    if (this.isMuted) return;

    // Web Audio API가 준비된 경우 우선 사용 (더 빠름)
    if (this.webAudioInitialized && this.audioBuffers.has(audioFile)) {
      this.playWithWebAudio(audioFile);
      return;
    }

    // Web Audio API가 준비되지 않은 경우 기존 방식 사용
    const audio = this.audioInstances.get(audioFile);
    if (!audio) {
      console.error(`오디오 파일을 찾을 수 없습니다: ${audioFile}`);
      return;
    }

    try {
      // 현재 재생 중인 오디오 중지
      audio.pause();
      audio.currentTime = 0;
      
      // 오디오가 준비되지 않은 경우 로딩 대기
      if (audio.readyState < 2) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Audio load timeout')), 1000);
          audio.addEventListener('canplaythrough', () => {
            clearTimeout(timeout);
            resolve(void 0);
          }, { once: true });
          audio.addEventListener('error', () => {
            clearTimeout(timeout);
            reject(new Error('Audio load error'));
          }, { once: true });
        });
      }
      
      // 재생
      await audio.play();
    } catch (error) {
      console.error(`오디오 재생 실패 (${audioFile}):`, error);
    }
  }

  // 클릭 사운드 재생 (편의 메서드)
  async playClickSound(): Promise<void> {
    await this.play("buttonClick");
  }

  // 퀴즈 정답 사운드 재생
  async playQuizRightSound(): Promise<void> {
    await this.play("quizRight");
  }

  // 퀴즈 오답 사운드 재생
  async playQuizWrongSound(): Promise<void> {
    await this.play("quizWrong");
  }

  // 레벨업 사운드 재생
  async playLevelUpSound(): Promise<void> {
    await this.play("levelUp");
  }

  // 스테이지 클리어 사운드 재생
  async playStageClearSound(): Promise<void> {
    await this.play("stageClear");
  }

  // 스테이지 실패 사운드 재생
  async playStageFailedSound(): Promise<void> {
    await this.play("stageFailed");
  }

  // 다음 페이즈 사운드 재생
  async playNextPhaseSound(): Promise<void> {
    await this.play("nextPhase");
  }

  // 모든 오디오 정지
  stopAll(): void {
    this.ensureInitialized();
    this.audioInstances.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // 리소스 정리
  destroy(): void {
    this.stopAll();
    this.audioInstances.clear();
  }
}

// 싱글톤 인스턴스
export const audioService = new AudioService();

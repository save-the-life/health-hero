// 오디오 파일 경로 매핑
const AUDIO_FILES = {
  buttonClick: "/sounds/button-click.mp3",
  levelUp: "/sounds/level-up.mp3",
  nextPhase: "/sounds/next-phase.mp3",
  quizRight: "/sounds/quiz-right.mp3",
  quizWrong: "/sounds/quiz-wrong.mp3",
  stageClear: "/sounds/stage-clear.mp3",
  stageFailed: "/sounds/stage-failed.mp3",
  background: "/sounds/background.mp3",
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
  private backgroundMusic: HTMLAudioElement | null = null;

  constructor() {
    // 서버 사이드에서는 초기화하지 않음
    if (typeof window !== "undefined") {
      this.initializeAudioInstances();
      this.loadMuteState(); // 먼저 음소거 상태 로드
      
      console.log("🎵 [audioService] 초기화 시작", {
        isMuted: this.isMuted,
        volume: this.volume
      });
      
      // 배경음악 미리 생성
      this.backgroundMusic = new Audio("/sounds/background.mp3");
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.isMuted ? 0 : this.volume;
      // 브라우저 자동 재생 정책 대응
      this.backgroundMusic.setAttribute('preload', 'auto');
      this.backgroundMusic.setAttribute('playsinline', '');
      
      console.log("🎵 [audioService] 배경음악 초기화 완료", {
        isMuted: this.isMuted,
        volume: this.volume,
        backgroundMusicVolume: this.backgroundMusic.volume,
        hasBackgroundMusic: !!this.backgroundMusic
      });
      
      // 백그라운드 감지 이벤트 리스너 등록
      this.setupVisibilityListener();
    }
  }
  
  // 백그라운드 감지 및 배경음악 제어
  private setupVisibilityListener() {
    if (typeof window === "undefined") return;
    
    document.addEventListener("visibilitychange", () => {
      const isHidden = document.hidden;
      
      if (isHidden) {
        // 백그라운드로 이동: 배경음악 일시정지
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
          this.backgroundMusic.pause();
          console.log("🔇 [audioService] 백그라운드 - 배경음악 일시정지");
        }
      } else {
        // 포그라운드로 복귀: 배경음악 재개 (음소거 상태가 아닐 때만)
        if (this.backgroundMusic && this.backgroundMusic.paused && !this.isMuted) {
          try {
            this.backgroundMusic.play().catch(() => {
              console.log("⚠️ [audioService] 배경음악 재개 실패");
            });
            console.log("🔊 [audioService] 포그라운드 - 배경음악 재개");
          } catch (error) {
            console.log("⚠️ [audioService] 배경음악 재개 실패:", error);
          }
        } else if (this.backgroundMusic) {
          console.log("🔊 [audioService] 포그라운드 복귀 (재생 상태 유지)");
        }
      }
    });
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

  // 음소거 상태 로드 (로컬 스토리지 사용)
  private loadMuteState() {
    if (typeof window === "undefined") return;

    try {
      const savedState = localStorage.getItem('audio_muted');
      if (savedState !== null) {
        this.isMuted = savedState === 'true';
      }
    } catch (error) {
      console.error("음소거 상태 로드 실패:", error);
    }
  }

  // 음소거 상태 저장 (로컬 스토리지 사용)
  private async saveMuteState(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem('audio_muted', this.isMuted.toString());
      console.log("💾 [audioService] 음소거 상태 저장:", this.isMuted);
    } catch (error) {
      console.error("음소거 상태 저장 실패:", error);
    }
  }

  // 음소거 토글
  async toggleMute(): Promise<boolean> {
    this.ensureInitialized();
    await this.ensureWebAudioInitialized();
    this.isMuted = !this.isMuted;
    
    console.log("🔇 [audioService] 음소거 토글 시작:", {
      isMuted: this.isMuted,
      hasBackgroundMusic: !!this.backgroundMusic,
      audioInstances: this.audioInstances.size,
      volume: this.volume
    });
    
    // Web Audio API 볼륨 조정
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
      console.log("🔇 [audioService] Web Audio API 볼륨 조정:", this.gainNode.gain.value);
    }
    
    // 기존 HTML Audio 볼륨 조정 (효과음)
    this.audioInstances.forEach((audio, key) => {
      audio.volume = this.isMuted ? 0 : this.volume;
      console.log(`🔇 [audioService] ${key} 볼륨 조정:`, audio.volume);
    });

    // 배경음악은 pause/play로 제어 (앱인토스 환경 호환성)
    if (this.backgroundMusic) {
      try {
        if (this.isMuted) {
          // 음소거: 일시정지
          this.backgroundMusic.pause();
          console.log("🔇 [audioService] 배경음악 일시정지:", {
            isMuted: this.isMuted,
            paused: this.backgroundMusic.paused,
            currentTime: this.backgroundMusic.currentTime
          });
        } else {
          // 음소거 해제: 재생 재개 (이미 재생 중이면 아무 효과 없음)
          if (this.backgroundMusic.paused) {
            await this.backgroundMusic.play();
            console.log("🔊 [audioService] 배경음악 재개:", {
              isMuted: this.isMuted,
              paused: this.backgroundMusic.paused,
              currentTime: this.backgroundMusic.currentTime
            });
          } else {
            console.log("🔊 [audioService] 배경음악 이미 재생 중");
          }
        }
      } catch (error) {
        console.log("⚠️ [audioService] 배경음악 제어 실패 (무시):", error);
      }
    } else {
      console.warn("🔇 [audioService] 배경음악 객체가 없습니다!");
    }

    await this.saveMuteState();
    console.log("🔇 [audioService] 음소거 상태 저장 완료:", this.isMuted);
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
    
    console.log("🔊 [audioService] 볼륨 설정:", {
      volume: this.volume,
      isMuted: this.isMuted,
      hasBackgroundMusic: !!this.backgroundMusic
    });
    
    // Web Audio API 볼륨 설정
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
    }
    
    // 기존 HTML Audio 볼륨도 설정
    this.audioInstances.forEach((audio, key) => {
      audio.volume = this.isMuted ? 0 : this.volume;
    });

    // 배경음악 볼륨도 설정
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.isMuted ? 0 : this.volume;
      console.log("🔊 [audioService] 배경음악 볼륨 설정:", this.backgroundMusic.volume);
    }
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
      // 이미 재생 중이면 중지
      if (!audio.paused) {
        try {
          audio.pause();
          // pause() 후에 currentTime을 설정하기 전에 잠시 대기
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch {
          // pause 에러는 무시
        }
      }
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
      
      // 재생 시도 (AbortError는 무시)
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (playError: unknown) {
        // AbortError와 NotAllowedError는 정상적인 중단이므로 무시
        if (playError instanceof Error) {
          const isAbortError = playError.name === 'AbortError';
          const isNotAllowedError = playError.name === 'NotAllowedError';
          
          // AbortError와 NotAllowedError 외에는 로그 출력
          if (!isAbortError && !isNotAllowedError) {
            console.error(`오디오 재생 중 예상치 못한 에러 (${audioFile}):`, playError);
          }
        }
      }
    } catch (error: unknown) {
      // AbortError와 Audio load timeout은 조용히 무시
      if (error instanceof Error && error.name !== 'AbortError' && error.message !== 'Audio load timeout') {
        console.error(`오디오 재생 실패 (${audioFile}):`, error);
      }
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
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  // 배경음악 재생
  async playBackgroundMusic(): Promise<void> {
    console.log("🔍 [audioService] playBackgroundMusic 호출");
    console.log("  - typeof window:", typeof window !== "undefined");
    console.log("  - isMuted:", this.isMuted);
    console.log("  - hasBackgroundMusic:", !!this.backgroundMusic);
    console.log("  - isAlreadyPlaying:", this.backgroundMusic ? !this.backgroundMusic.paused : false);

    if (typeof window === "undefined") {
      console.log("🔍 [audioService] window 없음 - 리턴");
      return;
    }

    // 배경음악이 없으면 생성
    if (!this.backgroundMusic) {
      console.log("🔍 [audioService] Audio 객체 생성");
      this.backgroundMusic = new Audio("/sounds/background.mp3");
      this.backgroundMusic.loop = true;
      this.backgroundMusic.setAttribute('preload', 'auto');
      this.backgroundMusic.setAttribute('playsinline', '');
      // 초기 볼륨 설정
      this.backgroundMusic.volume = this.isMuted ? 0 : this.volume;
      console.log("  - 초기 볼륨 설정:", this.backgroundMusic.volume);
    }

    // 이미 재생 중이면 리턴 (음소거 상태는 토글 버튼에서만 제어)
    if (!this.backgroundMusic.paused) {
      console.log("🔍 [audioService] 이미 재생 중 - 리턴");
      return;
    }
    
    // 일시정지된 상태일 때만 재생 시작 (음소거 상태 확인)
    if (this.backgroundMusic.paused) {
      // 음소거 상태가 아니어야 재생 시작
      if (this.isMuted) {
        console.log("🔍 [audioService] 음소거 상태 - 재생하지 않음");
        return;
      }
    }

    // 재생 시작 전 볼륨 설정
    this.backgroundMusic.volume = this.volume; // 음소거 상태가 아니므로 정상 볼륨
    console.log("  - 재생 전 볼륨 설정:", this.backgroundMusic.volume);

    try {
      console.log("🔍 [audioService] 배경음악 재생 시도...");
      console.log("  - Audio 상태: paused=" + this.backgroundMusic.paused, 
                  "readyState=" + this.backgroundMusic.readyState);
      
      const playPromise = this.backgroundMusic.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      console.log("✅ [audioService] 배경음악 재생 시작 성공");
      console.log("  - 재생 후 Audio 상태: paused=" + this.backgroundMusic.paused,
                  "currentTime=" + this.backgroundMusic.currentTime);
    } catch (playError: unknown) {
      console.error("❌ [audioService] 배경음악 재생 실패:", playError);
      if (playError instanceof Error) {
        console.error("  - 에러 이름:", playError.name);
        console.error("  - 에러 메시지:", playError.message);
      }
    }
  }

  // 배경음악 정지
  stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      console.log("🔇 배경음악 정지");
    }
  }

  // 리소스 정리
  destroy(): void {
    this.stopAll();
    this.audioInstances.clear();
    if (this.backgroundMusic) {
      this.backgroundMusic = null;
    }
  }
}

// 싱글톤 인스턴스
export const audioService = new AudioService();

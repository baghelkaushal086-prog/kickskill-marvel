/**
 * Marvel / Stark Industries Audio Engine
 * Features Iconic MARVEL Avengers Theme Background Music
 * with interactive Music Off / Music On toggle, adjustable volume slider,
 * and Stark HUD sound effects.
 */

class MarvelAudioEngine {
  private ctx: AudioContext | null = null;
  private isSoundEnabled: boolean = true;
  private isMusicEnabled: boolean = true;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmVolume: number = 0.75; // Default to 75% for rich presence
  private fadeInterval: any = null;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.isSoundEnabled = localStorage.getItem("marvel_sound") !== "false";
      // Default music to ON unless explicitly disabled
      const savedMusic = localStorage.getItem("marvel_music");
      this.isMusicEnabled = savedMusic !== "false";

      const savedVol = localStorage.getItem("marvel_music_volume");
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.bgmVolume = parsed;
        }
      }

      this.initBgmAudio();

      if (this.isMusicEnabled) {
        this.startAmbientMusic();
      }

      // If autoplay policy blocks initial sound, start on first user interaction
      const handleFirstInteraction = () => {
        if (this.isMusicEnabled && (!this.bgmAudio || this.bgmAudio.paused)) {
          this.startAmbientMusic();
        }
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
        window.removeEventListener("pointerdown", handleFirstInteraction);
      };
      window.addEventListener("click", handleFirstInteraction);
      window.addEventListener("keydown", handleFirstInteraction);
      window.addEventListener("touchstart", handleFirstInteraction);
      window.addEventListener("pointerdown", handleFirstInteraction);
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notifyListeners() {
    for (const fn of this.listeners) {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private initBgmAudio() {
    if (typeof window === "undefined") return;
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio("/audio/avengers-theme-song.mp3");
      this.bgmAudio.loop = true;
      this.bgmAudio.preload = "auto";
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  public getSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }

  public getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  public isPlaying(): boolean {
    return !!(this.bgmAudio && !this.bgmAudio.paused);
  }

  public getVolume(): number {
    return this.bgmVolume;
  }

  public setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    this.bgmVolume = clamped;
    if (typeof window !== "undefined") {
      localStorage.setItem("marvel_music_volume", String(clamped));
    }
    if (this.bgmAudio) {
      this.bgmAudio.volume = clamped;
      if (clamped > 0 && this.isMusicEnabled && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
    }
    this.notifyListeners();
  }

  public toggleSound(): boolean {
    this.isSoundEnabled = !this.isSoundEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("marvel_sound", String(this.isSoundEnabled));
    }
    if (this.isSoundEnabled) {
      this.playRepulsorClick();
    }
    this.notifyListeners();
    return this.isSoundEnabled;
  }

  public toggleMusic(): boolean {
    if (this.isMusicEnabled) {
      this.turnMusicOff();
    } else {
      this.turnMusicOn();
    }
    return this.isMusicEnabled;
  }

  public turnMusicOff(): void {
    this.isMusicEnabled = false;
    if (typeof window !== "undefined") {
      localStorage.setItem("marvel_music", "false");
    }
    this.stopAmbientMusic(true);
  }

  public turnMusicOn(): void {
    this.isMusicEnabled = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("marvel_music", "true");
    }
    this.startAmbientMusic();
  }

  /**
   * Iconic MARVEL Avengers Theme Background Music
   */
  public startAmbientMusic() {
    if (typeof window === "undefined") return;

    try {
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }

      this.initBgmAudio();
      if (!this.bgmAudio) return;

      this.isMusicEnabled = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("marvel_music", "true");
      }

      const targetVolume = this.bgmVolume;
      this.bgmAudio.volume = Math.min(targetVolume, 0.2);
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            let currentVolume = this.bgmAudio?.volume ?? 0.2;
            this.fadeInterval = setInterval(() => {
              if (!this.bgmAudio || !this.isMusicEnabled) {
                clearInterval(this.fadeInterval);
                return;
              }
              currentVolume = Math.min(targetVolume, currentVolume + 0.1);
              this.bgmAudio.volume = currentVolume;
              if (currentVolume >= targetVolume) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
              }
            }, 60);
            this.notifyListeners();
          })
          .catch(() => {
            this.notifyListeners();
          });
      }
      this.notifyListeners();
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  public stopAmbientMusic(immediate: boolean = true) {
    if (typeof window === "undefined") return;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.bgmAudio) {
      if (immediate) {
        try {
          this.bgmAudio.pause();
          this.bgmAudio.currentTime = 0;
        } catch (e) {}
        this.notifyListeners();
      } else if (!this.bgmAudio.paused) {
        try {
          let currentVolume = this.bgmAudio.volume;
          this.fadeInterval = setInterval(() => {
            if (!this.bgmAudio) {
              clearInterval(this.fadeInterval);
              return;
            }
            currentVolume = Math.max(0, currentVolume - 0.15);
            this.bgmAudio.volume = currentVolume;
            if (currentVolume <= 0.02) {
              this.bgmAudio.pause();
              this.bgmAudio.currentTime = 0;
              clearInterval(this.fadeInterval);
              this.fadeInterval = null;
              this.notifyListeners();
            }
          }, 40);
        } catch (e) {
          this.bgmAudio.pause();
          this.notifyListeners();
        }
      }
    } else {
      this.notifyListeners();
    }
  }

    public playRepulsorClick() {
    if (!this.isSoundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Transient snap (punch)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(110, now + 0.08);

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // 2. High-tech laser resonance
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1760, now);
      osc2.frequency.exponentialRampToValueAtTime(440, now + 0.06);

      gain2.gain.setValueAtTime(0.12, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.07);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  /**
   * Stark HUD Hologram Hover (Soft cybernetic blip)
   */
  public playHudHover() {
    if (!this.isSoundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1320, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  /**
   * Vibranium Verification Chime (Heroic chord)
   */
  public playVibraniumChime() {
    if (!this.isSoundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C Major chord (C5, E5, G5, C6)

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.15, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + 0.65);
      });
    } catch (e) {}
  }

  /**
   * Hulk Smash / Heavy Comic Punch Sound
   * Deep sub-bass impact with thunderous crunch
   */
  public playHulkSmash() {
    if (!this.isSoundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Deep Sub-bass Drop (Earth-shattering thud)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.28);

      subGain.gain.setValueAtTime(0.45, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.35);

      // 2. Punch Transient & Impact Crunch (Distorted mid-frequency punch)
      const punchOsc = this.ctx.createOscillator();
      const punchGain = this.ctx.createGain();
      punchOsc.type = "triangle";
      punchOsc.frequency.setValueAtTime(280, now);
      punchOsc.frequency.exponentialRampToValueAtTime(55, now + 0.12);

      punchGain.gain.setValueAtTime(0.35, now);
      punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      punchOsc.connect(punchGain);
      punchGain.connect(this.ctx.destination);
      punchOsc.start(now);
      punchOsc.stop(now + 0.16);

      // 3. Concrete / Shockwave Burst Noise
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.15);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {}
  }
}

export const marvelAudio = new MarvelAudioEngine();

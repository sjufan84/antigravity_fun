export class GalaxySynth {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            // Initialize on first user interaction to comply with autoplay policies
            window.addEventListener('click', () => this.init(), { once: true });
        }
    }

    private init() {
        if (this.ctx) return;

        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Master volume
        this.masterGain.connect(this.ctx.destination);
    }

    private createOscillator(type: OscillatorType, frequency: number, duration: number, startTime: number) {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startTime);

        // Envelope
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05); // Attack
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);

        // Cleanup to prevent memory leaks
        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
        }, duration * 1000 + 100);
    }

    public playStarSound(category: string, visits: number) {
        if (!this.ctx) {
            this.init(); // Try to init if not already
        }
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Base pitch influenced by visits (more visits = deeper, more resonant)
        // Visits 0 -> 440Hz, Visits 100 -> 110Hz
        const baseFreq = Math.max(110, 440 - (visits * 5));

        let type: OscillatorType = 'sine';
        let duration = 0.5;
        let detune = 0;

        switch (category.toLowerCase()) {
            case 'idea':
                type = 'sine'; // Pure, clear
                this.createOscillator('sine', baseFreq * 1.5, 0.8, now); // Harmonic
                break;
            case 'task':
                type = 'square'; // Solid, constructive
                duration = 0.3;
                break;
            case 'question':
                type = 'triangle'; // Sharp, inquiring
                this.createOscillator('triangle', baseFreq * 2, 0.6, now + 0.1); // Delay
                break;
            case 'person':
                type = 'sawtooth'; // Complex, buzzy
                detune = 5;
                break;
            default:
                type = 'sine';
        }

        this.createOscillator(type, baseFreq, duration, now);

        // Add a "shimmer" effect for highly visited stars
        if (visits > 10) {
            this.createOscillator('sine', baseFreq * 3, 1.0, now + 0.05);
        }
    }

    public playHoverSound() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Very short, high blip
        this.createOscillator('sine', 880, 0.1, now);
    }
}

// Singleton instance
export const galaxySynth = new GalaxySynth();

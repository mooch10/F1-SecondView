// Web Audio API Sound Synthesizer for Live F1 Alerts
// Zero external MP3 downloads, 0ms latency, works offline

const AUDIO_STORAGE_KEY = 'delta_audio_alerts_enabled';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioAlertsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(AUDIO_STORAGE_KEY);
  return val !== 'false';
}

export function setAudioAlertsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUDIO_STORAGE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('delta_audio_setting_change', { detail: { enabled } }));
}

/**
 * Helper to play an oscillator tone with envelope
 */
function playTone(
  freq: number,
  type: OscillatorType,
  startTime: number,
  duration: number,
  peakGain: number = 0.25
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

/**
 * ⚠️ Safety Car / VSC Siren Alert (Dual-tone European warning siren)
 */
export function playSafetyCarSound(): void {
  if (!isAudioAlertsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Tone 1
  playTone(587.33, 'triangle', now, 0.18, 0.3); // D5
  playTone(880.00, 'triangle', now + 0.20, 0.22, 0.3); // A5
  // Tone 2 repetition
  playTone(587.33, 'triangle', now + 0.44, 0.18, 0.3);
  playTone(880.00, 'triangle', now + 0.64, 0.26, 0.35);
}

/**
 * 🚩 Red Flag Alarm (Triple urgent warning pulse)
 */
export function playRedFlagSound(): void {
  if (!isAudioAlertsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(880, 'sawtooth', now, 0.12, 0.25);
  playTone(880, 'sawtooth', now + 0.16, 0.12, 0.25);
  playTone(880, 'sawtooth', now + 0.32, 0.22, 0.3);
}

/**
 * 🏎️ Pit Stop Telemetry Chirp (Fast two-tone uplink chirp)
 */
export function playPitStopSound(): void {
  if (!isAudioAlertsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1100, now);
  osc.frequency.exponentialRampToValueAtTime(2200, now + 0.14);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.15);
}

/**
 * 🏁 Chequered Flag Fanfare (Ascending major triad C5-E5-G5)
 */
export function playChequeredSound(): void {
  if (!isAudioAlertsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(523.25, 'sine', now, 0.14, 0.25); // C5
  playTone(659.25, 'sine', now + 0.14, 0.14, 0.25); // E5
  playTone(783.99, 'sine', now + 0.28, 0.35, 0.3); // G5
}

/**
 * 👑 Lead Change Chime
 */
export function playLeadChangeSound(): void {
  if (!isAudioAlertsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(659.25, 'triangle', now, 0.15, 0.25); // E5
  playTone(987.77, 'triangle', now + 0.16, 0.25, 0.3); // B5
}

type Sfx = "tick" | "blip" | "clunk" | "chirp" | "powerDown" | "powerUp";

const MUTE_KEY = "retro-mute";

let ctx: AudioContext | null = null;
let unlocked = false;
let muted = false;

if (typeof window !== "undefined") {
  try {
    muted = window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    muted = false;
  }
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function installRetroAudioUnlock() {
  if (typeof window === "undefined" || unlocked) return;
  const unlock = () => {
    unlocked = true;
    ensureCtx();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
}

export function isRetroMuted() {
  return muted;
}

export function setRetroMuted(value: boolean) {
  muted = value;
  try {
    window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function envGain(c: AudioContext, t: number, peak: number, dur: number) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(c.destination);
  return g;
}

function noiseBuffer(c: AudioContext, dur: number) {
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function playSfx(name: Sfx) {
  if (!unlocked || muted) return;
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime;

  if (name === "tick") {
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 0.035);
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2400;
    const g = envGain(c, t, 0.5, 0.035);
    src.connect(hp).connect(g);
    src.start(t);
    src.stop(t + 0.04);
    return;
  }

  if (name === "blip" || name === "clunk") {
    const osc = c.createOscillator();
    osc.type = name === "blip" ? "square" : "sawtooth";
    const f0 = name === "blip" ? 880 : 220;
    const f1 = name === "blip" ? 660 : 96;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f1, t + 0.09);
    const g = envGain(c, t, 0.35, 0.1);
    osc.connect(g);
    osc.start(t);
    osc.stop(t + 0.12);
    return;
  }

  if (name === "chirp") {
    const tones = [1300, 2100, 1300, 2400];
    tones.forEach((f, i) => {
      const osc = c.createOscillator();
      osc.type = "square";
      osc.frequency.value = f;
      const g = envGain(c, t + i * 0.07, 0.18, 0.065);
      osc.connect(g);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.07);
    });
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 0.22);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    const g = envGain(c, t + 0.28, 0.22, 0.22);
    src.connect(bp).connect(g);
    src.start(t + 0.28);
    src.stop(t + 0.5);
    return;
  }

  if (name === "powerDown" || name === "powerUp") {
    const osc = c.createOscillator();
    osc.type = "sawtooth";
    const up = name === "powerUp";
    osc.frequency.setValueAtTime(up ? 55 : 880, t);
    osc.frequency.exponentialRampToValueAtTime(up ? 880 : 48, t + 0.45);
    const g = envGain(c, t, 0.4, 0.5);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2200;
    osc.connect(lp).connect(g);
    osc.start(t);
    osc.stop(t + 0.55);
  }
}

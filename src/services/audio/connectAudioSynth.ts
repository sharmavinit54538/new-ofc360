import { getAudioContext } from "./connectAudioContext";

export function playSynthTone(freq: number, duration: number, type: OscillatorType = "sine", gainVal = 0.1) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playChime(freqs: number[], stepMs = 100, gainVal = 0.1) {
  freqs.forEach((f, i) => setTimeout(() => playSynthTone(f, 0.3, "sine", gainVal), i * stepMs));
}

let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) try { sharedAudioCtx = new AudioCtxClass(); } catch {}
  }
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") sharedAudioCtx.resume().catch(() => {});
  return sharedAudioCtx;
}

export async function unlockAudioContext(): Promise<boolean> {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    try { await ctx.resume(); return true; } catch { return true; }
  }
  return true;
}

export function attachRemoteAudio(stream: MediaStream): void {
  if (typeof document === "undefined") return;

  let audioEl = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
  if (!audioEl) {
    audioEl = document.createElement("audio");
    audioEl.id = "ofc360-remote-audio";
    audioEl.autoplay = true;
    audioEl.setAttribute("playsinline", "true");
    document.body.appendChild(audioEl);
  }

  audioEl.srcObject = stream;
  audioEl.muted = false;
  audioEl.volume = 1.0;

  const playPromise = audioEl.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn("[REMOTE_AUDIO] Auto-play was prevented by browser policy:", err);
      // Resume playback on next user click/keypress
      const unlockOnInteraction = () => {
        audioEl.play().catch(() => {});
        document.removeEventListener("click", unlockOnInteraction);
        document.removeEventListener("keydown", unlockOnInteraction);
      };
      document.addEventListener("click", unlockOnInteraction, { once: true });
      document.addEventListener("keydown", unlockOnInteraction, { once: true });
    });
  }
}

export function setRemoteAudioSpeaker(isSpeakerOn: boolean): void {
  if (typeof document === "undefined") return;
  const audioEl = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
  if (audioEl) {
    audioEl.volume = isSpeakerOn ? 1.0 : 0.0;
  }
}

export function cleanupRemoteAudio(): void {
  if (typeof document === "undefined") return;
  const existing = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
  if (existing) {
    try {
      existing.pause();
      existing.srcObject = null;
      existing.remove();
    } catch {}
  }
}

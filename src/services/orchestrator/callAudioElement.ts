export function attachRemoteAudio(stream: MediaStream): void {
  const existing = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
  if (existing) { existing.srcObject = null; existing.remove(); }
  const audioEl = document.createElement("audio");
  audioEl.id = "ofc360-remote-audio";
  audioEl.autoplay = true;
  audioEl.setAttribute("playsinline", "true");
  audioEl.srcObject = stream;
  audioEl.volume = 1.0;
  document.body.appendChild(audioEl);
  audioEl.play().catch(() => {});
}

export function cleanupRemoteAudio(): void {
  const existing = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
  if (existing) { existing.srcObject = null; existing.remove(); }
}

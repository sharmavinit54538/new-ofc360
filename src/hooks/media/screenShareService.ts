export function stopTracks(stream: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach((track) => {
    try { track.stop(); } catch { /* ignore */ }
  });
}

export async function requestDisplayMedia(constraints: DisplayMediaStreamOptions = { video: true, audio: true }) {
  if (!navigator?.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen sharing is not supported on this browser.");
  }
  return await navigator.mediaDevices.getDisplayMedia(constraints);
}

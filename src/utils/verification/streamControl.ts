export async function startCameraStream(video: HTMLVideoElement): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera API not supported.");
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false,
  });
  video.srcObject = stream;
  await video.play();
  return stream;
}

export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;
  try { stream.getTracks().forEach((t) => t.stop()); } catch (err) { console.error(err); }
}

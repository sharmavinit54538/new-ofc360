export function createCaptureCanvas(video: HTMLVideoElement) {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context error");
  ctx.drawImage(video, 0, 0, w, h);
  return { canvas, ctx, w, h };
}

import type { CameraCaptureResult } from "./types";
import { calculateBrightness } from "./calculateBrightness";

export function captureVideoFrame(video: HTMLVideoElement): CameraCaptureResult {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context error");
  ctx.drawImage(video, 0, 0, w, h);
  const bright = calculateBrightness(ctx.getImageData(0, 0, w, h).data);
  if (bright < 10) throw new Error("Frame too dark.");
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.88), width: w, height: h,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    faceHash: `FAC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, brightnessScore: bright,
  };
}

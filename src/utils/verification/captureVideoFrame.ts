import type { CameraCaptureResult } from "./types";
import { calculateBrightness } from "./calculateBrightness";

export function captureVideoFrame(videoElement: HTMLVideoElement): CameraCaptureResult {
  const width = videoElement.videoWidth || 640;
  const height = videoElement.videoHeight || 480;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to initialize 2D canvas context for frame capture.");
  ctx.drawImage(videoElement, 0, 0, width, height);
  const brightnessScore = calculateBrightness(ctx.getImageData(0, 0, width, height).data);
  if (brightnessScore < 10) throw new Error("Frame too dark. Please ensure sufficient ambient lighting.");
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.88),
    width,
    height,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    faceHash: `FAC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`,
    brightnessScore,
  };
}

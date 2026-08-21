import type { CameraCaptureResult } from "./types";
import { calculateBrightness } from "./calculateBrightness";
import { createCaptureCanvas } from "./createCaptureCanvas";

export function captureVideoFrame(video: HTMLVideoElement): CameraCaptureResult {
  const { canvas, ctx, w, h } = createCaptureCanvas(video);
  const bright = calculateBrightness(ctx.getImageData(0, 0, w, h).data);
  if (bright < 10) throw new Error("Frame too dark.");
  const r1 = Math.random().toString(36).substring(2, 8).toUpperCase();
  const r2 = Date.now().toString(36).slice(-4).toUpperCase();
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.88), width: w, height: h,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    faceHash: `FAC-${r1}-${r2}`, brightnessScore: bright,
  };
}

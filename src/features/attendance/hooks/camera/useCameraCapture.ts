import { useState, useCallback } from "react";
import { toast } from "sonner";
import { captureVideoFrame, type CameraCaptureResult } from "@/utils/verification/cameraVerification";

export function useCameraCapture(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [capturedSelfie, setCapturedSelfie] = useState<CameraCaptureResult | null>(null);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current) { toast.error("Webcam feed not ready for capture."); return; }
    try {
      const snap = await captureVideoFrame(videoRef.current);
      setCapturedSelfie(snap); toast.success("Selfie captured and verified!");
    } catch { toast.error("Failed to capture webcam frame."); }
  }, [videoRef]);

  const clearCapturedSelfie = useCallback(() => setCapturedSelfie(null), []);
  return { capturedSelfie, setCapturedSelfie, capturePhoto, clearCapturedSelfie };
}

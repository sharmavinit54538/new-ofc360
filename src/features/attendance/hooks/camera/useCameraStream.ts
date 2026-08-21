import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { startCameraStream, stopCameraStream } from "@/utils/verification/cameraVerification";

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startLiveCamera = useCallback(async () => {
    if (!videoRef.current) return;
    setCameraLoading(true); setCameraError(null);
    try {
      if (cameraStreamRef.current) stopCameraStream(cameraStreamRef.current);
      cameraStreamRef.current = await startCameraStream(videoRef.current);
      setIsCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not access webcam.";
      setCameraError(msg); toast.error(msg);
    } finally { setCameraLoading(false); }
  }, []);

  const stopLiveCamera = useCallback(() => {
    if (cameraStreamRef.current) { stopCameraStream(cameraStreamRef.current); cameraStreamRef.current = null; }
    setIsCameraActive(false);
  }, []);

  useEffect(() => () => { stopLiveCamera(); }, [stopLiveCamera]);
  return { videoRef, isCameraActive, cameraLoading, cameraError, startLiveCamera, stopLiveCamera };
}

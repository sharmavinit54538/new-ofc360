import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { initCamera, releaseCamera } from "./cameraStreamHelpers";

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startLiveCamera = useCallback(async () => {
    if (!videoRef.current) return;
    setCameraLoading(true); setCameraError(null);
    try { streamRef.current = await initCamera(videoRef.current, streamRef.current); setIsCameraActive(true); }
    catch (e: any) { setCameraError(e.message); toast.error(e.message); }
    finally { setCameraLoading(false); }
  }, []);

  const stopLiveCamera = useCallback(() => { releaseCamera(streamRef.current); streamRef.current = null; setIsCameraActive(false); }, []);
  useEffect(() => () => stopLiveCamera(), [stopLiveCamera]);
  return { videoRef, isCameraActive, cameraLoading, cameraError, startLiveCamera, stopLiveCamera };
}

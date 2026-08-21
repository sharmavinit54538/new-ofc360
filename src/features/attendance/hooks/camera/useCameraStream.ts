import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { initCamera, releaseCamera } from "./cameraStreamHelpers";
import { useCameraStreamState } from "./useCameraStreamState";

export function useCameraStream() {
  const s = useCameraStreamState();
  const startLiveCamera = useCallback(async () => {
    if (!s.videoRef.current) return;
    s.setCameraLoading(true); s.setCameraError(null);
    try { s.streamRef.current = await initCamera(s.videoRef.current, s.streamRef.current); s.setIsCameraActive(true); }
    catch (e: unknown) { const msg = e instanceof Error ? e.message : "Camera failed"; s.setCameraError(msg); toast.error(msg); }
    finally { s.setCameraLoading(false); }
  }, [s]);
  const stopLiveCamera = useCallback(() => { releaseCamera(s.streamRef.current); s.streamRef.current = null; s.setIsCameraActive(false); }, [s]);
  useEffect(() => () => stopLiveCamera(), [stopLiveCamera]);
  return { videoRef: s.videoRef, isCameraActive: s.isCameraActive, cameraLoading: s.cameraLoading, cameraError: s.cameraError, startLiveCamera, stopLiveCamera };
}

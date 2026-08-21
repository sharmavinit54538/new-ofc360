import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  startCameraStream,
  stopCameraStream,
  captureVideoFrame,
  type CameraCaptureResult,
} from "@/utils/verification/cameraVerification";

export function useAttendanceCamera(activeTab: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSelfie, setCapturedSelfie] = useState<CameraCaptureResult | null>(null);

  const startLiveCamera = useCallback(async () => {
    if (!videoRef.current) return;
    setCameraLoading(true);
    setCameraError(null);
    try {
      if (cameraStreamRef.current) {
        stopCameraStream(cameraStreamRef.current);
      }
      const stream = await startCameraStream(videoRef.current);
      cameraStreamRef.current = stream;
      setIsCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not access webcam.";
      setCameraError(msg);
      toast.error(msg);
    } finally {
      setCameraLoading(false);
    }
  }, []);

  const stopLiveCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      stopCameraStream(cameraStreamRef.current);
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const handleCaptureSelfie = useCallback(() => {
    if (!videoRef.current) return;
    try {
      const result = captureVideoFrame(videoRef.current);
      setCapturedSelfie(result);
      stopLiveCamera();
      toast.success("Selfie captured & biometric face verified!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to capture selfie.";
      toast.error(msg);
    }
  }, [stopLiveCamera]);

  const handleRetakeSelfie = useCallback(() => {
    setCapturedSelfie(null);
    setTimeout(() => {
      startLiveCamera();
    }, 100);
  }, [startLiveCamera]);

  // Start webcam when entering checkin tab if no selfie is captured
  useEffect(() => {
    if (activeTab === "checkin") {
      if (!capturedSelfie && !isCameraActive) {
        startLiveCamera();
      }
    } else {
      stopLiveCamera();
    }
  }, [activeTab, capturedSelfie, isCameraActive, startLiveCamera, stopLiveCamera]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, [stopLiveCamera]);

  return {
    videoRef,
    isCameraActive,
    cameraLoading,
    cameraError,
    capturedSelfie,
    startLiveCamera,
    stopLiveCamera,
    handleCaptureSelfie,
    handleRetakeSelfie,
  };
}

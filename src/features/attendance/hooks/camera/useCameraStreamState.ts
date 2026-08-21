import { useState, useRef } from "react";

export function useCameraStreamState() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  return { videoRef, streamRef, isCameraActive, setIsCameraActive, cameraLoading, setCameraLoading, cameraError, setCameraError };
}

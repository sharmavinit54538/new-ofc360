import { useState, useCallback, useRef, useEffect } from "react";

export function useScreenShare() {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const streamRef = useRef<MediaStream | null>(null);

  const stopScreenShare = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore cleanup errors
        }
      });
      streamRef.current = null;
    }
    setScreenStream(null);
    setIsSharing(false);
  }, []);

  const startScreenShare = useCallback(
    async (constraints: DisplayMediaStreamOptions = { video: true, audio: true }) => {
      if (!navigator?.mediaDevices?.getDisplayMedia) {
        setError("Screen sharing is not supported on this browser.");
        return null;
      }

      // Stop any active screen stream
      stopScreenShare();
      setError(null);
      setPermissionDenied(false);

      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        streamRef.current = stream;
        setScreenStream(stream);
        setIsSharing(true);

        // When user stops screen share via native browser bar
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.onended = () => {
            stopScreenShare();
          };
        }

        return stream;
      } catch (err: any) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setPermissionDenied(true);
          setError("Screen sharing permission was cancelled or denied.");
        } else {
          setError(err?.message || "Failed to start screen sharing.");
        }
        setIsSharing(false);
        return null;
      }
    },
    [stopScreenShare]
  );

  useEffect(() => {
    return () => {
      stopScreenShare();
    };
  }, [stopScreenShare]);

  return {
    screenStream,
    isSharing,
    error,
    permissionDenied,
    startScreenShare,
    stopScreenShare,
  };
}

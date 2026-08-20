import { useState, useCallback, useRef, useEffect } from "react";
import { stopTracks, requestDisplayMedia } from "./media/screenShareService";

export function useScreenShare() {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const stopScreenShare = useCallback(() => { stopTracks(streamRef.current); streamRef.current = null; setScreenStream(null); setIsSharing(false); }, []);
  const startScreenShare = useCallback(async (c?: DisplayMediaStreamOptions) => {
    stopScreenShare(); setError(null); setPermissionDenied(false);
    try {
      const s = await requestDisplayMedia(c); streamRef.current = s; setScreenStream(s); setIsSharing(true);
      const vt = s.getVideoTracks()[0]; if (vt) vt.onended = () => stopScreenShare(); return s;
    } catch (e: any) { setPermissionDenied(e.name === "NotAllowedError"); setError(e?.message || "Error"); setIsSharing(false); return null; }
  }, [stopScreenShare]);
  useEffect(() => () => stopScreenShare(), [stopScreenShare]);
  return { screenStream, isSharing, error, permissionDenied, startScreenShare, stopScreenShare };
}
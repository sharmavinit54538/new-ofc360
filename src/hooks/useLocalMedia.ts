import { useEffect, useCallback } from "react";
import type { LocalMediaOptions } from "./media/localMediaTypes";
import { useLocalMediaState } from "./media/useLocalMediaState";

export type { LocalMediaOptions };

export function useLocalMedia(options: LocalMediaOptions = {}) {
  const { stream, isCameraOn, setIsCameraOn, isMuted, setIsMuted, isLoading, streamRef, startMedia, setStream } = useLocalMediaState(options);
  const stopMedia = useCallback(() => { streamRef.current?.getTracks().forEach((t) => t.stop()); streamRef.current = null; setStream(null); }, [streamRef, setStream]);
  const toggleAudio = useCallback(() => { setIsMuted((m) => !m); streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; }); }, [streamRef, setIsMuted]);
  const toggleVideo = useCallback(() => { setIsCameraOn((c) => !c); streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; }); }, [streamRef, setIsCameraOn]);
  useEffect(() => { if (options.autoStart) startMedia(); return () => stopMedia(); }, [options.autoStart, startMedia, stopMedia]);
  return { stream, isCameraOn, isMuted, isLoading, error: null, permissionDenied: false, startMedia, stopMedia, toggleAudio, toggleVideo, switchAudioDevice: async () => {}, switchVideoDevice: async () => {} };
}
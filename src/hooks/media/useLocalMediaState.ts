import { useState, useCallback, useRef } from "react";
import type { LocalMediaOptions } from "./localMediaTypes";
import { acquireUserMedia } from "./acquireMediaStream";

export function useLocalMediaState(opts: LocalMediaOptions = {}) {
  const { audio = true, video = true } = opts;
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(Boolean(video));
  const [isMuted, setIsMuted] = useState<boolean>(!audio);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);
  const startMedia = useCallback(async () => {
    setIsLoading(true); const ms = await acquireUserMedia(audio, video);
    streamRef.current = ms; setStream(ms); setIsLoading(false); return ms;
  }, [audio, video]);
  return { stream, isCameraOn, setIsCameraOn, isMuted, setIsMuted, isLoading, streamRef, startMedia, setStream };
}

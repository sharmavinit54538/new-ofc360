import { useState, useEffect, useCallback, useRef } from "react";

export interface LocalMediaOptions {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
  autoStart?: boolean;
}

export function useLocalMedia(options: LocalMediaOptions = {}) {
  const { audio = true, video = true, autoStart = false } = options;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(Boolean(video));
  const [isMuted, setIsMuted] = useState<boolean>(!audio);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const streamRef = useRef<MediaStream | null>(null);

  const stopMedia = useCallback(() => {
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
    setStream(null);
    setIsLoading(false);
  }, []);

  const startMedia = useCallback(
    async (customConstraints?: { audio?: boolean | MediaTrackConstraints; video?: boolean | MediaTrackConstraints }) => {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setError("Browser does not support getUserMedia.");
        return null;
      }

      // Stop any existing stream before starting a new one
      stopMedia();
      setIsLoading(true);
      setError(null);
      setPermissionDenied(false);

      const constraints: MediaStreamConstraints = {
        audio: customConstraints?.audio ?? audio,
        video: customConstraints?.video ?? video,
      };

      try {
        const userStream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = userStream;
        setStream(userStream);

        // Sync track states
        const videoTrack = userStream.getVideoTracks()[0];
        const audioTrack = userStream.getAudioTracks()[0];

        setIsCameraOn(videoTrack ? videoTrack.enabled : false);
        setIsMuted(audioTrack ? !audioTrack.enabled : true);
        setIsLoading(false);
        return userStream;
      } catch (err: any) {
        setIsLoading(false);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setPermissionDenied(true);
          setError("Microphone / camera access was denied by the user or browser.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setError("Requested media device (camera/mic) could not be found.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setError("Hardware error: camera or microphone is already in use by another application.");
        } else {
          setError(err?.message || "Failed to acquire local media stream.");
        }
        return null;
      }
    },
    [audio, video, stopMedia]
  );

  const toggleCamera = useCallback(() => {
    if (!streamRef.current) return;
    const videoTracks = streamRef.current.getVideoTracks();
    if (videoTracks.length === 0) return;

    const newEnabled = !videoTracks[0].enabled;
    videoTracks.forEach((t) => {
      t.enabled = newEnabled;
    });
    setIsCameraOn(newEnabled);
  }, []);

  const toggleMicrophone = useCallback(() => {
    if (!streamRef.current) return;
    const audioTracks = streamRef.current.getAudioTracks();
    if (audioTracks.length === 0) return;

    const newEnabled = !audioTracks[0].enabled;
    audioTracks.forEach((t) => {
      t.enabled = newEnabled;
    });
    setIsMuted(!newEnabled);
  }, []);

  useEffect(() => {
    if (autoStart) {
      startMedia();
    }
    return () => {
      stopMedia();
    };
  }, [autoStart, startMedia, stopMedia]);

  return {
    stream,
    isCameraOn,
    isMuted,
    isLoading,
    error,
    permissionDenied,
    startMedia,
    stopMedia,
    toggleCamera,
    toggleMicrophone,
  };
}

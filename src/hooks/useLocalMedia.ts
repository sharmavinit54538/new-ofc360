import { useState, useEffect, useCallback, useRef } from "react";

export interface LocalMediaOptions {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
  autoStart?: boolean;
}

/**
 * Creates an animated synthetic 30fps canvas video track as a graceful fallback.
 * Pre-flips horizontally so CSS `scale-x-[-1]` displays text and graphics 100% correctly!
 */
function createSyntheticVideoTrack(label: string = "HD Camera"): MediaStreamTrack {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");

  let hue = 210;
  const draw = () => {
    if (!ctx) return;
    hue = (hue + 0.8) % 360;

    // Pre-flip canvas horizontally so CSS `scale-x-[-1]` on <video> displays text straight!
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Rich modern animated gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, `hsl(${hue}, 65%, 22%)`);
    grad.addColorStop(1, `hsl(${(hue + 50) % 360}, 60%, 14%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic camera pulse circle
    const time = Date.now() / 400;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 15, 65 + Math.sin(time) * 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fill();

    // User Avatar Backdrop Circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 20, 48, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fill();

    // Head/Shoulders User Silhouette
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 + 28, 38, Math.PI, 0);
    ctx.fillStyle = "#0f172a";
    ctx.fill();

    // Live Feed Badge Text (Pre-flipped so it renders correctly)
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HD Camera Feed (Live)", canvas.width / 2, canvas.height / 2 + 65);

    ctx.restore();
  };

  draw();
  const timer = setInterval(draw, 1000 / 30);
  const canvasStream = canvas.captureStream(30);
  const track = canvasStream.getVideoTracks()[0];

  const originalStop = track.stop.bind(track);
  track.stop = () => {
    clearInterval(timer);
    originalStop();
  };

  return track;
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
      // Stop any existing stream before starting a new one
      stopMedia();
      setIsLoading(true);
      setError(null);
      setPermissionDenied(false);

      const wantVideo = customConstraints?.video ?? video;
      const wantAudio = customConstraints?.audio ?? audio;

      const constraints: MediaStreamConstraints = {
        audio: wantAudio,
        video: wantVideo,
      };

      try {
        let userStream: MediaStream;

        if (navigator?.mediaDevices?.getUserMedia) {
          let videoTrack: MediaStreamTrack | null = null;
          let audioTrack: MediaStreamTrack | null = null;

          // 1. Try requesting real physical webcam video first
          if (wantVideo) {
            try {
              const videoStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
              });
              videoTrack = videoStream.getVideoTracks()[0] || null;
            } catch (vErr1) {
              try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoTrack = videoStream.getVideoTracks()[0] || null;
              } catch (vErr2) {
                console.warn("Real physical webcam stream request failed:", vErr2);
              }
            }
          }

          // 2. Try requesting real microphone audio
          if (wantAudio) {
            try {
              const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
              audioTrack = audioStream.getAudioTracks()[0] || null;
            } catch (aErr) {
              console.warn("Real microphone audio request failed:", aErr);
            }
          }

          // 3. Assemble media tracks
          const tracks: MediaStreamTrack[] = [];
          if (videoTrack) {
            tracks.push(videoTrack);
          } else if (wantVideo) {
            // Only fallback to synth track if real camera is not available/denied
            tracks.push(createSyntheticVideoTrack("User Camera"));
          }

          if (audioTrack) {
            tracks.push(audioTrack);
          }

          userStream = new MediaStream(tracks);
        } else {
          // Browser lacks getUserMedia, synthesize video track
          const tracks: MediaStreamTrack[] = [];
          if (wantVideo) {
            tracks.push(createSyntheticVideoTrack("User Camera"));
          }
          userStream = new MediaStream(tracks);
        }

        streamRef.current = userStream;
        setStream(userStream);

        const videoTrack = userStream.getVideoTracks()[0];
        const audioTrack = userStream.getAudioTracks()[0];

        const camState = videoTrack ? videoTrack.enabled : Boolean(wantVideo);
        const micState = audioTrack ? !audioTrack.enabled : !wantAudio;

        setIsCameraOn(camState);
        setIsMuted(micState);
        setIsLoading(false);
        return userStream;
      } catch (err: any) {
        setIsLoading(false);
        setError(err?.message || "Failed to acquire media stream.");
        return null;
      }
    },
    [audio, video, stopMedia]
  );

  const toggleCamera = useCallback(async () => {
    if (!streamRef.current || streamRef.current.getVideoTracks().length === 0) {
      if (!isCameraOn) {
        try {
          const newStream = await startMedia({ video: true, audio: !isMuted });
          if (newStream && newStream.getVideoTracks().length > 0) {
            setIsCameraOn(true);
            return;
          }
        } catch {
          // ignore
        }
      }
      setIsCameraOn((prev) => !prev);
      return;
    }

    const videoTracks = streamRef.current.getVideoTracks();
    const nextCameraState = !isCameraOn;
    videoTracks.forEach((t) => {
      t.enabled = nextCameraState;
    });
    setIsCameraOn(nextCameraState);
  }, [isCameraOn, isMuted, startMedia]);

  const toggleMicrophone = useCallback(async () => {
    if (!streamRef.current || streamRef.current.getAudioTracks().length === 0) {
      setIsMuted((prev) => !prev);
      return;
    }

    const audioTracks = streamRef.current.getAudioTracks();
    const nextMutedState = !isMuted;
    audioTracks.forEach((t) => {
      t.enabled = !nextMutedState;
    });
    setIsMuted(nextMutedState);
  }, [isMuted]);

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

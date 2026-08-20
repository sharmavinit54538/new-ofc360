import { useState, useEffect, useCallback, useRef } from "react";
import { connectWebRTCService, WebRTCConfig } from "@/services/connectWebRTCService";
import { useConnectCall } from "@/features/connect/hooks";

export function useWebRTC(config: WebRTCConfig = {}) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const { isMuted: reduxMuted, isCameraEnabled, isScreenSharing } = useConnectCall();

  const init = useCallback(async () => {
    await connectWebRTCService.init({
      ...config,
      onRemoteStream: (stream) => {
        setRemoteStream(stream);
        config.onRemoteStream?.(stream);
      },
      onConnectionStateChange: (state) => {
        setConnectionState(state);
        config.onConnectionStateChange?.(state);
      },
    });
  }, [config]);

  const startMedia = useCallback(async (audio = true, video = true) => {
    const stream = await connectWebRTCService.getLocalMedia(audio, video);
    setLocalStream(stream);
    setIsCameraOff(!video);
    setIsMuted(!audio);
    return stream;
  }, []);

  const startScreenShare = useCallback(async () => {
    const stream = await connectWebRTCService.startScreenShare();
    setScreenStream(stream);
    setIsSharing(Boolean(stream));
    return stream;
  }, []);

  const stopScreenShare = useCallback(async () => {
    await connectWebRTCService.stopScreenShare();
    setScreenStream(null);
    setIsSharing(false);
  }, []);

  const toggleMicrophone = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      connectWebRTCService.toggleMicrophone(!next);
      return next;
    });
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraOff((prev) => {
      const next = !prev;
      connectWebRTCService.toggleCamera(!next);
      return next;
    });
  }, []);

  const createOffer = useCallback(async () => {
    return await connectWebRTCService.createOffer();
  }, []);

  const createAnswer = useCallback(async () => {
    return await connectWebRTCService.createAnswer();
  }, []);

  const cleanup = useCallback(() => {
    connectWebRTCService.cleanup();
    setLocalStream(null);
    setRemoteStream(null);
    setScreenStream(null);
    setIsSharing(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    localStream,
    remoteStream,
    screenStream,
    connectionState,
    isMuted,
    isCameraOff,
    isSharing,
    init,
    startMedia,
    startScreenShare,
    stopScreenShare,
    toggleMicrophone,
    toggleCamera,
    createOffer,
    createAnswer,
    cleanup,
  };
}
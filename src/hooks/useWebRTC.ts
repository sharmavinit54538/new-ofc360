import { useEffect, useCallback } from "react";
import { connectWebRTCService, WebRTCConfig } from "@/services/connectWebRTCService";
import { useWebRTCStreams } from "./webrtc/useWebRTCStreams";
import { useWebRTCActions } from "./webrtc/useWebRTCActions";

export function useWebRTC(config: WebRTCConfig = {}) {
  const s = useWebRTCStreams();
  const act = useWebRTCActions(s);
  const init = useCallback(async () => {
    await connectWebRTCService.init({ ...config, onRemoteStream: (st) => { s.setRemoteStream(st); config.onRemoteStream?.(st); }, onConnectionStateChange: (st) => { s.setConnectionState(st); config.onConnectionStateChange?.(st); } });
  }, [config, s]);
  useEffect(() => () => act.cleanup(), [act]);
  return { localStream: s.localStream, remoteStream: s.remoteStream, screenStream: s.screenStream, connectionState: s.connectionState, isMuted: s.isMuted, isCameraOff: s.isCameraOff, isSharing: s.isSharing, init, ...act };
}
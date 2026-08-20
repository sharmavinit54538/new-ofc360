import { useState, useRef, useCallback, useEffect } from "react";
import type { PeerConnectionConfig } from "./webrtc/peerTypes";
import { DEFAULT_ICE_SERVERS } from "./webrtc/peerTypes";
import { createPeerOfferAnswer } from "./webrtc/peerOfferAnswer";
import { bindPeerEvents } from "./webrtc/peerInit";
export type { PeerConnectionConfig };

export function usePeerConnection(cfg: PeerConnectionConfig = {}) {
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const closeConnection = useCallback(() => { pcRef.current?.close(); pcRef.current = null; setRemoteStream(null); setConnectionState("closed"); }, []);
  const initPeerConnection = useCallback(() => {
    if (typeof window === "undefined" || !window.RTCPeerConnection) return null;
    pcRef.current?.close(); const pc = new RTCPeerConnection({ iceServers: cfg.iceServers || DEFAULT_ICE_SERVERS });
    pcRef.current = pc; bindPeerEvents(pc, cfg, setConnectionState, setRemoteStream); setConnectionState(pc.connectionState); return pc;
  }, [cfg]);
  useEffect(() => () => closeConnection(), [closeConnection]);
  return { peerConnection: pcRef.current, connectionState, remoteStream, initPeerConnection, closeConnection, ...createPeerOfferAnswer(pcRef) };
}
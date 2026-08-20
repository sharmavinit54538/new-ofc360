import React from "react";
import type { PeerConnectionConfig } from "./peerTypes";

export function bindPeerEvents(pc: RTCPeerConnection, cfg: PeerConnectionConfig, setConn: (s: RTCPeerConnectionState) => void, setRem: (s: MediaStream | null) => void) {
  pc.onconnectionstatechange = () => { setConn(pc.connectionState); cfg.onConnectionStateChange?.(pc.connectionState); };
  pc.onicecandidate = (e) => { if (e.candidate && cfg.onIceCandidate) cfg.onIceCandidate(e.candidate); };
  pc.ontrack = (e) => { if (e.streams?.[0]) setRem(e.streams[0]); cfg.onTrack?.(e); };
}

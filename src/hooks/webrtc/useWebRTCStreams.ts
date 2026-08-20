import { useState } from "react";

export function useWebRTCStreams() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  return { localStream, setLocalStream, remoteStream, setRemoteStream, screenStream, setScreenStream, connectionState, setConnectionState, isMuted, setIsMuted, isCameraOff, setIsCameraOff, isSharing, setIsSharing };
}

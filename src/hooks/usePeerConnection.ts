import { useState, useRef, useCallback, useEffect } from "react";

export interface PeerConnectionConfig {
  iceServers?: RTCIceServer[];
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  onTrack?: (event: RTCTrackEvent) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

export function usePeerConnection(config: PeerConnectionConfig = {}) {
  const {
    iceServers = DEFAULT_ICE_SERVERS,
    onIceCandidate,
    onTrack,
    onConnectionStateChange,
  } = config;

  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const initPeerConnection = useCallback(() => {
    if (typeof window === "undefined" || !window.RTCPeerConnection) {
      return null;
    }

    if (pcRef.current) {
      pcRef.current.close();
    }

    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      onConnectionStateChange?.(pc.connectionState);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && onIceCandidate) {
        onIceCandidate(event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
      onTrack?.(event);
    };

    setConnectionState(pc.connectionState);
    return pc;
  }, [iceServers, onIceCandidate, onTrack, onConnectionStateChange]);

  const addTracks = useCallback((stream: MediaStream) => {
    const pc = pcRef.current;
    if (!pc) return;

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
  }, []);

  const createOffer = useCallback(async (options?: RTCOfferOptions) => {
    const pc = pcRef.current;
    if (!pc) return null;
    const offer = await pc.createOffer(options);
    await pc.setLocalDescription(offer);
    return offer;
  }, []);

  const createAnswer = useCallback(async (options?: RTCAnswerOptions) => {
    const pc = pcRef.current;
    if (!pc) return null;
    const answer = await pc.createAnswer(options);
    await pc.setLocalDescription(answer);
    return answer;
  }, []);

  const handleRemoteDescription = useCallback(async (description: RTCSessionDescriptionInit) => {
    const pc = pcRef.current;
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(description));
  }, []);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const pc = pcRef.current;
    if (!pc) return;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }, []);

  const closeConnection = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setRemoteStream(null);
    setConnectionState("closed");
  }, []);

  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, [closeConnection]);

  return {
    peerConnection: pcRef.current,
    connectionState,
    remoteStream,
    initPeerConnection,
    addTracks,
    createOffer,
    createAnswer,
    handleRemoteDescription,
    handleIceCandidate,
    closeConnection,
  };
}

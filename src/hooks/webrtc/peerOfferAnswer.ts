import React from "react";

export function createPeerOfferAnswer(pcRef: React.MutableRefObject<RTCPeerConnection | null>) {
  const createOffer = async (opts?: RTCOfferOptions) => { if (!pcRef.current) return null; const o = await pcRef.current.createOffer(opts); await pcRef.current.setLocalDescription(o); return o; };
  const createAnswer = async (opts?: RTCAnswerOptions) => { if (!pcRef.current) return null; const a = await pcRef.current.createAnswer(opts); await pcRef.current.setLocalDescription(a); return a; };
  const handleRemoteDescription = async (desc: RTCSessionDescriptionInit) => { if (pcRef.current) await pcRef.current.setRemoteDescription(new RTCSessionDescription(desc)); };
  const handleIceCandidate = async (cand: RTCIceCandidateInit) => { if (pcRef.current) await pcRef.current.addIceCandidate(new RTCIceCandidate(cand)); };
  const addTracks = (stream: MediaStream) => { if (pcRef.current) stream.getTracks().forEach((t) => pcRef.current?.addTrack(t, stream)); };
  return { createOffer, createAnswer, handleRemoteDescription, handleIceCandidate, addTracks };
}

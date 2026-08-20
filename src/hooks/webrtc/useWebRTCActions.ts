import { useCallback } from "react";
import { connectWebRTCService } from "@/services/connectWebRTCService";

export function useWebRTCActions(s: any) {
  const startMedia = useCallback(async (audio = true, video = true) => { const st = await connectWebRTCService.getLocalMedia(audio, video); s.setLocalStream(st); s.setIsCameraOff(!video); s.setIsMuted(!audio); return st; }, [s]);
  const startScreenShare = useCallback(async () => { const st = await connectWebRTCService.startScreenShare(); s.setScreenStream(st); s.setIsSharing(Boolean(st)); return st; }, [s]);
  const stopScreenShare = useCallback(async () => { await connectWebRTCService.stopScreenShare(); s.setScreenStream(null); s.setIsSharing(false); }, [s]);
  const toggleMicrophone = useCallback(() => { s.setIsMuted((p: boolean) => { connectWebRTCService.toggleMicrophone(p); return !p; }); }, [s]);
  const toggleCamera = useCallback(() => { s.setIsCameraOff((p: boolean) => { connectWebRTCService.toggleCamera(p); return !p; }); }, [s]);
  const cleanup = useCallback(() => { connectWebRTCService.cleanup(); s.setLocalStream(null); s.setRemoteStream(null); s.setScreenStream(null); s.setIsSharing(false); }, [s]);
  return { startMedia, startScreenShare, stopScreenShare, toggleMicrophone, toggleCamera, cleanup, createOffer: () => connectWebRTCService.createOffer(), createAnswer: () => connectWebRTCService.createAnswer() };
}

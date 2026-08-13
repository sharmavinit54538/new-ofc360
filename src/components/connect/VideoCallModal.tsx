import { useState, useRef, useEffect } from "react";
import { useConnectStore } from "@/stores/connectStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Maximize,
  Minimize,
  MessageSquare,
  Users,
  ShieldCheck,
  Wifi,
  Sparkles,
} from "lucide-react";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { useScreenShare } from "@/hooks/useScreenShare";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function VideoCallModal() {
  const activeCall = useConnectStore((s) => s.activeCall);
  const endActiveCall = useConnectStore((s) => s.endActiveCall);
  const updateCallControls = useConnectStore((s) => s.updateCallControls);
  const incrementCallDuration = useConnectStore((s) => s.incrementCallDuration);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInCallChat, setShowInCallChat] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  // Local media hook
  const {
    stream: localStream,
    isCameraOn,
    isMuted,
    startMedia,
    stopMedia,
    toggleCamera,
    toggleMicrophone,
    error: mediaError,
    permissionDenied: mediaPermissionDenied,
  } = useLocalMedia({
    audio: true,
    video: true,
    autoStart: true,
  });

  // Screen share hook
  const {
    screenStream,
    isSharing,
    startScreenShare,
    stopScreenShare,
    error: screenError,
  } = useScreenShare();

  // Attach local media stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isCameraOn]);

  // Attach screen share stream to screen video element
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, isSharing]);

  // Duration timer
  useEffect(() => {
    if (activeCall && activeCall.status === "connected") {
      const timer = setInterval(() => {
        incrementCallDuration();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeCall?.status, incrementCallDuration]);

  if (!activeCall || activeCall.type !== "video") return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleEndCall = () => {
    stopMedia();
    stopScreenShare();
    endActiveCall();
  };

  const handleToggleScreenShare = async () => {
    if (isSharing) {
      stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  const initials = activeCall.targetUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white select-none overflow-hidden"
      >
        {/* Top Header */}
        <div className="h-14 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center font-bold text-white shadow-sm">
              <VideoIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{activeCall.targetUser.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/80 font-medium">
                  1-on-1 Call
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                {activeCall.targetUser.role || "Team Member"} • {activeCall.targetUser.department || "General"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Wifi className="w-3.5 h-3.5" />
              <span>{activeCall.status === "connected" ? "Connected" : "Calling..."}</span>
              <span className="font-mono ml-1 font-bold">{formatDuration(activeCall.duration)}</span>
            </div>
          </div>
        </div>

        {/* Center Video Area */}
        <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
          {/* Main Display: Screen Share or Remote Peer Placeholder */}
          {isSharing && screenStream ? (
            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold flex items-center gap-2 text-white">
                <Monitor className="w-3.5 h-3.5 text-primary" />
                <span>You are sharing your screen</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full max-h-[80vh] flex flex-col items-center justify-center rounded-2xl bg-zinc-900/80 border border-white/10 p-6 text-center">
              <div className="relative mb-4">
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-50" />
                <Avatar className="w-28 h-28 border-4 border-white/10 shadow-2xl">
                  <AvatarImage src={activeCall.targetUser.avatar} alt={activeCall.targetUser.name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{activeCall.targetUser.name}</h3>
              <p className="text-xs text-white/50 max-w-sm">
                Waiting for remote video stream to establish. Real camera and screen share functionality is live locally.
              </p>
            </div>
          )}

          {/* Picture-in-Picture Local Video Tile */}
          <div className="absolute bottom-6 right-6 w-48 sm:w-64 aspect-video rounded-2xl overflow-hidden bg-black/80 border-2 border-white/20 shadow-2xl z-20 group">
            {isCameraOn && localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 text-white/60 p-2">
                <VideoOff className="w-6 h-6 mb-1 text-white/40" />
                <span className="text-[11px] font-medium">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white">
              You {isMuted && "(Muted)"}
            </div>
          </div>
        </div>

        {/* Bottom Floating Control Bar */}
        <div className="h-20 px-6 flex items-center justify-center gap-3 bg-black/50 backdrop-blur-md border-t border-white/10 z-10">
          {/* Mute Mic */}
          <Button
            type="button"
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleMicrophone}
            className="w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105"
            title={isMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {/* Toggle Camera */}
          <Button
            type="button"
            variant={!isCameraOn ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleCamera}
            className="w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105"
            title={!isCameraOn ? "Turn On Camera" : "Turn Off Camera"}
          >
            {!isCameraOn ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </Button>

          {/* Screen Share */}
          <Button
            type="button"
            variant={isSharing ? "default" : "secondary"}
            size="icon"
            onClick={handleToggleScreenShare}
            className={`w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105 ${
              isSharing ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""
            }`}
            title={isSharing ? "Stop Sharing Screen" : "Share Screen"}
          >
            {isSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </Button>

          {/* End Call */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 shadow-xl transition-transform hover:scale-105 mx-2"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

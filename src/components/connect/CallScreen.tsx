import { useEffect, useRef } from "react";
import { useConnectCall } from "@/features/connect/hooks";
import { connectCallOrchestrator } from "@/services/connectCallOrchestrator";
import { connectAudioManager } from "@/services/connectAudioManager";
import { connectWebRTCService } from "@/services/connectWebRTCService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Wifi,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CallScreen() {
  const {
    activeCall,
    status,
    type,
    remoteUser,
    isMuted,
    isSpeakerOn,
    duration,
    toggleMute,
    toggleSpeaker,
    incrementDuration,
  } = useConnectCall();

  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  // Duration counter
  useEffect(() => {
    if (status === "connected") {
      const timer = setInterval(() => {
        incrementDuration();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, incrementDuration]);

  // Sync mute state to WebRTC
  useEffect(() => {
    connectWebRTCService.toggleMicrophone(!isMuted);
  }, [isMuted]);

  if (!activeCall || type !== "audio" || !remoteUser) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleEndCall = async () => {
    await connectCallOrchestrator.endActiveCall();
  };

  const initials = remoteUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 select-none"
      >
        <div className="w-full max-w-sm rounded-3xl bg-card border border-border/80 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          {/* Top Status Bar */}
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground mb-6">
            <div className="flex items-center gap-1.5 font-medium">
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              <span>{status === "connected" ? "Connected" : status === "calling" ? "Calling..." : status === "ringing" ? "Ringing..." : "Connecting..."}</span>
            </div>
            <span className="font-mono bg-muted/60 px-2 py-0.5 rounded-full font-bold">
              {formatDuration(duration)}
            </span>
          </div>

          {/* Animated Avatar Rings */}
          <div className="relative mb-6">
            {status === "connected" && (
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-60" />
            )}
            {status === "calling" && (
              <span className="absolute inset-0 rounded-full bg-amber-500/20 animate-pulse opacity-60" />
            )}
            <div className="relative w-24 h-24 rounded-full border-4 border-card shadow-xl overflow-hidden bg-primary/10 flex items-center justify-center">
              <Avatar className="w-full h-full">
                <AvatarImage src={remoteUser.avatar} alt={remoteUser.name} />
                <AvatarFallback className="text-xl bg-primary/20 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Callee Info */}
          <h3 className="text-lg font-bold text-foreground mb-1">{remoteUser.name}</h3>
          <p className="text-xs text-muted-foreground mb-8">
            {remoteUser.role || "Team Member"} • {remoteUser.department || "General"}
          </p>

          {/* Control Bar */}
          <div className="flex items-center gap-4">
            {/* Mic toggle */}
            <Button
              type="button"
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              onClick={() => toggleMute()}
              className="w-12 h-12 rounded-full shadow-md transition-all hover:scale-105"
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            {/* End Call */}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 shadow-lg transition-all hover:scale-105"
              title="End Call"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>

            {/* Speaker toggle */}
            <Button
              type="button"
              variant={isSpeakerOn ? "secondary" : "outline"}
              size="icon"
              onClick={() => toggleSpeaker()}
              className="w-12 h-12 rounded-full shadow-md transition-all hover:scale-105"
              title={isSpeakerOn ? "Mute Speaker" : "Unmute Speaker"}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Hidden remote audio element (audio playback handled by orchestrator) */}
        <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: "none" }} />
      </motion.div>
    </AnimatePresence>
  );
}


import { useEffect, useRef } from "react";
import { useConnectCall } from "@/features/connect/hooks";
import { connectCallOrchestrator } from "@/services/connectCallOrchestrator";
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
  PhoneCall,
  Loader2,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
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

  const isConnected = status === "CONNECTED" || status === "connected";
  const isCalling = status === "OUTGOING_CALLING" || status === "calling";
  const isRinging = status === "OUTGOING_RINGING" || status === "ringing";
  const isConnecting = status === "CONNECTING" || status === "connecting";
  const isDeclined = status === "DECLINED" || status === "declined";
  const isMissed = status === "MISSED" || status === "missed";
  const isFailed = status === "FAILED" || status === "failed";
  const isEnded = status === "ENDED" || status === "ended";

  // Duration counter starts ONLY when connected
  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        incrementDuration();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected, incrementDuration]);

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

  const handleRetry = async () => {
    if (remoteUser) {
      await connectCallOrchestrator.initiateCall(remoteUser, "audio");
    }
  };

  const initials = (remoteUser.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const getStatusDisplay = () => {
    if (isCalling) {
      return { text: "Calling...", icon: PhoneCall, color: "text-amber-500", pulse: true };
    }
    if (isRinging) {
      return { text: "Ringing...", icon: PhoneCall, color: "text-amber-500", pulse: true };
    }
    if (isConnecting) {
      return { text: "Connecting...", icon: Loader2, color: "text-primary", spin: true };
    }
    if (isConnected) {
      return { text: "Connected", icon: Wifi, color: "text-emerald-500" };
    }
    if (isDeclined) {
      return { text: "Call Declined", icon: AlertCircle, color: "text-rose-500" };
    }
    if (isMissed) {
      return { text: "Missed Call", icon: AlertCircle, color: "text-rose-500" };
    }
    if (isFailed) {
      return { text: "Unable to connect call", icon: AlertCircle, color: "text-rose-500" };
    }
    if (isEnded) {
      return {
        text: duration > 0 ? `Call ended • ${formatDuration(duration)}` : "Call ended",
        icon: CheckCircle2,
        color: "text-muted-foreground",
      };
    }
    return { text: "Connecting...", icon: Wifi, color: "text-muted-foreground" };
  };

  const statusInfo = getStatusDisplay();
  const StatusIcon = statusInfo.icon;

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
            <div className={`flex items-center gap-1.5 font-medium ${statusInfo.color}`}>
              <StatusIcon
                className={`w-3.5 h-3.5 ${statusInfo.spin ? "animate-spin" : ""} ${
                  statusInfo.pulse ? "animate-pulse" : ""
                }`}
              />
              <span>{statusInfo.text}</span>
            </div>
            {isConnected ? (
              <span className="font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                {formatDuration(duration)}
              </span>
            ) : duration > 0 ? (
              <span className="font-mono bg-muted/60 px-2 py-0.5 rounded-full font-bold">
                {formatDuration(duration)}
              </span>
            ) : null}
          </div>

          {/* Animated Avatar Rings */}
          <div className="relative mb-6">
            {isConnected && (
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-60" />
            )}
            {(isCalling || isRinging) && (
              <span className="absolute inset-0 rounded-full bg-amber-500/25 animate-pulse opacity-75" />
            )}
            {isConnecting && (
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-spin opacity-60" />
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
            {isFailed ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEndCall}
                  className="rounded-xl px-4 text-xs font-semibold"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-xl px-4 text-xs font-semibold gradient-bg text-white gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Call</span>
                </Button>
              </>
            ) : (
              <>
                {/* Mic toggle */}
                <Button
                  type="button"
                  variant={isMuted ? "destructive" : "secondary"}
                  size="icon"
                  onClick={() => toggleMute()}
                  disabled={!isConnected && !isCalling && !isRinging}
                  className="w-12 h-12 rounded-full shadow-md transition-all hover:scale-105 cursor-pointer"
                  title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                {/* End / Cancel Call */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleEndCall}
                  className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 shadow-lg transition-all hover:scale-105 cursor-pointer"
                  title={isCalling || isRinging ? "Cancel Call" : "End Call"}
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>

                {/* Speaker toggle */}
                <Button
                  type="button"
                  variant={isSpeakerOn ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => toggleSpeaker()}
                  className="w-12 h-12 rounded-full shadow-md transition-all hover:scale-105 cursor-pointer"
                  title={isSpeakerOn ? "Mute Speaker" : "Unmute Speaker"}
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Hidden remote audio element */}
        <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: "none" }} />
      </motion.div>
    </AnimatePresence>
  );
}
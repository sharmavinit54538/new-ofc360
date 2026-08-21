import { useEffect } from "react";
import { useConnectCall } from "@/features/connect/hooks";
import { connectCallOrchestrator } from "@/services/connectCallOrchestrator";
import { connectAudioManager } from "@/services/connectAudioManager";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function IncomingCallModal() {
  const { incomingCall } = useConnectCall();

  // Play incoming ringtone while ringing
  useEffect(() => {
    if (incomingCall) {
      connectAudioManager.playIncomingCall();
      return () => {
        connectAudioManager.stopIncomingCall();
      };
    }
  }, [incomingCall]);

  if (!incomingCall) return null;

  const handleAccept = async () => {
    console.log(`[CALL_ACCEPTED] User accepting incoming call ${incomingCall.id} from ${incomingCall.targetUser?.name}`);
    await connectCallOrchestrator.acceptCall(incomingCall);
  };

  const handleReject = async () => {
    console.log(`[CALL_REJECTED] User rejecting incoming call ${incomingCall.id} from ${incomingCall.targetUser?.name}`);
    await connectCallOrchestrator.rejectCall(incomingCall);
  };

  const callerName = incomingCall?.targetUser?.name || "Unknown";
  const initials = callerName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-6 right-6 z-50 w-full max-w-sm rounded-2xl bg-card/95 backdrop-blur-xl border border-primary/30 p-4 shadow-2xl select-none"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
            <Avatar className="w-12 h-12 border-2 border-emerald-500 shadow-md">
              <AvatarImage src={incomingCall?.targetUser?.avatar} alt={callerName} />
              <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Incoming {incomingCall?.type === "video" ? "Video" : "Audio"} Call...
            </span>
            <h4 className="text-sm font-bold text-foreground truncate">{callerName}</h4>
            <p className="text-[11px] text-muted-foreground truncate">
              {incomingCall?.targetUser?.role || "Colleague"} • {incomingCall?.targetUser?.department || "General"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            className="flex-1 h-9 rounded-xl text-xs gap-1.5 font-semibold bg-rose-600 hover:bg-rose-700"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Decline</span>
          </Button>

          <Button
            type="button"
            onClick={handleAccept}
            className="flex-1 h-9 rounded-xl text-xs gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
          >
            {incomingCall.type === "video" ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
            <span>Accept</span>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
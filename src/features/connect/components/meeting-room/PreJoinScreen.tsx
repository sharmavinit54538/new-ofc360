import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { leaveMeeting } from "@/features/connect/meetingSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video as VideoIcon, VideoOff, Radio, ArrowRight } from "lucide-react";
import { connectAudioManager } from "@/services/connectAudioManager";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { useWebRTC } from "@/hooks/useWebRTC";
import { toast } from "sonner";

interface PreJoinScreenProps {
  activeMeeting: {
    title: string;
    hostName: string;
    id: string;
  };
  currentConnectUser: ConnectUser;
  localStream: MediaStream | null;
  isCameraOff: boolean;
  isMuted: boolean;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  onJoin: () => void;
  onCancel: () => void;
}

export function PreJoinScreen({
  activeMeeting,
  currentConnectUser,
  localStream,
  isCameraOff,
  isMuted,
  toggleMicrophone,
  toggleCamera,
  onJoin,
  onCancel,
}: PreJoinScreenProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-card/60 backdrop-blur-xl border border-border/80 rounded-2xl select-none shadow-2xl">
      <div className="w-full max-w-xl space-y-6 text-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Ready to Join
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mt-2">{activeMeeting.title}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Host: {activeMeeting.hostName || "Colleague"} • Check your camera and mic before entering
          </p>
        </div>

        {/* Camera preview tile */}
        <div className="relative aspect-video w-full rounded-2xl bg-black/90 border border-border/80 overflow-hidden shadow-2xl flex items-center justify-center">
          <video
            ref={(el) => {
              if (el && localStream) {
                el.srcObject = localStream;
              }
            }}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover mirror scale-x-[-1] ${
              !isCameraOff && localStream ? "block" : "hidden"
            }`}
          />

          {(isCameraOff || !localStream) && (
            <div className="flex flex-col items-center justify-center text-white/50 space-y-2">
              <Avatar className="w-20 h-20 border-2 border-white/20">
                <AvatarImage src={currentConnectUser.avatar} />
                <AvatarFallback className="text-xl font-bold bg-primary/20 text-primary">
                  {currentConnectUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">Camera is off</span>
            </div>
          )}

          {/* In-preview quick toggles */}
          <div className="absolute bottom-4 flex items-center gap-3">
            <Button
              type="button"
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              onClick={toggleMicrophone}
              className="w-10 h-10 rounded-full shadow-lg"
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              type="button"
              variant={isCameraOff ? "destructive" : "secondary"}
              size="icon"
              onClick={toggleCamera}
              className="w-10 h-10 rounded-full shadow-lg"
            >
              {isCameraOff ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-10 px-5 text-xs rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onJoin}
            className="gradient-bg text-primary-foreground font-bold h-10 px-8 text-xs rounded-xl shadow-lg hover:opacity-95 cursor-pointer"
          >
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MicOff, VideoOff, Monitor, MonitorOff } from "lucide-react";
import { ConnectUser } from "@/types/connect";

interface VideoGridProps {
  isSharing: boolean;
  screenStream: MediaStream | null;
  screenVideoRef: React.RefObject<HTMLVideoElement>;
  localStream: MediaStream | null;
  isCameraOff: boolean;
  isMuted: boolean;
  currentConnectUser: ConnectUser;
  participantsList: ConnectUser[];
  currentUserId: string;
}

export function VideoGrid({
  isSharing,
  screenStream,
  screenVideoRef,
  localStream,
  isCameraOff,
  isMuted,
  currentConnectUser,
  participantsList,
  currentUserId,
}: VideoGridProps) {
  if (isSharing && screenStream) {
    return (
      <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
        <video
          ref={screenVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-2 text-white">
          <Monitor className="w-3.5 h-3.5 text-primary" />
          <span>Screen sharing is active</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full max-h-[78vh] grid gap-3 p-2 items-center justify-center ${
        participantsList.length <= 1
          ? "grid-cols-1"
          : participantsList.length === 2
          ? "grid-cols-1 md:grid-cols-2"
          : participantsList.length <= 4
          ? "grid-cols-2"
          : "grid-cols-2 md:grid-cols-3"
      }`}
    >
      {/* Local Tile */}
      <div className="relative w-full h-full min-h-[160px] rounded-2xl bg-zinc-900/90 border border-white/10 overflow-hidden flex items-center justify-center shadow-lg group">
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
            <Avatar className="w-16 h-16 border-2 border-white/20">
              <AvatarImage src={currentConnectUser.avatar} />
              <AvatarFallback className="text-base font-bold bg-primary/20 text-primary">
                {currentConnectUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[11px] font-semibold flex items-center gap-1.5">
          <span>{currentConnectUser.name} (You)</span>
          {isMuted && <MicOff className="w-3 h-3 text-rose-400" />}
        </div>
      </div>

      {/* Other Remote Participants */}
      {participantsList
        .filter((p) => p.id !== currentUserId)
        .map((p) => (
          <div
            key={p.id}
            className="relative w-full h-full min-h-[160px] rounded-2xl bg-zinc-900/90 border border-white/10 overflow-hidden flex items-center justify-center shadow-lg"
          >
            <div className="flex flex-col items-center justify-center text-white/50 space-y-2">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarImage src={p.avatar} />
                <AvatarFallback className="text-base font-bold bg-primary/20 text-primary">
                  {p.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[11px] font-semibold">
              {p.name}
            </div>
          </div>
        ))}
    </div>
  );
}
import React from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, MonitorOff, PhoneOff, Users, MessageSquare, FolderArchive, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/app/hooks";
import { setActiveDrawer } from "@/features/connect/meetingSlice";

interface MeetingControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  isSharing: boolean;
  activePanel: "chat" | "participants" | "files" | "info" | null;
  activeMeeting: {
    hostId: string;
  };
  currentUserId: string;
  onToggleMicrophone: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
  onEndForAll: () => void;
}

export function MeetingControls({
  isMuted,
  isCameraOff,
  isSharing,
  activePanel,
  activeMeeting,
  currentUserId,
  onToggleMicrophone,
  onToggleCamera,
  onToggleScreenShare,
  onLeave,
  onEndForAll,
}: MeetingControlsProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="h-18 px-4 md:px-6 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-3 shrink-0 z-10">
      {/* Left: Info details */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">
        <span>{activeMeeting.title}</span>
      </div>

      {/* Center: Core Audio/Video/Screen controls */}
      <div className="flex items-center gap-3">
        {/* Mic */}
        <Button
          type="button"
          variant={isMuted ? "destructive" : "secondary"}
          size="icon"
          onClick={onToggleMicrophone}
          className="w-11 h-11 rounded-full shadow-lg"
          title={isMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        {/* Camera */}
        <Button
          type="button"
          variant={isCameraOff ? "destructive" : "secondary"}
          size="icon"
          onClick={onToggleCamera}
          className="w-11 h-11 rounded-full shadow-lg"
          title={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
        >
          {isCameraOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
        </Button>

        {/* Screen Share */}
        <Button
          type="button"
          variant={isSharing ? "default" : "secondary"}
          size="icon"
          onClick={onToggleScreenShare}
          className={`w-11 h-11 rounded-full shadow-lg ${
            isSharing ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""
          }`}
          title={isSharing ? "Stop Screen Share" : "Share Screen"}
        >
          {isSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </Button>

        {/* Leave / End Call */}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={onLeave}
          className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 shadow-xl mx-2"
          title="Leave Meeting"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>

        {activeMeeting.hostId === currentUserId && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEndForAll}
            className="text-xs h-9 px-2.5 rounded-xl border-rose-500/50 text-rose-400 hover:bg-rose-500/10 hidden md:inline-flex"
          >
            End for All
          </Button>
        )}
      </div>

      {/* Right: Drawer toggles */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            dispatch(setActiveDrawer(activePanel === "chat" ? null : "chat"))
          }
          className={`w-9 h-9 rounded-xl ${
            activePanel === "chat" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
          }`}
          title="Chat"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            dispatch(setActiveDrawer(activePanel === "participants" ? null : "participants"))
          }
          className={`w-9 h-9 rounded-xl ${
            activePanel === "participants"
              ? "bg-white/20 text-white"
              : "text-white/60 hover:text-white"
          }`}
          title="Participants"
        >
          <Users className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            dispatch(setActiveDrawer(activePanel === "files" ? null : "files"))
          }
          className={`w-9 h-9 rounded-xl ${
            activePanel === "files" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
          }`}
          title="Shared Files"
        >
          <FolderArchive className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            dispatch(setActiveDrawer(activePanel === "info" ? null : "info"))
          }
          className={`w-9 h-9 rounded-xl ${
            activePanel === "info" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
          }`}
          title="Meeting Info"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
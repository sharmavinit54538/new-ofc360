import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useConnectStore } from "@/stores/connectStore";
import { connectAudioManager } from "@/services/connectAudioManager";
import { useAuth } from "@/hooks/useAuth";
import { ConnectMeeting, ConnectUser, ConnectMessage } from "@/types/connect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Users,
  MessageSquare,
  FolderArchive,
  Info,
  Copy,
  Check,
  Sparkles,
  Send,
  X,
  Radio,
  Share2,
} from "lucide-react";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { useScreenShare } from "@/hooks/useScreenShare";
import { ChatComposer } from "./ChatComposer";
import { MessageBubble } from "./MessageBubble";
import { FileCard } from "./FileCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface MeetingRoomProps {
  meetingId: string;
}

export function MeetingRoom({ meetingId }: MeetingRoomProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ? String(currentUser.id) : "usr_current";

  const currentConnectUser: ConnectUser = useMemo(
    () => ({
      id: currentUserId,
      name: currentUser?.name || currentUser?.email?.split("@")[0] || "Guest User",
      email: currentUser?.email || "",
      role: currentUser?.role,
    }),
    [currentUserId, currentUser]
  );

  const meetings = useConnectStore((s) => s.meetings);
  const currentMeetingRoom = useConnectStore((s) => s.currentMeetingRoom);
  const joinMeetingRoom = useConnectStore((s) => s.joinMeetingRoom);
  const leaveMeetingRoom = useConnectStore((s) => s.leaveMeetingRoom);

  // In-meeting state
  const [meetingState, setMeetingState] = useState<"prejoin" | "joined" | "ended">("prejoin");
  const [activePanel, setActivePanel] = useState<"chat" | "participants" | "files" | "info" | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);

  // In-meeting messages & files local state
  const [inMeetingMessages, setInMeetingMessages] = useState<ConnectMessage[]>([]);
  const [inMeetingFiles, setInMeetingFiles] = useState<any[]>([]);

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
  } = useScreenShare();

  // Attach local media stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isCameraOn, meetingState]);

  // Attach screen share stream
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, isSharing]);

  // Duration timer
  useEffect(() => {
    if (meetingState === "joined") {
      const timer = setInterval(() => {
        setMeetingDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [meetingState]);

  const activeMeeting: ConnectMeeting = useMemo(() => {
    const existing = meetings.find((m) => m.id === meetingId);
    if (existing) return existing;

    return {
      id: meetingId,
      title: `Meeting Room (${meetingId})`,
      hostId: currentConnectUser.id,
      hostName: currentConnectUser.name,
      startTime: new Date().toISOString(),
      participants: [currentConnectUser],
      isPrivate: false,
      allowScreenShare: true,
      allowMicrophone: true,
      allowCamera: true,
      status: "in_meeting",
    };
  }, [meetings, meetingId, currentConnectUser]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleJoin = () => {
    connectAudioManager.playMeetingStarted({ eventId: `meet_start_${meetingId}` });
    joinMeetingRoom(meetingId, currentConnectUser);
    setMeetingState("joined");
    toast.success("Joined meeting room");
  };

  const handleLeave = () => {
    connectAudioManager.playMeetingEnded({ eventId: `meet_end_${meetingId}` });
    stopMedia();
    stopScreenShare();
    leaveMeetingRoom();
    setMeetingState("ended");
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Meeting link copied to clipboard");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendMeetingMessage = (payload: { content: string; attachments?: any[] }) => {
    const newMsg: ConnectMessage = {
      id: `mmsg_${Date.now()}`,
      conversationId: meetingId,
      senderId: currentConnectUser.id,
      senderName: currentConnectUser.name,
      content: payload.content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
      attachments: payload.attachments,
    };
    setInMeetingMessages((prev) => [...prev, newMsg]);

    if (payload.attachments && payload.attachments.length > 0) {
      setInMeetingFiles((prev) => [...prev, ...payload.attachments!]);
    }
  };

  const handleToggleScreen = async () => {
    if (isSharing) {
      stopScreenShare();
      connectAudioManager.playScreenShareStopped();
    } else {
      await startScreenShare();
      connectAudioManager.playScreenShareStarted();
    }
  };

  // PRE-JOIN SCREEN
  if (meetingState === "prejoin") {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-background select-none">
        <div className="w-full max-w-2xl rounded-3xl bg-card border border-border/80 p-6 md:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
              Ready to Connect
            </span>
            <h2 className="text-xl font-bold text-foreground mt-2">{activeMeeting.title}</h2>
            <p className="text-xs text-muted-foreground">
              Meeting ID: <span className="font-mono font-semibold text-foreground">{meetingId}</span>
            </p>
          </div>

          {/* Camera Preview Tile */}
          <div className="relative aspect-video max-h-72 w-full mx-auto rounded-2xl overflow-hidden bg-black/90 border border-border/70 shadow-lg flex items-center justify-center">
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
                isCameraOn && localStream ? "block" : "hidden"
              }`}
            />
            {(!isCameraOn || !localStream) && (
              <div className="flex flex-col items-center justify-center text-white/50 space-y-2">
                <VideoOff className="w-10 h-10 opacity-60" />
                <span className="text-xs font-medium">Camera is turned off</span>
              </div>
            )}

            {/* Quick Controls in preview */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md p-1.5 px-4 rounded-full border border-white/20">
              <Button
                type="button"
                variant={isMuted ? "destructive" : "secondary"}
                size="icon"
                onClick={toggleMicrophone}
                className="w-10 h-10 rounded-full"
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

              <Button
                type="button"
                variant={!isCameraOn ? "destructive" : "secondary"}
                size="icon"
                onClick={toggleCamera}
                className="w-10 h-10 rounded-full"
                title={!isCameraOn ? "Enable Camera" : "Disable Camera"}
              >
                {!isCameraOn ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* User badge and Join Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/60">
            <div className="flex items-center gap-2.5">
              <Avatar className="w-9 h-9 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {currentConnectUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold text-foreground">{currentConnectUser.name}</p>
                <p className="text-[11px] text-muted-foreground">Joining as Participant</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial h-9 rounded-xl text-xs gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Link Copied" : "Copy Link"}</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleJoin}
                className="flex-1 sm:flex-initial h-9 px-6 rounded-xl gradient-bg text-primary-foreground font-semibold text-xs shadow-md"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MEETING ENDED SCREEN
  if (meetingState === "ended") {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-background text-center select-none">
        <div className="w-full max-w-md rounded-3xl bg-card border border-border/80 p-8 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <Radio className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">You left the meeting</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Thank you for participating. Your local media streams and screen sharing tracks have been safely disconnected.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                startMedia();
                setMeetingState("prejoin");
              }}
              className="h-9 rounded-xl text-xs font-semibold px-4"
            >
              Rejoin Meeting
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => navigate("/connect/meetings")}
              className="gradient-bg text-primary-foreground h-9 rounded-xl text-xs font-semibold px-4 shadow-sm"
            >
              Return to Meetings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE MEETING ROOM SCREEN
  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-5.5rem)] flex flex-col bg-zinc-950 text-white rounded-2xl overflow-hidden shadow-2xl border border-border/40 select-none">
      {/* Top Header */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center font-bold text-white shrink-0">
            <VideoIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{activeMeeting.title}</h3>
            <span className="text-[11px] text-white/60 font-mono">ID: {meetingId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Duration & Live Pill */}
          <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-mono text-white/90">{formatDuration(meetingDuration)}</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="text-xs h-8 text-white/80 hover:text-white hover:bg-white/10 gap-1.5 hidden sm:inline-flex rounded-lg"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Copied" : "Copy Link"}</span>
          </Button>
        </div>
      </div>

      {/* Center Grid + Optional Right Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Participant Video Grid */}
        <div className="flex-1 p-4 flex flex-col items-center justify-center overflow-hidden">
          {isSharing && screenStream ? (
            <div className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden bg-black border border-white/10 relative">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-primary" />
                <span>Screen Share is live</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center">
              {/* Local Participant Tile */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border-2 border-primary/40 shadow-xl flex items-center justify-center group">
                {isCameraOn && localStream ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror scale-x-[-1]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/50">
                    <Avatar className="w-20 h-20 mb-2 border-2 border-white/20">
                      <AvatarFallback className="text-xl font-bold bg-primary/20 text-primary">
                        {currentConnectUser.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{currentConnectUser.name} (Camera off)</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <span>You {isMuted ? "(Muted)" : ""}</span>
                  {isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>

              {/* Peer Tile / Waiting for peers */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/10 shadow-lg flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Users className="w-7 h-7 text-white/40" />
                </div>
                <h4 className="text-sm font-semibold text-white/80">Waiting for other participants</h4>
                <p className="text-[11px] text-white/40 max-w-xs mt-1">
                  Share the meeting link to invite teammates to this room.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="mt-3 text-xs h-7 gap-1 border-white/20 text-white hover:bg-white/10"
                >
                  <Share2 className="w-3 h-3" /> Copy Link
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Drawer Panel (Chat, Participants, Files, Info) */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="h-full bg-zinc-900 border-l border-white/10 flex flex-col shadow-2xl shrink-0 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="h-12 px-4 flex items-center justify-between border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {activePanel === "chat" && "Meeting Chat"}
                  {activePanel === "participants" && `Participants (${activeMeeting.participants.length})`}
                  {activePanel === "files" && `Shared Files (${inMeetingFiles.length})`}
                  {activePanel === "info" && "Meeting Details"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setActivePanel(null)}
                  className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin text-xs">
                {activePanel === "chat" && (
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-2 scrollbar-thin">
                      {inMeetingMessages.length === 0 ? (
                        <p className="text-center py-12 text-white/40 text-xs">
                          No messages in this meeting yet.
                        </p>
                      ) : (
                        inMeetingMessages.map((m) => (
                          <div key={m.id} className="p-2 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-primary">{m.senderName}</span>
                              <span className="text-[10px] text-white/40">{m.timestamp}</span>
                            </div>
                            <p className="text-white/90">{m.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <ChatComposer
                      onSendMessage={handleSendMeetingMessage}
                      placeholder="Message meeting..."
                      compact
                      className="bg-transparent border-t border-white/10 p-0"
                    />
                  </div>
                )}

                {activePanel === "participants" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7 border border-white/10">
                          <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-bold">
                            {currentConnectUser.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{currentConnectUser.name} (You)</p>
                          <p className="text-[10px] text-white/50">{currentConnectUser.role || "Host"}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                  </div>
                )}

                {activePanel === "files" && (
                  <div className="space-y-2">
                    {inMeetingFiles.length === 0 ? (
                      <p className="text-center py-12 text-white/40 text-xs">
                        No files shared in this meeting yet.
                      </p>
                    ) : (
                      inMeetingFiles.map((f) => (
                        <FileCard key={f.id} attachment={f} compact className="bg-white/5 border-white/10 text-white" />
                      ))
                    )}
                  </div>
                )}

                {activePanel === "info" && (
                  <div className="space-y-3 text-white/80">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/40 block">Title</span>
                      <p className="font-semibold text-white">{activeMeeting.title}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/40 block">Meeting ID</span>
                      <p className="font-mono text-xs">{meetingId}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/40 block">Host</span>
                      <p>{activeMeeting.hostName}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Control Bar */}
      <div className="h-18 px-4 sm:px-6 flex items-center justify-between bg-black/60 backdrop-blur-md border-t border-white/10 shrink-0">
        {/* Left Side: Meeting details button */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActivePanel(activePanel === "info" ? null : "info")}
            className="text-xs text-white/70 hover:text-white hover:bg-white/10 gap-1.5 rounded-lg"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Details</span>
          </Button>
        </div>

        {/* Center: Main Media Controls */}
        <div className="flex items-center gap-2.5 mx-auto">
          {/* Mute Mic */}
          <Button
            type="button"
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleMicrophone}
            className="w-11 h-11 rounded-full shadow-lg transition-transform hover:scale-105"
            title={isMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {/* Toggle Cam */}
          <Button
            type="button"
            variant={!isCameraOn ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleCamera}
            className="w-11 h-11 rounded-full shadow-lg transition-transform hover:scale-105"
            title={!isCameraOn ? "Turn On Camera" : "Turn Off Camera"}
          >
            {!isCameraOn ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
          </Button>

          {/* Screen Share */}
          <Button
            type="button"
            variant={isSharing ? "default" : "secondary"}
            size="icon"
            onClick={handleToggleScreen}
            className={`w-11 h-11 rounded-full shadow-lg transition-transform hover:scale-105 ${
              isSharing ? "bg-primary text-primary-foreground" : ""
            }`}
            title={isSharing ? "Stop Screen Share" : "Share Screen"}
          >
            {isSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </Button>

          {/* Leave / End Call */}
          <Button
            type="button"
            variant="destructive"
            onClick={handleLeave}
            className="h-11 px-5 rounded-full bg-rose-600 hover:bg-rose-700 font-semibold text-xs gap-1.5 shadow-xl transition-transform hover:scale-105 ml-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
          </Button>
        </div>

        {/* Right Side: Drawer triggers */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={activePanel === "participants" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setActivePanel(activePanel === "participants" ? null : "participants")}
            className="w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            title="Participants"
          >
            <Users className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={activePanel === "chat" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
            className="w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            title="In-Meeting Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={activePanel === "files" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setActivePanel(activePanel === "files" ? null : "files")}
            className="w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            title="Shared Files"
          >
            <FolderArchive className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setPrejoinMeeting,
  joinMeetingSuccess,
  leaveMeeting,
  toggleMeetingMute,
  toggleMeetingCamera,
  toggleMeetingScreenShare,
  setActiveDrawer,
  incrementMeetingDuration,
} from "@/features/connect/meetingSlice";
import {
  selectMeetingState,
  selectIsMeetingJoined,
  selectMeetingParticipants,
  selectMeetingDuration,
  selectMeetingActiveDrawer,
} from "@/features/connect/selectors";
import {
  useGetMeetingQuery,
  useJoinMeetingMutation,
  useLeaveMeetingMutation,
  useEndMeetingMutation,
  useGetMeetingParticipantsQuery,
  useGetMeetingMessagesQuery,
  useSendMeetingMessageMutation,
  useGetMeetingFilesQuery,
  useShareMeetingFileMutation,
  useStartScreenShareMutation,
  useStopScreenShareMutation,
  useGenerateAiMeetingSummaryMutation,
} from "@/services/api/connectApi";
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
import { useWebRTC } from "@/hooks/useWebRTC";
import { MessageBubble } from "./MessageBubble";
import { FileCard } from "./FileCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface MeetingRoomProps {
  meetingId: string;
}

export function MeetingRoom({ meetingId }: MeetingRoomProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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

  const isJoined = useAppSelector(selectIsMeetingJoined);
  const participantsFromRedux = useAppSelector(selectMeetingParticipants);
  const meetingDuration = useAppSelector(selectMeetingDuration);
  const activePanel = useAppSelector(selectMeetingActiveDrawer);

  const [copiedLink, setCopiedLink] = useState(false);
  const [inMeetingChatMessage, setInMeetingChatMessage] = useState("");
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // RTK Query endpoints
  const { data: meetingData, isLoading: isMeetingLoading } = useGetMeetingQuery(meetingId);
  const { data: participantsApi = [] } = useGetMeetingParticipantsQuery(meetingId, {
    skip: !isJoined,
    pollingInterval: 10000,
  });
  const { data: inMeetingMessages = [] } = useGetMeetingMessagesQuery(meetingId, {
    skip: !isJoined,
    pollingInterval: 5000,
  });
  const { data: inMeetingFiles = [] } = useGetMeetingFilesQuery(meetingId, {
    skip: !isJoined,
  });

  const [joinMeetingApi] = useJoinMeetingMutation();
  const [leaveMeetingApi] = useLeaveMeetingMutation();
  const [endMeetingApi] = useEndMeetingMutation();
  const [sendMeetingMessage] = useSendMeetingMessageMutation();
  const [shareMeetingFile] = useShareMeetingFileMutation();
  const [startScreenShareApi] = useStartScreenShareMutation();
  const [stopScreenShareApi] = useStopScreenShareMutation();
  const [generateAiSummary, { isLoading: isGeneratingSummary }] = useGenerateAiMeetingSummaryMutation();

  // WebRTC
  const {
    localStream,
    screenStream,
    isCameraOff,
    isMuted,
    isSharing,
    startMedia,
    startScreenShare,
    stopScreenShare,
    toggleMicrophone,
    toggleCamera,
    cleanup: cleanupWebRTC,
  } = useWebRTC();

  // Initialize media for prejoin preview
  useEffect(() => {
    startMedia(true, true);
    return () => {
      cleanupWebRTC();
      dispatch(leaveMeeting());
    };
  }, []);

  // Screen video stream attachment
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, isSharing]);

  // Duration timer
  useEffect(() => {
    if (isJoined) {
      const timer = setInterval(() => {
        dispatch(incrementMeetingDuration());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isJoined, dispatch]);

  const activeMeeting: ConnectMeeting = useMemo(() => {
    if (meetingData) return meetingData;
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
  }, [meetingData, meetingId, currentConnectUser]);

  const participantsList = participantsApi.length > 0 ? participantsApi : participantsFromRedux;

  const handleJoin = async () => {
    try {
      await joinMeetingApi({
        meetingId,
        passcode: undefined,
      }).unwrap();
    } catch {}

    dispatch(joinMeetingSuccess({ meeting: activeMeeting, user: currentConnectUser }));
    connectAudioManager.playParticipantJoined({ eventId: `join_${currentUserId}` });
    toast.success(`Joined ${activeMeeting.title}`);
  };

  const handleLeave = async () => {
    connectAudioManager.playParticipantLeft({ eventId: `leave_${currentUserId}` });
    try {
      await leaveMeetingApi(meetingId).unwrap();
    } catch {}
    cleanupWebRTC();
    dispatch(leaveMeeting());
    navigate("/connect/meetings");
  };

  const handleEndForAll = async () => {
    if (confirm("Are you sure you want to end this meeting for all participants?")) {
      try {
        await endMeetingApi(meetingId).unwrap();
      } catch {}
      handleLeave();
    }
  };

  const handleToggleScreenShare = async () => {
    if (isSharing) {
      await stopScreenShare();
      dispatch(toggleMeetingScreenShare(false));
      try {
        await stopScreenShareApi(meetingId).unwrap();
      } catch {}
      connectAudioManager.playScreenShareStopped();
    } else {
      const stream = await startScreenShare();
      if (stream) {
        dispatch(toggleMeetingScreenShare(true));
        try {
          await startScreenShareApi(meetingId).unwrap();
        } catch {}
        connectAudioManager.playScreenShareStarted();
      }
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inMeetingChatMessage.trim()) return;

    const content = inMeetingChatMessage.trim();
    setInMeetingChatMessage("");

    try {
      await sendMeetingMessage({
        meetingId,
        content,
      }).unwrap();
    } catch {
      toast.error("Failed to send message.");
    }
  };

  const handleGenerateSummary = async () => {
    try {
      const res = await generateAiSummary(meetingId).unwrap();
      setAiSummary(res.summary);
      toast.success("AI Meeting Summary Generated!");
    } catch {
      toast.error("Failed to generate meeting summary.");
    }
  };

  const handleCopyMeetingLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Meeting link copied to clipboard");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
    }
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // ----------------------------------------------------
  // PRE-JOIN SCREEN
  // ----------------------------------------------------
  if (!isJoined) {
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
              onClick={() => navigate("/connect/meetings")}
              className="h-10 px-5 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoin}
              className="gradient-bg text-primary-foreground font-bold h-10 px-8 text-xs rounded-xl shadow-lg hover:opacity-95 cursor-pointer"
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // IN-MEETING ROOM SCREEN
  // ----------------------------------------------------
  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white rounded-2xl border border-border/60 overflow-hidden select-none shadow-2xl relative">
      {/* Top Meeting Header */}
      <div className="h-14 px-4 md:px-6 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs md:text-sm font-bold text-white truncate">{activeMeeting.title}</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                {formatDuration(meetingDuration)}
              </span>
            </div>
            <p className="text-[10px] text-white/50 truncate">ID: {meetingId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Summary Trigger */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="h-8 px-2.5 rounded-lg text-xs gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {isGeneratingSummary ? "Generating..." : "AI Summary"}
            </span>
          </Button>

          {/* Copy Meeting Link */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyMeetingLink}
            className="h-8 px-2.5 rounded-lg text-xs gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10"
            title="Copy Meeting Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      {/* Main Grid + Side Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Video Presentation / Grid */}
        <div className="flex-1 flex flex-col p-3 md:p-4 overflow-hidden relative justify-center items-center">
          {isSharing && screenStream ? (
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
          ) : (
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
          )}

          {/* AI Meeting Summary Overlay Modal */}
          {aiSummary && (
            <div className="absolute inset-x-4 top-4 max-h-60 overflow-y-auto z-30 p-4 rounded-2xl bg-card/95 text-foreground border border-amber-500/30 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-xs text-primary">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Executive Meeting Summary</span>
                </div>
                <Button size="icon" variant="ghost" onClick={() => setAiSummary(null)} className="w-6 h-6">
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {aiSummary}
              </p>
            </div>
          )}
        </div>

        {/* In-Meeting Drawer Panels (Chat, Participants, Files, Info) */}
        {activePanel && (
          <div className="w-80 md:w-96 bg-zinc-900 border-l border-white/10 flex flex-col shrink-0 z-20">
            {/* Drawer Header */}
            <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {activePanel === "chat"
                  ? "In-Meeting Chat"
                  : activePanel === "participants"
                  ? `Participants (${participantsList.length})`
                  : activePanel === "files"
                  ? "Shared Files"
                  : "Meeting Details"}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => dispatch(setActiveDrawer(null))}
                className="w-7 h-7 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {activePanel === "chat" && (
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                    {inMeetingMessages.length === 0 ? (
                      <p className="text-center py-12 text-xs text-white/40">
                        No in-meeting messages yet.
                      </p>
                    ) : (
                      inMeetingMessages.map((msg) => (
                        <div key={msg.id} className="p-2 rounded-xl bg-white/5 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-white/50">
                            <span className="font-bold text-primary">{msg.senderName}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="text-white/90">{msg.content}</p>
                        </div>
                      ))
                    )}
                    <div ref={chatScrollRef} />
                  </div>

                  <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 pt-2">
                    <Input
                      value={inMeetingChatMessage}
                      onChange={(e) => setInMeetingChatMessage(e.target.value)}
                      placeholder="Send to everyone in room..."
                      className="h-8 text-xs bg-white/10 border-white/10 text-white rounded-lg"
                    />
                    <Button type="submit" size="icon" className="w-8 h-8 rounded-lg gradient-bg shrink-0">
                      <Send className="w-3.5 h-3.5 text-white" />
                    </Button>
                  </form>
                </div>
              )}

              {activePanel === "participants" && (
                <div className="space-y-1.5">
                  {participantsList.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={p.avatar} />
                          <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                            {p.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">
                            {p.name} {p.id === currentUserId && "(You)"}
                          </p>
                          <p className="text-[10px] text-white/50">{p.role || "Participant"}</p>
                        </div>
                      </div>
                      {p.id === activeMeeting.hostId && (
                        <span className="text-[10px] bg-primary/20 text-primary font-bold px-1.5 py-0.5 rounded-md">
                          Host
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activePanel === "files" && (
                <div className="space-y-2">
                  {inMeetingFiles.length === 0 ? (
                    <p className="text-center py-12 text-xs text-white/40">
                      No files shared in this meeting yet.
                    </p>
                  ) : (
                    inMeetingFiles.map((file) => (
                      <div key={file.id} className="p-2.5 rounded-xl bg-white/5 text-xs space-y-1">
                        <p className="font-bold text-white truncate">{file.name}</p>
                        <p className="text-[10px] text-white/50">Shared by {file.sharedBy?.name || "Member"}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activePanel === "info" && (
                <div className="space-y-3 text-xs text-white/70">
                  <div>
                    <span className="font-bold text-white block mb-0.5">Meeting Code</span>
                    <p className="font-mono bg-white/5 p-2 rounded-lg text-white/90">{meetingId}</p>
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">Direct URL</span>
                    <p className="break-all bg-white/5 p-2 rounded-lg text-[11px] text-white/90">
                      {window.location.href}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Meeting Control Bar */}
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
            onClick={toggleMicrophone}
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
            onClick={toggleCamera}
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
            onClick={handleToggleScreenShare}
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
            onClick={handleLeave}
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
              onClick={handleEndForAll}
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
    </div>
  );
}
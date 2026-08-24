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
import { ConnectMeeting, ConnectUser } from "@/types/connect";
import { useWebRTC } from "@/hooks/useWebRTC";
import { MessageBubble } from "./MessageBubble";
import { FileCard } from "./FileCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  PreJoinScreen,
  MeetingHeader,
  VideoGrid,
  SideDrawer,
  MeetingControls,
  AIMeetingSummary,
} from "./meeting-room";

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

  // ----------------------------------------------------
  // PRE-JOIN SCREEN
  // ----------------------------------------------------
  if (!isJoined) {
    return (
      <PreJoinScreen
        activeMeeting={activeMeeting}
        currentConnectUser={currentConnectUser}
        localStream={localStream}
        isCameraOff={isCameraOff}
        isMuted={isMuted}
        toggleMicrophone={toggleMicrophone}
        toggleCamera={toggleCamera}
        onJoin={handleJoin}
        onCancel={() => navigate("/connect/meetings")}
      />
    );
  }

  // ----------------------------------------------------
  // IN-MEETING ROOM SCREEN
  // ----------------------------------------------------
  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white rounded-2xl border border-border/60 overflow-hidden select-none shadow-2xl relative">
      {/* Top Meeting Header */}
      <MeetingHeader
        activeMeeting={activeMeeting}
        meetingDuration={meetingDuration}
        currentUserId={currentUserId}
        aiSummary={aiSummary}
        setAiSummary={setAiSummary}
        isGeneratingSummary={isGeneratingSummary}
        onGenerateSummary={handleGenerateSummary}
        onCopyMeetingLink={handleCopyMeetingLink}
        copiedLink={copiedLink}
      />

      {/* Main Grid + Side Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Video Presentation / Grid */}
        <div className="flex-1 flex flex-col p-3 md:p-4 overflow-hidden relative justify-center items-center">
          <VideoGrid
            isSharing={isSharing}
            screenStream={screenStream}
            screenVideoRef={screenVideoRef}
            localStream={localStream}
            isCameraOff={isCameraOff}
            isMuted={isMuted}
            currentConnectUser={currentConnectUser}
            participantsList={participantsList}
            currentUserId={currentUserId}
          />

          {/* AI Meeting Summary Overlay Modal */}
          <AIMeetingSummary aiSummary={aiSummary} setAiSummary={setAiSummary} />
        </div>

        {/* In-Meeting Drawer Panels (Chat, Participants, Files, Info) */}
        <SideDrawer
          activePanel={activePanel}
          setActivePanel={setActiveDrawer}
          inMeetingMessages={inMeetingMessages}
          inMeetingFiles={inMeetingFiles}
          participantsList={participantsList}
          activeMeeting={activeMeeting}
          currentUserId={currentUserId}
          inMeetingChatMessage={inMeetingChatMessage}
          setInMeetingChatMessage={setInMeetingChatMessage}
          chatScrollRef={chatScrollRef}
          onSendChatMessage={handleSendChatMessage}
        />
      </div>

      {/* Bottom Meeting Control Bar */}
      <MeetingControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        isSharing={isSharing}
        activePanel={activePanel}
        activeMeeting={activeMeeting}
        currentUserId={currentUserId}
        onToggleMicrophone={toggleMicrophone}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onLeave={handleLeave}
        onEndForAll={handleEndForAll}
      />
    </div>
  );
}
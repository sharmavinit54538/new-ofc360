import { useAppDispatch, useAppSelector } from "@/app/hooks";
import * as connectActions from "./connectSlice";
import * as callActions from "./callSlice";
import * as meetingActions from "./meetingSlice";
import * as presenceActions from "./presenceSlice";
import * as websocketActions from "./websocketSlice";
import * as soundActions from "./soundSettingsSlice";
import * as selectors from "./selectors";
import { useCallback } from "react";
import { ConnectMessage, ConnectUser, MailArtifactDraft, PresenceStatus } from "@/types/connect";

export function useConnect() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectors.selectConnectState);

  const setActiveTab = useCallback(
    (tab: connectActions.ConnectTab) => dispatch(connectActions.setActiveTab(tab)),
    [dispatch]
  );

  const setActiveConversationId = useCallback(
    (id: string | null) => dispatch(connectActions.setActiveConversationId(id)),
    [dispatch]
  );

  const setActiveChannelId = useCallback(
    (id: string | null) => dispatch(connectActions.setActiveChannelId(id)),
    [dispatch]
  );

  const setActiveMeetingId = useCallback(
    (id: string | null) => dispatch(connectActions.setActiveMeetingId(id)),
    [dispatch]
  );

  const setActiveThreadMessage = useCallback(
    (msg: ConnectMessage | null) => dispatch(connectActions.setActiveThreadMessage(msg)),
    [dispatch]
  );

  const setIsNewChatOpen = useCallback(
    (open: boolean) => dispatch(connectActions.setIsNewChatOpen(open)),
    [dispatch]
  );

  const setIsNewChannelOpen = useCallback(
    (open: boolean) => dispatch(connectActions.setIsNewChannelOpen(open)),
    [dispatch]
  );

  const setIsNewMeetingOpen = useCallback(
    (open: boolean) => dispatch(connectActions.setIsNewMeetingOpen(open)),
    [dispatch]
  );

  const setIsSearchOpen = useCallback(
    (open: boolean) => dispatch(connectActions.setIsSearchOpen(open)),
    [dispatch]
  );

  const openMailArtifact = useCallback(
    (draft?: Partial<MailArtifactDraft>) => dispatch(connectActions.openMailArtifact(draft)),
    [dispatch]
  );

  const closeMailArtifact = useCallback(
    () => dispatch(connectActions.closeMailArtifact()),
    [dispatch]
  );

  const updateMailArtifact = useCallback(
    (draft: Partial<MailArtifactDraft>) => dispatch(connectActions.updateMailArtifact(draft)),
    [dispatch]
  );

  return {
    ...state,
    setActiveTab,
    setActiveConversationId,
    setActiveChannelId,
    setActiveMeetingId,
    setActiveThreadMessage,
    setIsNewChatOpen,
    setIsNewChannelOpen,
    setIsNewMeetingOpen,
    setIsSearchOpen,
    openMailArtifact,
    closeMailArtifact,
    updateMailArtifact,
  };
}

export function useConnectCall() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectors.selectCallState);

  const startOutgoingCall = useCallback(
    (targetUser: ConnectUser, type: "audio" | "video", callId?: string) =>
      dispatch(callActions.startOutgoingCall({ targetUser, type, callId })),
    [dispatch]
  );

  const receiveIncomingCall = useCallback(
    (caller: ConnectUser, type: "audio" | "video", callId?: string) =>
      dispatch(callActions.receiveIncomingCall({ caller, type, callId })),
    [dispatch]
  );

  const acceptIncomingCall = useCallback(
    () => dispatch(callActions.acceptIncomingCall()),
    [dispatch]
  );

  const rejectIncomingCall = useCallback(
    () => dispatch(callActions.rejectIncomingCall()),
    [dispatch]
  );

  const endCall = useCallback(
    () => dispatch(callActions.endCall()),
    [dispatch]
  );

  const toggleMute = useCallback(
    (muted?: boolean) => dispatch(callActions.toggleMute(muted)),
    [dispatch]
  );

  const toggleCamera = useCallback(
    (enabled?: boolean) => dispatch(callActions.toggleCamera(enabled)),
    [dispatch]
  );

  const toggleScreenShare = useCallback(
    (sharing?: boolean) => dispatch(callActions.toggleScreenShare(sharing)),
    [dispatch]
  );

  const toggleSpeaker = useCallback(
    (speakerOn?: boolean) => dispatch(callActions.toggleSpeaker(speakerOn)),
    [dispatch]
  );

  const incrementDuration = useCallback(
    () => dispatch(callActions.incrementCallDuration()),
    [dispatch]
  );

  const setOutgoingRinging = useCallback(
    () => dispatch(callActions.setOutgoingRinging()),
    [dispatch]
  );

  const setCallConnecting = useCallback(
    () => dispatch(callActions.setCallConnecting()),
    [dispatch]
  );

  const setCallConnected = useCallback(
    (callId?: string) => dispatch(callActions.setCallConnected({ callId })),
    [dispatch]
  );

  const setCallDeclined = useCallback(
    () => dispatch(callActions.setCallDeclined()),
    [dispatch]
  );

  const setCallMissed = useCallback(
    () => dispatch(callActions.setCallMissed()),
    [dispatch]
  );

  const setCallFailed = useCallback(
    (error?: string) => dispatch(callActions.setCallFailed(error)),
    [dispatch]
  );

  const resetCallState = useCallback(
    () => dispatch(callActions.resetCallState()),
    [dispatch]
  );

  return {
    ...state,
    startOutgoingCall,
    setOutgoingRinging,
    receiveIncomingCall,
    acceptIncomingCall,
    rejectIncomingCall,
    setCallConnecting,
    setCallConnected,
    setCallDeclined,
    setCallMissed,
    setCallFailed,
    endCall,
    resetCallState,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    toggleSpeaker,
    incrementDuration,
  };
}

export function useConnectPresence() {
  const dispatch = useAppDispatch();
  const currentUserPresence = useAppSelector(selectors.selectCurrentUserPresence);
  const userPresenceMap = useAppSelector(selectors.selectUserPresenceMap);
  const customStatusText = useAppSelector(selectors.selectCustomStatusText);

  const setCurrentUserPresence = useCallback(
    (status: PresenceStatus) => dispatch(presenceActions.setCurrentUserPresence(status)),
    [dispatch]
  );

  const setCustomStatusText = useCallback(
    (text: string) => dispatch(presenceActions.setCustomStatusText(text)),
    [dispatch]
  );

  const setUserPresence = useCallback(
    (userId: string, status: PresenceStatus) =>
      dispatch(presenceActions.setUserPresence({ userId, status })),
    [dispatch]
  );

  return {
    currentUserPresence,
    userPresenceMap,
    customStatusText,
    setCurrentUserPresence,
    setCustomStatusText,
    setUserPresence,
  };
}
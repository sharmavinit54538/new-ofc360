import { useLocation, useNavigate } from "react-router-dom";
import { useConnect } from "@/features/connect/hooks";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectMasterVolume,
  selectIsMutedAll,
  selectCallStatus,
  selectActiveCall,
  selectIncomingCall,
  selectCallRemoteUser,
  selectCallDuration,
  selectCallType,
} from "@/features/connect/selectors";
import { setIsSettingsOpen } from "@/features/connect/soundSettingsSlice";
import {
  useGetConversationsQuery,
  useGetChannelsQuery,
  useGetMeetingsQuery,
  useGetFilesQuery,
} from "@/services/api/connectApi";
import { Button } from "@/components/ui/button";
import { PresenceSelector } from "./PresenceSelector";
import {
  Search,
  Video,
  Sparkles,
  MessageSquare,
  Hash,
  PhoneCall,
  Calendar,
  Folder,
  Users,
  Volume2,
  VolumeX,
  Phone,
  PhoneForwarded,
} from "lucide-react";

export function ConnectHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { setIsSearchOpen, setIsNewMeetingOpen } = useConnect();

  const isMutedAll = useAppSelector(selectIsMutedAll);
  const masterVolume = useAppSelector(selectMasterVolume);

  // Call Status Selectors
  const callStatus = useAppSelector(selectCallStatus);
  const activeCall = useAppSelector(selectActiveCall);
  const incomingCall = useAppSelector(selectIncomingCall);
  const remoteUser = useAppSelector(selectCallRemoteUser);
  const callDuration = useAppSelector(selectCallDuration);
  const callType = useAppSelector(selectCallType);

  // RTK Query hooks
  const { data: conversations = [] } = useGetConversationsQuery();
  const { data: channels = [] } = useGetChannelsQuery();
  const { data: meetings = [] } = useGetMeetingsQuery();
  const { data: sharedFiles = [] } = useGetFilesQuery();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const isConnected = callStatus === "CONNECTED" || callStatus === "connected";
  const isOutgoing =
    callStatus === "OUTGOING_CALLING" ||
    callStatus === "OUTGOING_RINGING" ||
    callStatus === "calling";
  const isIncoming =
    callStatus === "INCOMING_RINGING" ||
    callStatus === "ringing" ||
    Boolean(incomingCall);

  const callPartnerName =
    remoteUser?.name ||
    activeCall?.targetUser?.name ||
    incomingCall?.caller?.name ||
    incomingCall?.targetUser?.name ||
    "Colleague";

  const tabs = [
    {
      id: "chat",
      label: "Chat",
      icon: MessageSquare,
      path: "/connect/chat",
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      id: "channels",
      label: "Channels",
      icon: Hash,
      path: "/connect/channels",
      count: channels.filter((c) => !c.isArchived).length,
    },
    { id: "calls", label: "Calls", icon: PhoneCall, path: "/connect/calls" },
    {
      id: "meetings",
      label: "Meetings",
      icon: Calendar,
      path: "/connect/meetings",
      count: meetings.length > 0 ? meetings.length : undefined,
    },
    {
      id: "files",
      label: "Files",
      icon: Folder,
      path: "/connect/files",
      count: sharedFiles.length > 0 ? sharedFiles.length : undefined,
    },
    { id: "contacts", label: "Contacts", icon: Users, path: "/connect/contacts" },
  ];

  return (
    <div className="h-16 px-4 md:px-6 border-b border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 select-none">
      {/* Horizontal Card Format Tabs */}
      <div className="flex items-center bg-secondary/60 p-1 rounded-xl border border-border/50 overflow-x-auto scrollbar-none max-w-full">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = location.pathname.startsWith(t.path);
          return (
            <button
              key={t.id}
              onClick={() => navigate(t.path)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-card text-primary shadow-sm font-bold border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span>{t.label}</span>
              {t.badge ? (
                <span className="text-[10px] bg-primary text-primary-foreground font-bold px-1.5 py-0.2 rounded-full">
                  {t.badge}
                </span>
              ) : t.count !== undefined && t.count > 0 ? (
                <span className="text-[10px] bg-muted text-muted-foreground font-semibold px-1.5 py-0.2 rounded-md">
                  {t.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Global In-Call / Status Indicator Banner */}
      {isConnected && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>In call with {callPartnerName}</span>
          <span className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
            {formatDuration(callDuration)}
          </span>
        </div>
      )}

      {isOutgoing && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <PhoneForwarded className="w-3.5 h-3.5 animate-bounce" />
          <span>Calling {callPartnerName}...</span>
        </div>
      )}

      {isIncoming && !isConnected && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-pulse">
          <Phone className="w-3.5 h-3.5 animate-bounce" />
          <span>Incoming call from {callPartnerName}</span>
        </div>
      )}

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Global Search Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSearchOpen(true)}
          className="h-8 px-2.5 text-xs text-muted-foreground border-border/60 gap-1.5 hidden lg:inline-flex"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="text-[9px] bg-muted border border-border/70 px-1 py-0.2 rounded font-mono">⌘K</kbd>
        </Button>

        {/* Presence Selector */}
        <PresenceSelector />

        {/* Connect Notification & Sound Settings Button */}
        <Button
          variant={isMutedAll ? "destructive" : "outline"}
          size="sm"
          onClick={() => dispatch(setIsSettingsOpen(true))}
          className={`h-8 px-2.5 text-xs border-border/60 gap-1.5 transition-all ${
            isMutedAll
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/40"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={isMutedAll ? "Connect Sounds Muted" : `Sound Settings (${masterVolume}%)`}
        >
          {isMutedAll ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-primary" />
          )}
          <span className="hidden md:inline font-semibold">{isMutedAll ? "Muted" : `${masterVolume}%`}</span>
        </Button>

        {/* Start Instant Meeting */}
        <Button
          size="sm"
          onClick={() => setIsNewMeetingOpen(true)}
          className="gradient-bg text-primary-foreground h-8 px-3 rounded-xl text-xs gap-1.5 font-semibold shadow-xs hidden sm:inline-flex"
        >
          <Video className="w-3.5 h-3.5" />
          <span>New Meeting</span>
        </Button>
      </div>
    </div>
  );
}
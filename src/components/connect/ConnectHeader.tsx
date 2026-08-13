import { useLocation, useNavigate } from "react-router-dom";
import { useConnectStore } from "@/stores/connectStore";
import { useConnectSoundStore } from "@/stores/connectSoundStore";
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
} from "lucide-react";

export function ConnectHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = useConnectStore((s) => s.activeTab);
  const setIsSearchOpen = useConnectStore((s) => s.setIsSearchOpen);
  const setIsNewMeetingOpen = useConnectStore((s) => s.setIsNewMeetingOpen);

  const isMutedAll = useConnectSoundStore((s) => s.isMutedAll);
  const masterVolume = useConnectSoundStore((s) => s.masterVolume);
  const setIsSoundSettingsOpen = useConnectSoundStore((s) => s.setIsSettingsOpen);

  const conversations = useConnectStore((s) => s.conversations);
  const channels = useConnectStore((s) => s.channels);
  const meetings = useConnectStore((s) => s.meetings);
  const sharedFiles = useConnectStore((s) => s.sharedFiles);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageSquare, path: "/connect/chat", badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { id: "channels", label: "Channels", icon: Hash, path: "/connect/channels", count: channels.filter((c) => !c.isArchived).length },
    { id: "calls", label: "Calls", icon: PhoneCall, path: "/connect/calls" },
    { id: "meetings", label: "Meetings", icon: Calendar, path: "/connect/meetings", count: meetings.length > 0 ? meetings.length : undefined },
    { id: "files", label: "Files", icon: Folder, path: "/connect/files", count: sharedFiles.length > 0 ? sharedFiles.length : undefined },
    { id: "contacts", label: "Contacts", icon: Users, path: "/connect/contacts" },
  ];

  const getSectionTitle = () => {
    switch (activeTab) {
      case "chat":
        return { label: "Chat & Messaging", icon: MessageSquare };
      case "channels":
        return { label: "Team Channels", icon: Hash };
      case "calls":
        return { label: "Calls & Voice", icon: PhoneCall };
      case "meetings":
        return { label: "Meetings & Video Rooms", icon: Calendar };
      case "files":
        return { label: "Shared Files Hub", icon: Folder };
      case "contacts":
        return { label: "Colleagues & Directory", icon: Users };
      default:
        return { label: "OFC360 Connect", icon: Sparkles };
    }
  };

  const currentSection = getSectionTitle();
  const IconComponent = currentSection.icon;

  return (
    <div className="h-16 px-4 md:px-6 border-b border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 select-none">
      {/* Horizontal Card Format Tabs (Matching People Page Tab Style) */}
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
          onClick={() => setIsSoundSettingsOpen(true)}
          className={`h-8 px-2.5 text-xs border-border/60 gap-1.5 transition-all ${
            isMutedAll
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/40"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={isMutedAll ? "Connect Sounds Muted (Click to configure)" : `Notification Sound Settings (${masterVolume}%)`}
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

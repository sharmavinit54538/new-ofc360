import { useConnectStore } from "@/stores/connectStore";
import { Button } from "@/components/ui/button";
import { PresenceSelector } from "./PresenceSelector";
import { NotificationPanel } from "./NotificationPanel";
import {
  Search,
  Plus,
  Video,
  Sparkles,
  MessageSquare,
  Hash,
  PhoneCall,
  Calendar,
  FolderArchive,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ConnectHeader() {
  const navigate = useNavigate();
  const activeTab = useConnectStore((s) => s.activeTab);
  const setIsSearchOpen = useConnectStore((s) => s.setIsSearchOpen);
  const setIsNewChatOpen = useConnectStore((s) => s.setIsNewChatOpen);
  const setIsNewChannelOpen = useConnectStore((s) => s.setIsNewChannelOpen);
  const setIsNewMeetingOpen = useConnectStore((s) => s.setIsNewMeetingOpen);

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
        return { label: "Shared Files Hub", icon: FolderArchive };
      case "contacts":
        return { label: "Colleagues & Directory", icon: Users };
      default:
        return { label: "OFC360 Connect", icon: Sparkles };
    }
  };

  const currentSection = getSectionTitle();
  const IconComponent = currentSection.icon;

  return (
    <div className="h-16 px-4 md:px-6 border-b border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 select-none">
      {/* Current Section Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-xs">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm md:text-base font-bold text-foreground truncate tracking-tight">
            {currentSection.label}
          </h1>
          <p className="text-[11px] text-muted-foreground hidden sm:block truncate">
            Unified Communication & Collaboration Workspace
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-full h-9 px-3 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/60 text-muted-foreground text-xs flex items-center justify-between transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search people, channels, files, or messages...</span>
          </div>
          <kbd className="text-[10px] bg-background border border-border/80 px-1.5 py-0.5 rounded font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Presence Selector */}
        <PresenceSelector />

        {/* Notifications */}
        <NotificationPanel />

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

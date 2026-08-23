import { NavLink, useLocation } from "react-router-dom";
import { useConnectStore } from "@/stores/connectStore";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Hash,
  PhoneCall,
  Video,
  FolderArchive,
  Users,
  Plus,
  Radio,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectSidebarProps {
  className?: string;
}

export function ConnectSidebar({ className = "" }: ConnectSidebarProps) {
  const location = useLocation();
  const conversations = useConnectStore((s) => s.conversations);
  const channels = useConnectStore((s) => s.channels);
  const meetings = useConnectStore((s) => s.meetings);
  const sharedFiles = useConnectStore((s) => s.sharedFiles);
  const setIsNewChatOpen = useConnectStore((s) => s.setIsNewChatOpen);
  const setIsNewChannelOpen = useConnectStore((s) => s.setIsNewChannelOpen);
  const setIsNewMeetingOpen = useConnectStore((s) => s.setIsNewMeetingOpen);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const NAV_ITEMS = [
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
    {
      id: "calls",
      label: "Calls",
      icon: PhoneCall,
      path: "/connect/calls",
    },
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
      icon: FolderArchive,
      path: "/connect/files",
      count: sharedFiles.length > 0 ? sharedFiles.length : undefined,
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: Users,
      path: "/connect/contacts",
    },
  ];

  return (
    <div
      className={`w-60 h-full flex flex-col bg-card/70 border-r border-border/70 select-none shrink-0 ${className}`}
    >
      {/* Quick Launch Actions */}
      <div className="p-3 border-b border-border/50 space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-full gradient-bg text-primary-foreground font-semibold text-xs h-9 rounded-xl shadow-xs gap-1.5 justify-between"
            >
              <div className="flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>New Action</span>
              </div>
              <span className="text-[10px] bg-primary-foreground/20 px-1.5 py-0.2 rounded font-mono">⌘N</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 p-1.5 text-xs rounded-xl shadow-xl border-border/80">
            <DropdownMenuItem
              onClick={() => setIsNewChatOpen(true)}
              className="cursor-pointer gap-2 py-2 font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              <span>New Direct Chat</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsNewChannelOpen(true)}
              className="cursor-pointer gap-2 py-2 font-medium"
            >
              <Hash className="w-3.5 h-3.5 text-indigo-500" />
              <span>New Channel</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsNewMeetingOpen(true)}
              className="cursor-pointer gap-2 py-2 font-medium"
            >
              <Video className="w-3.5 h-3.5 text-emerald-500" />
              <span>New Meeting</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation List (Card Format) */}
      <div className="flex-1 py-2 px-2 space-y-1.5 overflow-y-auto scrollbar-thin">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 block">
          Connect Modules
        </span>
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/connect" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                isActive
                  ? "bg-card text-primary shadow-sm font-bold border-border/60 ring-1 ring-border/50"
                  : "bg-card/40 text-muted-foreground border-border/30 hover:bg-card hover:text-foreground hover:border-border/60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "bg-muted/60 text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge ? (
                <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {item.badge}
                </span>
              ) : item.count !== undefined && item.count > 0 ? (
                <span className="text-[10px] bg-secondary text-secondary-foreground font-semibold px-2 py-0.5 rounded-md border border-border/40">
                  {item.count}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetConnectNotificationsQuery,
  useMarkNotificationReadMutation,
  useClearAllNotificationsMutation,
} from "@/services/api/connectApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  MessageSquare,
  PhoneCall,
  Video,
  AtSign,
  FileText,
  Hash,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { ConnectNotification } from "@/types/connect";

function formatRelativeTime(timestamp?: string): string {
  if (!timestamp) return "Just now";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return timestamp;
  }
}

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: rawNotifications = [] } = useGetConnectNotificationsQuery();
  const notifications = Array.isArray(rawNotifications) ? rawNotifications : [];
  const [markAsRead] = useMarkNotificationReadMutation();
  const [clearAll] = useClearAllNotificationsMutation();

  const unreadCount = notifications.filter((n) => !n?.read).length;

  const handleNotificationClick = (notif: ConnectNotification) => {
    if (!notif.read) {
      markAsRead(notif.id);
    }
    setOpen(false);

    if (notif.link) {
      navigate(notif.link);
    } else if (notif.channelId) {
      navigate(`/connect/channels/${notif.channelId}`);
    } else if (notif.conversationId) {
      navigate(`/connect/chat/${notif.conversationId}`);
    } else {
      navigate("/connect/chat");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "call":
        return <PhoneCall className="w-3.5 h-3.5 text-rose-500" />;
      case "meeting":
        return <Video className="w-3.5 h-3.5 text-indigo-500" />;
      case "mention":
        return <AtSign className="w-3.5 h-3.5 text-amber-500" />;
      case "file":
        return <FileText className="w-3.5 h-3.5 text-emerald-500" />;
      case "channel":
        return <Hash className="w-3.5 h-3.5 text-primary" />;
      case "message":
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const getContextLabel = (notif: ConnectNotification) => {
    if (notif.channelName) {
      return {
        label: `#${notif.channelName.replace(/^#/, "")}`,
        variant: "channel" as const,
      };
    }
    if (notif.channelId) {
      return {
        label: "#channel",
        variant: "channel" as const,
      };
    }
    if (notif.type === "mention") {
      return {
        label: "@Mention",
        variant: "mention" as const,
      };
    }
    if (notif.type === "call") {
      return {
        label: "Voice Call",
        variant: "call" as const,
      };
    }
    if (notif.type === "meeting") {
      return {
        label: "Meeting",
        variant: "meeting" as const,
      };
    }
    return {
      label: "Direct Message",
      variant: "dm" as const,
    };
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          title="Connect Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-84 sm:w-96 p-0 overflow-hidden shadow-2xl rounded-2xl border-border/80 bg-popover/95 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 px-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground tracking-tight">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearAll()}
                className="text-[11px] h-6 px-2 text-muted-foreground hover:text-destructive cursor-pointer"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* List of Notifications */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="text-center py-10 px-4 text-muted-foreground">
              <div className="w-10 h-10 rounded-2xl bg-muted/40 flex items-center justify-center mx-auto mb-2.5 border border-border/50">
                <Bell className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-xs font-semibold text-foreground">No new notifications</p>
              <p className="text-[11px] opacity-75 mt-0.5">You're completely caught up with all messages & calls.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const context = getContextLabel(notif);
              const messageContent =
                notif.description ||
                notif.content ||
                (notif as any).message ||
                (notif as any).body ||
                (notif as any).text;

              const senderInitials = notif.sender?.name
                ? notif.sender.name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "";

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-xs relative border ${
                    !notif.read
                      ? "bg-primary/5 hover:bg-primary/10 border-primary/20 shadow-xs"
                      : "hover:bg-accent/40 border-transparent text-muted-foreground"
                  }`}
                >
                  {/* Sender Avatar or Icon */}
                  <div className="relative shrink-0 mt-0.5">
                    {notif.sender?.avatar || senderInitials ? (
                      <Avatar className="w-8 h-8 border border-border/60">
                        <AvatarImage src={notif.sender?.avatar} alt={notif.sender?.name} />
                        <AvatarFallback className="text-[10px] bg-primary/15 text-primary font-bold">
                          {senderInitials || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-muted/70 flex items-center justify-center border border-border/50">
                        {getNotificationIcon(notif.type)}
                      </div>
                    )}
                    {!notif.read && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-1">
                    {/* Top Row: Title + Destination Pill */}
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs truncate ${
                          !notif.read ? "font-bold text-foreground" : "font-medium text-foreground"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-normal">
                        {formatRelativeTime(notif.timestamp)}
                      </span>
                    </div>

                    {/* Context Tag: Where it was sent ("Kis me msg kiya hai") */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                          context.variant === "channel"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : context.variant === "mention"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : context.variant === "call"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : "bg-muted/70 text-muted-foreground border border-border/40"
                        }`}
                      >
                        {context.variant === "channel" ? (
                          <Hash className="w-2.5 h-2.5" />
                        ) : (
                          <MessageSquare className="w-2.5 h-2.5" />
                        )}
                        <span>{context.label}</span>
                      </span>
                    </div>

                    {/* Message Preview: What was sent ("Kya kiya hai") */}
                    {messageContent ? (
                      <p className="text-[11px] text-foreground/80 line-clamp-2 leading-relaxed bg-muted/30 px-2 py-1 rounded-md border border-border/30 font-normal">
                        {messageContent}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic">
                        Click to view conversation
                      </p>
                    )}
                  </div>

                  {/* Hover Arrow Indicator */}
                  <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
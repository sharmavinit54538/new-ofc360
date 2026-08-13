import { useConnectStore } from "@/stores/connectStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, PhoneCall, Video, AtSign, FileText, Check, Trash2 } from "lucide-react";

export function NotificationPanel() {
  const notifications = useConnectStore((s) => s.notifications);
  const markAsRead = useConnectStore((s) => s.markNotificationAsRead);
  const clearAll = useConnectStore((s) => s.clearAllNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
      case "message":
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
          title="Connect Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden shadow-xl rounded-2xl border-border/80">
        <div className="flex items-center justify-between p-3 px-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-[11px] h-6 px-2 text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-6 h-6 mx-auto mb-1.5 opacity-30" />
              <p className="text-xs font-medium">No new notifications</p>
              <p className="text-[11px] opacity-75">You're completely caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors cursor-pointer text-xs ${
                  !notif.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-accent/40"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-foreground truncate ${!notif.read ? "text-primary" : ""}`}>
                    {notif.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                    {notif.description}
                  </p>
                  <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                    {notif.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

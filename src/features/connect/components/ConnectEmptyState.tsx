import { LucideIcon, MessageSquare, Hash, Calendar, FolderArchive, PhoneCall, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type EmptyStateVariant = "chats" | "messages" | "channels" | "meetings" | "files" | "calls" | "contacts" | "thread" | "custom";

interface ConnectEmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const PRESETS: Record<Exclude<EmptyStateVariant, "custom">, { icon: LucideIcon; title: string; description: string }> = {
  chats: {
    icon: MessageSquare,
    title: "No conversations yet",
    description: "Start a new conversation with your colleagues to begin collaborating.",
  },
  messages: {
    icon: MessageSquare,
    title: "No messages yet",
    description: "Send a message to start the conversation.",
  },
  channels: {
    icon: Hash,
    title: "No channels yet",
    description: "Create a channel to collaborate with your team, share announcements, and discuss topics.",
  },
  meetings: {
    icon: Calendar,
    title: "No upcoming meetings",
    description: "Schedule a team sync, client call, or start an instant video room right now.",
  },
  files: {
    icon: FolderArchive,
    title: "No shared files yet",
    description: "Documents, images, and videos shared across your chats and channels will appear here.",
  },
  calls: {
    icon: PhoneCall,
    title: "No call history",
    description: "Start an audio or video call with anyone on your team to see your call log here.",
  },
  contacts: {
    icon: Users,
    title: "No contacts found",
    description: "Try adjusting your search criteria or department filter.",
  },
  thread: {
    icon: MessageCircle,
    title: "No thread selected",
    description: "Click \"Reply in thread\" on any message to view or participate in focused discussions.",
  },
};

export function ConnectEmptyState({
  variant = "chats",
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = "",
}: ConnectEmptyStateProps) {
  const preset = variant !== "custom" ? PRESETS[variant] : null;
  const IconComponent = icon || preset?.icon || MessageSquare;
  const displayTitle = title || preset?.title || "No items found";
  const displayDescription = description || preset?.description || "";

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center min-h-[280px] select-none ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center mb-4 text-muted-foreground shadow-sm">
        <IconComponent className="w-7 h-7 text-primary/70" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5 tracking-tight">{displayTitle}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5 leading-relaxed">{displayDescription}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="gradient-bg text-primary-foreground font-medium shadow-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
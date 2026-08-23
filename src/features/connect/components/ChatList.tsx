import { useState, useMemo, useEffect } from "react";
import { useConnect } from "@/features/connect/hooks";
import { useAppSelector } from "@/app/hooks";
import { selectUserPresenceMap } from "@/features/connect/selectors";
import {
  useGetConversationsQuery,
  usePinConversationMutation,
  useMuteConversationMutation,
} from "@/services/api/connectApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Pin, BellOff, Bell, MoreVertical } from "lucide-react";
import { PresenceIndicator } from "./PresenceIndicator";
import { ConnectEmptyState } from "./ConnectEmptyState";
import { ConnectErrorState } from "./ConnectErrorState";
import { formatConversationTime } from "@/utils/formatTime";
import { toast } from "sonner";

interface ChatListProps {
  onSelectConversation?: (conversationId: string) => void;
  className?: string;
}

export function ChatList({ onSelectConversation, className = "" }: ChatListProps) {
  const [search, setSearch] = useState("");
  const { activeConversationId, setActiveConversationId, setIsNewChatOpen } = useConnect();

  // RTK Query hooks
  const {
    data: conversations = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetConversationsQuery();
  const [pinConversation] = usePinConversationMutation();
  const [muteConversation] = useMuteConversationMutation();

  useEffect(() => {
    console.log(`[CHAT_INIT] ChatList state updated. Total conversations: ${conversations.length}`);
    if (isError) {
      console.error("[CHAT_CONVERSATIONS] Error fetching conversations:", error);
    }
  }, [conversations.length, isError, error]);

  const userPresenceMap = useAppSelector(selectUserPresenceMap);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        (c.participant?.name && c.participant.name.toLowerCase().includes(q)) ||
        (c.participant?.email && c.participant.email.toLowerCase().includes(q)) ||
        (c.participant?.role && c.participant.role.toLowerCase().includes(q)) ||
        (c.participant?.department && c.participant.department.toLowerCase().includes(q)) ||
        (c.lastMessage && c.lastMessage.content?.toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const handleSelect = (id: string) => {
    setActiveConversationId(id);
    onSelectConversation?.(id);
  };

  const handleTogglePin = async (e: React.MouseEvent, convId: string, currentPinned?: boolean) => {
    e.stopPropagation();
    try {
      await pinConversation({ conversationId: convId, isPinned: !currentPinned }).unwrap();
      toast.success(currentPinned ? "Unpinned conversation" : "Pinned conversation");
    } catch {
      toast.error("Failed to update pin state");
    }
  };

  const handleToggleMute = async (e: React.MouseEvent, convId: string, currentMuted?: boolean) => {
    e.stopPropagation();
    try {
      await muteConversation({ conversationId: convId, isMuted: !currentMuted }).unwrap();
      toast.success(currentMuted ? "Unmuted conversation" : "Muted conversation");
    } catch {
      toast.error("Failed to update mute state");
    }
  };

  return (
    <div className={`h-full flex flex-col bg-card/60 border-r border-border/70 select-none ${className}`}>
      {/* Header & New Chat button */}
      <div className="p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground tracking-tight">Direct Messages</span>
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
            {conversations.length}
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => setIsNewChatOpen(true)}
          className="gradient-bg text-primary-foreground h-7 px-2.5 rounded-lg text-xs gap-1 shadow-sm font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-border/40 bg-muted/20">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="pl-8 text-xs h-8 bg-background/80 rounded-xl border-border/60"
          />
        </div>
      </div>

      {/* Conversations Stream */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-card/60 animate-pulse border border-border/40" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-4">
            <ConnectErrorState
              variant="connection_failed"
              title="Failed to Load Conversations"
              description="Could not connect to conversation service. Please check your connection."
              onRetry={() => refetch()}
            />
          </div>
        ) : conversations.length === 0 ? (
          <ConnectEmptyState
            variant="chats"
            actionLabel="Start a Conversation"
            onAction={() => setIsNewChatOpen(true)}
          />
        ) : filteredConversations.length === 0 ? (
          <p className="text-center py-8 text-xs text-muted-foreground">No conversations match "{search}"</p>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const participantName = conv.participant?.name || "Colleague";
            const initials = participantName
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "U";

            return (
              <div
                key={conv.id}
                onClick={() => handleSelect(conv.id)}
                className={`group w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left relative cursor-pointer ${
                  isActive
                    ? "bg-primary/10 border border-primary/30 text-foreground font-medium shadow-xs"
                    : "hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Avatar & Presence */}
                <div className="relative shrink-0">
                  <Avatar className="w-9 h-9 border border-border/50">
                    <AvatarImage src={conv.participant?.avatar} alt={participantName} />
                    <AvatarFallback className="text-xs bg-primary/15 text-primary font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {(() => {
                    const pId = conv.participant?.id;
                    const pUserId = conv.participant?.userId;
                    const pEmail = conv.participant?.email?.toLowerCase();
                    const dynamicPresence =
                      (pId && userPresenceMap[pId]) ||
                      (pUserId && userPresenceMap[pUserId]) ||
                      (pEmail && userPresenceMap[pEmail]) ||
                      conv.participant?.presence ||
                      "offline";

                    return (
                      <PresenceIndicator
                        status={dynamicPresence}
                        size="sm"
                        withPulse={dynamicPresence === "online"}
                        className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background"
                      />
                    );
                  })()}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-xs truncate ${isActive ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
                      {conv.participant?.name || "Colleague"}
                    </p>
                    {(conv.lastMessage?.timestamp || conv.updatedAt) && (
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                        {formatConversationTime(conv.lastMessage?.timestamp || conv.updatedAt)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground truncate leading-tight">
                      {conv.lastMessage
                        ? conv.lastMessage.isVoiceMessage
                          ? "🎤 Voice message"
                          : conv.lastMessage.content
                        : `${conv.participant.role || "Team Member"}`}
                    </p>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                      {conv.isPinned && (
                        <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />
                      )}
                      {conv.isMuted && (
                        <BellOff className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="w-6 h-6 rounded-md">
                        <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 text-xs">
                      <DropdownMenuItem onClick={(e) => handleTogglePin(e, conv.id, conv.isPinned)}>
                        <Pin className="w-3.5 h-3.5 mr-2" />
                        <span>{conv.isPinned ? "Unpin" : "Pin to top"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleToggleMute(e, conv.id, conv.isMuted)}>
                        {conv.isMuted ? <Bell className="w-3.5 h-3.5 mr-2" /> : <BellOff className="w-3.5 h-3.5 mr-2" />}
                        <span>{conv.isMuted ? "Unmute" : "Mute notifications"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
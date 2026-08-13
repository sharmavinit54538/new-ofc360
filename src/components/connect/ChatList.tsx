import { useState, useMemo } from "react";
import { useConnectStore } from "@/stores/connectStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, MessageSquare, Pin } from "lucide-react";
import { PresenceIndicator } from "./PresenceIndicator";
import { ConnectEmptyState } from "./ConnectEmptyState";

interface ChatListProps {
  onSelectConversation?: (conversationId: string) => void;
  className?: string;
}

export function ChatList({ onSelectConversation, className = "" }: ChatListProps) {
  const [search, setSearch] = useState("");
  const conversations = useConnectStore((s) => s.conversations);
  const activeConversationId = useConnectStore((s) => s.activeConversationId);
  const setActiveConversationId = useConnectStore((s) => s.setActiveConversationId);
  const setIsNewChatOpen = useConnectStore((s) => s.setIsNewChatOpen);

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        c.participant.name.toLowerCase().includes(q) ||
        (c.participant.role && c.participant.role.toLowerCase().includes(q)) ||
        (c.participant.department && c.participant.department.toLowerCase().includes(q)) ||
        (c.lastMessage && c.lastMessage.content.toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const handleSelect = (id: string) => {
    setActiveConversationId(id);
    onSelectConversation?.(id);
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
        {conversations.length === 0 ? (
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
            const initials = conv.participant.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => handleSelect(conv.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left relative ${
                  isActive
                    ? "bg-primary/10 border border-primary/30 text-foreground font-medium shadow-xs"
                    : "hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Avatar & Presence */}
                <div className="relative shrink-0">
                  <Avatar className="w-9 h-9 border border-border/50">
                    <AvatarImage src={conv.participant.avatar} alt={conv.participant.name} />
                    <AvatarFallback className="text-xs bg-primary/15 text-primary font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <PresenceIndicator
                    status={conv.participant.presence || "online"}
                    size="sm"
                    className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-xs truncate ${isActive ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
                      {conv.participant.name}
                    </p>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                        {conv.lastMessage.timestamp}
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
                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 ml-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {conv.isPinned && (
                  <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0 ml-1" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

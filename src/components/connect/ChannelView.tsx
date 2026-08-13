import { useMemo, useRef, useEffect, useState } from "react";
import { useConnectStore } from "@/stores/connectStore";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pin, Search, X } from "lucide-react";
import { ChannelHeader } from "./ChannelHeader";
import { MessageBubble } from "./MessageBubble";
import { ChatComposer } from "./ChatComposer";
import { ConnectEmptyState } from "./ConnectEmptyState";

interface ChannelViewProps {
  channelId?: string | null;
  className?: string;
}

export function ChannelView({ channelId, className = "" }: ChannelViewProps) {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ? String(currentUser.id) : "usr_current";

  const channels = useConnectStore((s) => s.channels);
  const activeChannelId = channelId || useConnectStore((s) => s.activeChannelId);
  const messagesMap = useConnectStore((s) => s.messages);
  const sendMessage = useConnectStore((s) => s.sendMessage);
  const toggleReaction = useConnectStore((s) => s.toggleReaction);
  const togglePinMessage = useConnectStore((s) => s.togglePinMessage);
  const deleteMessage = useConnectStore((s) => s.deleteMessage);
  const setActiveThreadMessage = useConnectStore((s) => s.setActiveThreadMessage);

  const [messageSearch, setMessageSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const activeChannel = useMemo(() => {
    return channels.find((c) => c.id === activeChannelId);
  }, [channels, activeChannelId]);

  const rawMessages = useMemo(() => {
    if (!activeChannelId) return [];
    return messagesMap[activeChannelId] || [];
  }, [messagesMap, activeChannelId]);

  const pinnedMessages = useMemo(() => {
    return rawMessages.filter((m) => m.isPinned);
  }, [rawMessages]);

  const filteredMessages = useMemo(() => {
    if (!messageSearch.trim()) return rawMessages;
    const q = messageSearch.toLowerCase();
    return rawMessages.filter((m) => m.content.toLowerCase().includes(q));
  }, [rawMessages, messageSearch]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rawMessages.length]);

  if (!activeChannel) {
    return (
      <div className={`flex-1 flex items-center justify-center p-8 bg-card/30 ${className}`}>
        <ConnectEmptyState
          variant="channels"
          title="No Channel Selected"
          description="Choose a channel from the left sidebar to view discussions and announcements."
        />
      </div>
    );
  }

  const currentConnectUser: ConnectUser = {
    id: currentUserId,
    name: currentUser?.name || currentUser?.email?.split("@")[0] || "User",
    email: currentUser?.email || "",
    role: currentUser?.role,
  };

  const handleSendMessage = (payload: {
    content: string;
    attachments?: any[];
    isVoiceMessage?: boolean;
    voiceDuration?: number;
  }) => {
    sendMessage({
      targetId: activeChannel.id,
      sender: currentConnectUser,
      content: payload.content,
      attachments: payload.attachments,
      isVoiceMessage: payload.isVoiceMessage,
      voiceDuration: payload.voiceDuration,
    });
  };

  return (
    <div className={`flex-1 flex flex-col h-full bg-background/90 overflow-hidden select-none ${className}`}>
      {/* Channel Header */}
      <ChannelHeader channel={activeChannel} onToggleSearch={() => setShowSearch(!showSearch)} />

      {/* Optional Search Bar */}
      {showSearch && (
        <div className="p-2 px-4 border-b border-border/50 bg-muted/20 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={messageSearch}
            onChange={(e) => setMessageSearch(e.target.value)}
            placeholder={`Search messages in #${activeChannel.name}...`}
            className="h-7 text-xs bg-background/80 rounded-lg border-border/60 flex-1"
            autoFocus
          />
          {messageSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessageSearch("")}
              className="text-[11px] h-6 px-1.5 text-muted-foreground"
            >
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Pinned Messages Banner */}
      {pinnedMessages.length > 0 && (
        <div className="p-2 px-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500" />
            <span className="font-semibold text-foreground">Pinned:</span>
            <span className="text-muted-foreground truncate">{pinnedMessages[0].content}</span>
          </div>
          {pinnedMessages.length > 1 && (
            <span className="text-[11px] text-amber-600 font-bold shrink-0">
              +{pinnedMessages.length - 1} more
            </span>
          )}
        </div>
      )}

      {/* Channel Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {rawMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <ConnectEmptyState
              variant="custom"
              title={`Welcome to #${activeChannel.name}!`}
              description={
                activeChannel.description ||
                "This is the start of this channel. Send a message to get the discussion rolling."
              }
            />
          </div>
        ) : filteredMessages.length === 0 ? (
          <p className="text-center py-12 text-xs text-muted-foreground">
            No messages match "{messageSearch}"
          </p>
        ) : (
          filteredMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOutgoing={msg.senderId === currentUserId}
              currentUserId={currentUserId}
              onReplyInThread={(m) => setActiveThreadMessage(m)}
              onToggleReaction={(msgId, emoji) =>
                toggleReaction(activeChannel.id, msgId, emoji, currentUserId)
              }
              onTogglePin={(msgId) => togglePinMessage(activeChannel.id, msgId)}
              onDelete={(msgId) => deleteMessage(activeChannel.id, msgId)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <ChatComposer
        onSendMessage={handleSendMessage}
        placeholder={`Message #${activeChannel.name}...`}
      />
    </div>
  );
}

import { useMemo, useRef, useEffect, useState } from "react";
import { useConnect } from "@/features/connect/hooks";
import {
  useGetChannelQuery,
  useGetChannelMessagesQuery,
  useSendChannelMessageMutation,
  useToggleReactionMutation,
  usePinMessageMutation,
  useDeleteMessageMutation,
} from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pin, Search } from "lucide-react";
import { ChannelHeader } from "./ChannelHeader";
import { MessageBubble } from "./MessageBubble";
import { ChatComposer } from "./ChatComposer";
import { ConnectEmptyState } from "./ConnectEmptyState";
import { toast } from "sonner";

interface ChannelViewProps {
  channelId?: string | null;
  className?: string;
}

export function ChannelView({ channelId, className = "" }: ChannelViewProps) {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ? String(currentUser.id) : "usr_current";

  const { activeChannelId: storeChannelId, setActiveThreadMessage } = useConnect();
  const activeChannelId = channelId || storeChannelId;

  const [messageSearch, setMessageSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // RTK Query hooks
  const { data: channel, isLoading: isChannelLoading } = useGetChannelQuery(activeChannelId || "", {
    skip: !activeChannelId,
  });

  const { data: messages = [], isLoading: isMessagesLoading } = useGetChannelMessagesQuery(
    {
      channelId: activeChannelId || "",
      search: messageSearch.length >= 2 ? messageSearch : undefined,
    },
    { skip: !activeChannelId }
  );

  const [sendChannelMessage] = useSendChannelMessageMutation();
  const [toggleReaction] = useToggleReactionMutation();
  const [pinMessage] = usePinMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const pinnedMessages = useMemo(() => {
    return messages.filter((m) => m.isPinned);
  }, [messages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!activeChannelId) {
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

  const handleSendMessage = async (payload: {
    content: string;
    attachments?: any[];
    isVoiceMessage?: boolean;
    voiceDuration?: number;
  }) => {
    try {
      await sendChannelMessage({
        channelId: activeChannelId,
        content: payload.content,
        attachments: payload.attachments,
        isVoiceMessage: payload.isVoiceMessage,
        voiceDuration: payload.voiceDuration,
      }).unwrap();
    } catch {
      toast.error("Failed to send channel message.");
    }
  };

  const channelObj = channel || {
    id: activeChannelId,
    name: "channel",
    description: "",
    isPrivate: false,
    createdBy: currentUserId,
    createdAt: new Date().toISOString(),
    members: [],
  };

  return (
    <div className={`flex-1 flex flex-col h-full bg-background/90 overflow-hidden select-none ${className}`}>
      {/* Channel Header */}
      <ChannelHeader channel={channelObj} onToggleSearch={() => setShowSearch(!showSearch)} />

      {/* Optional Search Bar */}
      {showSearch && (
        <div className="p-2 px-4 border-b border-border/50 bg-muted/20 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={messageSearch}
            onChange={(e) => setMessageSearch(e.target.value)}
            placeholder={`Search messages in #${channelObj.name}...`}
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
        {isMessagesLoading ? (
          <div className="space-y-2 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-card/60 animate-pulse border border-border/40" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <ConnectEmptyState
              variant="custom"
              title={`Welcome to #${channelObj.name}!`}
              description={
                channelObj.description ||
                "This is the start of this channel. Send a message to get the discussion rolling."
              }
            />
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOutgoing={msg.senderId === currentUserId}
              currentUserId={currentUserId}
              onReplyInThread={(m) => setActiveThreadMessage(m)}
              onToggleReaction={(msgId, emoji) =>
                toggleReaction({
                  messageId: msgId,
                  emoji,
                  conversationId: activeChannelId,
                })
              }
              onTogglePin={(msgId) =>
                pinMessage({
                  messageId: msgId,
                  isPinned: !msg.isPinned,
                  conversationId: activeChannelId,
                })
              }
              onDelete={(msgId) =>
                deleteMessage({
                  messageId: msgId,
                  conversationId: activeChannelId,
                })
              }
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <ChatComposer
        onSendMessage={handleSendMessage}
        placeholder={`Message #${channelObj.name}...`}
      />
    </div>
  );
}

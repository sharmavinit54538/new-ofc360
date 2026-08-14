import { useMemo, useRef, useEffect, useState } from "react";
import { useConnect, useConnectCall } from "@/features/connect/hooks";
import { useAppSelector } from "@/app/hooks";
import { selectTargetTypingUsers } from "@/features/connect/selectors";
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useToggleReactionMutation,
  usePinMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
} from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser, ConnectMessage } from "@/types/connect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Pin,
  Sparkles,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PresenceIndicator } from "./PresenceIndicator";
import { MessageBubble } from "./MessageBubble";
import { ChatComposer } from "./ChatComposer";
import { ConnectEmptyState } from "./ConnectEmptyState";
import { toast } from "sonner";

interface ChatWindowProps {
  conversationId?: string | null;
  onOpenVideoCall?: (user: ConnectUser) => void;
  onOpenAudioCall?: (user: ConnectUser) => void;
  className?: string;
}

export function ChatWindow({
  conversationId,
  onOpenVideoCall,
  onOpenAudioCall,
  className = "",
}: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ? String(currentUser.id) : "usr_current";

  const { activeConversationId: storeConvId, setActiveThreadMessage } = useConnect();
  const { startOutgoingCall } = useConnectCall();

  const activeConversationId = conversationId || storeConvId;

  const [messageSearch, setMessageSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // RTK Query hooks
  const { data: conversations = [] } = useGetConversationsQuery();
  const {
    data: messages = [],
    isLoading: isMessagesLoading,
  } = useGetConversationMessagesQuery(
    {
      conversationId: activeConversationId || "",
      search: messageSearch.length >= 2 ? messageSearch : undefined,
    },
    { skip: !activeConversationId }
  );

  const [sendMessage] = useSendMessageMutation();
  const [markConversationRead] = useMarkConversationReadMutation();
  const [toggleReaction] = useToggleReactionMutation();
  const [pinMessage] = usePinMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [editMessage] = useEditMessageMutation();

  const typingUsers = useAppSelector((state) =>
    selectTargetTypingUsers(state, activeConversationId || "")
  );

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId);
  }, [conversations, activeConversationId]);

  // Mark conversation read automatically on load/view
  useEffect(() => {
    if (activeConversationId && activeConversation && activeConversation.unreadCount > 0) {
      markConversationRead(activeConversationId);
    }
  }, [activeConversationId, activeConversation?.unreadCount, markConversationRead]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!activeConversationId) {
    return (
      <div className={`flex-1 flex items-center justify-center p-8 bg-card/30 ${className}`}>
        <ConnectEmptyState
          variant="chats"
          title="No Conversation Selected"
          description="Select a colleague from the list or start a new chat to begin collaborating."
        />
      </div>
    );
  }

  const currentConnectUser: ConnectUser = {
    id: currentUserId,
    name: currentUser?.name || currentUser?.email?.split("@")[0] || "User",
    email: currentUser?.email || "",
    role: currentUser?.role,
    avatar: undefined,
  };

  const handleSendMessage = async (payload: {
    content: string;
    attachments?: any[];
    isVoiceMessage?: boolean;
    voiceDuration?: number;
  }) => {
    try {
      await sendMessage({
        conversationId: activeConversationId,
        content: payload.content,
        attachments: payload.attachments,
        isVoiceMessage: payload.isVoiceMessage,
        voiceDuration: payload.voiceDuration,
      }).unwrap();
    } catch {
      toast.error("Failed to send message.");
    }
  };

  const handleStartAudio = () => {
    if (!activeConversation) return;
    startOutgoingCall(activeConversation.participant, "audio");
    onOpenAudioCall?.(activeConversation.participant);
  };

  const handleStartVideo = () => {
    if (!activeConversation) return;
    startOutgoingCall(activeConversation.participant, "video");
    onOpenVideoCall?.(activeConversation.participant);
  };

  const participant = activeConversation?.participant || {
    id: "unknown",
    name: "Colleague",
    email: "",
  };

  const initials = participant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`flex-1 flex flex-col h-full bg-background/90 overflow-hidden select-none ${className}`}>
      {/* Header */}
      <div className="h-16 px-4 border-b border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
        {/* Recipient Profile */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <Avatar className="w-10 h-10 border border-border/60">
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback className="text-xs bg-primary/15 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <PresenceIndicator
              status={participant.presence || "online"}
              size="sm"
              className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground truncate">{participant.name}</h3>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {participant.role || "Team Member"} • {participant.department || "General"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {showSearch && (
            <div className="relative w-48 mr-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search messages..."
                className="pl-7 h-8 text-xs rounded-xl bg-muted/40 border-border/60"
                autoFocus
              />
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground"
            title="Search In Conversation"
          >
            <Search className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleStartAudio}
            className="w-8 h-8 rounded-xl text-primary hover:bg-primary/15"
            title="Audio Call"
          >
            <Phone className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleStartVideo}
            className="w-8 h-8 rounded-xl text-primary hover:bg-primary/15"
            title="Video Call"
          >
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {isMessagesLoading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-12 w-2/3 rounded-2xl bg-card/60 animate-pulse border border-border/40 ${
                  i % 2 === 0 ? "ml-auto" : "mr-auto"
                }`}
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <ConnectEmptyState
            variant="messages"
            title="No messages yet"
            description={`Say hello to ${participant.name} to kick off the conversation!`}
          />
        ) : (
          messages.map((message) => {
            const isOutgoing = message.senderId === currentUserId;
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOutgoing={isOutgoing}
                currentUserId={currentUserId}
                onReplyInThread={() => setActiveThreadMessage(message)}
                onToggleReaction={(msgId, emoji) =>
                  toggleReaction({ messageId: msgId, emoji, conversationId: activeConversationId })
                }
                onTogglePin={(msgId) =>
                  pinMessage({
                    messageId: msgId,
                    isPinned: !message.isPinned,
                    conversationId: activeConversationId,
                  })
                }
                onDelete={(msgId) =>
                  deleteMessage({ messageId: msgId, conversationId: activeConversationId })
                }
              />
            );
          })
        )}

        {/* Real-time Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground italic px-2 py-1">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-200" />
            </span>
            <span>{typingUsers.join(", ")} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <ChatComposer
        onSendMessage={handleSendMessage}
        placeholder={`Message ${participant.name}...`}
        recipientName={participant.name}
        recipientEmail={participant.email}
      />
    </div>
  );
}

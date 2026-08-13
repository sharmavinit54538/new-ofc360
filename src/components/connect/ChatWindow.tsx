import { useMemo, useRef, useEffect, useState } from "react";
import { useConnectStore } from "@/stores/connectStore";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
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
  ShieldCheck,
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

  const conversations = useConnectStore((s) => s.conversations);
  const activeConversationId = conversationId || useConnectStore((s) => s.activeConversationId);
  const messagesMap = useConnectStore((s) => s.messages);
  const sendMessage = useConnectStore((s) => s.sendMessage);
  const toggleReaction = useConnectStore((s) => s.toggleReaction);
  const togglePinMessage = useConnectStore((s) => s.togglePinMessage);
  const deleteMessage = useConnectStore((s) => s.deleteMessage);
  const setActiveThreadMessage = useConnectStore((s) => s.setActiveThreadMessage);
  const startCall = useConnectStore((s) => s.startCall);

  const [messageSearch, setMessageSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId);
  }, [conversations, activeConversationId]);

  const rawMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messagesMap[activeConversationId] || [];
  }, [messagesMap, activeConversationId]);

  // Filter messages by search if open
  const filteredMessages = useMemo(() => {
    if (!messageSearch.trim()) return rawMessages;
    const q = messageSearch.toLowerCase();
    return rawMessages.filter((m) => m.content.toLowerCase().includes(q));
  }, [rawMessages, messageSearch]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rawMessages.length]);

  if (!activeConversation) {
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

  const handleSendMessage = (payload: {
    content: string;
    attachments?: any[];
    isVoiceMessage?: boolean;
    voiceDuration?: number;
  }) => {
    sendMessage({
      targetId: activeConversation.id,
      sender: currentConnectUser,
      content: payload.content,
      attachments: payload.attachments,
      isVoiceMessage: payload.isVoiceMessage,
      voiceDuration: payload.voiceDuration,
    });
  };

  const handleStartAudio = () => {
    startCall(activeConversation.participant, "audio");
    onOpenAudioCall?.(activeConversation.participant);
  };

  const handleStartVideo = () => {
    startCall(activeConversation.participant, "video");
    onOpenVideoCall?.(activeConversation.participant);
  };

  const initials = activeConversation.participant.name
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
              <AvatarImage src={activeConversation.participant.avatar} alt={activeConversation.participant.name} />
              <AvatarFallback className="text-xs bg-primary/15 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <PresenceIndicator
              status={activeConversation.participant.presence || "online"}
              size="sm"
              className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground truncate">
                {activeConversation.participant.name}
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground font-medium hidden sm:inline-block">
                {activeConversation.participant.department || "General"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {activeConversation.participant.role || "Team Member"} •{" "}
              <span className="text-emerald-500 font-medium capitalize">
                {activeConversation.participant.presence || "Online"}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Audio Call */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStartAudio}
            className="h-8 px-2.5 rounded-lg text-xs gap-1.5 border-border/80 hover:bg-accent/40 text-foreground"
            title="Start Audio Call"
          >
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Audio</span>
          </Button>

          {/* Video Call */}
          <Button
            type="button"
            size="sm"
            onClick={handleStartVideo}
            className="gradient-bg text-primary-foreground h-8 px-2.5 rounded-lg text-xs gap-1.5 shadow-sm font-medium"
            title="Start Video Call"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Video Call</span>
          </Button>

          {/* Search in chat toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
            title="Search in conversation"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* More options menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1 text-xs">
              <DropdownMenuItem
                onClick={() => toast.info(`Email: ${activeConversation.participant.email}`)}
                className="cursor-pointer gap-2 py-1.5"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" /> Contact Info
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.success("Notification preferences updated")}
                className="cursor-pointer gap-2 py-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" /> Privacy & Security
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Optional Search Sub-Bar */}
      {showSearch && (
        <div className="p-2 px-4 border-b border-border/50 bg-muted/20 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={messageSearch}
            onChange={(e) => setMessageSearch(e.target.value)}
            placeholder="Search messages in this conversation..."
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

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {rawMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <ConnectEmptyState
              variant="chats"
              title="No messages yet"
              description={`Start a conversation with ${activeConversation.participant.name}.`}
            />
          </div>
        ) : filteredMessages.length === 0 ? (
          <p className="text-center py-12 text-xs text-muted-foreground">
            No messages found matching "{messageSearch}"
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
                toggleReaction(activeConversation.id, msgId, emoji, currentUserId)
              }
              onTogglePin={(msgId) => togglePinMessage(activeConversation.id, msgId)}
              onDelete={(msgId) => deleteMessage(activeConversation.id, msgId)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <ChatComposer
        onSendMessage={handleSendMessage}
        placeholder={`Message ${activeConversation.participant.name}...`}
        recipientName={activeConversation.participant.name}
        recipientEmail={activeConversation.participant.email}
      />
    </div>
  );
}

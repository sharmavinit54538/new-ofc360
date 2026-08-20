import { useMemo, useRef, useEffect, useState } from "react";
import { useConnect, useConnectCall } from "@/features/connect/hooks";
import { useAppSelector } from "@/app/hooks";
import { selectTargetTypingUsers, selectUserPresenceMap } from "@/features/connect/selectors";
import {
  useGetConversationsQuery,
  useGetColleaguesQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useToggleReactionMutation,
  usePinMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  isCurrentUser,
} from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser, ConnectMessage, PresenceStatus } from "@/types/connect";
import { connectCallOrchestrator } from "@/services/connectCallOrchestrator";
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
import { ConnectErrorState } from "./ConnectErrorState";
import { toast } from "sonner";

/**
 * Extracts a person's display name from various possible object structures:
 * - name, full_name, fullName, display_name, displayName
 * - first_name + last_name or firstName + lastName
 * - nested: participant, user, recipient, colleague, targetUser, otherUser, other_user
 * - email prefix, username
 */
function extractNameFromEntity(entity: any): string {
  if (!entity) return "";
  if (typeof entity === "string") {
    const trimmed = entity.trim();
    if (trimmed && trimmed.toLowerCase() !== "colleague" && trimmed.toLowerCase() !== "user") {
      return trimmed;
    }
    return "";
  }

  // 1. Direct name properties
  const directProps = [
    entity.name,
    entity.full_name,
    entity.fullName,
    entity.display_name,
    entity.displayName,
  ];
  for (const prop of directProps) {
    if (
      typeof prop === "string" &&
      prop.trim() &&
      prop.trim().toLowerCase() !== "colleague" &&
      prop.trim().toLowerCase() !== "user"
    ) {
      return prop.trim();
    }
  }

  // 2. Separate first & last names
  const firstName = (
    typeof entity.first_name === "string"
      ? entity.first_name
      : typeof entity.firstName === "string"
      ? entity.firstName
      : ""
  ).trim();
  const lastName = (
    typeof entity.last_name === "string"
      ? entity.last_name
      : typeof entity.lastName === "string"
      ? entity.lastName
      : ""
  ).trim();

  if (firstName || lastName) {
    const combined = `${firstName} ${lastName}`.trim();
    if (
      combined &&
      combined.toLowerCase() !== "colleague" &&
      combined.toLowerCase() !== "user"
    ) {
      return combined;
    }
  }

  // 3. Nested objects
  const nested =
    entity.participant ||
    entity.user ||
    entity.recipient ||
    entity.colleague ||
    entity.targetUser ||
    entity.target_user ||
    entity.otherUser ||
    entity.other_user;

  if (nested && typeof nested === "object") {
    const nestedName = extractNameFromEntity(nested);
    if (nestedName) return nestedName;
  }

  // 4. Email fallback
  const email =
    entity.email ||
    entity.emailAddress ||
    entity.user?.email ||
    entity.participant?.email;
  if (typeof email === "string" && email.includes("@")) {
    const prefix = email.split("@")[0].trim();
    if (prefix) return prefix;
  }

  // 5. Username fallback
  const username =
    entity.username || entity.user?.username || entity.participant?.username;
  if (typeof username === "string" && username.trim()) {
    return username.trim();
  }

  return "";
}

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
  const { data: colleaguesData } = useGetColleaguesQuery();
  const {
    data: messages = [],
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
    refetch: refetchMessages,
  } = useGetConversationMessagesQuery(
    {
      conversationId: activeConversationId || "",
      search: messageSearch.length >= 2 ? messageSearch : undefined,
    },
    { skip: !activeConversationId }
  );

  useEffect(() => {
    if (activeConversationId) {
      console.log(`[CHAT_INIT] ChatWindow active conversation: ${activeConversationId}`);
    }
    if (isMessagesError) {
      console.error(`[CHAT_MESSAGES] Error fetching messages for ${activeConversationId}:`, messagesError);
    }
  }, [activeConversationId, isMessagesError, messagesError]);

  const [sendMessage] = useSendMessageMutation();
  const [markConversationRead] = useMarkConversationReadMutation();
  const [toggleReaction] = useToggleReactionMutation();
  const [pinMessage] = usePinMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [editMessage] = useEditMessageMutation();

  const typingUsers = useAppSelector((state) =>
    selectTargetTypingUsers(state, activeConversationId || "")
  );
  const userPresenceMap = useAppSelector(selectUserPresenceMap);

  const colleaguesList: ConnectUser[] = useMemo(() => {
    if (Array.isArray(colleaguesData)) {
      return colleaguesData;
    } else if (colleaguesData && typeof colleaguesData === "object") {
      const src = colleaguesData as any;
      if (Array.isArray(src.colleagues)) return src.colleagues;
      if (Array.isArray(src.data?.colleagues)) return src.data.colleagues;
      if (Array.isArray(src.data)) return src.data;
      if (Array.isArray(src.items)) return src.items;
    }
    return [];
  }, [colleaguesData]);

  // Find active conversation from conversations query
  const activeConversation = useMemo(() => {
    if (!activeConversationId) return undefined;
    const targetId = String(activeConversationId);
    const cleanTargetId = targetId.replace(/^conv_/, "");

    return conversations.find((c: any) => {
      if (!c) return false;
      const cId = String(c.id || c._id || c.conversationId || "");
      const cleanCId = cId.replace(/^conv_/, "");
      if (
        cId === targetId ||
        cleanCId === cleanTargetId ||
        cId === cleanTargetId ||
        cleanCId === targetId
      ) {
        return true;
      }

      // Check participant/user/recipient ID inside conversation
      const pId = String(
        c.participant?.id ||
        c.participant?._id ||
        c.user?.id ||
        c.user?._id ||
        c.recipient?.id ||
        c.recipient?._id ||
        c.targetUser?.id ||
        c.targetUser?._id ||
        ""
      );
      if (pId && (pId === targetId || pId === cleanTargetId)) {
        return true;
      }

      // Check participants array
      if (Array.isArray(c.participants)) {
        return c.participants.some((p: any) => {
          const partId = String(p.id || p._id || "");
          return partId && (partId === targetId || partId === cleanTargetId);
        });
      }

      return false;
    });
  }, [conversations, activeConversationId]);

  // Resolve recipient entity across conversations, colleagues list, and message history
  const recipientEntity = useMemo(() => {
    if (!activeConversationId) return null;
    const targetId = String(activeConversationId);
    const cleanTargetId = targetId.replace(/^conv_/, "");

    // 1. From activeConversation (ensure we pick the non-current user)
    if (activeConversation) {
      const convAny = activeConversation as any;

      if (Array.isArray(convAny.participants) && convAny.participants.length > 0) {
        const other = convAny.participants.find(
          (p: any) => p && typeof p === "object" && !isCurrentUser(p, currentUser)
        );
        if (other) return other;
      }

      if (
        convAny.participant &&
        typeof convAny.participant === "object" &&
        !isCurrentUser(convAny.participant, currentUser)
      ) {
        return convAny.participant;
      }

      const candidates = [
        convAny.other_user,
        convAny.otherUser,
        convAny.recipient,
        convAny.target_user,
        convAny.targetUser,
        convAny.colleague,
        convAny.user,
        convAny.sender,
        convAny.receiver,
      ];
      for (const c of candidates) {
        if (c && typeof c === "object" && !isCurrentUser(c, currentUser)) {
          return c;
        }
      }
    }

    // 2. From colleagues list (find colleague matching targetId who is NOT current user)
    if (colleaguesList.length > 0) {
      const matchedColleague = colleaguesList.find((emp: any) => {
        if (isCurrentUser(emp, currentUser)) return false;
        const empId = String(emp.id || emp._id || emp.userId || emp.user_id || "");
        const cleanEmpId = empId.replace(/^conv_/, "");
        return (
          empId === targetId ||
          cleanEmpId === cleanTargetId ||
          empId === cleanTargetId ||
          (emp.email && emp.email.toLowerCase() === targetId.toLowerCase())
        );
      });
      if (matchedColleague) return matchedColleague;
    }

    // 3. From message history: find any message where sender is NOT the current user
    if (messages.length > 0) {
      const otherMsg = messages.find(
        (m) =>
          !isCurrentUser(
            m.senderId || (m as any).sender_id || (m as any).user_id,
            currentUser
          ) && m.senderName
      );
      if (otherMsg) {
        return {
          id: otherMsg.senderId,
          name: otherMsg.senderName,
          avatar: otherMsg.senderAvatar,
        };
      }
    }

    // 4. Fallback if activeConversation.participant is available
    if (
      activeConversation?.participant &&
      !isCurrentUser(activeConversation.participant, currentUser)
    ) {
      return activeConversation.participant;
    }

    return activeConversation?.participant || null;
  }, [activeConversation, activeConversationId, colleaguesList, messages, currentUser]);

  // Recipient Display Name
  const recipientName = useMemo(() => {
    const extracted = extractNameFromEntity(recipientEntity);
    if (extracted) return extracted;

    if (activeConversation) {
      const fromConv = extractNameFromEntity(activeConversation);
      if (fromConv) return fromConv;
    }

    // Fallback: use user identifier without hardcoding "Colleague"
    if (activeConversationId) {
      return String(activeConversationId).replace(/^conv_/, "");
    }

    return "";
  }, [recipientEntity, activeConversation, activeConversationId]);

  // Recipient Role / Subtitle
  const recipientRole = useMemo(() => {
    const rawRole =
      (recipientEntity as any)?.role ||
      (recipientEntity as any)?.designation ||
      (recipientEntity as any)?.job_title ||
      (recipientEntity as any)?.title ||
      (activeConversation as any)?.role;
    return rawRole || "Team Member";
  }, [recipientEntity, activeConversation]);

  // Recipient Department
  const recipientDepartment = useMemo(() => {
    const rawDept =
      (recipientEntity as any)?.department ||
      (recipientEntity as any)?.dept ||
      (activeConversation as any)?.department;
    return rawDept || "General";
  }, [recipientEntity, activeConversation]);

  // Recipient Avatar
  const recipientAvatar = useMemo(() => {
    return (
      (recipientEntity as any)?.avatar ||
      (recipientEntity as any)?.photoUrl ||
      (recipientEntity as any)?.photo_url ||
      (recipientEntity as any)?.avatar_url ||
      (recipientEntity as any)?.avatarUrl ||
      (recipientEntity as any)?.profile_picture ||
      undefined
    );
  }, [recipientEntity]);

  // Dynamic Real-time Recipient Presence
  const recipientPresence: PresenceStatus = useMemo(() => {
    const rId = (recipientEntity as any)?.id ? String((recipientEntity as any).id).trim() : "";
    const rUserId = ((recipientEntity as any)?.userId || (recipientEntity as any)?.user_id)
      ? String((recipientEntity as any).userId || (recipientEntity as any).user_id).trim()
      : "";
    const rEmpId = ((recipientEntity as any)?.employee_id || (recipientEntity as any)?.employeeId)
      ? String((recipientEntity as any).employee_id || (recipientEntity as any).employeeId).trim()
      : "";
    const rEmail = (recipientEntity as any)?.email ? String((recipientEntity as any).email).toLowerCase().trim() : "";
    const convId = activeConversationId ? String(activeConversationId).replace(/^conv_/, "").trim() : "";

    if (rId && userPresenceMap[rId]) return userPresenceMap[rId];
    if (rUserId && userPresenceMap[rUserId]) return userPresenceMap[rUserId];
    if (rEmpId && userPresenceMap[rEmpId]) return userPresenceMap[rEmpId];
    if (rEmail && userPresenceMap[rEmail]) return userPresenceMap[rEmail];
    if (convId && userPresenceMap[convId]) return userPresenceMap[convId];

    // Clean prefix lookups
    const cleanRId = rId.replace(/^conv_/, "").replace(/^usr_/, "");
    if (cleanRId && userPresenceMap[cleanRId]) return userPresenceMap[cleanRId];

    const cleanRUserId = rUserId.replace(/^conv_/, "").replace(/^usr_/, "");
    if (cleanRUserId && userPresenceMap[cleanRUserId]) return userPresenceMap[cleanRUserId];

    const staticPresence = (recipientEntity as any)?.presence;
    if (
      staticPresence &&
      ["online", "away", "busy", "dnd", "offline"].includes(String(staticPresence).toLowerCase())
    ) {
      return String(staticPresence).toLowerCase() as PresenceStatus;
    }

    return "offline";
  }, [recipientEntity, activeConversationId, userPresenceMap]);

  // Recipient Email
  const recipientEmail = useMemo(() => {
    return (
      (recipientEntity as any)?.email ||
      (recipientEntity as any)?.emailAddress ||
      ""
    );
  }, [recipientEntity]);

  // Recipient ID
  const recipientId = useMemo(() => {
    return (
      (recipientEntity as any)?.id ||
      (recipientEntity as any)?._id ||
      (activeConversation as any)?.id ||
      activeConversationId ||
      "unknown"
    );
  }, [recipientEntity, activeConversation, activeConversationId]);

  // Initials matching recipient name
  const initials = useMemo(() => {
    if (!recipientName) return "";
    return (
      recipientName
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || recipientName.charAt(0).toUpperCase()
    );
  }, [recipientName]);

  // Dynamic participant representation
  const participant: ConnectUser = useMemo(() => {
    return {
      id: recipientId,
      name: recipientName,
      email: recipientEmail,
      role: recipientRole,
      department: recipientDepartment,
      avatar: recipientAvatar,
      presence: recipientPresence,
    };
  }, [
    recipientId,
    recipientName,
    recipientEmail,
    recipientRole,
    recipientDepartment,
    recipientAvatar,
    recipientPresence,
  ]);

  // Mark conversation read automatically on load/view
  useEffect(() => {
    if (activeConversationId && activeConversation && activeConversation.unreadCount > 0) {
      markConversationRead(activeConversationId);
    }
  }, [activeConversationId, activeConversation?.unreadCount, markConversationRead]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
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

  const handleStartAudio = async () => {
    if (!participant) return;
    toast.info(`Calling ${participant.name}...`);
    await connectCallOrchestrator.initiateCall(participant, "audio");
    onOpenAudioCall?.(participant);
  };

  const handleStartVideo = async () => {
    if (!participant) return;
    toast.info(`Calling ${participant.name}...`);
    await connectCallOrchestrator.initiateCall(participant, "video");
    onOpenVideoCall?.(participant);
  };

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
              status={participant.presence}
              size="sm"
              withPulse={participant.presence === "online"}
              className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground truncate">{participant.name}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
              <span>{participant.role || "Team Member"} • {participant.department || "General"}</span>
              <span>•</span>
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  participant.presence === "online"
                    ? "text-emerald-500"
                    : participant.presence === "away"
                    ? "text-amber-500"
                    : participant.presence === "busy" || participant.presence === "dnd"
                    ? "text-rose-500"
                    : "text-muted-foreground"
                }`}
              >
                {participant.presence === "online"
                  ? "● Online"
                  : participant.presence === "away"
                  ? "● Away"
                  : participant.presence === "busy"
                  ? "● Busy"
                  : participant.presence === "dnd"
                  ? "● Do Not Disturb"
                  : "○ Offline"}
              </span>
            </div>
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
        ) : isMessagesError ? (
          <div className="p-6">
            <ConnectErrorState
              variant="connection_failed"
              title="Failed to Load Messages"
              description="Could not load messages for this conversation. Please check your connection and try again."
              onRetry={() => refetchMessages()}
            />
          </div>
        ) : messages.length === 0 ? (
          <ConnectEmptyState
            variant="messages"
            title="No messages yet"
            description={`Say hello to ${participant.name} to kick off the conversation!`}
          />
        ) : (
          messages.map((message, idx) => {
            const isOutgoing = isCurrentUser(
              message.senderId || (message as any).sender_id || (message as any).user_id || (message as any).sender,
              currentUser
            );

            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const isConsecutive = prevMsg
              ? isCurrentUser(
                  prevMsg.senderId || (prevMsg as any).sender_id || (prevMsg as any).user_id,
                  currentUser
                ) === isOutgoing &&
                String(prevMsg.senderId || (prevMsg as any).sender_id || "") ===
                  String(message.senderId || (message as any).sender_id || "")
              : false;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOutgoing={isOutgoing}
                isConsecutive={isConsecutive}
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
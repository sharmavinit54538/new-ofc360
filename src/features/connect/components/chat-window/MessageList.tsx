import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectEmptyState } from "../ConnectEmptyState";
import { ConnectErrorState } from "../ConnectErrorState";
import { MessageBubble } from "../MessageBubble";

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  currentUser: any;
  currentUserId: string;
  activeConversationId: string;
  chatScrollRef: React.RefObject<HTMLDivElement>;
  onReplyInThread: (message: any) => void;
  onToggleReaction: (msgId: string, emoji: string) => void;
  onTogglePin: (msgId: string) => void;
  onDelete: (msgId: string) => void;
  refetchMessages: () => void;
  isCurrentUser: (senderId: any, currentUser: any) => boolean;
}

export function MessageList({
  messages,
  isLoading,
  isError,
  error,
  currentUser,
  currentUserId,
  activeConversationId,
  chatScrollRef,
  onReplyInThread,
  onToggleReaction,
  onTogglePin,
  onDelete,
  refetchMessages,
  isCurrentUser,
}: MessageListProps) {
  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ConnectErrorState
          variant="connection_failed"
          title="Failed to Load Messages"
          description="Could not load messages for this conversation. Please check your connection and try again."
          onRetry={refetchMessages}
        />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <ConnectEmptyState
        variant="messages"
        title="No messages yet"
        description="Say hello to start the conversation!"
      />
    );
  }

  return (
    <>
      {messages.map((message, idx) => {
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
            onReplyInThread={() => onReplyInThread(message)}
            onToggleReaction={(msgId, emoji) =>
              onToggleReaction(msgId, emoji)
            }
            onTogglePin={(msgId) =>
              onTogglePin(msgId)
            }
            onDelete={(msgId) =>
              onDelete(msgId)
            }
          />
        );
      })}

      <div ref={chatScrollRef} />
    </>
  );
}
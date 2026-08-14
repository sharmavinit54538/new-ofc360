import { useMemo, useRef, useEffect } from "react";
import { useConnect } from "@/features/connect/hooks";
import {
  useGetMessageThreadQuery,
  usePostThreadReplyMutation,
  useToggleReactionMutation,
  useDeleteMessageMutation,
} from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, CornerDownRight } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatComposer } from "./ChatComposer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function ThreadPanel() {
  const { activeThreadMessage, setActiveThreadMessage } = useConnect();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ? String(currentUser.id) : "usr_current";

  const parentMessageId = activeThreadMessage?.id || "";

  // RTK Query hooks
  const { data: replies = [], isLoading } = useGetMessageThreadQuery(parentMessageId, {
    skip: !parentMessageId,
  });

  const [postThreadReply] = usePostThreadReplyMutation();
  const [toggleReaction] = useToggleReactionMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies.length]);

  if (!activeThreadMessage) return null;

  const handleSendReply = async ({
    content,
    attachments,
  }: {
    content: string;
    attachments?: any[];
  }) => {
    try {
      await postThreadReply({
        parentMessageId: activeThreadMessage.id,
        content,
        attachments,
        conversationId: activeThreadMessage.conversationId,
      }).unwrap();
    } catch {
      toast.error("Failed to post thread reply.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full sm:w-[420px] h-full border-l border-border/80 bg-card/95 backdrop-blur-xl flex flex-col shadow-2xl z-20 shrink-0 select-none overflow-hidden"
      >
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Thread</span>
            <span className="text-xs text-muted-foreground">with {activeThreadMessage.senderName}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveThreadMessage(null)}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {/* Parent Original Message */}
          <div className="p-3 rounded-2xl bg-muted/30 border border-border/60">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-2 block">
              Original Message
            </span>
            <MessageBubble
              message={activeThreadMessage}
              isOutgoing={activeThreadMessage.senderId === currentUserId}
              currentUserId={currentUserId}
              onToggleReaction={(msgId, emoji) =>
                toggleReaction({
                  messageId: msgId,
                  emoji,
                  conversationId: activeThreadMessage.conversationId,
                })
              }
            />
          </div>

          {/* Replies divider */}
          <div className="flex items-center gap-2 py-2">
            <span className="h-px flex-1 bg-border/60" />
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <CornerDownRight className="w-3 h-3 text-primary" />
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </span>
            <span className="h-px flex-1 bg-border/60" />
          </div>

          {/* Reply bubbles */}
          {isLoading ? (
            <div className="space-y-2 py-3">
              <div className="h-10 rounded-xl bg-card/60 animate-pulse border border-border/40" />
            </div>
          ) : replies.length === 0 ? (
            <p className="text-center py-6 text-xs text-muted-foreground">
              No replies yet. Be the first to start the discussion!
            </p>
          ) : (
            replies.map((reply) => (
              <MessageBubble
                key={reply.id}
                message={reply}
                isOutgoing={reply.senderId === currentUserId}
                currentUserId={currentUserId}
                onToggleReaction={(msgId, emoji) =>
                  toggleReaction({
                    messageId: msgId,
                    emoji,
                    conversationId: activeThreadMessage.conversationId,
                  })
                }
                onDelete={(msgId) =>
                  deleteMessage({
                    messageId: msgId,
                    conversationId: activeThreadMessage.conversationId,
                  })
                }
              />
            ))
          )}
          <div ref={scrollRef} />
        </div>

        {/* Thread Reply Composer */}
        <ChatComposer
          onSendMessage={handleSendReply}
          placeholder="Reply in thread..."
          recipientName={activeThreadMessage.senderName}
          compact
        />
      </motion.div>
    </AnimatePresence>
  );
}

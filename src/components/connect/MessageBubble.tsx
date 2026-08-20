import { useState } from "react";
import { ConnectMessage, MessageAttachment } from "@/types/connect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Smile,
  MessageCircle,
  Pin,
  MoreHorizontal,
  Check,
  CheckCheck,
  Copy,
  Trash2,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileCard } from "./FileCard";
import { ImageModalPreview } from "./ImageModalPreview";
import { VideoModalPreview } from "./VideoModalPreview";
import { formatMessageTime } from "@/utils/formatTime";
import { toast } from "sonner";

interface MessageBubbleProps {
  message: ConnectMessage;
  isOutgoing: boolean;
  isConsecutive?: boolean;
  currentUserId: string;
  onReplyInThread?: (message: ConnectMessage) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onTogglePin?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

const COMMON_EMOJIS = ["👍", "❤️", "🔥", "🚀", "🎉", "👀", "👏", "🙌"];

export function MessageBubble({
  message,
  isOutgoing,
  isConsecutive = false,
  currentUserId,
  onReplyInThread,
  onToggleReaction,
  onTogglePin,
  onDelete,
}: MessageBubbleProps) {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; name: string } | null>(null);

  const displayTime = formatMessageTime(message.timestamp);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Message copied to clipboard");
  };

  const handleAttachmentPreview = (att: MessageAttachment) => {
    const isImage = att.type.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].some((e) => att.name.toLowerCase().endsWith(e));
    const isVideo = att.type.startsWith("video/") || ["mp4", "webm", "mov"].some((e) => att.name.toLowerCase().endsWith(e));

    if (isImage) {
      setSelectedImage({ url: att.url, name: att.name });
    } else if (isVideo) {
      setSelectedVideo({ url: att.url, name: att.name });
    } else {
      window.open(att.url, "_blank");
    }
  };

  const senderInitials = message.senderName
    ? message.senderName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div
      className={`group relative flex gap-2.5 my-1.5 transition-all ${
        isOutgoing ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar (incoming messages only, hidden on consecutive) */}
      {!isOutgoing && (
        <div className="w-8 shrink-0">
          {!isConsecutive ? (
            <Avatar className="w-8 h-8 border border-border/50 mt-0.5">
              <AvatarImage src={message.senderAvatar} alt={message.senderName} />
              <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-semibold">
                {senderInitials}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-8" />
          )}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
          isOutgoing ? "items-end" : "items-start"
        }`}
      >
        {/* Header (Sender label & Timestamp) */}
        {!isConsecutive && (
          <div className={`flex items-center gap-2 mb-1 px-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
            <span className={`text-[11px] font-semibold ${isOutgoing ? "text-primary" : "text-foreground"}`}>
              {isOutgoing ? "You" : message.senderName || "Colleague"}
            </span>
            <span className="text-[10px] text-muted-foreground">{displayTime}</span>
            {message.isPinned && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-500 font-medium">
                <Pin className="w-2.5 h-2.5 fill-amber-500" /> Pinned
              </span>
            )}
          </div>
        )}

        {/* Message Main Bubble */}
        <div
          className={`relative px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs transition-all duration-250 ease-in-out cursor-default ${
            isOutgoing
              ? "bg-primary text-primary-foreground rounded-br-xs message-bubble-outgoing"
              : "bg-card border border-border/70 text-foreground rounded-bl-xs message-bubble-incoming"
          }`}
        >
          {/* Pinned Indicator for Outgoing */}
          {isOutgoing && message.isPinned && (
            <div className="flex items-center gap-1 text-[10px] text-primary-foreground/90 font-medium mb-1">
              <Pin className="w-2.5 h-2.5 fill-current" /> Pinned message
            </div>
          )}

          {/* Voice Message UI */}
          {message.isVoiceMessage ? (
            <div className="flex items-center gap-3 py-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                className={`w-7 h-7 rounded-full transition-transform duration-200 hover:scale-105 ${
                  isOutgoing
                    ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
                    : "bg-primary/15 hover:bg-primary/25 text-primary"
                }`}
              >
                {isPlayingVoice ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </Button>

              {/* Animated Waveform simulator */}
              <div className="flex items-center gap-0.5 h-6 px-1">
                {[12, 20, 8, 24, 16, 28, 14, 22, 10, 18, 26, 12, 16].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height}px` }}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isOutgoing ? "bg-primary-foreground/80" : "bg-primary"
                    } ${isPlayingVoice ? "animate-pulse" : "opacity-60"}`}
                  />
                ))}
              </div>

              <span className="text-[11px] opacity-85 font-mono">
                {message.voiceDuration ? `${message.voiceDuration}s` : "0:12"}
              </span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words transition-colors duration-200 select-text message-text-subtle">
              {message.content}
            </p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {message.attachments.map((att) => (
                <FileCard
                  key={att.id}
                  attachment={att}
                  onPreview={() => handleAttachmentPreview(att)}
                  compact
                  className={isOutgoing ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" : ""}
                />
              ))}
            </div>
          )}

          {/* Time & Read Receipts (Outgoing) */}
          {isOutgoing && (
            <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-primary-foreground/75 font-medium">
              <span>{displayTime}</span>
              {message.status === "read" ? (
                <CheckCheck className="w-3 h-3 text-primary-foreground" />
              ) : (
                <Check className="w-3 h-3 text-primary-foreground/80" />
              )}
            </div>
          )}
        </div>

        {/* Reactions List */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1 px-0.5">
            {message.reactions.map((reaction) => {
              const hasReacted = reaction.users.includes(currentUserId);
              return (
                <button
                  key={reaction.emoji}
                  type="button"
                  onClick={() => onToggleReaction?.(message.id, reaction.emoji)}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] border transition-all ${
                    hasReacted
                      ? "bg-primary/15 border-primary/40 text-primary font-semibold"
                      : "bg-muted/60 border-border/70 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Thread replies count trigger */}
        {message.replyCount && message.replyCount > 0 ? (
          <button
            type="button"
            onClick={() => onReplyInThread?.(message)}
            className="flex items-center gap-1 mt-1 text-[11px] text-primary font-semibold hover:underline"
          >
            <MessageCircle className="w-3 h-3" />
            <span>{message.replyCount} {message.replyCount === 1 ? "reply" : "replies"}</span>
          </button>
        ) : null}
      </div>

      {/* Floating Action Menu (Hover) */}
      <div
        className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-background/95 backdrop-blur-md border border-border/80 rounded-xl px-1 py-0.5 shadow-md z-10 ${
          isOutgoing ? "right-full mr-2" : "left-full ml-2"
        }`}
      >
        {/* Emoji Reaction Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 rounded-lg text-muted-foreground hover:text-foreground">
              <Smile className="w-3.5 h-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-auto p-1.5 flex items-center gap-1 shadow-xl rounded-xl">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onToggleReaction?.(message.id, emoji)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-sm transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Reply in thread */}
        {onReplyInThread && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReplyInThread(message)}
            className="w-6 h-6 rounded-lg text-muted-foreground hover:text-foreground"
            title="Reply in thread"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </Button>
        )}

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 rounded-lg text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isOutgoing ? "end" : "start"} className="w-36 p-1 text-xs">
            <DropdownMenuItem onClick={handleCopy} className="cursor-pointer gap-2 py-1.5">
              <Copy className="w-3.5 h-3.5 text-muted-foreground" /> Copy text
            </DropdownMenuItem>
            {onTogglePin && (
              <DropdownMenuItem onClick={() => onTogglePin(message.id)} className="cursor-pointer gap-2 py-1.5">
                <Pin className="w-3.5 h-3.5 text-muted-foreground" /> {message.isPinned ? "Unpin" : "Pin message"}
              </DropdownMenuItem>
            )}
            {onDelete && isOutgoing && (
              <DropdownMenuItem
                onClick={() => onDelete(message.id)}
                className="cursor-pointer gap-2 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image and Video Modals */}
      {selectedImage && (
        <ImageModalPreview
          open={Boolean(selectedImage)}
          onOpenChange={(open) => !open && setSelectedImage(null)}
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
        />
      )}
      {selectedVideo && (
        <VideoModalPreview
          open={Boolean(selectedVideo)}
          onOpenChange={(open) => !open && setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          videoName={selectedVideo.name}
        />
      )}
    </div>
  );
}

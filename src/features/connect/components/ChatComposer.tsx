import { useState, useRef, useEffect } from "react";
import { MessageAttachment } from "@/types/connect";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  Mic,
  MicOff,
  Sparkles,
  X,
  Square,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilePicker } from "./FilePicker";
import { FileCard } from "./FileCard";
import { AIAssistantDropdown } from "./AIAssistantDropdown";

interface ChatComposerProps {
  onSendMessage: (data: {
    content: string;
    attachments?: MessageAttachment[];
    isVoiceMessage?: boolean;
    voiceDuration?: number;
  }) => void;
  placeholder?: string;
  recipientName?: string;
  recipientEmail?: string;
  compact?: boolean;
  className?: string;
}

const EMOJIS = ["😀", "😂", "😍", "🎉", "🔥", "👍", "❤️", "🙌", "✨", "🚀", "💡", "👏", "🙏", "💯", "👀", "✅"];

export function ChatComposer({
  onSendMessage,
  placeholder = "Type a message... (Press Enter to send)",
  recipientName,
  recipientEmail,
  compact = false,
  className = "",
}: ChatComposerProps) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0 && !isRecording) return;

    if (isRecording) {
      // Send voice message
      onSendMessage({
        content: "Voice Message",
        isVoiceMessage: true,
        voiceDuration: Math.max(recordingSeconds, 1),
      });
      setIsRecording(false);
      setRecordingSeconds(0);
      return;
    }

    onSendMessage({
      content: text.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    setText("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFilesSelected = (newAttachments: MessageAttachment[]) => {
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  return (
    <div
      className={`p-3 bg-card/80 backdrop-blur-md border-t border-border/70 flex flex-col gap-2 transition-all ${className}`}
    >
      {/* Pending Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-1 max-h-36 overflow-y-auto scrollbar-thin">
          {attachments.map((att) => (
            <FileCard
              key={att.id}
              attachment={att}
              onRemove={() => removeAttachment(att.id)}
              compact
              className="bg-background shadow-xs max-w-xs"
            />
          ))}
        </div>
      )}

      {/* Voice Recording Active Bar */}
      {isRecording ? (
        <div className="flex items-center justify-between p-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-ping" />
            <span className="font-semibold">Recording voice message...</span>
            <span className="font-mono">{`0:${recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsRecording(false)}
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSend}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs h-7 gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Send Voice</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center gap-2 bg-background border border-border/80 rounded-2xl p-1.5 px-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 shadow-xs transition-all">
          {/* Text Area */}
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 min-h-[36px] max-h-[120px] p-1.5 text-xs bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none leading-relaxed placeholder:text-muted-foreground/70"
          />

          {/* Action Tools */}
          <div className="flex items-center gap-1 shrink-0 pb-0.5">
            {/* AI Assistant */}
            <AIAssistantDropdown
              currentText={text}
              onApplyText={(newText) => setText(newText)}
              recipientName={recipientName}
              recipientEmail={recipientEmail}
            />

            {/* Emoji Picker Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground"
                  title="Emoji"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="end" className="w-64 p-2 shadow-xl rounded-2xl">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-base transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Attachments Picker (Generic Files) */}
            <FilePicker onFilesSelected={handleFilesSelected} accept="*/*">
              {({ openPicker }) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={openPicker}
                  className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              )}
            </FilePicker>

            {/* Attachments Picker (Images only) */}
            <FilePicker onFilesSelected={handleFilesSelected} accept="image/*">
              {({ openPicker }) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={openPicker}
                  className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                  title="Attach image"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              )}
            </FilePicker>

            {/* Voice Message trigger */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsRecording(true)}
              className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground"
              title="Record voice message"
            >
              <Mic className="w-4 h-4" />
            </Button>

            {/* Send Button */}
            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              disabled={!text.trim() && attachments.length === 0}
              className="w-8 h-8 rounded-xl gradient-bg text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-40 transition-all ml-1"
              title="Send (Enter)"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
import React from "react";
import { Radio, Sparkles, Share2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  }
  return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
};

interface MeetingHeaderProps {
  activeMeeting: {
    title: string;
    id: string;
    hostId: string;
  };
  meetingDuration: number;
  currentUserId: string;
  aiSummary: string | null;
  setAiSummary: (summary: string | null) => void;
  isGeneratingSummary: boolean;
  onGenerateSummary: () => void;
  onCopyMeetingLink: () => void;
  copiedLink: boolean;
}

export function MeetingHeader({
  activeMeeting,
  meetingDuration,
  currentUserId,
  aiSummary,
  setAiSummary,
  isGeneratingSummary,
  onGenerateSummary,
  onCopyMeetingLink,
  copiedLink,
}: MeetingHeaderProps) {
  return (
    <div className="h-14 px-4 md:px-6 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs md:text-sm font-bold text-white truncate">{activeMeeting.title}</h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
              {formatDuration(meetingDuration)}
            </span>
          </div>
          <p className="text-[10px] text-white/50 truncate">ID: {activeMeeting.id}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* AI Summary Trigger */}
        <Button
          size="sm"
          variant="outline"
          onClick={onGenerateSummary}
          disabled={isGeneratingSummary}
          className="h-8 px-2.5 rounded-lg text-xs gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">
            {isGeneratingSummary ? "Generating..." : "AI Summary"}
          </span>
        </Button>

        {/* Copy Meeting Link */}
        <Button
          size="sm"
          variant="outline"
          onClick={onCopyMeetingLink}
          className="h-8 px-2.5 rounded-lg text-xs gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10"
          title="Copy Meeting Link"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </div>
  );
}
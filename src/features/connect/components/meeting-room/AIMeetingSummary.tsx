import React from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIMeetingSummaryProps {
  aiSummary: string | null;
  setAiSummary: (summary: string | null) => void;
}

export function AIMeetingSummary({ aiSummary, setAiSummary }: AIMeetingSummaryProps) {
  if (!aiSummary) return null;

  return (
    <div className="absolute inset-x-4 top-4 max-h-60 overflow-y-auto z-30 p-4 rounded-2xl bg-card/95 text-foreground border border-amber-500/30 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-xs text-primary">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Executive Meeting Summary</span>
        </div>
        <Button size="icon" variant="ghost" onClick={() => setAiSummary(null)} className="w-6 h-6">
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {aiSummary}
      </p>
    </div>
  );
}
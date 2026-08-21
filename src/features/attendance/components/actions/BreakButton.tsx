import { Button } from "@/components/ui/button";
import { Coffee, Play } from "lucide-react";

export function BreakButton({ isOnBreak, onToggleBreak }: { isOnBreak: boolean; onToggleBreak: () => void }) {
  return (
    <Button onClick={onToggleBreak} variant="outline" className={`h-9 px-3.5 text-xs font-semibold border-border/80 shadow-sm flex items-center gap-1.5 ${isOnBreak ? "bg-amber-500/10 text-amber-600 border-amber-300" : ""}`}>
      {isOnBreak ? <Play className="h-3.5 w-3.5 fill-current" /> : <Coffee className="h-3.5 w-3.5" />}
      {isOnBreak ? "Resume Work" : "Take Break"}
    </Button>
  );
}

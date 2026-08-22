import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarControlsNav({ onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <Button variant="outline" size="sm" onClick={onToday} className="h-8 text-xs font-semibold border-border/60 bg-secondary/20">Today</Button>
      <Button variant="outline" size="icon" onClick={onPrev} className="h-8 w-8 border-border/60 bg-secondary/20"><ChevronLeft className="w-4 h-4" /></Button>
      <Button variant="outline" size="icon" onClick={onNext} className="h-8 w-8 border-border/60 bg-secondary/20"><ChevronRight className="w-4 h-4" /></Button>
    </div>
  );
}

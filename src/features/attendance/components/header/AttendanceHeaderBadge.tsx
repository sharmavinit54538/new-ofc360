import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function AttendanceHeaderBadge() {
  return (
    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 flex items-center gap-1">
      <Sparkles className="h-2.5 w-2.5" /> Biometric AI Ready
    </Badge>
  );
}

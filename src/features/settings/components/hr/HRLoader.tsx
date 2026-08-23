import { Loader2 } from "lucide-react";

export function HRLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs text-muted-foreground font-medium">Loading HR Settings from server...</p>
    </div>
  );
}

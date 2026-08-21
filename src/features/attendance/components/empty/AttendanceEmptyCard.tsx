import { CalendarOff } from "lucide-react";

export function AttendanceEmptyCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card/40 rounded-xl border border-dashed border-border/80">
      <div className="p-3 bg-muted/60 rounded-full mb-2.5">
        <CalendarOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
    </div>
  );
}

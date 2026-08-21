import type { LucideIcon } from "lucide-react";

interface AttendanceEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colSpan?: number;
}

export function AttendanceEmptyState({
  icon: Icon,
  title,
  description,
  colSpan,
}: AttendanceEmptyStateProps) {
  const content = (
    <div className="py-12 text-center text-muted-foreground text-xs space-y-1">
      <Icon className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
      <p className="font-bold text-sm text-foreground">{title}</p>
      <p className="text-[11px] text-muted-foreground">{description}</p>
    </div>
  );

  if (colSpan !== undefined) {
    return (
      <tr>
        <td colSpan={colSpan}>{content}</td>
      </tr>
    );
  }

  return (
    <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
      <Icon className="w-8 h-8 mx-auto text-muted-foreground/40" />
      <h4 className="font-bold text-sm text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

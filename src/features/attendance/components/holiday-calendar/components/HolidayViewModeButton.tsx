import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}

export function HolidayViewModeButton({ active, onClick, icon, label }: Props) {
  const activeClass = active ? "bg-card text-foreground shadow-xs border border-border/60" : "text-muted-foreground hover:text-foreground";
  return (
    <Button type="button" size="sm" variant="ghost" onClick={onClick} className={`h-8 text-xs font-semibold rounded-lg gap-1.5 px-3 transition-all ${activeClass}`}>
      {icon}<span>{label}</span>
    </Button>
  );
}

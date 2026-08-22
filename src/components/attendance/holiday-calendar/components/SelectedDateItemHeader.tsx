import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HolidayCardItemProps } from "../types/holidayCardProps";
import { getHolidayBadgeStyle } from "../utils/badgeStyle";

export function SelectedDateItemHeader({ holiday, onDelete }: HolidayCardItemProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <Badge className={`text-[10px] font-bold ${getHolidayBadgeStyle(holiday.type)}`}>{holiday.type}</Badge>
        <h4 className="font-bold text-sm text-foreground mt-1.5">{holiday.title}</h4>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onDelete(holiday.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10">
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HolidayCardItemProps } from "../types/holidayCardProps";
import { getHolidayBadgeStyle } from "../utils/badgeStyle";

export function HolidayCardItemHeader({ holiday, onDelete }: HolidayCardItemProps) {
  return (
    <div className="flex items-center justify-between">
      <Badge variant="outline" className={`text-[10px] font-bold ${getHolidayBadgeStyle(holiday.type)}`}>
        {holiday.type}
      </Badge>
      <Button variant="ghost" size="icon" onClick={() => onDelete(holiday.id)} className="h-7 w-7 text-destructive">
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

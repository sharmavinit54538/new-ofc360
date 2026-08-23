import { Badge } from "@/components/ui/badge";
import { MONTH_NAMES } from "../constants/monthNames";

interface Props {
  month: number;
  total: number;
}

export function MonthHolidaysListHeader({ month, total }: Props) {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-border/40">
      <span className="text-xs font-bold text-foreground">All Holidays in {MONTH_NAMES[month]}</span>
      <Badge variant="outline" className="text-[10px] font-bold text-primary">{total} Total</Badge>
    </div>
  );
}

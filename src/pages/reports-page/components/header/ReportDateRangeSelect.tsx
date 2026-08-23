import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ReportDateRangeSelect({ dateRange, setDateRange }: { dateRange: string; setDateRange: (d: string) => void }) {
  return (
    <Select value={dateRange} onValueChange={setDateRange}>
      <SelectTrigger className="w-36 text-xs h-9 bg-secondary/30 border-border/60">
        <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /><SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Q2-2026">Q2 2026 (Current)</SelectItem>
        <SelectItem value="Q1-2026">Q1 2026</SelectItem>
        <SelectItem value="FY-2025-26">FY 2025-26</SelectItem>
        <SelectItem value="ALL-TIME">All-Time</SelectItem>
      </SelectContent>
    </Select>
  );
}

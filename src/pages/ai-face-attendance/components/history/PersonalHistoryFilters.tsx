import { Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PersonalHistoryFilters({ status, setStatus, month, setMonth, total }: any) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border/60">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2"><Filter className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs font-semibold text-foreground">Filters:</span></div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="present">Present</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="half_day">Half Day</SelectItem><SelectItem value="absent">Absent</SelectItem></SelectContent>
        </Select>
        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-muted-foreground" /><Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-36 h-8 text-xs" /></div>
      </div>
      <div className="text-xs text-muted-foreground font-mono">Total Records: {total || 0}</div>
    </div>
  );
}

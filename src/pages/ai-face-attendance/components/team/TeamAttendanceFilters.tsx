import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TeamAttendanceFilters({ search, setSearch, date, setDate, status, setStatus, total }: any) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border/60">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-56"><Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" /><Input placeholder="Search direct report..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" /></div>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-36 h-8 text-xs" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="present">Present</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="absent">Absent</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="text-xs text-muted-foreground font-mono">Team Size: {total || 0}</div>
    </div>
  );
}

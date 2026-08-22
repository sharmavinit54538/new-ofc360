import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/types/hr";
import { SHIFT_OPTIONS } from "../constants/shiftOptions";
import type { JobDetailsState } from "../types/jobDetailsTypes";

export function JobScheduleRow({ j }: { j: JobDetailsState }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Joining Date *</Label><Input type="date" value={j.joiningDate} onChange={(e) => j.setJoiningDate(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" required /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Reporting Manager</Label><Input placeholder="Alex Mercer (VP)" value={j.reportingManager} onChange={(e) => j.setReportingManager(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Shift Schedule</Label><Select value={j.shift} onValueChange={(v) => j.setShift(v as Employee["shift"])}><SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60"><SelectValue /></SelectTrigger><SelectContent>{SHIFT_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
    </div>
  );
}

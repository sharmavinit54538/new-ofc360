import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/types/hr";
import { WORK_LOCATION_OPTIONS } from "../constants/workLocationOptions";
import type { JobDetailsState } from "../types/jobDetailsTypes";

export function JobLocationRow({ j }: { j: JobDetailsState }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Team</Label><Input placeholder="Core Platform" value={j.team} onChange={(e) => j.setTeam(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Branch / Office</Label><Input placeholder="Mumbai HQ" value={j.branchOffice} onChange={(e) => j.setBranchOffice(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Work Location</Label><Select value={j.workLocation} onValueChange={(v) => j.setWorkLocation(v as Employee["workLocation"])}><SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60"><SelectValue /></SelectTrigger><SelectContent>{WORK_LOCATION_OPTIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SHIFT_OPTIONS, DAY_OF_WEEK_OPTIONS } from "../../constants/attendance.constants";

export function RosterDialogForm(p: {
  rosterEmp: string; setRosterEmp: (v: string) => void;
  rosterShift: string; setRosterShift: (v: string) => void;
  rosterDay: string; setRosterDay: (v: string) => void;
}) {
  return (
    <div className="space-y-3 py-2">
      <div><Label className="text-xs">Employee Name / ID</Label><Input value={p.rosterEmp} onChange={(e) => p.setRosterEmp(e.target.value)} placeholder="e.g. Alex Mercer" className="h-8 text-xs mt-1" /></div>
      <div><Label className="text-xs">Shift Template</Label><Select value={p.rosterShift} onValueChange={p.setRosterShift}><SelectTrigger className="h-8 text-xs mt-1"><SelectValue placeholder="Shift" /></SelectTrigger><SelectContent className="text-xs">{SHIFT_OPTIONS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select></div>
      <div><Label className="text-xs">Assigned Day</Label><Select value={p.rosterDay} onValueChange={p.setRosterDay}><SelectTrigger className="h-8 text-xs mt-1"><SelectValue placeholder="Day" /></SelectTrigger><SelectContent className="text-xs">{DAY_OF_WEEK_OPTIONS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select></div>
    </div>
  );
}

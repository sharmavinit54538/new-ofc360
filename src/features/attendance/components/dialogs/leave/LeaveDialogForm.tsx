import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAVE_TYPE_OPTIONS } from "../../constants/attendance.constants";

export function LeaveDialogForm(p: {
  leaveType: string; setLeaveType: (v: string) => void;
  leaveStart: string; setLeaveStart: (v: string) => void;
  leaveEnd: string; setLeaveEnd: (v: string) => void;
  leaveReason: string; setLeaveReason: (v: string) => void;
}) {
  return (
    <div className="space-y-3 py-2">
      <div><Label className="text-xs">Leave Category</Label><Select value={p.leaveType} onValueChange={p.setLeaveType}><SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger><SelectContent className="text-xs">{LEAVE_TYPE_OPTIONS.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent></Select></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label className="text-xs">Start Date</Label><Input type="date" value={p.leaveStart} onChange={(e) => p.setLeaveStart(e.target.value)} className="h-8 text-xs mt-1" /></div>
        <div><Label className="text-xs">End Date</Label><Input type="date" value={p.leaveEnd} onChange={(e) => p.setLeaveEnd(e.target.value)} className="h-8 text-xs mt-1" /></div>
      </div>
      <div><Label className="text-xs">Reason</Label><Textarea value={p.leaveReason} onChange={(e) => p.setLeaveReason(e.target.value)} placeholder="Justification..." className="text-xs mt-1 min-h-[60px]" /></div>
    </div>
  );
}

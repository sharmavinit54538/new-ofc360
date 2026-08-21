import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REGULARIZATION_PUNCH_TYPES } from "../../constants/attendance.constants";

export function RegularizationDialogForm(p: any) {
  return (
    <div className="space-y-3 py-2">
      <div className="grid grid-cols-2 gap-2">
        <div><Label className="text-xs">Missed Punch Date</Label><Input type="date" value={p.regDate} onChange={(e) => p.setRegDate(e.target.value)} className="h-8 text-xs mt-1" /></div>
        <div><Label className="text-xs">Actual Time</Label><Input type="time" value={p.regTime} onChange={(e) => p.setRegTime(e.target.value)} className="h-8 text-xs mt-1" /></div>
      </div>
      <div><Label className="text-xs">Punch Type</Label><Select value={p.regType} onValueChange={p.setRegType}><SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger><SelectContent className="text-xs">{REGULARIZATION_PUNCH_TYPES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent></Select></div>
      <div><Label className="text-xs">Justification Reason</Label><Textarea value={p.regReason} onChange={(e) => p.setRegReason(e.target.value)} placeholder="Explain the reason for missed swipe..." className="text-xs mt-1 min-h-[60px]" /></div>
    </div>
  );
}

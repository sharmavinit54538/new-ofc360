import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OVERTIME_MULTIPLIER_OPTIONS } from "../../constants/attendance.constants";

export function OvertimeDialogForm(p: any) {
  return (
    <div className="space-y-3 py-2">
      <div className="grid grid-cols-2 gap-2">
        <div><Label className="text-xs">OT Duration (Hours)</Label><Input type="number" min="0.5" max="12" step="0.5" value={p.otHours} onChange={(e) => p.setOtHours(e.target.value)} className="h-8 text-xs mt-1" /></div>
        <div><Label className="text-xs">Rate Multiplier</Label><Select value={p.otMultiplier} onValueChange={p.setOtMultiplier}><SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger><SelectContent className="text-xs">{OVERTIME_MULTIPLIER_OPTIONS.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}</SelectContent></Select></div>
      </div>
      <div><Label className="text-xs">Business Justification</Label><Textarea value={p.otReason} onChange={(e) => p.setOtReason(e.target.value)} placeholder="State project deadlines / critical tasks..." className="text-xs mt-1 min-h-[60px]" /></div>
    </div>
  );
}

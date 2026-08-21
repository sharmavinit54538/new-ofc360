import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ShiftDialogInputs(p: {
  shiftName: string; setShiftName: (v: string) => void;
  shiftStart: string; setShiftStart: (v: string) => void;
  shiftEnd: string; setShiftEnd: (v: string) => void;
}) {
  return (
    <div className="grid gap-3">
      <div><Label className="text-xs">Shift Title</Label><Input value={p.shiftName} onChange={(e) => p.setShiftName(e.target.value)} placeholder="e.g. Standard Morning Shift" className="h-8 text-xs mt-1" /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label className="text-xs">Start Time</Label><Input type="time" value={p.shiftStart} onChange={(e) => p.setShiftStart(e.target.value)} className="h-8 text-xs mt-1" /></div>
        <div><Label className="text-xs">End Time</Label><Input type="time" value={p.shiftEnd} onChange={(e) => p.setShiftEnd(e.target.value)} className="h-8 text-xs mt-1" /></div>
      </div>
    </div>
  );
}

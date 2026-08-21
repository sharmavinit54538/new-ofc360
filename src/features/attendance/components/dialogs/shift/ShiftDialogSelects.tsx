import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DEPARTMENT_OPTIONS } from "../../../constants/attendance.constants";

export function ShiftDialogSelects(p: { shiftDept: string; setShiftDept: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">Assigned Department</Label>
      <Select value={p.shiftDept} onValueChange={p.setShiftDept}>
        <SelectTrigger className="h-8 text-xs mt-1"><SelectValue placeholder="Department" /></SelectTrigger>
        <SelectContent className="text-xs">
          {DEPARTMENT_OPTIONS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
        </SelectContent>
      </Select>
    </div>
  );
}

import { ShiftsHeader } from "./shifts/ShiftsHeader";
import { ShiftsTable } from "./shifts/ShiftsTable";
import type { ShiftTemplate } from "../../types/attendance.types";

export function ShiftsTab({ shifts, onAddShift, onDeleteShift }: {
  shifts: ShiftTemplate[]; onAddShift: () => void; onDeleteShift: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <ShiftsHeader onAddShift={onAddShift} />
      <ShiftsTable shifts={shifts} onDelete={onDeleteShift} />
    </div>
  );
}

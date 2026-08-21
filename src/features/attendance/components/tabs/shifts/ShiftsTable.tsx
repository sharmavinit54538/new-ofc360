import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShiftsTableRow } from "./ShiftsTableRow";
import { AttendanceEmptyState } from "../../AttendanceEmptyState";
import type { ShiftTemplate } from "../../../types/attendance.types";

export function ShiftsTable({ shifts, onDelete }: { shifts: ShiftTemplate[]; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow><TableHead className="text-xs">Shift Title</TableHead><TableHead className="text-xs">Working Window</TableHead><TableHead className="text-xs">Grace Window</TableHead><TableHead className="text-xs">Department</TableHead><TableHead className="text-xs text-right">Actions</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (<AttendanceEmptyState isTableRow colSpan={5} description="No custom shift templates configured." />) : (shifts.map((s) => (<ShiftsTableRow key={s.id} shift={s} onDelete={onDelete} />)))}
        </TableBody>
      </Table>
    </div>
  );
}

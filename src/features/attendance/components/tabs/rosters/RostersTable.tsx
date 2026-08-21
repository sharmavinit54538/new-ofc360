import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RostersTableRow } from "./RostersTableRow";
import { AttendanceEmptyState } from "../../AttendanceEmptyState";
import type { RosterItem } from "../../../types/attendance.types";

export function RostersTable({ rosters, onDelete }: { rosters: RosterItem[]; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow><TableHead className="text-xs">Employee</TableHead><TableHead className="text-xs">Department</TableHead><TableHead className="text-xs">Assigned Shift</TableHead><TableHead className="text-xs">Work Hours</TableHead><TableHead className="text-xs">Scheduled Day</TableHead><TableHead className="text-xs text-right">Action</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {rosters.length === 0 ? (<AttendanceEmptyState isTableRow colSpan={6} description="No active roster schedules found." />) : (rosters.map((r) => (<RostersTableRow key={r.id} roster={r} onDelete={onDelete} />)))}
        </TableBody>
      </Table>
    </div>
  );
}

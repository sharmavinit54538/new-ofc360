import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OverviewTableRow } from "./OverviewTableRow";
import { AttendanceEmptyState } from "../../AttendanceEmptyState";
import type { PunchRecord } from "../../../types/attendance.types";

export function OverviewTable({ list }: { list: PunchRecord[] }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow><TableHead className="text-xs">Employee</TableHead><TableHead className="text-xs">Dept</TableHead><TableHead className="text-xs">Type</TableHead><TableHead className="text-xs">Time</TableHead><TableHead className="text-xs">Station</TableHead><TableHead className="text-xs">Status</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (<AttendanceEmptyState isTableRow colSpan={6} description="No live attendance events captured today yet." />) : (list.map((p) => (<OverviewTableRow key={p.id} punch={p} />)))}
        </TableBody>
      </Table>
    </div>
  );
}

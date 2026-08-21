import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OvertimeTableRow } from "./OvertimeTableRow";
import { AttendanceEmptyState } from "../../AttendanceEmptyState";
import type { OvertimeEntry } from "../../../types/attendance.types";

export function OvertimeTable({ list, isManagerOrAbove, onUpdate }: { list: OvertimeEntry[]; isManagerOrAbove: boolean; onUpdate: (id: string, s: string) => void }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow><TableHead className="text-xs">Employee</TableHead><TableHead className="text-xs">Date</TableHead><TableHead className="text-xs">Standard</TableHead><TableHead className="text-xs">Overtime</TableHead><TableHead className="text-xs">Rate</TableHead><TableHead className="text-xs">Reason</TableHead><TableHead className="text-xs">Status</TableHead>{isManagerOrAbove && (<TableHead className="text-xs text-right">Review</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (<AttendanceEmptyState isTableRow colSpan={isManagerOrAbove ? 8 : 7} description="No overtime entries logged." />) : (list.map((o) => (<OvertimeTableRow key={o.id} ot={o} isManagerOrAbove={isManagerOrAbove} onUpdate={onUpdate} />)))}
        </TableBody>
      </Table>
    </div>
  );
}

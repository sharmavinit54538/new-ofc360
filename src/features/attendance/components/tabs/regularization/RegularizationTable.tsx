import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RegularizationTableRow } from "./RegularizationTableRow";
import { AttendanceEmptyState } from "../../AttendanceEmptyState";
import type { RegularizationRequest } from "../../../types/attendance.types";

export function RegularizationTable({ list, isManagerOrAbove, onUpdate }: { list: RegularizationRequest[]; isManagerOrAbove: boolean; onUpdate: (id: string, s: string) => void }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow><TableHead className="text-xs">Employee</TableHead><TableHead className="text-xs">Date</TableHead><TableHead className="text-xs">Punch Type</TableHead><TableHead className="text-xs">Correct Time</TableHead><TableHead className="text-xs">Reason</TableHead><TableHead className="text-xs">Status</TableHead>{isManagerOrAbove && (<TableHead className="text-xs text-right">Actions</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (<AttendanceEmptyState isTableRow colSpan={isManagerOrAbove ? 7 : 6} description="No regularization requests found matching your filters." />) : (list.map((r) => (<RegularizationTableRow key={r.id} req={r} isManagerOrAbove={isManagerOrAbove} onUpdate={onUpdate} />)))}
        </TableBody>
      </Table>
    </div>
  );
}

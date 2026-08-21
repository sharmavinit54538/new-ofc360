import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeavesTableRow } from "./LeavesTableRow";
import { AttendanceEmptyState } from "../../AttendanceEmptyState";
import type { DisplayedLeave } from "../../../types/attendance.types";

export function LeavesTable({ list, isManagerOrAbove, onReview }: { list: DisplayedLeave[]; isManagerOrAbove: boolean; onReview: (id: string, s: "Approved" | "Denied") => void }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow><TableHead className="text-xs">Employee</TableHead><TableHead className="text-xs">Type</TableHead><TableHead className="text-xs">Duration</TableHead><TableHead className="text-xs">Days</TableHead><TableHead className="text-xs">Reason</TableHead><TableHead className="text-xs">Status</TableHead>{isManagerOrAbove && (<TableHead className="text-xs text-right">Review</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (<AttendanceEmptyState isTableRow colSpan={isManagerOrAbove ? 7 : 6} description="No leave records logged yet." />) : (list.map((l) => (<LeavesTableRow key={l.id} leave={l} isManagerOrAbove={isManagerOrAbove} onReview={onReview} />)))}
        </TableBody>
      </Table>
    </div>
  );
}

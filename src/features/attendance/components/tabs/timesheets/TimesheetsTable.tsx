import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimesheetsTableRow } from "./TimesheetsTableRow";
import { AttendanceEmptyState } from "../../AttendanceEmptyState";
import type { DisplayedTimesheet } from "../../../types/attendance.types";

export function TimesheetsTable({ list, isManagerOrAbove, onApprove }: { list: DisplayedTimesheet[]; isManagerOrAbove: boolean; onApprove: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow><TableHead className="text-xs">Employee</TableHead><TableHead className="text-xs">Project</TableHead><TableHead className="text-xs">Task</TableHead><TableHead className="text-xs">Hours</TableHead><TableHead className="text-xs">Type</TableHead><TableHead className="text-xs">Status</TableHead>{isManagerOrAbove && (<TableHead className="text-xs text-right">Action</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (<AttendanceEmptyState isTableRow colSpan={isManagerOrAbove ? 7 : 6} description="No timesheets submitted yet." />) : (list.map((t) => (<TimesheetsTableRow key={t.id} ts={t} isManagerOrAbove={isManagerOrAbove} onApprove={onApprove} />)))}
        </TableBody>
      </Table>
    </div>
  );
}

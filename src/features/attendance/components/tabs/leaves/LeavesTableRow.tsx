import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeavesActionBtns } from "./LeavesActionBtns";
import type { DisplayedLeave } from "../../../types/attendance.types";

export function LeavesTableRow({ leave: l, isManagerOrAbove, onReview }: { leave: DisplayedLeave; isManagerOrAbove: boolean; onReview: (id: string, s: "Approved" | "Denied") => void }) {
  return (
    <TableRow className="hover:bg-muted/30 text-xs">
      <TableCell className="font-semibold text-foreground">{l.employeeName}</TableCell>
      <TableCell><Badge variant="outline" className="text-[10px]">{l.type}</Badge></TableCell>
      <TableCell className="font-mono text-muted-foreground">{l.startDate} to {l.endDate}</TableCell>
      <TableCell className="text-muted-foreground">{l.days} days</TableCell>
      <TableCell className="text-muted-foreground max-w-[200px] truncate">{l.reason}</TableCell>
      <TableCell><Badge variant="secondary" className={`text-[10px] ${l.status.toLowerCase() === "approved" ? "bg-emerald-500/15 text-emerald-700" : l.status.toLowerCase() === "rejected" ? "bg-rose-500/15 text-rose-700" : "bg-amber-500/15 text-amber-700"}`}>{l.status}</Badge></TableCell>
      {isManagerOrAbove && (<TableCell className="text-right">{l.status.toLowerCase() === "pending" ? (<LeavesActionBtns id={l.id} onReview={onReview} />) : (<span className="text-[11px] text-muted-foreground">—</span>)}</TableCell>)}
    </TableRow>
  );
}

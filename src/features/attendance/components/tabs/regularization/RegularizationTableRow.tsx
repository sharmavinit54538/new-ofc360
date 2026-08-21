import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RegularizationActionBtns } from "./RegularizationActionBtns";
import type { RegularizationRequest } from "../../../types/attendance.types";

export function RegularizationTableRow({ req: r, isManagerOrAbove, onUpdate }: { req: RegularizationRequest; isManagerOrAbove: boolean; onUpdate: (id: string, s: string) => void }) {
  return (
    <TableRow className="hover:bg-muted/30 text-xs">
      <TableCell className="font-semibold text-foreground">{r.employeeName}</TableCell>
      <TableCell className="font-mono text-muted-foreground">{r.date}</TableCell>
      <TableCell><Badge variant="outline" className="text-[10px]">{r.missedPunchType}</Badge></TableCell>
      <TableCell className="font-mono text-muted-foreground">{r.requestedTime}</TableCell>
      <TableCell className="text-muted-foreground max-w-[200px] truncate">{r.reason}</TableCell>
      <TableCell><Badge variant="secondary" className={`text-[10px] ${r.status === "Approved" ? "bg-emerald-500/15 text-emerald-700" : r.status === "Rejected" ? "bg-rose-500/15 text-rose-700" : "bg-amber-500/15 text-amber-700"}`}>{r.status}</Badge></TableCell>
      {isManagerOrAbove && (<TableCell className="text-right">{r.status === "Pending" ? (<RegularizationActionBtns id={r.id} onUpdate={onUpdate} />) : (<span className="text-[11px] text-muted-foreground">—</span>)}</TableCell>)}
    </TableRow>
  );
}

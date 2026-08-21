import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OvertimeActionBtns } from "./OvertimeActionBtns";
import type { OvertimeEntry } from "../../../types/attendance.types";

export function OvertimeTableRow({ ot: o, isManagerOrAbove, onUpdate }: { ot: OvertimeEntry; isManagerOrAbove: boolean; onUpdate: (id: string, s: string) => void }) {
  return (
    <TableRow className="hover:bg-muted/30 text-xs">
      <TableCell className="font-semibold text-foreground">{o.employeeName}</TableCell>
      <TableCell className="font-mono text-muted-foreground">{o.date}</TableCell>
      <TableCell className="font-mono text-muted-foreground">{o.standardHours} hrs</TableCell>
      <TableCell className="font-mono text-foreground font-semibold">+{o.overtimeHours} hrs</TableCell>
      <TableCell><Badge variant="outline" className="text-[10px]">{o.rateMultiplier}</Badge></TableCell>
      <TableCell className="text-muted-foreground max-w-[200px] truncate">{o.reason}</TableCell>
      <TableCell><Badge variant="secondary" className={`text-[10px] ${o.status === "Approved" ? "bg-emerald-500/15 text-emerald-700" : o.status === "Rejected" ? "bg-rose-500/15 text-rose-700" : "bg-amber-500/15 text-amber-700"}`}>{o.status}</Badge></TableCell>
      {isManagerOrAbove && (<TableCell className="text-right">{o.status === "Pending" ? (<OvertimeActionBtns id={o.id} onUpdate={onUpdate} />) : (<span className="text-[11px] text-muted-foreground">—</span>)}</TableCell>)}
    </TableRow>
  );
}

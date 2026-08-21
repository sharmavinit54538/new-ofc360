import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PunchRecord } from "../../../types/attendance.types";

export function OverviewTableRow({ punch: p }: { punch: PunchRecord }) {
  return (
    <TableRow className="hover:bg-muted/30 text-xs">
      <TableCell className="font-semibold text-foreground">{p.employeeName}</TableCell>
      <TableCell className="text-muted-foreground">{p.department || "General"}</TableCell>
      <TableCell><Badge variant="outline" className={`text-[10px] ${p.type === "Check-In" ? "bg-emerald-500/10 text-emerald-600 border-emerald-300" : p.type === "Check-Out" ? "bg-rose-500/10 text-rose-600 border-rose-300" : "bg-amber-500/10 text-amber-600 border-amber-300"}`}>{p.type}</Badge></TableCell>
      <TableCell className="font-mono text-muted-foreground">{p.timestamp}</TableCell>
      <TableCell className="text-muted-foreground">{p.location || "Facial Punch Station"}</TableCell>
      <TableCell><Badge variant="secondary" className={`text-[10px] ${p.status === "Late" ? "bg-amber-500/15 text-amber-700" : p.status === "Half Day" ? "bg-purple-500/15 text-purple-700" : p.status === "Overtime" ? "bg-blue-500/15 text-blue-700" : "bg-emerald-500/15 text-emerald-700"}`}>{p.status || "Present"}</Badge></TableCell>
    </TableRow>
  );
}

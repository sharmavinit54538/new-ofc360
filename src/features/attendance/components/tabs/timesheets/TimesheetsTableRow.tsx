import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { DisplayedTimesheet } from "../../../types/attendance.types";

export function TimesheetsTableRow({ ts: t, isManagerOrAbove, onApprove }: { ts: DisplayedTimesheet; isManagerOrAbove: boolean; onApprove: (id: string) => void }) {
  return (
    <TableRow className="hover:bg-muted/30 text-xs">
      <TableCell className="font-semibold text-foreground">{t.employeeName}</TableCell>
      <TableCell className="font-medium text-foreground">{t.projectName}</TableCell>
      <TableCell className="text-muted-foreground max-w-[220px] truncate">{t.taskDescription}</TableCell>
      <TableCell className="font-mono text-muted-foreground">{t.loggedHours} hrs</TableCell>
      <TableCell><Badge variant={t.billable ? "default" : "secondary"} className="text-[10px]">{t.billable ? "Billable" : "Non-billable"}</Badge></TableCell>
      <TableCell><Badge variant="secondary" className={`text-[10px] ${t.status === "Approved" ? "bg-emerald-500/15 text-emerald-700" : "bg-amber-500/15 text-amber-700"}`}>{t.status}</Badge></TableCell>
      {isManagerOrAbove && (<TableCell className="text-right">{t.status !== "Approved" ? (<Button onClick={() => onApprove(t.id)} size="sm" variant="ghost" className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-500/10"><Check className="h-3.5 w-3.5" /></Button>) : (<span className="text-[11px] text-muted-foreground">—</span>)}</TableCell>)}
    </TableRow>
  );
}

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { RosterItem } from "../../../types/attendance.types";

export function RostersTableRow({ roster: r, onDelete }: { roster: RosterItem; onDelete: (id: string) => void }) {
  return (
    <TableRow className="hover:bg-muted/30 text-xs">
      <TableCell className="font-semibold text-foreground">{r.employeeName}</TableCell>
      <TableCell className="text-muted-foreground">{r.department || "Engineering"}</TableCell>
      <TableCell><Badge variant="outline" className="text-[10px]">{r.shiftName}</Badge></TableCell>
      <TableCell className="font-mono text-muted-foreground">{r.timing}</TableCell>
      <TableCell className="text-muted-foreground">{r.dayOfWeek}</TableCell>
      <TableCell className="text-right"><Button onClick={() => onDelete(r.id)} variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
    </TableRow>
  );
}

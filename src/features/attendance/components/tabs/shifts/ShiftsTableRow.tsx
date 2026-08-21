import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ShiftTemplate } from "../../../types/attendance.types";

export function ShiftsTableRow({ shift: s, onDelete }: { shift: ShiftTemplate; onDelete: (id: string) => void }) {
  return (
    <TableRow className="hover:bg-muted/30 text-xs">
      <TableCell className="font-semibold text-foreground">{s.name}</TableCell>
      <TableCell className="font-mono text-muted-foreground">{s.startTime} - {s.endTime}</TableCell>
      <TableCell className="text-muted-foreground">{s.gracePeriodMins} mins</TableCell>
      <TableCell className="text-muted-foreground">{s.department || "All Departments"}</TableCell>
      <TableCell className="text-right"><Button onClick={() => onDelete(s.id)} variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
    </TableRow>
  );
}

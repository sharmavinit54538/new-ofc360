import { TableRow, TableCell } from "@/components/ui/table";

export function AttendanceEmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center text-xs text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  );
}

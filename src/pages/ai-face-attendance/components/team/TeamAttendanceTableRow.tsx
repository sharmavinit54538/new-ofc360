import { TableRow, TableCell } from "@/components/ui/table";
import { getStatusBadge } from "../../utils/statusBadgeHelper";

export function TeamAttendanceTableRow({ row }: { row: any }) {
  return (
    <TableRow key={row.id}>
      <TableCell className="text-xs font-semibold">{row.employeeName || "Employee"}</TableCell>
      <TableCell className="text-xs font-mono text-muted-foreground">{row.employeeId || "—"}</TableCell>
      <TableCell className="text-xs font-mono">{row.date}</TableCell>
      <TableCell className="text-xs">{row.checkIn || "—"}</TableCell>
      <TableCell className="text-xs">{row.checkOut || "—"}</TableCell>
      <TableCell className="text-xs font-mono">{row.workingHours || "—"}</TableCell>
      <TableCell>{getStatusBadge(row.status)}</TableCell>
    </TableRow>
  );
}

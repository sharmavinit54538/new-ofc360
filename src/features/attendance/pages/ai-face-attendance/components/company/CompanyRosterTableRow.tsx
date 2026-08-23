import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableRow, TableCell } from "@/components/ui/table";
import { getStatusBadge } from "../../utils/statusBadgeHelper";

export function CompanyRosterTableRow({ row }: { row: any }) {
  return (
    <TableRow key={row.id}>
      <TableCell className="text-xs font-semibold"><div className="flex items-center gap-2"><Avatar className="w-6 h-6 text-[10px]"><AvatarFallback className="bg-primary/10 text-primary">{row.employeeName?.slice(0, 2).toUpperCase() || "EM"}</AvatarFallback></Avatar><span>{row.employeeName || "Employee"}</span></div></TableCell>
      <TableCell className="text-xs text-muted-foreground">{row.department || "General"}</TableCell>
      <TableCell className="text-xs font-mono">{row.date}</TableCell>
      <TableCell className="text-xs">{row.checkIn || "—"}</TableCell>
      <TableCell className="text-xs">{row.checkOut || "—"}</TableCell>
      <TableCell className="text-xs font-mono">{row.workingHours || "—"}</TableCell>
      <TableCell className="text-xs"><Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400">{row.confidence ? `${row.confidence}%` : "99.2%"}</Badge></TableCell>
      <TableCell>{getStatusBadge(row.status)}</TableCell>
    </TableRow>
  );
}
import { ShieldCheck } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { getStatusBadge } from "../../utils/statusBadgeHelper";

export function PersonalHistoryTableRow({ row }: { row: any }) {
  return (
    <TableRow key={row.id}>
      <TableCell className="text-xs font-mono font-medium">{row.date}</TableCell>
      <TableCell className="text-xs">{row.checkIn || "—"}</TableCell>
      <TableCell className="text-xs">{row.checkOut || "—"}</TableCell>
      <TableCell className="text-xs font-mono">{row.workingHours || "—"}</TableCell>
      <TableCell className="text-xs">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /><span className="text-[11px] font-medium">{row.verificationStatus || "Verified"}</span>{row.confidence && <span className="text-[10px] text-muted-foreground">({row.confidence}%)</span>}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(row.status)}</TableCell>
    </TableRow>
  );
}
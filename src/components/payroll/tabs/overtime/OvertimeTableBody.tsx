import { TableBody } from "@/components/ui/table";
import { Clock, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { OvertimeRow } from "./OvertimeRow";

export function OvertimeTableBody() {
  const { isOvertimeLoading, overtimeList } = usePayrollContext();
  if (isOvertimeLoading) {
    return <TableBody><tr><td colSpan={7} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading...</p></td></tr></TableBody>;
  }
  if (overtimeList.length === 0) {
    return <TableBody><tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-xs"><Clock className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No overtime hours logged</p></td></tr></TableBody>;
  }
  return (
    <TableBody>
      {overtimeList.map((o: any) => <OvertimeRow key={o.id} o={o} />)}
    </TableBody>
  );
}

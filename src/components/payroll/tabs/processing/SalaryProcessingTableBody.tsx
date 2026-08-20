import { TableBody } from "@/components/ui/table";
import { Loader2, Play } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { SalaryProcessingRow } from "./SalaryProcessingRow";

export function SalaryProcessingTableBody() {
  const { isSalaryProcLoading, payCyclesList, salaryProcRes, runMonth } = usePayrollContext();
  const list = payCyclesList.length > 0 ? payCyclesList : salaryProcRes?.data ? [salaryProcRes.data] : [];
  if (isSalaryProcLoading) return <TableBody><tr><td colSpan={6} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading...</p></td></tr></TableBody>;
  if (list.length === 0) return <TableBody><tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-xs"><Play className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No payroll runs executed yet</p></td></tr></TableBody>;
  return (
    <TableBody>
      {list.map((r: any, idx: number) => <SalaryProcessingRow key={r.id || idx} r={r} runMonth={runMonth} />)}
    </TableBody>
  );
}

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePayrollContext } from "../../PayrollContext";

export function TaxRow({ t }: { t: any }) {
  const { fmt } = usePayrollContext();
  const reg = t.tax_code || t.taxCode || "New Tax Regime", limit80C = t.rate || 150000, tds = Math.round(limit80C * 0.15);
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">{t.name || "TDS Declaration"}</TableCell>
      <TableCell><Badge variant="outline" className="text-[10px] bg-card">{reg}</Badge></TableCell>
      <TableCell className="text-xs font-mono">{fmt(limit80C)}</TableCell>
      <TableCell className="text-xs font-mono text-muted-foreground">{fmt(25000)}</TableCell>
      <TableCell className="text-xs font-mono font-bold text-destructive">-{fmt(tds)} / Mo</TableCell>
      <TableCell className="text-right"><Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">{t.is_active ? "Active" : "Draft"}</Badge></TableCell>
    </TableRow>
  );
}

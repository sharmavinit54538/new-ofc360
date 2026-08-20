import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ComplianceRow({ c }: { c: any }) {
  const cat = c.category?.toUpperCase().replace("_", " ") || "TAX";
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">
        <div>{c.rule_name || "Statutory Rule"}</div>
        <div className="text-[10px] text-primary mt-0.5">{cat}</div>
      </TableCell>
      <TableCell className="text-xs font-bold text-muted-foreground">{c.state ? `${c.state}, ${c.country}` : c.country}</TableCell>
      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{c.description || "Central statutory labor policy standard."}</TableCell>
      <TableCell className="text-xs font-mono">{c.effective_date || "2026-04-01"}</TableCell>
      <TableCell className="text-right"><Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">{c.is_active ? "Compliant" : "Inactive"}</Badge></TableCell>
    </TableRow>
  );
}

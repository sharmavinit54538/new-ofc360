import { TableCell, TableRow } from "@/components/ui/table"; import { Badge } from "@/components/ui/badge";
import { BankTransferAction } from "./BankTransferAction"; import { usePayrollContext } from "../../PayrollContext";

export function BankTransferRow({ b }: { b: any }) {
  const c = usePayrollContext();
  const isOk = ["completed", "processing"].includes(b.status?.toLowerCase() || "completed");
  return (
    <TableRow>
      <TableCell className="font-bold text-xs text-foreground">{b.id || "BNK-BATCH-01"}</TableCell>
      <TableCell className="text-xs font-bold text-muted-foreground">{b.bank_name || "HDFC"}</TableCell>
      <TableCell className="text-xs font-mono">{b.batch_reference || "HDFC-PAY"}</TableCell>
      <TableCell className="text-xs font-mono font-bold">{b.transfer_count || 10} E</TableCell>
      <TableCell className="text-xs font-mono font-bold text-primary">{c.fmt(b.total_amount || 720000)}</TableCell>
      <TableCell><Badge className={isOk ? "bg-emerald-500/15 text-emerald-500" : "bg-destructive/15 text-destructive"}>{b.status || "Completed"}</Badge></TableCell>
      <TableCell className="text-right"><BankTransferAction b={b} /></TableCell>
    </TableRow>
  );
}

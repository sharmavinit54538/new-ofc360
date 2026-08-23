import { TableBody } from "@/components/ui/table";
import { ShieldCheck, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { TaxRow } from "./TaxRow";

export function TaxTableBody() {
  const { isTaxesLoading, taxesList } = usePayrollContext();
  if (isTaxesLoading) {
    return <TableBody><tr><td colSpan={6} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading declarations...</p></td></tr></TableBody>;
  }
  if (taxesList.length === 0) {
    return <TableBody><tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-xs"><ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No tax declarations submitted</p></td></tr></TableBody>;
  }
  return (
    <TableBody>
      {taxesList.map((t: any) => <TaxRow key={t.id} t={t} />)}
    </TableBody>
  );
}

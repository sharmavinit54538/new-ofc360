import { TableBody } from "@/components/ui/table";
import { Award, Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";
import { BonusRow } from "./BonusRow";

export function BonusesTableBody() {
  const { isBonusesLoading, bonusesList } = usePayrollContext();
  if (isBonusesLoading) {
    return <TableBody><tr><td colSpan={6} className="text-center py-12 text-xs"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" /><p className="text-muted-foreground">Loading...</p></td></tr></TableBody>;
  }
  if (bonusesList.length === 0) {
    return <TableBody><tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-xs"><Award className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" /><p className="font-bold text-sm text-foreground">No bonus records created</p></td></tr></TableBody>;
  }
  return (
    <TableBody>
      {bonusesList.map((b: any) => <BonusRow key={b.id} b={b} />)}
    </TableBody>
  );
}

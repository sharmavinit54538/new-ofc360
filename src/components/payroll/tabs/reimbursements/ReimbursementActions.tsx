import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function ReimbursementActions({ id }: { id: string }) {
  const c = usePayrollContext();
  return (
    <div className="flex items-center justify-end gap-1">
      <Button size="sm" variant="ghost" onClick={() => c.handleApproveReimbursement(id)} disabled={c.isApprovingReimb} className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10">Approve</Button>
      <Button size="sm" variant="ghost" onClick={() => c.handleRejectReimbursement(id)} disabled={c.isRejectingReimb} className="h-7 text-xs text-destructive hover:bg-destructive/10">Reject</Button>
    </div>
  );
}

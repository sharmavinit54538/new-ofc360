import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function BonusesHeader() {
  const { setIsBonusModalOpen } = usePayrollContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">One-Time Bonuses & Variable Payouts</h2>
        <p className="text-xs text-muted-foreground">Approve spot awards, referral incentives, and annual performance payouts.</p>
      </div>
      <Button onClick={() => setIsBonusModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
        <Plus className="w-4 h-4" /> Add Bonus Entry
      </Button>
    </div>
  );
}

import { Landmark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BankAccountsSectionHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        <Landmark className="w-4 h-4 text-primary" />
        <span>11. Bank Account & Payroll Payout</span>
      </div>
      <Button type="button" size="sm" onClick={onAdd} className="h-8 text-xs gap-1">
        <Plus className="w-3.5 h-3.5" /> Add Bank Account
      </Button>
    </div>
  );
}

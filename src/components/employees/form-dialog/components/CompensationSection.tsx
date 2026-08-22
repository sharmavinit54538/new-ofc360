import { DollarSign } from "lucide-react";
import type { CompensationState } from "../types/compensationTypes";
import { CompensationSalaryRow } from "./CompensationSalaryRow";
import { CompensationDeductionsRow } from "./CompensationDeductionsRow";

export function CompensationSection({ comp }: { comp: CompensationState }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/40 pb-2">
        <DollarSign className="w-4 h-4 text-primary" />
        <span>4. Compensation Structure & Deductions</span>
      </div>
      <CompensationSalaryRow comp={comp} />
      <CompensationDeductionsRow comp={comp} />
    </div>
  );
}

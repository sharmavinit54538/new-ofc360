import { DeductionsHeader } from "./deductions/DeductionsHeader";
import { DeductionsList } from "./deductions/DeductionsList";

export function DeductionsTab() {
  return (
    <div className="space-y-6">
      <DeductionsHeader />
      <DeductionsList />
    </div>
  );
}

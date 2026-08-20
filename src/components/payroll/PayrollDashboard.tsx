import { PayrollNavigation } from "./PayrollNavigation";
import { PayrollTabContent } from "./PayrollTabContent";
import * as Modals from "./modals";

export function PayrollDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-6">
      <PayrollNavigation />
      <PayrollTabContent />
      <Modals.RunPayrollModal />
      <Modals.AddStructureModal />
      <Modals.SubmitReimbursementModal />
      <Modals.AddBonusModal />
      <Modals.AddDeductionModal />
      <Modals.RequestAdvanceModal />
      <Modals.DeclareTaxModal />
    </div>
  );
}

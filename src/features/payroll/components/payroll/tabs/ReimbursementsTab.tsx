import { ReimbursementsHeader } from "./reimbursements/ReimbursementsHeader";
import { ReimbursementsTable } from "./reimbursements/ReimbursementsTable";

export function ReimbursementsTab() {
  return (
    <div className="space-y-6">
      <ReimbursementsHeader />
      <ReimbursementsTable />
    </div>
  );
}

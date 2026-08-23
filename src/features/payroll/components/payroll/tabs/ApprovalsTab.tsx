import { ApprovalsHeader } from "./approvals/ApprovalsHeader";
import { ApprovalsWorkflowList } from "./approvals/ApprovalsWorkflowList";

export function ApprovalsTab() {
  return (
    <div className="space-y-6">
      <ApprovalsHeader />
      <ApprovalsWorkflowList />
    </div>
  );
}

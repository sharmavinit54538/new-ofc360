import { ComplianceHeader } from "./compliance/ComplianceHeader";
import { ComplianceTable } from "./compliance/ComplianceTable";

export function ComplianceTab() {
  return (
    <div className="space-y-6">
      <ComplianceHeader />
      <ComplianceTable />
    </div>
  );
}

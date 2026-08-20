import { SalaryProcessingHeader } from "./processing/SalaryProcessingHeader";
import { SalaryProcessingTable } from "./processing/SalaryProcessingTable";

export function SalaryProcessingTab() {
  return (
    <div className="space-y-6">
      <SalaryProcessingHeader />
      <SalaryProcessingTable />
    </div>
  );
}

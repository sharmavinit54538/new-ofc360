import { SalaryStructureHeader } from "./structure/SalaryStructureHeader";
import { SalaryStructureList } from "./structure/SalaryStructureList";

export function SalaryStructureTab() {
  return (
    <div className="space-y-6">
      <SalaryStructureHeader />
      <SalaryStructureList />
    </div>
  );
}

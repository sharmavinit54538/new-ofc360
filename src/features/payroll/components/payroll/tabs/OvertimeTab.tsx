import { OvertimeHeader } from "./overtime/OvertimeHeader";
import { OvertimeTable } from "./overtime/OvertimeTable";

export function OvertimeTab() {
  return (
    <div className="space-y-6">
      <OvertimeHeader />
      <OvertimeTable />
    </div>
  );
}

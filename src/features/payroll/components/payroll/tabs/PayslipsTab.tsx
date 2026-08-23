import { PayslipsHeader } from "./payslips/PayslipsHeader";
import { PayslipsTable } from "./payslips/PayslipsTable";

export function PayslipsTab() {
  return (
    <div className="space-y-6">
      <PayslipsHeader />
      <PayslipsTable />
    </div>
  );
}

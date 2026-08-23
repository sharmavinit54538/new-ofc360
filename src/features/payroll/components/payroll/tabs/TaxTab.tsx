import { TaxHeader } from "./tax/TaxHeader";
import { TaxTable } from "./tax/TaxTable";

export function TaxTab() {
  return (
    <div className="space-y-6">
      <TaxHeader />
      <TaxTable />
    </div>
  );
}

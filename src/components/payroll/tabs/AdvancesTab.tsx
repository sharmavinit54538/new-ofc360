import { AdvancesHeader } from "./advances/AdvancesHeader";
import { AdvancesTable } from "./advances/AdvancesTable";

export function AdvancesTab() {
  return (
    <div className="space-y-6">
      <AdvancesHeader />
      <AdvancesTable />
    </div>
  );
}

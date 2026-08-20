import { BonusesHeader } from "./bonuses/BonusesHeader";
import { BonusesTable } from "./bonuses/BonusesTable";

export function BonusesTab() {
  return (
    <div className="space-y-6">
      <BonusesHeader />
      <BonusesTable />
    </div>
  );
}

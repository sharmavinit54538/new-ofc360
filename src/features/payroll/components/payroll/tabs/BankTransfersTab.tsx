import { BankTransfersHeader } from "./bank/BankTransfersHeader";
import { BankTransfersTable } from "./bank/BankTransfersTable";

export function BankTransfersTab() {
  return (
    <div className="space-y-6">
      <BankTransfersHeader />
      <BankTransfersTable />
    </div>
  );
}

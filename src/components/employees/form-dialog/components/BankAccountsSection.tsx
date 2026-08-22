import type { BankAccountItem } from "@/types/hr";
import { BankAccountsSectionHeader } from "./BankAccountsSectionHeader";
import { BankAccountCardItem } from "./BankAccountCardItem";

export function BankAccountsSection({ bankAccounts, setBankAccounts, holderName }: {
  bankAccounts: BankAccountItem[]; setBankAccounts: React.Dispatch<React.SetStateAction<BankAccountItem[]>>; holderName: string;
}) {
  const handleAdd = () => setBankAccounts([...bankAccounts, { id: String(Date.now()), bankName: "HDFC Bank", accountHolder: holderName || "Account Holder", accountNumber: "", ifscCode: "", accountType: "SAVINGS", isPrimary: bankAccounts.length === 0 }]);
  const handleUpdate = (updated: BankAccountItem) => setBankAccounts(bankAccounts.map((b) => (b.id === updated.id ? updated : b)));
  const handleRemove = (id: string) => setBankAccounts(bankAccounts.filter((b) => b.id !== id));
  return (
    <div className="space-y-4">
      <BankAccountsSectionHeader onAdd={handleAdd} />
      {bankAccounts.map((acc) => (
        <BankAccountCardItem key={acc.id} acc={acc} onUpdate={handleUpdate} onRemove={() => handleRemove(acc.id)} />
      ))}
    </div>
  );
}

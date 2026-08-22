import type { NestedListsState } from "../types/nestedListTypes";
import { SkillsSection } from "./SkillsSection";
import { EmergencyContactsSection } from "./EmergencyContactsSection";
import { BankAccountsSection } from "./BankAccountsSection";

export function FormMiscSections({ lists, holderName }: { lists: NestedListsState; holderName: string }) {
  return (
    <>
      <SkillsSection skills={lists.skills} setSkills={lists.setSkills} />
      <EmergencyContactsSection emergencyContacts={lists.emergencyContacts} setEmergencyContacts={lists.setEmergencyContacts} />
      <BankAccountsSection bankAccounts={lists.bankAccounts} setBankAccounts={lists.setBankAccounts} holderName={holderName} />
    </>
  );
}

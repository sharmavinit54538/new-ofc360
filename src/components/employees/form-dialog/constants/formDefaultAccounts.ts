import type { EmergencyContactItem, BankAccountItem } from "@/types/hr";

export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContactItem[] = [
  { id: "em-1", name: "Ramesh Sharma", relationship: "Parent", primaryPhone: "+91 9876543210" },
];

export const DEFAULT_BANK_ACCOUNTS: BankAccountItem[] = [
  { id: "bnk-1", bankName: "HDFC Bank", accountHolder: "Primary Employee", accountNumber: "50100234567890", ifscCode: "HDFC0001234", accountType: "SAVINGS", isPrimary: true },
];

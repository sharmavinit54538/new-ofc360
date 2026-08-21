export interface BankAccountItem {
  id?: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName?: string;
  accountHolder?: string;
  accountType?: string;
  isPrimary?: boolean;
  [key: string]: any;
}

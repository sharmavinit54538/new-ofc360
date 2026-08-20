export interface BankTransfer {
  id: string;
  cycle_id: string;
  total_amount: number;
  transfer_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | string;
  bank_name?: string;
  batch_reference?: string;
  file_url?: string;
  created_at?: string;
  [key: string]: any;
}

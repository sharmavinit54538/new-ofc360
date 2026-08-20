export type PayrollModalType = 'create-cycle' | 'run-payroll' | 'payslip-preview' | null;
export interface PayslipFilterState { page: number; limit: number; employeeId?: string; status?: string; }
export interface BankTransferFilterState { page: number; limit: number; status?: string; }
export interface PayrollUiState { selectedCycleId: string | null; activeModal: PayrollModalType; payslipFilters: PayslipFilterState; bankTransferFilters: BankTransferFilterState; }

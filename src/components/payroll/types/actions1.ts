export interface Actions1Context {
  handleRunPayroll: () => Promise<void>;
  handleCreateStructure: () => Promise<void>;
  handleDeleteStructure: (id: string) => Promise<void>;
  handleDownloadPayslip: (payslipId: string, empName?: string) => Promise<void>;
  handleBulkEmailPayslips: () => Promise<void>;
  handleCreateReimbursement: () => Promise<void>;
  handleApproveReimbursement: (id: string) => Promise<void>;
  handleRejectReimbursement: (id: string) => Promise<void>;
  handleCreateBonus: () => Promise<void>;
  handleApproveBonus: (id: string) => Promise<void>;
  handleCreateDeduction: () => Promise<void>;
  handleDeleteDeduction: (id: string) => Promise<void>;
}

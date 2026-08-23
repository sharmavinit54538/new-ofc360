export interface Actions2Context {
  handleCreateAdvance: () => Promise<void>;
  handleApproveAdvance: (id: string) => Promise<void>;
  handleApproveOvertime: (id: string) => Promise<void>;
  handleCreateTaxDeclaration: () => Promise<void>;
  handleSignOffWorkflow: (tierIndex: number) => Promise<void>;
  handleGenerateBankAdvice: () => Promise<void>;
  handleDownloadBankAdvice: (batch: any) => void;
  handleGenerateEpfoEcr: () => Promise<void>;
  handleExportAccountingLedger: () => Promise<void>;
  handleSaveSettings: (partialSettings: any) => Promise<void>;
  handleSendCopilotMessage: () => Promise<void>;
}

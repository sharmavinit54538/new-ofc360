import { describe, it, expect } from "vitest";
import {
  salaryStructureApi,
  payslipsApi,
  reimbursementsApi,
  bonusesApi,
  deductionsApi,
  advancesApi,
  overtimeApi,
  taxApi,
  salaryProcessingApi,
  bankTransfersApi,
  complianceApi,
  settingsApi,
  dashboardCopilotApi,
  aiPayrollApi,
  payCyclesApi,
  componentsApi,
} from "@/features/payroll";

describe("OFC360 Payroll Frontend – Complete API Integration Tests", () => {
  describe("1. Salary Structure API Endpoints & Wiring", () => {
    it("should have all required Salary Structure endpoints defined", () => {
      const endpoints = salaryStructureApi.endpoints;
      expect(endpoints.getSalaryStructures).toBeDefined();
      expect(endpoints.getSalaryStructureById).toBeDefined();
      expect(endpoints.getEmployeeSalaryStructure).toBeDefined();
      expect(endpoints.createSalaryStructure).toBeDefined();
      expect(endpoints.updateSalaryStructure).toBeDefined();
      expect(endpoints.deleteSalaryStructure).toBeDefined();
      expect(endpoints.assignSalaryStructure).toBeDefined();
    });
  });

  describe("2. Payslips API Endpoints & Wiring", () => {
    it("should have all required Payslip endpoints defined", () => {
      const endpoints = payslipsApi.endpoints;
      expect(endpoints.getPayslips).toBeDefined();
      expect(endpoints.getPayslipById).toBeDefined();
      expect(endpoints.downloadPayslipPdf).toBeDefined();
      expect(endpoints.bulkGeneratePayslips).toBeDefined();
      expect(endpoints.bulkEmailPayslips).toBeDefined();
      expect(endpoints.deletePayslip).toBeDefined();
      expect(endpoints.regeneratePayslip).toBeDefined();
    });
  });

  describe("3. Reimbursements API Endpoints & Wiring", () => {
    it("should have all required Reimbursement endpoints defined", () => {
      const endpoints = reimbursementsApi.endpoints;
      expect(endpoints.getReimbursements).toBeDefined();
      expect(endpoints.createReimbursement).toBeDefined();
      expect(endpoints.approveReimbursement).toBeDefined();
      expect(endpoints.rejectReimbursement).toBeDefined();
      expect(endpoints.bulkApproveReimbursements).toBeDefined();
      expect(endpoints.getReimbursementsAuditLogs).toBeDefined();
      expect(endpoints.getReimbursementsAiInsights).toBeDefined();
    });
  });

  describe("4. Bonuses API Endpoints & Wiring", () => {
    it("should have all required Bonus endpoints defined", () => {
      const endpoints = bonusesApi.endpoints;
      expect(endpoints.getBonuses).toBeDefined();
      expect(endpoints.getBonusPlans).toBeDefined();
      expect(endpoints.createBonus).toBeDefined();
      expect(endpoints.approveBonus).toBeDefined();
      expect(endpoints.rejectBonus).toBeDefined();
    });
  });

  describe("5. Deductions API Endpoints & Wiring", () => {
    it("should have all required Deduction CRUD endpoints defined", () => {
      const endpoints = deductionsApi.endpoints;
      expect(endpoints.getDeductions).toBeDefined();
      expect(endpoints.getDeductionById).toBeDefined();
      expect(endpoints.createDeduction).toBeDefined();
      expect(endpoints.updateDeduction).toBeDefined();
      expect(endpoints.deleteDeduction).toBeDefined();
    });
  });

  describe("6. Advances API Endpoints & Wiring", () => {
    it("should have all required Salary Advance endpoints defined", () => {
      const endpoints = advancesApi.endpoints;
      expect(endpoints.getAdvances).toBeDefined();
      expect(endpoints.createAdvance).toBeDefined();
      expect(endpoints.approveAdvance).toBeDefined();
      expect(endpoints.rejectAdvance).toBeDefined();
      expect(endpoints.advancesCopilotChat).toBeDefined();
    });
  });

  describe("7. Overtime API Endpoints & Wiring", () => {
    it("should have all required Overtime endpoints defined", () => {
      const endpoints = overtimeApi.endpoints;
      expect(endpoints.getOvertimeEntries).toBeDefined();
      expect(endpoints.createOvertimeEntry).toBeDefined();
      expect(endpoints.approveOvertime).toBeDefined();
      expect(endpoints.rejectOvertime).toBeDefined();
      expect(endpoints.getOvertimeSettings).toBeDefined();
      expect(endpoints.updateOvertimeSettings).toBeDefined();
      expect(endpoints.calculateOvertime).toBeDefined();
    });
  });

  describe("8. Tax API Endpoints & Wiring", () => {
    it("should have all required Tax endpoints defined", () => {
      const endpoints = taxApi.endpoints;
      expect(endpoints.getTaxes).toBeDefined();
      expect(endpoints.getAdminTax).toBeDefined();
      expect(endpoints.getTaxById).toBeDefined();
      expect(endpoints.createTax).toBeDefined();
      expect(endpoints.updateTax).toBeDefined();
      expect(endpoints.deleteTax).toBeDefined();
      expect(endpoints.recalculateTaxes).toBeDefined();
    });
  });

  describe("9. Approvals & Salary Processing API Endpoints & Wiring", () => {
    it("should have all required Salary Processing and Multi-Tier Approval endpoints defined", () => {
      const endpoints = salaryProcessingApi.endpoints;
      expect(endpoints.getSalaryProcessing).toBeDefined();
      expect(endpoints.getSalaryProcessingApprovalWorkflow).toBeDefined();
      expect(endpoints.getSalaryProcessingHero).toBeDefined();
      expect(endpoints.getSalaryProcessingKpis).toBeDefined();
      expect(endpoints.runSalaryProcessing).toBeDefined();
      expect(endpoints.approveSalaryProcessing).toBeDefined();
      expect(endpoints.rollbackSalaryProcessing).toBeDefined();
      expect(endpoints.batchApproveSalaryProcessing).toBeDefined();
    });
  });

  describe("10. Bank Transfers API Endpoints & Wiring", () => {
    it("should have all required Bank Transfer endpoints defined", () => {
      const endpoints = bankTransfersApi.endpoints;
      expect(endpoints.getBankTransfers).toBeDefined();
      expect(endpoints.getBankTransfersDashboard).toBeDefined();
      expect(endpoints.generateBankTransferFile).toBeDefined();
      expect(endpoints.initiateBankTransfer).toBeDefined();
      expect(endpoints.batchBankTransfers).toBeDefined();
      expect(endpoints.markBankTransferPaid).toBeDefined();
      expect(endpoints.retryBankTransfer).toBeDefined();
    });
  });

  describe("11. Compliance API Endpoints & Wiring", () => {
    it("should have all required Compliance endpoints defined", () => {
      const endpoints = complianceApi.endpoints;
      expect(endpoints.getComplianceRules).toBeDefined();
      expect(endpoints.getComplianceDashboard).toBeDefined();
      expect(endpoints.getComplianceConfig).toBeDefined();
      expect(endpoints.getComplianceCalendar).toBeDefined();
      expect(endpoints.createComplianceRule).toBeDefined();
      expect(endpoints.generateComplianceChallan).toBeDefined();
      expect(endpoints.validateCompliance).toBeDefined();
    });
  });

  describe("12. Reports & Analytics API Endpoints & Wiring", () => {
    it("should have all required Payroll Reports and Analytics endpoints defined", () => {
      expect(salaryProcessingApi.endpoints.getSalaryProcessingAnalytics).toBeDefined();
      expect(salaryProcessingApi.endpoints.exportSalaryProcessing).toBeDefined();
      expect(salaryProcessingApi.endpoints.getSalaryProcessingKpis).toBeDefined();
    });
  });

  describe("13. Settings API Endpoints & Wiring", () => {
    it("should have all required Settings endpoints defined", () => {
      const endpoints = settingsApi.endpoints;
      expect(endpoints.getPayrollSettings).toBeDefined();
      expect(endpoints.updatePayrollSettings).toBeDefined();
      expect(endpoints.resetPayrollSettings).toBeDefined();
      expect(endpoints.getPayrollSettingsAudit).toBeDefined();
      expect(endpoints.getPayrollSettingsHistory).toBeDefined();
    });
  });

  describe("14. Copilot & AI Intelligence API Endpoints & Wiring", () => {
    it("should have all required Copilot and AI Payroll endpoints defined", () => {
      expect(dashboardCopilotApi.endpoints.getPayrollDashboard).toBeDefined();
      expect(dashboardCopilotApi.endpoints.payrollCopilotChat).toBeDefined();
      expect(aiPayrollApi.endpoints.getAiPayrollDashboard).toBeDefined();
      expect(aiPayrollApi.endpoints.getAiPayrollAnomalies).toBeDefined();
      expect(aiPayrollApi.endpoints.getAiPayrollHealthScore).toBeDefined();
      expect(aiPayrollApi.endpoints.getAiPayrollCostAnalysis).toBeDefined();
      expect(aiPayrollApi.endpoints.detectAiPayrollAnomalies).toBeDefined();
    });
  });

  describe("15. Pay Cycles & Salary Components API Endpoints & Wiring", () => {
    it("should have all required Pay Cycles and Component endpoints defined", () => {
      expect(payCyclesApi.endpoints.getPayCycles).toBeDefined();
      expect(payCyclesApi.endpoints.createPayCycle).toBeDefined();
      expect(payCyclesApi.endpoints.activatePayCycle).toBeDefined();
      expect(payCyclesApi.endpoints.lockPayCycle).toBeDefined();
      expect(componentsApi.endpoints.getSalaryComponents).toBeDefined();
      expect(componentsApi.endpoints.createSalaryComponent).toBeDefined();
    });
  });
});
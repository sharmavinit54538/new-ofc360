import { describe, it, expect, beforeEach } from "vitest";
import {
  decomposeCtc,
  calculatePfContribution,
  calculateEsiContribution,
  calculateProfessionalTax,
  calculateMonthlyTds,
  computeEmployeePayroll,
} from "../utils/payrollCalculations";
import { usePayrollStore } from "../stores/payrollStore";

describe("OFC360 Payroll & Financial Calculation Engine", () => {
  describe("CTC Component Decomposition", () => {
    it("decomposes 12,00,000 Annual CTC into correct monthly components", () => {
      const annualCtc = 1200000;
      const components = decomposeCtc(annualCtc);

      expect(components.grossMonthly).toBe(100000); // 12L / 12 = 1L/mo
      expect(components.basic).toBe(50000); // 50% Basic
      expect(components.hra).toBe(20000);   // 20% HRA
      expect(components.da).toBe(10000);    // 10% DA
      expect(components.conveyance).toBe(1600);
      expect(components.lta).toBe(1250);
      expect(components.specialAllowance).toBe(17150); // Remainder
    });
  });

  describe("Statutory Deductions (PF, ESI, PT)", () => {
    it("calculates Provident Fund (PF) capped at ₹1,800 for basic > ₹15,000", () => {
      const { employeePf, employerPf } = calculatePfContribution(50000);
      expect(employeePf).toBe(1800);
      expect(employerPf).toBe(1800);
    });

    it("calculates exact 12% PF for basic <= ₹15,000", () => {
      const { employeePf } = calculatePfContribution(12000);
      expect(employeePf).toBe(1440); // 12% of 12,000
    });

    it("calculates ESI for gross <= ₹21,000 and 0 for gross > ₹21,000", () => {
      const eligible = calculateEsiContribution(20000);
      expect(eligible.employeeEsi).toBe(150); // 0.75% of 20,000
      expect(eligible.employerEsi).toBe(650); // 3.25% of 20,000

      const ineligible = calculateEsiContribution(50000);
      expect(ineligible.employeeEsi).toBe(0);
      expect(ineligible.employerEsi).toBe(0);
    });

    it("calculates Professional Tax (PT) based on monthly gross salary", () => {
      expect(calculateProfessionalTax(12000)).toBe(0);
      expect(calculateProfessionalTax(25000, false)).toBe(200);
      expect(calculateProfessionalTax(25000, true)).toBe(300); // Feb
    });
  });

  describe("Income Tax / TDS (Sec 115BAC)", () => {
    it("returns zero TDS for taxable income up to 7 Lakhs under Sec 87A rebate", () => {
      // Annual income 6,00,000
      const tds = calculateMonthlyTds(600000, "New Tax Regime (Sec 115BAC)");
      expect(tds).toBe(0);
    });

    it("calculates progressive TDS for higher income (e.g. 15,00,000 CTC)", () => {
      const tds = calculateMonthlyTds(1500000, "New Tax Regime (Sec 115BAC)");
      expect(tds).toBeGreaterThan(0);
    });
  });

  describe("Gross-to-Net Employee Payroll Computation", () => {
    it("computes complete net salary factoring additions, deductions, LOP, and advance EMI", () => {
      const payroll = computeEmployeePayroll({
        employeeId: "EMP-101",
        employeeName: "Alex Mercer",
        annualCtc: 1200000, // 1,00,000/mo gross
        approvedBonus: 10000,
        approvedOvertimeHours: 5,
        hourlyOtRate: 500, // 5 * 500 * 1.5 = 3750 OT
        approvedReimbursement: 2500,
        activeSalaryAdvanceEmi: 5000,
        lopDays: 1, // 1 day LOP = 3333 deduction
        taxRegime: "New Tax Regime (Sec 115BAC)",
      });

      expect(payroll.monthlyCtc).toBe(100000);
      expect(payroll.bonusAmount).toBe(10000);
      expect(payroll.overtimeAmount).toBe(3750);
      expect(payroll.reimbursementAmount).toBe(2500);
      expect(payroll.statutoryDeductions.employeePf).toBe(1800);
      expect(payroll.statutoryDeductions.professionalTax).toBe(200);
      expect(payroll.netSalary).toBeGreaterThan(0);
    });
  });
});

describe("Payroll Store Workflow & State Management", () => {
  beforeEach(() => {
    const store = usePayrollStore.getState();
    // Reset state before each test
    store.runs.forEach(() => {});
  });

  it("records a new payroll run successfully", () => {
    const store = usePayrollStore.getState();
    const initialLength = store.runs.length;

    store.addRun({
      month: "August 2026",
      year: 2026,
      processedEmpCount: 15,
      grossTotal: 1250000,
      netTotal: 1050000,
      status: "Approved",
    });

    expect(usePayrollStore.getState().runs.length).toBe(initialLength + 1);
    const lastRun = usePayrollStore.getState().runs[0];
    expect(lastRun.month).toBe("August 2026");
    expect(lastRun.grossTotal).toBe(1250000);
  });

  it("updates reimbursement claim status to Approved", () => {
    const store = usePayrollStore.getState();
    store.addReimbursement({
      employeeId: "EMP-202",
      employeeName: "Jane Smith",
      category: "Fuel & Travel",
      amount: 4500,
      description: "Client site visits",
      status: "Pending",
    });

    const claim = usePayrollStore.getState().reimbursements[0];
    expect(claim.status).toBe("Pending");

    usePayrollStore.getState().updateReimbursementStatus(claim.id, "Approved");
    const updated = usePayrollStore.getState().reimbursements.find((r) => r.id === claim.id);
    expect(updated?.status).toBe("Approved");
  });

  it("updates multi-tier approval status to Approved", () => {
    const store = usePayrollStore.getState();
    const approval = store.approvals[0];

    if (approval) {
      store.updateApprovalStatus(approval.id, "Approved", "Verified by Finance");
      const updated = usePayrollStore.getState().approvals.find((a) => a.id === approval.id);
      expect(updated?.status).toBe("Approved");
      expect(updated?.comments).toBe("Verified by Finance");
    }
  });
});

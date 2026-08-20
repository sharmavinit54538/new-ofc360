import type { PayrollRun, SalaryStructure } from "./payrollRunTypes";

export const DEFAULT_PAYROLL_RUNS: PayrollRun[] = [
  { id: "PAY-2026-07", month: "July", year: 2026, processedEmpCount: 48, grossTotal: 3420000, netTotal: 2980000, status: "Disbursed", processedAt: "2026-07-31" },
  { id: "PAY-2026-08", month: "August", year: 2026, processedEmpCount: 52, grossTotal: 3750000, netTotal: 3260000, status: "Draft", processedAt: "2026-08-15" },
];
export const DEFAULT_SALARY_STRUCTURES: SalaryStructure[] = [
  { id: "STR-L1", gradeName: "Engineering L1 - Associate", basicPct: 40, hraPct: 20, daPct: 10, specialAllowancePct: 20, conveyance: 5000, lta: 5000 },
  { id: "STR-L2", gradeName: "Engineering L2 - Mid", basicPct: 40, hraPct: 20, daPct: 10, specialAllowancePct: 20, conveyance: 5000, lta: 5000 },
];
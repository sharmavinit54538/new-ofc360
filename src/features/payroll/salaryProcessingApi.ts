import { baseApi } from "@/services/api/baseApi";
export * from "./salaryProcessing/getSalaryProcessing";
export * from "./salaryProcessing/runSalaryProcessing";
export * from "./salaryProcessing/batchSalaryProcessing";
export * from "./salaryProcessing/payslipBankSalaryProcessing";
export const salaryProcessingApi = baseApi as any;
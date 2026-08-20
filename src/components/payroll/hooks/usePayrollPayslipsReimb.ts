import { useGetPayslipsQuery, useGetReimbursementsQuery } from "@/features/payroll";

export function usePayrollPayslipsReimb(activeTab: string) {
  const { data: payslipsRes, isLoading: isPayslipsLoading } = useGetPayslipsQuery(undefined, {
    skip: activeTab !== "payslips",
  });
  const { data: reimbursementsRes, isLoading: isReimbursementsLoading } = useGetReimbursementsQuery(undefined, {
    skip: activeTab !== "reimbursements",
  });
  const raw = payslipsRes?.data;
  const payslipsList = Array.isArray(raw) ? raw : raw?.items || raw?.payslips || [];
  return {
    isPayslipsLoading, payslipsList,
    isReimbursementsLoading, reimbursementsList: reimbursementsRes?.data || [],
  };
}

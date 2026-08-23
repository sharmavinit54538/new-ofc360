import { useGetOvertimeEntriesQuery, useGetTaxesQuery, useGetBankTransfersQuery } from "@/features/payroll";

export function usePayrollOtTaxTransfers(activeTab: string) {
  const { data: overtimeRes, isLoading: isOvertimeLoading } = useGetOvertimeEntriesQuery(undefined, { skip: activeTab !== "overtime" });
  const { data: taxesRes, isLoading: isTaxesLoading } = useGetTaxesQuery(undefined, { skip: activeTab !== "tax" });
  const { data: bankTransfersRes, isLoading: isBankTransfersLoading } = useGetBankTransfersQuery(undefined, { skip: activeTab !== "bank-transfers" });
  return {
    isOvertimeLoading, overtimeList: overtimeRes?.data || [],
    isTaxesLoading, taxesList: taxesRes?.data || [],
    isBankTransfersLoading, bankTransfersList: bankTransfersRes?.data || [],
  };
}

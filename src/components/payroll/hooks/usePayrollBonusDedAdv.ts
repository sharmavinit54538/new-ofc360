import { useGetBonusesQuery, useGetDeductionsQuery, useGetAdvancesQuery } from "@/features/payroll";

export function usePayrollBonusDedAdv(activeTab: string) {
  const { data: bonusesRes, isLoading: isBonusesLoading } = useGetBonusesQuery(undefined, { skip: activeTab !== "bonuses" });
  const { data: deductionsRes, isLoading: isDeductionsLoading } = useGetDeductionsQuery(undefined, { skip: activeTab !== "deductions" });
  const { data: advancesRes, isLoading: isAdvancesLoading } = useGetAdvancesQuery(undefined, { skip: activeTab !== "advances" });
  return {
    isBonusesLoading, bonusesList: bonusesRes?.data || [],
    isDeductionsLoading, deductionsList: deductionsRes?.data || [],
    isAdvancesLoading, advancesList: advancesRes?.data || [],
  };
}

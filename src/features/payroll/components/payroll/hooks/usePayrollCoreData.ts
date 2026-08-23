import { useGetSalaryProcessingQuery, useGetPayCyclesQuery, useGetSalaryStructuresQuery } from "@/features/payroll";

export function usePayrollCoreData(activeTab: string) {
  const { data: salaryProcRes, isLoading: isSalaryProcLoading } = useGetSalaryProcessingQuery(undefined, {
    skip: activeTab !== "salary-processing" && activeTab !== "reports",
  });
  const { data: payCyclesRes } = useGetPayCyclesQuery(undefined, { skip: activeTab !== "salary-processing" });
  const { data: structuresRes, isLoading: isStructuresLoading } = useGetSalaryStructuresQuery(undefined, {
    skip: activeTab !== "salary-structure",
  });
  return {
    salaryProcRes, isSalaryProcLoading,
    payCyclesList: payCyclesRes?.data || [],
    isStructuresLoading, structuresList: structuresRes?.data || [],
  };
}

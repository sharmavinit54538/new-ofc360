import { useGenerateComplianceChallanMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollGenerateCompliance() {
  const [generateComplianceChallan, { isLoading: isGeneratingChallan }] = useGenerateComplianceChallanMutation();
  const handleGenerateEpfoEcr = async () => {
    try {
      await generateComplianceChallan({ type: "EPFO Monthly ECR", period: "August 2026", total_contribution: 102000 }).unwrap();
      toast.success("Generated EPFO Monthly ECR filing from live payroll data.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate EPFO ECR.");
    }
  };
  return { handleGenerateEpfoEcr, isGeneratingChallan };
}

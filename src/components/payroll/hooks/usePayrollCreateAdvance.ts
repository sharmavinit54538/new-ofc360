import { useCreateAdvanceMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateAdvance(props: any) {
  const [createAdvance, { isLoading: isCreatingAdvance }] = useCreateAdvanceMutation();
  const handleCreateAdvance = async (): Promise<void> => {
    if (!props.advEmp.trim() || !props.advAmount) {
      toast.error("Employee and loan amount are required.");
      return;
    }
    try {
      const p = parseFloat(props.advAmount) || 0, tenure = parseInt(props.advTenure) || 6, m = Math.round(p / tenure);
      await createAdvance({ employee_name: props.advEmp.trim(), principal_amount: p, monthly_repayment: m, remaining_balance: p, tenure_months: tenure, reason: props.advReason.trim() || "Emergency Advance", status: "pending" } as any).unwrap();
      toast.success("Salary Advance requested!");
      props.setAdvEmp(""); props.setAdvAmount(""); props.setAdvReason(""); props.setIsAdvModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to request salary advance.");
    }
  };
  return { handleCreateAdvance, isCreatingAdvance };
}

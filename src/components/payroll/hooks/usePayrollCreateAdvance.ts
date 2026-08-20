import { useCreateAdvanceMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateAdvance(props: any) {
  const [createAdvance, { isLoading: isCreatingAdvance }] = useCreateAdvanceMutation();
  const handleCreateAdvance = async () => {
    if (!props.advEmp.trim() || !props.advAmount) return toast.error("Employee and loan amount are required.");
    const amt = parseFloat(props.advAmount) || 50000;
    const months = parseInt(props.advEmi) || 6;
    try {
      await createAdvance({ employee_name: props.advEmp.trim(), principal_amount: amt, tenure_months: months, monthly_repayment: Math.round(amt / months), remaining_balance: amt, status: "pending" }).unwrap();
      toast.success("Salary advance request submitted!");
      props.setAdvEmp(""); props.setAdvAmount(""); props.setIsAdvModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit advance request.");
    }
  };
  return { handleCreateAdvance, isCreatingAdvance };
}

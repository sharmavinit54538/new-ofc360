import { useCreateReimbursementMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateReimbursement(props: any) {
  const [createReimbursement, { isLoading: isCreatingReimbursement }] = useCreateReimbursementMutation();
  const handleCreateReimbursement = async (): Promise<void> => {
    if (!props.reimbAmount || !props.reimbDesc.trim()) {
      toast.error("Please enter amount and description.");
      return;
    }
    try {
      await createReimbursement({ employee_name: props.reimbEmp || "Current Employee", category: props.reimbCat, amount: parseFloat(props.reimbAmount) || 0, description: props.reimbDesc.trim() } as any).unwrap();
      toast.success("Reimbursement claim submitted!");
      props.setReimbAmount(""); props.setReimbDesc(""); props.setIsReimbModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit claim.");
    }
  };
  return { handleCreateReimbursement, isCreatingReimbursement };
}

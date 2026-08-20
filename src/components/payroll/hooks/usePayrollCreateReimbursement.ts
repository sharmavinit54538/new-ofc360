import { useCreateReimbursementMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateReimbursement(props: any) {
  const [createReimbursement, { isLoading: isCreatingReimb }] = useCreateReimbursementMutation();
  const handleCreateReimbursement = async () => {
    if (!props.reimbAmount || !props.reimbDesc.trim()) return toast.error("Please enter amount and description.");
    try {
      await createReimbursement({ employee_id: props.user?.id || "EMP-CURRENT", employee_name: props.user?.name || "Alex Mercer", category: props.reimbCategory, amount: parseFloat(props.reimbAmount) || 0, remarks: props.reimbDesc.trim(), expense_date: new Date().toISOString().split("T")[0], status: "pending" }).unwrap();
      toast.success("Expense reimbursement claim submitted!");
      props.setReimbAmount(""); props.setReimbDesc(""); props.setIsReimbModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit reimbursement claim.");
    }
  };
  return { handleCreateReimbursement, isCreatingReimb };
}

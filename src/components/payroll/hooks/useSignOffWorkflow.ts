import { useApproveSalaryProcessingMutation } from "@/features/payroll";
import { toast } from "sonner";

export function useSignOffWorkflow(props: any) {
  const [approveSalaryProcessing, { isLoading: isApprovingProc }] = useApproveSalaryProcessingMutation();
  const handleSignOffWorkflow = async (tierIndex: number) => {
    try {
      await approveSalaryProcessing({ tier: tierIndex, approver_id: props.user?.id, status: "approved" }).unwrap();
      toast.success(`Stage 0${tierIndex + 1} sign-off confirmed & locked.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to record approval stage.");
    }
  };
  return { handleSignOffWorkflow, isApprovingProc };
}

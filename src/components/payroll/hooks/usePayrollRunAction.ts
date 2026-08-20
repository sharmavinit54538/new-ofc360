import { useRunSalaryProcessingMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollRunAction(props: any) {
  const [runSalaryProcessing, { isLoading: isRunningPayroll }] = useRunSalaryProcessingMutation();
  const handleRunPayroll = async () => {
    try {
      const active = props.employees.length > 0 ? props.employees : [{ id: props.user?.id || "EMP-001" }];
      await runSalaryProcessing({ month: props.runMonth, year: 2026, employee_count: active.length, apply_lop: true }).unwrap();
      toast.success(`Payroll processed for ${props.runMonth}! Batch calculations synchronized.`);
      props.setIsRunModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to execute salary processing run.");
    }
  };
  return { handleRunPayroll, isRunningPayroll };
}

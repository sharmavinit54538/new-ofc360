import { useBulkEmailPayslipsMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollBulkEmailPayslips() {
  const [bulkEmailPayslips, { isLoading: isEmailingPayslips }] = useBulkEmailPayslipsMutation();
  const handleBulkEmailPayslips = async () => {
    try {
      await bulkEmailPayslips({}).unwrap();
      toast.success("Bulk emailing password-protected payslips to all employees.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to trigger bulk payslip email.");
    }
  };
  return { handleBulkEmailPayslips, isEmailingPayslips };
}

import { useLazyDownloadPayslipPdfQuery } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollDownloadPayslip() {
  const [triggerDownload, { isLoading: isDownloadingPdf }] = useLazyDownloadPayslipPdfQuery();
  const handleDownloadPayslip = async (p: any): Promise<void> => {
    try {
      const blob = await triggerDownload(p.id).unwrap();
      if (!(blob instanceof Blob)) {
        toast.success("Generated successfully.");
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip-${p.employee_name || "Employee"}-${p.pay_period || "Current"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not download payslip PDF.");
    }
  };
  return { handleDownloadPayslip, isDownloadingPdf };
}

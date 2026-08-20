import { useLazyDownloadPayslipPdfQuery } from "@/features/payroll";
import { toast } from "sonner";
import { downloadBlob } from "../utils/downloadBlob";

export function usePayrollDownloadPayslip() {
  const [triggerDownloadPdf] = useLazyDownloadPayslipPdfQuery();
  const handleDownloadPayslip = async (payslipId: string, empName?: string) => {
    try {
      toast.info(`Preparing PDF for ${empName || "employee"}...`);
      const blob = await triggerDownloadPdf(payslipId).unwrap();
      if (!(blob instanceof Blob)) return toast.success("Generated successfully.");
      downloadBlob(blob, `OFC360_Payslip_${payslipId}.pdf`);
      toast.success("Downloaded successfully.");
    } catch (err: any) {
      toast.error(err?.data?.message || "PDF being generated.");
    }
  };
  return { handleDownloadPayslip };
}

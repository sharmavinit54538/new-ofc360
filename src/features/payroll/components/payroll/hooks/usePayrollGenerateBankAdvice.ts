import { useGenerateBankTransferFileMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollGenerateBankAdvice() {
  const [generateBankTransferFile, { isLoading: isGeneratingTransferFile }] = useGenerateBankTransferFileMutation();
  const handleGenerateBankAdvice = async () => {
    try {
      await generateBankTransferFile({ bank_name: "HDFC Bank", batch_reference: "HDFC-PAY-JUNE26", total_amount: 720000, count: 10, file_format: "HDFC TXT Format" }).unwrap();
      toast.success("Generated HDFC corporate payment advice file from backend.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate bank transfer file.");
    }
  };
  return { handleGenerateBankAdvice, isGeneratingTransferFile };
}

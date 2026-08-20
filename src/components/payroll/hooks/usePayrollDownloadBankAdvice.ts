import { toast } from "sonner";

export function usePayrollDownloadBankAdvice() {
  const handleDownloadBankAdvice = (batch: any) => {
    const headers = ["Batch ID", "Bank Name", "Batch Reference", "Employee Count", "Total Amount (INR)", "File Format", "Generated Date", "Account Status"];
    const row = [batch.id || "BNK-BATCH-01", batch.bank_name || batch.bankName || "HDFC Bank", batch.batch_reference || batch.batchReference || "HDFC-PAY-2026", batch.transfer_count || batch.employeeCount || 10, batch.total_amount || batch.totalAmount || 720000, batch.file_format || batch.fileFormat || "HDFC TXT Format", batch.created_at || batch.generatedAt || new Date().toLocaleDateString(), "Corporate Gate Cleared (Masked AC: •••• 4892)"];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `OFC360_Bank_Payout_Advice_${batch.batch_reference || "BATCH"}.csv`;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
    toast.success("Exported bank payout advice.");
  };
  return { handleDownloadBankAdvice };
}

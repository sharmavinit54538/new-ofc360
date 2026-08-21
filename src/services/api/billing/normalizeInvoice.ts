import { BillingInvoice } from "@/types/api/settings";

export function normalizeInvoice(item: any): BillingInvoice {
  if (!item) return {} as BillingInvoice;
  const rawAmount = item.amount ?? item.total ?? item.subtotal ?? 0;
  const dateVal = item.issueDate || item.issue_date || item.date || item.created_at || item.createdAt;
  const urlVal = item.downloadUrl || item.download_url || item.pdfUrl || item.pdf_url || item.hosted_invoice_url;
  return {
    id: String(item.id || item.invoice_id || item.number || `inv_${Math.random().toString(36).slice(2)}`),
    invoiceNumber: item.invoiceNumber || item.invoice_number || item.number || item.code || `INV-${item.id || "001"}`,
    amount: typeof rawAmount === "string" ? parseFloat(rawAmount) || 0 : Number(rawAmount),
    currency: item.currency || "INR", status: item.status || "paid",
    issueDate: dateVal, date: dateVal, dueDate: item.dueDate || item.due_date,
    periodStart: item.periodStart || item.period_start, periodEnd: item.periodEnd || item.period_end,
    downloadUrl: urlVal, pdfUrl: urlVal, receiptUrl: item.receiptUrl || item.receipt_url,
  };
}

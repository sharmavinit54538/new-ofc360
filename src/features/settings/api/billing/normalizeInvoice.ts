import { BillingInvoice } from "@/types/api/settings";

export function normalizeInvoice(item: any): BillingInvoice {
  if (!item) return {} as BillingInvoice;
  const rawAmount = item.amount_paise
    ? item.amount_paise / 100
    : item.amount ?? item.total ?? item.subtotal ?? 0;
  const dateVal =
    item.created_at || item.issueDate || item.issue_date || item.date || item.createdAt;
  const invNumber =
    item.invoiceNumber ||
    item.invoice_number ||
    item.razorpay_payment_id ||
    item.payment_id ||
    item.number ||
    (item.id ? `INV-${String(item.id).slice(0, 8).toUpperCase()}` : "INV-LIVE");
  const urlVal =
    item.downloadUrl ||
    item.download_url ||
    item.pdfUrl ||
    item.pdf_url ||
    item.receipt_url ||
    item.hosted_invoice_url;

  return {
    id: String(item.id || item.transaction_id || item.order_id || `inv_${Date.now()}`),
    invoiceNumber: invNumber,
    amount: typeof rawAmount === "string" ? parseFloat(rawAmount) || 0 : Number(rawAmount),
    currency: item.currency || "INR",
    status: (item.status || "paid").toLowerCase(),
    issueDate: dateVal || "",
    date: dateVal || "",
    dueDate: item.dueDate || item.due_date,
    periodStart: item.periodStart || item.period_start,
    periodEnd: item.periodEnd || item.period_end,
    downloadUrl: urlVal,
    pdfUrl: urlVal,
    receiptUrl: item.receiptUrl || item.receipt_url,
  };
}



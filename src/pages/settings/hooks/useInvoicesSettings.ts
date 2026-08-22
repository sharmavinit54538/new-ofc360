import { useState } from "react";
import { useGetBillingInvoicesQuery } from "@/services/api/billingApi";

export function useInvoicesSettings() {
  const [invoicePage, setInvoicePage] = useState(1);
  const { data: invoicesData, isLoading: isLoadingInvoices, error: invoicesError, refetch: refetchInvoices } = useGetBillingInvoicesQuery({ page: invoicePage, limit: 10 });
  const invoices = invoicesData?.invoices || [];

  return { invoicePage, setInvoicePage, invoicesData, invoices, isLoadingInvoices, invoicesError, refetchInvoices };
}

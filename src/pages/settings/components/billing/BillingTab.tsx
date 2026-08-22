import { TabsContent } from "@/components/ui/tabs";
import { useBillingSettings } from "../../hooks/useBillingSettings";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { useInvoicesSettings } from "../../hooks/useInvoicesSettings";
import { BillingTopSection } from "./BillingTopSection";
import { AddPaymentMethodDialog } from "./AddPaymentMethodDialog";
import { InvoicesCard } from "./InvoicesCard";

export function BillingTab() {
  const b = useBillingSettings();
  const pm = usePaymentMethods();
  const inv = useInvoicesSettings();
  return (
    <TabsContent value="payment" className="space-y-5">
      <BillingTopSection sub={b.subscription} isLoadingSub={b.isLoadingSub} paymentMethods={pm.paymentMethods} isLoadingPM={pm.isLoadingPM} onOpenAdd={() => pm.setIsAddPmOpen(true)} onSetDefault={pm.handleSetDefaultPM} onDelete={pm.handleDeletePM} onRefresh={pm.refetchPM} />
      <InvoicesCard invoices={inv.invoices} isLoading={inv.isLoadingInvoices} totalPages={inv.invoicesData?.totalPages || 1} page={inv.invoicePage} onPageChange={inv.setInvoicePage} onRefresh={inv.refetchInvoices} />
      <AddPaymentMethodDialog open={pm.isAddPmOpen} onOpenChange={pm.setIsAddPmOpen} form={pm.pmForm} onChange={pm.setPmForm} isAdding={pm.isAddingPM} onSubmit={pm.handleAddPaymentMethod} />
    </TabsContent>
  );
}
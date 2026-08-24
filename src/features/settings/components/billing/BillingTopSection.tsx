import type { PaymentMethod } from "@/types/api/settings";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";
import { PaymentMethodsCard } from "./PaymentMethodsCard";

export function BillingTopSection({
  sub,
  isLoadingSub,
  paymentMethods,
  isLoadingPM,
  onOpenAdd,
  onSetDefault,
  onDelete,
  onRefresh,
  onOpenUpgrade,
}: {
  sub: any;
  isLoadingSub: boolean;
  paymentMethods: PaymentMethod[];
  isLoadingPM: boolean;
  onOpenAdd: () => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onOpenUpgrade?: () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <SubscriptionPlanCard sub={sub} isLoading={isLoadingSub} onOpenUpgrade={onOpenUpgrade} />
      <PaymentMethodsCard
        paymentMethods={paymentMethods}
        isLoading={isLoadingPM}
        onOpenAdd={onOpenAdd}
        onSetDefault={onSetDefault}
        onDelete={onDelete}
        onRefresh={onRefresh}
      />
    </div>
  );
}
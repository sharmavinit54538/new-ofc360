export * from "./billing/normalizeSubscription";
export * from "./billing/normalizePaymentMethod";
export * from "./billing/normalizeInvoice";
export * from "./billing/billingSubscriptionEndpoints";
export * from "./billing/billingPaymentMethodsEndpoints";
export * from "./billing/billingPaymentDefaultEndpoints";
export * from "./billing/billingInvoicesEndpoints";
export * from "./billing/billingDownloadInvoiceEndpoints";

import { billingSubscriptionApi } from "./billing/billingSubscriptionEndpoints";
import { billingPaymentMethodsApi } from "./billing/billingPaymentMethodsEndpoints";
import { billingPaymentDefaultApi } from "./billing/billingPaymentDefaultEndpoints";
import { billingInvoicesApi } from "./billing/billingInvoicesEndpoints";
import { billingDownloadInvoiceApi } from "./billing/billingDownloadInvoiceEndpoints";

export const billingApi = {
  ...billingSubscriptionApi, ...billingPaymentMethodsApi, ...billingPaymentDefaultApi,
  ...billingInvoicesApi, ...billingDownloadInvoiceApi,
};
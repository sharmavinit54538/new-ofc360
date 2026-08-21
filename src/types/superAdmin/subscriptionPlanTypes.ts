export interface SuperAdminSubscription {
  id: string;
  organizationId?: string;
  organizationName?: string;
  companyName?: string;
  plan: "Starter" | "Professional" | "Enterprise" | "Growth" | string;
  billingCycle: "Monthly" | "Annual" | string;
  amount: number;
  status: "Active" | "Past Due" | "Cancelled" | "Trialing" | string;
  nextBillingDate?: string;
  autoRenew?: boolean;
  seatsUsed?: number;
  activeLicenses?: number;
  maxSeats?: number;
  maxLicenses?: number;
}
export interface SuperAdminPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  featureFlags: string[];
  maxUsers: number;
  isPopular?: boolean;
}
export interface SuperAdminPayment {
  id: string;
  organizationId: string;
  organizationName: string;
  invoiceId: string;
  amount: number;
  status: "Succeeded" | "Failed" | "Pending" | "Refunded";
  date: string;
  paymentMethod: string;
}
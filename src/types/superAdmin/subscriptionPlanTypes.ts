export interface SuperAdminSubscription {
  id: string; organizationId: string; organizationName: string; plan: "Starter" | "Professional" | "Enterprise";
  billingCycle: "Monthly" | "Annual"; amount: number; status: "Active" | "Past Due" | "Cancelled" | "Trialing";
  nextBillingDate: string; autoRenew: boolean; seatsUsed: number; maxSeats: number;
}
export interface SuperAdminPlan {
  id: string; name: string; description: string; monthlyPrice: number; annualPrice: number;
  featureFlags: string[]; maxUsers: number; isPopular?: boolean;
}
export interface SuperAdminPayment {
  id: string; organizationId: string; organizationName: string; invoiceId: string;
  amount: number; status: "Succeeded" | "Failed" | "Pending" | "Refunded"; date: string; paymentMethod: string;
}
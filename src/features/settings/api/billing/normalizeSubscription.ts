import { RawEnvelope } from "../envelope";
import { BillingSubscription } from "@/types/api/settings";

export function normalizeSubscription(data: any): BillingSubscription {
  if (!data) return { plan: "Community Tier", billingCycle: "Monthly", price: 0, currency: "INR", status: "inactive", seats: 0, usedSeats: 0 };
  const raw = (data as RawEnvelope<any>)?.data || data;
  const rawPrice = raw.price ?? raw.amount ?? raw.monthly_price ?? 0;
  const rawSeats = raw.seats ?? raw.totalSeats ?? raw.max_employees ?? 0;
  const rawUsedSeats = raw.usedSeats ?? raw.used_seats ?? raw.active_employees ?? 0;
  const renewal = raw.renewalDate || raw.renewal_date || raw.nextBillingDate || raw.next_billing_date || raw.next_invoice_date;
  return {
    id: raw.id || raw.subscription_id, plan: raw.plan || raw.planName || raw.tier || "Community Tier",
    planName: raw.planName || raw.plan_name || raw.plan,
    billingCycle: raw.billingCycle || raw.billing_cycle || (raw.interval === "year" ? "Annual" : "Monthly"),
    price: typeof rawPrice === "string" ? parseFloat(rawPrice) || 0 : Number(rawPrice),
    currency: raw.currency || "INR", status: raw.status || (raw.active ? "active" : "inactive"),
    seats: Number(rawSeats), usedSeats: Number(rawUsedSeats),
    currentPeriodStart: raw.currentPeriodStart || raw.start_date, currentPeriodEnd: raw.currentPeriodEnd || raw.end_date,
    renewalDate: renewal, nextBillingDate: raw.nextBillingDate || raw.next_billing_date || renewal,
    features: raw.features || [], limits: raw.limits || { maxEmployees: raw.max_employees, storageGb: raw.storage_gb, aiCreditsMonthly: raw.ai_credits_monthly },
  };
}

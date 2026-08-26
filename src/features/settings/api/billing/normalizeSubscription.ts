import { RawEnvelope } from "../envelope";
import { BillingSubscription } from "@/types/api/settings";

export function normalizeSubscription(data: any): BillingSubscription {
  if (!data) {
    return {
      plan: "Community Tier",
      planName: "Community Tier",
      billingCycle: "Monthly",
      price: 0,
      currency: "INR",
      status: "inactive",
      seats: 0,
      usedSeats: 0,
      renewalDate: "—",
      nextBillingDate: "—",
    };
  }


  const raw = (data as RawEnvelope<any>)?.data || data;
  const rawPlan = raw.plan || raw.planName || raw.plan_name || raw.tier || "Community Tier";
  const isCommunity =
    String(rawPlan).toLowerCase().includes("community") ||
    String(rawPlan).toLowerCase().includes("free");

  // If Community / Free tier, price is 0, not 49,999
  const rawPrice = isCommunity ? 0 : Number(raw.price ?? raw.amount ?? raw.monthly_price ?? 0);
  const rawSeats = isCommunity ? 10 : Number(raw.seats ?? raw.totalSeats ?? raw.max_employees ?? 50);
  const rawUsedSeats = Number(raw.usedSeats ?? raw.used_seats ?? raw.active_employees ?? 1);
  const renewal = isCommunity ? "—" : (raw.renewalDate || raw.renewal_date || raw.nextBillingDate || raw.next_billing_date || "—");

  return {
    id: raw.id || raw.subscription_id,
    plan: isCommunity ? "Community Tier" : rawPlan,
    planName: isCommunity ? "Community Tier" : (raw.planName || raw.plan_name || rawPlan),
    billingCycle: raw.billingCycle || raw.billing_cycle || (raw.interval === "year" ? "Annual" : "Monthly"),
    price: rawPrice,
    currency: raw.currency || "INR",
    status: raw.status || "active",
    seats: rawSeats,
    usedSeats: rawUsedSeats,
    currentPeriodStart: raw.currentPeriodStart || raw.start_date,
    currentPeriodEnd: raw.currentPeriodEnd || raw.end_date,
    renewalDate: renewal,
    nextBillingDate: renewal,
    features: raw.features || [],
    limits: raw.limits || { maxEmployees: rawSeats, storageGb: 10, aiCreditsMonthly: 1000 },
  };
}

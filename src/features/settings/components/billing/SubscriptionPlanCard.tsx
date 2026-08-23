import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SubscriptionPlanCard({ sub, isLoading }: { sub: any; isLoading: boolean }) {
  const active = sub?.status === "active";
  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between"><Badge variant={active ? "default" : "outline"} className={`text-[11px] ${active ? "bg-primary/15 text-primary border-primary/20" : "border-border/60 text-muted-foreground"}`}>{active ? "Active Subscription" : sub?.status || "Community Tier"}</Badge>{isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}</div>
        <h3 className="text-xl font-extrabold text-foreground">{sub?.plan || "Community Tier"}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">Enterprise AI workforce suite with full attendance, payroll, connect, and recruitment features.</p>
      </div>
      <div className="space-y-2 pt-3 border-t border-border/30">
        <div className="flex items-baseline gap-1"><span className="text-2xl font-black text-foreground">{sub?.price && sub.price > 0 ? `₹${sub.price.toLocaleString("en-IN")}` : "Free"}</span><span className="text-xs text-muted-foreground">/ {sub?.billingCycle?.toLowerCase() || "month"}</span></div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground"><span>Seats: {sub?.usedSeats || 0} / {sub?.seats || "∞"} used</span><span>Renewal: {sub?.renewalDate || sub?.nextBillingDate || "—"}</span></div>
      </div>
    </div>
  );
}

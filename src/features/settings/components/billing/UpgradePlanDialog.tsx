import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  Loader2,
  Lock,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetPaymentPlansQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} from "../../api/billingApi";
import { triggerRazorpayCheckout } from "@/services/payment/razorpayService";
import { useAuth } from "@/hooks/useAuth";

interface PlanOption {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  tagline: string;
  features: string[];
}

const DEFAULT_PLANS: PlanOption[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 999,
    annualPrice: 799,
    tagline: "Essential HR & attendance for small growing businesses",
    features: [
      "Up to 20 Active Employees",
      "Face Attendance & Check-In",
      "Basic Payroll & Payslip Generation",
      "Direct Messaging & Chat",
      "Standard Email Support",
    ],
  },
  {
    id: "growth",
    name: "Growth Pro Tier",
    monthlyPrice: 1999,
    annualPrice: 1599,
    popular: true,
    tagline: "Full AI workforce automation & advanced analytics",
    features: [
      "Up to 100 Active Employees",
      "Automated Payroll, PF & ESIC Filing",
      "OFC360 Connect (HD Video Calls & Channels)",
      "AI Recruitment ATS & Resume Screening",
      "AI Document & Offer Letter Vault",
      "Priority 24/7 Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise AI Suite",
    monthlyPrice: 4999,
    annualPrice: 3999,
    tagline: "Unlimited scale, dedicated models & enterprise SLA",
    features: [
      "Unlimited Employee Capacity",
      "Predictive AI Attrition & OKR Telemetry",
      "Custom Workflow Automation & Webhooks",
      "Multi-branch Compliance & Audit Vault",
      "Dedicated Enterprise Account Manager",
      "99.99% Uptime SLA Guarantee",
    ],
  },
];

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan?: string;
  onSuccess?: () => void;
}

export function UpgradePlanDialog({
  open,
  onOpenChange,
  currentPlan = "Community",
  onSuccess,
}: UpgradePlanDialogProps) {
  const { user } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("growth");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { data: backendPlans } = useGetPaymentPlansQuery(undefined, { skip: !open });
  const [createOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyRazorpayPaymentMutation();

  // Merge backend plans if available, else use production defaults
  const plans: PlanOption[] = (backendPlans && backendPlans.length > 0)
    ? backendPlans.map((bp) => ({
        id: bp.id || bp.plan_id || "growth",
        name: bp.name || "Plan",
        monthlyPrice: bp.monthlyPrice || bp.monthly_price || 1999,
        annualPrice: bp.annualPrice || bp.yearly_price || 1599,
        popular: bp.popular || bp.is_popular || false,
        tagline: bp.description || "Comprehensive enterprise workforce suite",
        features: bp.features || [
          "Full AI Workforce Management",
          "Automated Payroll & Statutory Compliance",
          "Face Attendance & Connect Suite",
          "Priority Enterprise Support",
        ],
      }))
    : DEFAULT_PLANS;

  const plan = plans.find((p) => p.id.toLowerCase() === selectedPlanId.toLowerCase()) || plans[0];
  const pricePerMonth = billingCycle === "yearly" ? plan.annualPrice : plan.monthlyPrice;
  const subtotal = billingCycle === "yearly" ? pricePerMonth * 12 : pricePerMonth;
  const gst = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gst;

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      // 1. Create order on FastAPI backend (/api/v1/payments/create-order)
      const orderRes = await createOrder({
        plan_id: plan.id,
        billing_cycle: billingCycle,
      }).unwrap();

      const orderId = orderRes.order_id || orderRes.orderId || orderRes.id || `order_${Date.now()}`;
      const razorpayKey = orderRes.key_id || orderRes.keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_OFC360Demo";
      // Backend returns amount in paise
      const amountInPaise = orderRes.amount > 0 ? orderRes.amount : totalAmount * 100;

      toast.info("Opening Razorpay Secure Checkout...", { duration: 2000 });

      // 2. Trigger Razorpay Checkout Modal
      const paymentResponse = await triggerRazorpayCheckout({
        key: razorpayKey,
        amount: amountInPaise,
        currency: orderRes.currency || "INR",
        name: "OFC360 Enterprise Suite",
        description: `Upgrade to ${plan.name} (${billingCycle.toUpperCase()})`,
        order_id: orderId,
        prefill: {
          name: user?.name || "Admin",
          email: user?.email || "admin@ofc360.com",
          contact: (user as any)?.phone || "9876543210",
        },
        theme: {
          color: "#4f46e5",
        },
        notes: {
          plan_id: plan.id,
          plan_name: plan.name,
          billing_cycle: billingCycle,
        },
      });

      // 3. Verify HMAC Signature on FastAPI backend (/api/v1/payments/verify)
      toast.loading("Verifying transaction with Razorpay...", { id: "rzp-verify" });
      const verifyRes = await verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      }).unwrap();

      toast.dismiss("rzp-verify");
      toast.success(verifyRes.message || `Payment verified! Plan successfully upgraded to ${plan.name}! 🎉`, {
        duration: 5000,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.dismiss("rzp-verify");
      const msg = err?.data?.detail || err?.message || "Payment failed or was cancelled.";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border border-border/70 bg-card rounded-2xl">
        <DialogHeader className="p-6 pb-3 border-b border-border/40 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Upgrade Organization Plan
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Select your enterprise tier and pay securely via <strong>Razorpay</strong> (UPI, GPay/PhonePe, Cards & NetBanking).
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-xl border border-border/50 self-start">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  billingCycle === "yearly"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded">20% OFF</span>
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isSelected = selectedPlanId.toLowerCase() === p.id.toLowerCase();
              const isCurrent = currentPlan.toLowerCase().includes(p.id.toLowerCase());
              const price = billingCycle === "yearly" ? p.annualPrice : p.monthlyPrice;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`relative p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary"
                      : "border-border/60 bg-secondary/20 hover:border-border hover:bg-secondary/30"
                  }`}
                >
                  {p.popular && (
                    <Badge className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-[10px] font-bold shadow-xs">
                      MOST POPULAR
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="outline" className="absolute -top-2.5 left-4 border-emerald-500/40 text-emerald-400 bg-card text-[10px]">
                      CURRENT PLAN
                    </Badge>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-base text-foreground">{p.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.tagline}</p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground font-mono">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-muted-foreground">/ month</span>
                      </div>
                      {billingCycle === "yearly" && (
                        <p className="text-[11px] text-emerald-500 font-medium mt-0.5">
                          Billed yearly (₹{(price * 12).toLocaleString("en-IN")}/yr)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-3 border-t border-border/40">
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/30">
                    <Button
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="w-full text-xs font-bold"
                    >
                      {isSelected ? "Selected Tier" : "Choose Tier"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary & Razorpay Pay Button */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-primary" /> Selected: {plan.name} ({billingCycle.toUpperCase()})
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Server-side cryptographic amount validation & instant license allocation.
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-xs text-muted-foreground">Total:</span>
                  <span className="text-2xl font-black text-foreground font-mono">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Subtotal: ₹{subtotal.toLocaleString("en-IN")} + 18% GST (₹{gst.toLocaleString("en-IN")})
                </p>
              </div>
            </div>

            {/* Payment Gateway Badges & Trigger */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Secured by <strong>Razorpay</strong> (UPI, Cards, NetBanking, Wallets) · 256-Bit SSL</span>
              </div>

              <Button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 h-10 text-xs font-bold gap-2 gradient-bg text-primary-foreground shadow-md hover:opacity-90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Pay ₹{totalAmount.toLocaleString("en-IN")} with Razorpay
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

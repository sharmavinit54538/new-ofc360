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
  HelpCircle,
  Building,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
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

const AVAILABLE_PLANS: PlanOption[] = [
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 1999,
    annualPrice: 1599,
    popular: true,
    tagline: "Ideal for growing teams scaling operations",
    features: [
      "Up to 50 Active Employees",
      "Automated Payroll & Statutory Returns",
      "Face Attendance & Geo-fencing",
      "OFC360 Connect (Chat & HD Calling)",
      "AI Recruitment & Resume Parsing",
      "Standard Email & Slack Support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 4999,
    annualPrice: 3999,
    tagline: "Full AI workflow automation & advanced analytics",
    features: [
      "Up to 250 Active Employees",
      "Everything in Growth Plan",
      "Predictive Attrition & AI Skill Matrix",
      "Multi-branch Compliance Governance",
      "Automated Bank Salary Advice Transfer",
      "Priority 24/7 Phone & Web Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise AI Suite",
    monthlyPrice: 9999,
    annualPrice: 7999,
    tagline: "Dedicated AI architecture & unlimited scale",
    features: [
      "Unlimited Employee Capacity",
      "Custom Fine-tuned LLM Workflows",
      "Dedicated Enterprise Success Manager",
      "Custom Webhook & ERP Integrations",
      "Custom SLA Guarantee (99.99%)",
      "SOC2 & ISO Audit Readiness Vault",
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
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Annual">("Annual");
  const [seats, setSeats] = useState<number>(25);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [createOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyRazorpayPaymentMutation();

  const plan = AVAILABLE_PLANS.find((p) => p.id === selectedPlan) || AVAILABLE_PLANS[0];
  const basePricePerMonth = billingCycle === "Annual" ? plan.annualPrice : plan.monthlyPrice;
  const subtotal = billingCycle === "Annual" ? basePricePerMonth * 12 : basePricePerMonth;
  const gst = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gst;

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      // 1. Create order on backend
      const orderRes = await createOrder({
        plan: plan.name,
        billingCycle,
        seats,
        amount: totalAmount,
        currency: "INR",
      }).unwrap();

      const orderId = orderRes.orderId || orderRes.id || `order_${Date.now()}`;
      const razorpayKey = orderRes.keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_OFC360Demo";

      toast.info("Opening Razorpay Secure Checkout...", { duration: 2000 });

      // 2. Trigger Razorpay Modal Checkout
      const paymentResponse = await triggerRazorpayCheckout({
        key: razorpayKey,
        amount: totalAmount * 100, // in paise
        currency: "INR",
        name: "OFC360 Enterprise Suite",
        description: `Upgrade to ${plan.name} (${billingCycle})`,
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
          plan: plan.name,
          billing_cycle: billingCycle,
          seats: String(seats),
        },
      });

      // 3. Verify Payment Signature with backend
      toast.loading("Verifying transaction with Razorpay...", { id: "rzp-verify" });
      const verifyRes = await verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        plan: plan.name,
        billingCycle,
        seats,
      }).unwrap();

      toast.dismiss("rzp-verify");
      toast.success(verifyRes.message || `Plan successfully upgraded to ${plan.name}! 🎉`, {
        duration: 4000,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.dismiss("rzp-verify");
      const msg = err?.message || err?.data?.detail || "Payment failed or was cancelled.";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border border-border/70 bg-card rounded-2xl">
        <DialogHeader className="p-6 pb-2 border-b border-border/40 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Upgrade Organization Plan
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Select an enterprise subscription tier and checkout securely via Razorpay (UPI, Cards, NetBanking).
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl border border-border/50 self-start">
              <button
                type="button"
                onClick={() => setBillingCycle("Monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === "Monthly"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("Annual")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  billingCycle === "Annual"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded">20% OFF</span>
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AVAILABLE_PLANS.map((p) => {
              const isSelected = selectedPlan === p.id;
              const isCurrent = currentPlan.toLowerCase() === p.id;
              const price = billingCycle === "Annual" ? p.annualPrice : p.monthlyPrice;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
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
                        <span className="text-xs text-muted-foreground">/ user / mo</span>
                      </div>
                      {billingCycle === "Annual" && (
                        <p className="text-[11px] text-emerald-500 font-medium mt-0.5">
                          Billed annually (₹{(price * 12).toLocaleString("en-IN")}/yr)
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
                  <Zap className="w-4 h-4 text-primary" /> Selected: {plan.name} Tier ({billingCycle})
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Full instant access to AI tools, automated compliance, and enterprise modules.
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
                <span>Secured by <strong>Razorpay</strong> · 256-Bit Encrypted · Instant Activation</span>
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

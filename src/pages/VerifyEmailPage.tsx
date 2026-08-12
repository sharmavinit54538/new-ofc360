import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Sparkles, Shield, ArrowRight, ArrowLeft, CheckCircle2, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/services/api/authApi";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    otpInputsRef.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (!email.trim()) {
      toast.error("Please provide your work email address.");
      return;
    }
    if (enteredOtp.length < 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      await verifyEmail({ email, otp: enteredOtp }).unwrap();
      toast.success("Email verified successfully! You can now sign in.");
      setIsVerified(true);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    if (!email.trim()) {
      toast.error("Please enter your work email address.");
      return;
    }

    try {
      await resendOtp({ email }).unwrap();
      toast.success(`Verification code resent to ${email}`);
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black gradient-text tracking-tight">OFC360</h1>
          <p className="text-xs text-muted-foreground">Work Email Verification</p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-5 border border-border/50 shadow-xl bg-card/90 backdrop-blur-xl">
          {isVerified ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Email Verified!</h2>
                <p className="text-xs text-muted-foreground">
                  Your work email has been verified. You can now access your OFC360 workspace.
                </p>
              </div>

              <Button
                onClick={() => navigate("/login")}
                className="w-full gradient-bg text-primary-foreground font-bold text-xs h-10 shadow-md gap-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-foreground">Verify your email</h2>
                <p className="text-xs text-muted-foreground">
                  We've sent a 6-digit verification code to your email.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4 pt-1">
                <div className="space-y-1 text-left">
                  <Label className="text-xs font-semibold">Work Email</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 h-10 text-xs rounded-lg bg-secondary/30 border border-border/60 focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <Label className="text-xs font-semibold">6-Digit Verification Code</Label>
                  <div className="flex items-center justify-center gap-2 pt-1" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-mono font-bold rounded-xl bg-secondary/40 border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full gradient-bg text-primary-foreground font-bold text-xs h-10 shadow-md gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link to="/login" className="text-muted-foreground hover:text-foreground text-[11px] flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isResending}
                  className={`text-[11px] font-semibold ${
                    canResend ? "text-primary hover:underline" : "text-muted-foreground/60 cursor-not-allowed"
                  }`}
                >
                  {isResending ? "Sending..." : canResend ? "Resend code" : `Resend in ${resendTimer}s`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>OFC360 Multi-Tenant Identity & Access Management</span>
        </div>
      </motion.div>
    </div>
  );
}

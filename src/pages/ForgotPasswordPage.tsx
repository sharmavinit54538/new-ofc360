import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} from "@/services/api/authApi";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Recovery Flow Steps: 1 = Email, 2 = 6-digit OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [forgotPassword, { isLoading: isSendingForgot }] = useForgotPasswordMutation();
  const [verifyResetOtp, { isLoading: isVerifyingOtp }] = useVerifyResetOtpMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  // 60-second OTP cooldown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Step 1: Send Forgot Password OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your registered work email.");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      toast.success(`6-digit reset code sent to ${email}`);
      setStep(2);
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  // OTP input handlers
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

  // Step 2: Verify Reset OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    try {
      await verifyResetOtp({ email, otp: enteredOtp }).unwrap();
      toast.success("Reset code verified successfully!");
      setStep(3);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResendingOtp) return;
    try {
      await resendOtp({ email }).unwrap();
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
      toast.success(`New 6-digit reset code sent to ${email}`);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  // Step 3: Save New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        email,
        otp: otp.join(""),
        newPassword,
      }).unwrap();

      toast.success("Password reset successfully!");
      setStep(4);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black gradient-text tracking-tight">OFC360</h1>
          <p className="text-xs text-muted-foreground">Account Recovery & Security Service</p>
        </div>

        {/* Glassmorphic Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-5 border border-border/50 shadow-xl bg-card/90 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: ENTER EMAIL */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="space-y-1 text-left">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Reset your password</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enter the email tied to your workspace and we'll send a password reset link.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4 pt-1">
                  <div className="space-y-1.5 text-left">
                    <Label className="text-xs font-semibold text-foreground">Work email</Label>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary/30 text-xs h-10 border-border/60"
                      required
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSendingForgot}
                    className="w-full gradient-bg text-primary-foreground font-bold text-xs h-10 shadow-md gap-2"
                  >
                    {isSendingForgot ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending reset code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* STEP 2: 6-DIGIT OTP */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-foreground">Enter 6-digit reset code</h2>
                  <p className="text-xs text-muted-foreground">
                    Code sent to <span className="font-semibold text-foreground">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4 pt-2">
                  <div className="flex items-center justify-center gap-2" onPaste={handleOtpPaste}>
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

                  <Button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full gradient-bg text-primary-foreground font-bold text-xs h-10 shadow-md gap-2"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-muted-foreground hover:text-foreground text-[11px]"
                  >
                    Change email
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend || isResendingOtp}
                    className={`text-[11px] font-semibold ${
                      canResend ? "text-primary hover:underline" : "text-muted-foreground/60 cursor-not-allowed"
                    }`}
                  >
                    {isResendingOtp ? "Sending..." : canResend ? "Resend code" : `Resend in ${resendTimer}s`}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SET NEW PASSWORD */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-foreground">Set new password</h2>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long with numbers and symbols.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-3.5 pt-1">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">New Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-9 bg-secondary/30 text-xs h-10 border-border/60"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-primary" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-9 bg-secondary/30 text-xs h-10 border-border/60"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-primary" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isResettingPassword}
                    className="w-full gradient-bg text-primary-foreground font-bold text-xs h-10 shadow-md gap-2 mt-2"
                  >
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-2"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground">Password Reset Complete!</h2>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Your password has been successfully updated. You can now sign in to your OFC360 workspace.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full gradient-bg text-primary-foreground font-bold text-xs h-10 shadow-md gap-2"
                >
                  <span>Sign In Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Footer */}
        <div className="text-center flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>OFC360 Multi-Tenant Identity & Access Management</span>
        </div>
      </motion.div>
    </div>
  );
}

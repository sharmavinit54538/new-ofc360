import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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
  useResendOtpMutation,
  useResetPasswordMutation,
} from "@/services/api/authApi";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  // Recovery Flow Steps: 1 = Email, 2 = 6-digit OTP (legacy/fallback), 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotPassword, { isLoading: isSendingForgot }] = useForgotPasswordMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  // Retrieve email from localStorage or URL query param if present
  useEffect(() => {
    const savedEmail = localStorage.getItem("ofc360_reset_email");
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else if (savedEmail && !email) {
      setEmail(savedEmail);
    }
  }, [searchParams, email]);

  // Handle auto-transition to Step 3 if token is present in the URL
  useEffect(() => {
    if (tokenFromUrl) {
      setStep(3);
    }
  }, [tokenFromUrl]);

  // 60-second cooldown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isEmailSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEmailSent, resendTimer]);

  // Step 1: Send Forgot Password OTP/Link
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your registered work email.");
      return;
    }

    try {
      await forgotPassword({ identifier: email }).unwrap();
      toast.success(`Password reset email sent to ${email}`);
      localStorage.setItem("ofc360_reset_email", email);
      setIsEmailSent(true);
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResendingOtp) return;
    try {
      await resendOtp({ identifier: email }).unwrap();
      setResendTimer(60);
      setCanResend(false);
      toast.success(`New password reset link sent to ${email}`);
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
        identifier: email,
        otp: tokenFromUrl || otp.join(""),
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
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="OFC360 Logo"
            className="w-14 h-14 rounded-2xl object-contain bg-white mx-auto shadow-md"
          />
          <h1 className="text-2xl font-black gradient-text tracking-tight">OFC360</h1>
          <p className="text-xs text-muted-foreground">Account Recovery & Security Service</p>
        </div>

        {/* Glassmorphic Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-5 border border-border/50 shadow-xl bg-card/90 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: ENTER EMAIL OR EMAIL SENT SUCCESS */}
            {step === 1 && (
              <motion.div
                key={isEmailSent ? "emailsent" : "step1"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {isEmailSent ? (
                  <div className="text-center space-y-4 py-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-foreground">Password reset email sent successfully!</h2>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        We've sent a password reset link to your email address. Please check your inbox and click the link to update your password.
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmailSent(false);
                          setCanResend(false);
                          setResendTimer(60);
                        }}
                        className="text-muted-foreground hover:text-foreground text-[11px] transition-colors"
                      >
                        Change email
                      </button>

                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={!canResend || isResendingOtp}
                        className={`text-[11px] font-semibold transition-colors ${
                          canResend ? "text-primary hover:underline" : "text-muted-foreground/60 cursor-not-allowed"
                        }`}
                      >
                        {isResendingOtp ? "Sending..." : canResend ? "Resend link" : `Resend in ${resendTimer}s`}
                      </button>
                    </div>

                    <div className="pt-2 text-center border-t border-border/40">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
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
                            <span>Sending reset link...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Reset Link</span>
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
                  </>
                )}
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
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemRole, roleLabels } from "@/features/auth/authTypes";
import {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailOtpMutation,
  useResendEmailOtpMutation,
} from "@/services/api/authApi";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerApi, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyEmailOtpApi, { isLoading: isVerifyingOtp }] = useVerifyEmailOtpMutation();
  const [resendEmailOtpApi, { isLoading: isResendingOtp }] = useResendEmailOtpMutation();

  const [isSignup, setIsSignup] = useState(
    location.pathname === "/register" || location.search.includes("signup=true")
  );

  // OTP Step States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setWorkEmail(emailParam);
    }
    if (location.pathname === "/register") {
      setIsSignup(true);
    }
  }, [location.pathname, location.search]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isOtpStep && resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOtpStep, resendTimer, canResend]);

  const checkOnboardingAndNavigate = (role: SystemRole, _userId?: string) => {
    if (role === "super_admin") {
      navigate("/super-admin", { replace: true });
      return;
    }

    if (role === "employee") {
      navigate("/employee", { replace: true });
      return;
    }

    // For hr_admin and other roles, navigate to /dashboard.
    // DashboardLayout / HRAdminOnboardingGuard authoritative backend check handles routing.
    navigate("/dashboard", { replace: true });
  };

  const handleSSOLogin = (provider: "Google" | "GitHub") => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";
    window.location.href = `${baseUrl}/api/v1/auth/sso/${provider.toLowerCase()}`;
  };

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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      const res = await verifyEmailOtpApi({
        verification_id: verificationId,
        otp: enteredOtp,
        identifier: workEmail.trim(),
        email: workEmail.trim(),
      }).unwrap();

      if (res.token && res.token.length > 10) {
        dispatch(
          setCredentials({
            user: res.user,
            token: res.token,
            refreshToken: res.refreshToken,
            companyId: res.user.companyId,
          })
        );
        const activeRole = res.user.role || "employee";
        toast.success(
          `Email verified! Signed in as ${roleLabels[activeRole] || activeRole}.`
        );

        const redirectParam = new URLSearchParams(location.search).get("redirect");
        const fromPath = (location.state as any)?.from?.pathname;
        const targetPath =
          redirectParam ||
          (fromPath && fromPath !== "/login" && fromPath !== "/register" ? fromPath : null);

        if (targetPath) {
          navigate(targetPath, { replace: true });
        } else {
          checkOnboardingAndNavigate(activeRole, res.user.id);
        }
      } else {
        toast.error("Authentication failed. Please try signing in again.");
      }
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResendingOtp) return;
    try {
      const res = await resendEmailOtpApi({
        verification_id: verificationId,
        email: workEmail.trim(),
        identifier: workEmail.trim(),
      }).unwrap();

      if (res.verification_id) {
        setVerificationId(res.verification_id);
      }
      toast.success(`Verification code resent to ${maskedEmail || workEmail}`);
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      if (!fullName.trim()) {
        toast.error("Please enter your full name.");
        return;
      }
      if (!companyName.trim()) {
        toast.error("Please enter your company name.");
        return;
      }
      if (!workEmail.trim()) {
        toast.error("Please enter your work email.");
        return;
      }
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        toast.error("Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (!agreeTerms) {
        toast.error("Please agree to the Terms and Privacy Policy.");
        return;
      }

      try {
        const nameParts = fullName.trim().split(" ");
        const first_name = nameParts[0] || fullName.trim();
        const last_name = nameParts.slice(1).join(" ") || "User";

        await registerApi({
          first_name,
          last_name,
          name: fullName.trim(),
          full_name: fullName.trim(),
          identifier: workEmail.trim(),
          phone: cleanPhone,
          password,
          company_name: companyName.trim(),
        }).unwrap();

        toast.success(`Account created! Please check your email for the verification code.`);
        navigate(`/verify-email?email=${encodeURIComponent(workEmail.trim())}`);
      } catch (err: any) {
        const norm = normalizeError(err);
        const serverErrors = err?.data?.errors;
        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
          const detailMsg = serverErrors.map((e: any) => e.message || `${e.field} is invalid`).join(". ");
          toast.error(detailMsg);
        } else {
          toast.error(norm.message);
        }
      }
    } else {
      if (!workEmail.trim()) {
        toast.error("Please enter your work email or phone number.");
        return;
      }
      if (!password) {
        toast.error("Please enter your password.");
        return;
      }

      try {
        const res = await loginApi({
          identifier: workEmail.trim(),
          password,
        }).unwrap();

        // 1. Check if email verification OTP challenge is required
        if (res.requires_email_verification || res.verification_id) {
          setIsOtpStep(true);
          setVerificationId(res.verification_id || "");
          setMaskedEmail(res.masked_email || res.email || workEmail.trim());
          setOtp(["", "", "", "", "", ""]);
          setResendTimer(60);
          setCanResend(false);
          toast.info("Please enter the verification code sent to your email.");
          return;
        }

        // 2. Normal verified login
        if (res.token && res.token.length > 10) {
          dispatch(
            setCredentials({
              user: res.user,
              token: res.token,
              refreshToken: res.refreshToken,
              companyId: res.user.companyId,
            })
          );
          const activeRole = res.user.role || "employee";
          toast.success(
            `Welcome back to OFC360! Signed in as ${roleLabels[activeRole] || activeRole}.`
          );

          const redirectParam = new URLSearchParams(location.search).get("redirect");
          const fromPath = (location.state as any)?.from?.pathname;
          const targetPath =
            redirectParam ||
            (fromPath && fromPath !== "/login" && fromPath !== "/register" ? fromPath : null);

          if (targetPath) {
            navigate(targetPath, { replace: true });
          } else {
            checkOnboardingAndNavigate(activeRole, res.user.id);
          }
        } else {
          toast.error("Authentication failed: No valid access token received.");
        }
      } catch (err: any) {
        const norm = normalizeError(err);
        if (norm.status === 403 && (norm.message.toLowerCase().includes("verify") || norm.message.toLowerCase().includes("unverified"))) {
          toast.error(`${norm.message} Redirecting to email verification...`);
          setTimeout(() => {
            navigate(`/verify-email?email=${encodeURIComponent(workEmail.trim())}`);
          }, 1200);
        } else {
          toast.error(norm.message);
        }
      }
    }
  };

  const isLoading = isLoggingIn || isRegistering;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden py-10">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full ${isSignup && !isOtpStep ? "max-w-lg" : "max-w-md"} relative z-10 space-y-5`}
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="OFC360 Logo"
            className="w-14 h-14 rounded-2xl object-contain bg-white mx-auto shadow-md"
          />
          <h1 className="text-2xl font-black gradient-text tracking-tight">OFC360</h1>
          <p className="text-xs text-muted-foreground">
            Enterprise AI Workforce & Human Resource Intelligence
          </p>
        </div>

        {/* Glassmorphic Auth Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-5 border border-border/50 shadow-xl bg-card/90 backdrop-blur-xl">
          {isOtpStep ? (
            /* OTP Verification Screen */
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Verify your email</h2>
                <p className="text-xs text-muted-foreground">
                  We've sent a 6-digit verification code to{" "}
                  <strong className="text-foreground">{maskedEmail || workEmail}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
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
                      <span>Verify & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="text-muted-foreground hover:text-foreground text-[11px] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isResendingOtp}
                  className={`text-[11px] font-semibold ${
                    canResend ? "text-primary hover:underline" : "text-muted-foreground/60 cursor-not-allowed"
                  }`}
                >
                  {isResendingOtp ? "Sending..." : canResend ? "Resend code" : `Resend in ${resendTimer}s`}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-foreground">
                  {isSignup ? "Create your workspace" : "Sign In to OFC360"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isSignup
                    ? "Set up your organization in seconds with AI workforce management"
                    : "Enter your work credentials to access your workspace"}
                </p>
              </div>

              {/* Google & GitHub SSO Social Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSSOLogin("Google")}
                  className="w-full bg-secondary/30 hover:bg-secondary/60 text-xs font-semibold h-10 border-border/60 gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSSOLogin("GitHub")}
                  className="w-full bg-secondary/30 hover:bg-secondary/60 text-xs font-semibold h-10 border-border/60 gap-2"
                >
                  <svg className="w-4 h-4 fill-foreground" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                {isSignup ? (
                  <>
                    {/* 1. Full name */}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Full name</Label>
                      <Input
                        placeholder="Jane Cooper"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-secondary/30 text-xs h-10 border-border/60"
                        required
                      />
                    </div>

                    {/* 2. Company Name */}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Company Name</Label>
                      <Input
                        placeholder="Acme Corp"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-secondary/30 text-xs h-10 border-border/60"
                        required
                      />
                    </div>

                    {/* 3. Work email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Work email</Label>
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          className="bg-secondary/30 text-xs h-10 border-border/60"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Phone Number</Label>
                        <Input
                          type="tel"
                          placeholder="9876543210"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="bg-secondary/30 text-xs h-10 border-border/60"
                          required
                        />
                      </div>
                    </div>

                    {/* 4. Password */}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-9 bg-secondary/30 text-xs h-10 border-border/60"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-primary" />}
                        </button>
                      </div>
                      <p className="text-[10.5px] text-muted-foreground leading-tight pt-0.5">
                        Must be 8–64 chars with uppercase, lowercase, number & special character
                      </p>
                    </div>

                    {/* 5. Confirm password */}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Confirm password</Label>
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

                    {/* 6. Terms Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="rounded border-border/60 text-primary focus:ring-primary h-4 w-4"
                          required
                        />
                        <span>
                          I agree to the <strong className="text-foreground">Terms</strong> and{" "}
                          <strong className="text-foreground">Privacy Policy</strong>
                        </span>
                      </label>
                    </div>

                    {/* 7. Create Workspace Submit */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gradient-bg text-primary-foreground font-bold text-xs h-10 shadow-md gap-2 mt-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating workspace...</span>
                        </>
                      ) : (
                        <>
                          <span>Create workspace</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Sign In Fields */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Work email or phone</Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          type="text"
                          placeholder="you@company.com or 9876543210"
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          className="pl-9 bg-secondary/30 text-xs h-10 border-border/60"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">Password</Label>
                        <button
                          type="button"
                          onClick={() => navigate("/forgot-password")}
                          className="text-[11px] text-primary hover:underline font-semibold transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 pr-9 bg-secondary/30 text-xs h-10 border-border/60"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-border/60 text-primary focus:ring-primary h-3.5 w-3.5"
                        />
                        <span>Remember this device</span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gradient-bg text-primary-foreground font-bold text-xs h-10 shadow-md gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to OFC360</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </>
                )}
              </form>

              {/* Switcher Footer */}
              <div className="pt-2 text-center text-xs text-muted-foreground">
                {isSignup ? "Already have a company account?" : "Need to register a new organization?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary hover:underline font-bold ml-1"
                >
                  {isSignup ? "Sign In" : "Create workspace"}
                </button>
              </div>
            </>
          )}
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
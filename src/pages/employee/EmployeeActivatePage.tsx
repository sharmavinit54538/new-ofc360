import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Building2,
  KeyRound,
  Mail,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/seo/SEOHead";
import { useActivateEmployeeMutation } from "@/services/api/employeeApi";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";

/**
 * Safely decodes a JWT payload without external dependencies
 */
function parseJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function EmployeeActivatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Extract query parameters
  const token =
    searchParams.get("token") ||
    searchParams.get("activation_token") ||
    searchParams.get("invite_token") ||
    "";

  // Check possible employee_id sources (query params or decoded token)
  const queryEmployeeId =
    searchParams.get("employee_id") ||
    searchParams.get("id") ||
    searchParams.get("emp_id") ||
    searchParams.get("user_id") ||
    "";

  const emailParam = searchParams.get("email") || "";

  // Attempt to resolve employee ID from query or JWT payload
  const [employeeId, setEmployeeId] = useState<string>(queryEmployeeId);
  const [resolvedEmail, setResolvedEmail] = useState<string>(emailParam);

  useEffect(() => {
    if (queryEmployeeId) {
      setEmployeeId(queryEmployeeId);
    } else if (token) {
      const payload = parseJwtPayload(token);
      if (payload) {
        const idFromToken =
          payload.employee_id || payload.sub || payload.id || payload.user_id;
        if (idFromToken) setEmployeeId(String(idFromToken));
        const emailFromToken = payload.email || payload.identifier;
        if (emailFromToken && !resolvedEmail) setResolvedEmail(String(emailFromToken));
      }
    }
  }, [token, queryEmployeeId, resolvedEmail]);

  // Form State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activateEmployee, { isLoading }] = useActivateEmployeeMutation();

  // Live password validation
  const hasMinLength = password.length >= 8;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const hasLetterAndNumber =
    /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const isFormValid = hasMinLength && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token || !employeeId) {
      setErrorMessage(
        "Invalid invitation link. Please request a new invitation from HR."
      );
      toast.error("Invalid invitation link. Missing token or employee ID.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      toast.error("Password too short.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Confirm password does not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const cleanEmpId = employeeId.trim();
      const res = await activateEmployee({
        id: cleanEmpId,
        employee_id: cleanEmpId,
        token: token.trim(),
        new_password: password,
        confirm_password: confirmPassword,
      }).unwrap();

      setIsSuccess(true);
      toast.success("Password set successfully! Your account is activated.");

      // Check if the backend activation returned authenticated session tokens
      const sessionToken = (res as any)?.token || (res as any)?.access_token || (res as any)?.data?.token || (res as any)?.data?.access_token;
      const userObj = (res as any)?.user || (res as any)?.data?.user;

      if (sessionToken && userObj) {
        dispatch(
          setCredentials({
            token: sessionToken,
            refreshToken: (res as any)?.refreshToken || (res as any)?.data?.refreshToken,
            user: userObj,
          })
        );
        // Directly navigate to employee onboarding
        setTimeout(() => {
          navigate("/employee/onboarding", { replace: true });
        }, 1200);
      }
    } catch (err: any) {
      const norm = normalizeError(err);
      const errStatus = norm.status;
      const rawMsg = (norm.message || "").toLowerCase();

      if (
        errStatus === 400 ||
        errStatus === 401 ||
        errStatus === 403 ||
        errStatus === 404 ||
        rawMsg.includes("expired") ||
        rawMsg.includes("invalid token") ||
        rawMsg.includes("already used") ||
        rawMsg.includes("not found")
      ) {
        setErrorMessage(
          "Your invitation link is invalid or has expired. Please contact your HR administrator for a new invitation."
        );
      } else {
        setErrorMessage(norm.message || "Failed to set password. Please try again.");
      }
      toast.error(norm.message || "Password activation failed.");
    }
  };

  const handleProceedToLogin = () => {
    const loginUrl = resolvedEmail
      ? `/login?email=${encodeURIComponent(resolvedEmail)}&redirect=/employee/onboarding`
      : `/login?redirect=/employee/onboarding`;
    navigate(loginUrl, {
      state: { from: { pathname: "/employee/onboarding" } },
      replace: true,
    });
  };

  return (
    <>
      <SEOHead
        title="Set Your Password | OFC360"
        description="Set your account password to activate your OFC360 employee account and access onboarding."
      />

      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden py-12">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md relative z-10 space-y-6"
        >
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground">
                OFC<span className="text-primary">360</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground font-medium">
              AI-Powered HR & Workforce Management Platform
            </p>
          </div>

          <Card className="glass-card border border-border/60 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-6 md:p-8 space-y-6">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  /* Success State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6 py-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-foreground tracking-tight">
                        Password Set Successfully!
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your employee account has been activated. Proceed to log in with your new password to complete your onboarding.
                      </p>
                    </div>

                    <Button
                      onClick={handleProceedToLogin}
                      className="w-full font-semibold gap-2 py-5 shadow-lg shadow-primary/20 cursor-pointer"
                    >
                      <span>Proceed to Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (!token || !employeeId) ? (
                  /* Missing Token or Employee ID Warning */
                  <motion.div
                    key="missing-token-or-id"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-5 py-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto shadow-inner">
                      <AlertCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-foreground">
                        Invalid Invitation Link
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Invalid invitation link. Please request a new invitation from HR.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="w-full text-xs font-semibold cursor-pointer"
                      >
                        Return to Sign In
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  /* Password Setup Form */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Header */}
                    <div className="space-y-1.5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 mb-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Welcome to OFC360</span>
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Set Your Password
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Create a secure password to activate your employee workspace account.
                      </p>
                    </div>

                    {/* Error Banner */}
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive flex items-start gap-2.5 text-xs shadow-sm"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{errorMessage}</span>
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* New Password */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="new-password"
                          className="text-xs font-medium text-foreground flex items-center justify-between"
                        >
                          <span>New Password</span>
                          <span className="text-[10px] text-muted-foreground">Min 8 chars</span>
                        </Label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            autoComplete="new-password"
                            className="pl-9 pr-10 bg-muted/40 border-border/60 text-xs focus:ring-primary/20 h-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="confirm-password"
                          className="text-xs font-medium text-foreground"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            autoComplete="new-password"
                            className="pl-9 pr-10 bg-muted/40 border-border/60 text-xs focus:ring-primary/20 h-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                            tabIndex={-1}
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Password Requirements Checklist */}
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-2 text-[11px]">
                        <p className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
                          Password Requirements
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 transition-colors ${
                                hasMinLength
                                  ? "text-emerald-500"
                                  : "text-muted-foreground/40"
                              }`}
                            />
                            <span
                              className={
                                hasMinLength
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              }
                            >
                              At least 8 characters
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 transition-colors ${
                                passwordsMatch
                                  ? "text-emerald-500"
                                  : "text-muted-foreground/40"
                              }`}
                            />
                            <span
                              className={
                                passwordsMatch
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              }
                            >
                              Passwords match
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 transition-colors ${
                                hasLetterAndNumber
                                  ? "text-emerald-500"
                                  : "text-muted-foreground/40"
                              }`}
                            />
                            <span
                              className={
                                hasLetterAndNumber
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              }
                            >
                              Contains letters & numbers (recommended)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full font-semibold gap-2 py-5 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 transition-all"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Activating Account...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Set Password & Activate</span>
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="text-center pt-2">
                      <Link
                        to="/login"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                      >
                        Already have an activated account? Sign In
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

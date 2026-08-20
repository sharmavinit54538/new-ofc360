import React, { useState } from "react";
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
  KeyRound,
  UserCheck,
  RotateCcw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/seo/SEOHead";
import {
  useValidateEmployeeInvitationQuery,
  useActivateEmployeeMutation,
} from "@/services/api/employeeApi";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";

export default function EmployeeActivatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 1. Read the invitation token directly from the URL query parameter
  const rawToken =
    searchParams.get("token") ||
    searchParams.get("activation_token") ||
    searchParams.get("invite_token") ||
    "";
  const token = rawToken.trim();

  // 2. Validate token with the backend canonical endpoint GET /api/v1/onboarding/validate?token=...
  const {
    data: validationData,
    isLoading: isValidatingToken,
    isError: isValidationError,
    error: validationError,
    refetch: refetchValidation,
  } = useValidateEmployeeInvitationQuery(token, {
    skip: !token,
  });

  // 3. Resolve employee details strictly from the backend validation response
  const rawValidationData = (validationData as any)?.data || validationData;
  const resolvedEmployeeId =
    rawValidationData?.employee_id ||
    rawValidationData?.employeeId ||
    rawValidationData?.id ||
    rawValidationData?.employee?.id ||
    rawValidationData?.employee?._id ||
    rawValidationData?.employee?.employee_id ||
    rawValidationData?.employee_data?.id ||
    rawValidationData?.user?.id ||
    rawValidationData?.user_id ||
    rawValidationData?.userId ||
    "";

  const resolvedEmail =
    rawValidationData?.email ||
    rawValidationData?.employee?.email ||
    rawValidationData?.user?.email ||
    "";

  const resolvedName =
    rawValidationData?.full_name ||
    rawValidationData?.name ||
    rawValidationData?.employee?.full_name ||
    rawValidationData?.employee?.name ||
    "";

  const resolvedCompanyName =
    rawValidationData?.company_name ||
    rawValidationData?.employee?.company_name ||
    "";

  // 4. Granular Error Classification
  const normValError = isValidationError ? normalizeError(validationError) : null;
  const errStatus = normValError?.status;
  const errMsg = (normValError?.message || "").toLowerCase();
  const rawMsg = (typeof rawValidationData?.message === "string" ? rawValidationData.message : "").toLowerCase();

  // Network / Server Error (500, 502, 503, 504, FETCH_ERROR, timeout)
  const isNetworkOrServerError =
    Boolean(normValError) &&
    (errStatus === 500 ||
      errStatus === 502 ||
      errStatus === 503 ||
      errStatus === 504 ||
      errStatus === "FETCH_ERROR" ||
      errStatus === "PARSING_ERROR" ||
      errStatus === "TIMEOUT_ERROR" ||
      errMsg.includes("failed to fetch") ||
      errMsg.includes("network error") ||
      errMsg.includes("server error") ||
      errMsg.includes("timeout"));

  // Expired Token (410, or message indicates expired)
  const isExpiredToken =
    Boolean(normValError && !isNetworkOrServerError && (
      errStatus === 410 ||
      errMsg.includes("expired") ||
      normValError?.code === "TOKEN_EXPIRED"
    )) ||
    (rawValidationData?.expired === true ||
      rawValidationData?.status === "expired" ||
      rawMsg.includes("expired"));

  // Already Used Token (409, or message indicates already activated / used)
  const isAlreadyUsedToken =
    Boolean(normValError && !isNetworkOrServerError && !isExpiredToken && (
      errStatus === 409 ||
      errMsg.includes("already used") ||
      errMsg.includes("already activated") ||
      errMsg.includes("already accepted") ||
      errMsg.includes("already registered") ||
      normValError?.code === "TOKEN_ALREADY_USED"
    )) ||
    (rawValidationData?.already_used === true ||
      rawValidationData?.activated === true ||
      rawValidationData?.status === "already_used" ||
      rawValidationData?.status === "activated" ||
      rawMsg.includes("already used") ||
      rawMsg.includes("already activated"));

  // Explicit Invalid Token (Missing token, 400, 401, 403, 404, 422, or valid === false)
  const isMissingToken = !token;
  const isExplicitInvalidToken =
    isMissingToken ||
    (Boolean(validationData) && rawValidationData?.valid === false) ||
    (Boolean(normValError) &&
      !isNetworkOrServerError &&
      !isExpiredToken &&
      !isAlreadyUsedToken &&
      (errStatus === 400 ||
        errStatus === 401 ||
        errStatus === 403 ||
        errStatus === 404 ||
        errStatus === 422 ||
        errStatus === "CUSTOM_ERROR"));

  // 5. Form State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activateEmployee, { isLoading: isActivatingMutation }] = useActivateEmployeeMutation();
  const isActivating = isActivatingMutation || isSubmitting;

  // Live password validation rules
  const hasMinLength = password.length >= 8;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const hasLetterAndNumber =
    /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const isFormValid = hasMinLength && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isActivating) return;
    setErrorMessage(null);

    if (!token || !resolvedEmployeeId) {
      setErrorMessage(
        "Your invitation link is invalid or has expired. Please contact HR for a new invitation."
      );
      toast.error("Missing activation token or employee ID.");
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

    setIsSubmitting(true);
    try {
      const cleanEmpId = resolvedEmployeeId.trim();

      // Dispatch POST /api/v1/employees/{employee_id}/activate
      const res = await activateEmployee({
        id: cleanEmpId,
        employee_id: cleanEmpId,
        token: token,
        new_password: password,
        confirm_password: confirmPassword,
      }).unwrap();

      setIsSuccess(true);
      toast.success("Account activated successfully!");

      // Check if backend activation returned authentication session tokens
      const sessionToken =
        (res as any)?.token ||
        (res as any)?.access_token ||
        (res as any)?.data?.token ||
        (res as any)?.data?.access_token;
      const userObj = (res as any)?.user || (res as any)?.data?.user;

      if (sessionToken && userObj) {
        dispatch(
          setCredentials({
            token: sessionToken,
            refreshToken: (res as any)?.refreshToken || (res as any)?.data?.refreshToken,
            user: userObj,
          })
        );
        setTimeout(() => {
          navigate("/employee/onboarding", { replace: true });
        }, 1200);
      }
    } catch (err: any) {
      const norm = normalizeError(err);
      const normStatus = norm.status;
      const rawErr = (norm.message || "").toLowerCase();

      if (
        normStatus === 400 &&
        (rawErr.includes("expired") ||
          rawErr.includes("invalid token") ||
          rawErr.includes("already used") ||
          rawErr.includes("not found"))
      ) {
        setErrorMessage(
          "Your invitation link is invalid or has expired. Please contact HR for a new invitation."
        );
      } else {
        setErrorMessage(norm.message || "Failed to activate account. Please try again.");
      }
      toast.error(norm.message || "Account activation failed.");
    } finally {
      setIsSubmitting(false);
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
        title="Activate Your Account | OFC360"
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
                        Password set successfully. Please sign in to continue your onboarding.
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
                ) : isValidatingToken ? (
                  /* Token Validation Loading State */
                  <motion.div
                    key="validating-token"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-5 py-8"
                  >
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <div className="space-y-1.5">
                      <h2 className="text-base font-semibold text-foreground">
                        Validating invitation...
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Please wait while we verify your invitation details.
                      </p>
                    </div>
                  </motion.div>
                ) : isNetworkOrServerError ? (
                  /* Server / Network Failure State */
                  <motion.div
                    key="network-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-5 py-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive mx-auto shadow-inner">
                      <AlertCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-foreground">
                        Verification Failed
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Unable to verify your invitation right now. Please try again.
                      </p>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button
                        onClick={() => refetchValidation()}
                        className="w-full text-xs font-semibold gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="w-full text-xs font-semibold cursor-pointer"
                      >
                        Return to Sign In
                      </Button>
                    </div>
                  </motion.div>
                ) : isExpiredToken ? (
                  /* Expired Token View */
                  <motion.div
                    key="expired-token"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-5 py-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto shadow-inner">
                      <Clock className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-foreground">
                        Invitation Expired
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This invitation link has expired. Please request a new invitation.
                      </p>
                      {normValError?.status && (
                        <p className="text-[11px] text-muted-foreground/70 font-mono">
                          HTTP {normValError.status}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 space-y-2">
                      {token && (
                        <Button
                          onClick={() => refetchValidation()}
                          className="w-full text-xs font-semibold gap-2 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Try Again</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="w-full text-xs font-semibold cursor-pointer"
                      >
                        Return to Sign In
                      </Button>
                    </div>
                  </motion.div>
                ) : isAlreadyUsedToken ? (
                  /* Already Used / Activated Token View */
                  <motion.div
                    key="already-used-token"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-5 py-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 mx-auto shadow-inner">
                      <UserCheck className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-foreground">
                        Invitation Already Used
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This invitation has already been activated.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => navigate("/login")}
                        className="w-full text-xs font-semibold gap-2 cursor-pointer"
                      >
                        <span>Proceed to Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ) : isExplicitInvalidToken ? (
                  /* Invalid Token Warning */
                  <motion.div
                    key="invalid-token"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                        {normValError?.message ||
                          rawValidationData?.message ||
                          "This invitation link is invalid or no longer available."}
                      </p>
                      {normValError?.status && (
                        <p className="text-[11px] text-muted-foreground/70 font-mono">
                          HTTP {normValError.status}
                          {typeof normValError.data === "object" && (normValError.data as any)?.message
                            ? ` — ${(normValError.data as any).message}`
                            : ""}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 space-y-2">
                      {token && (
                        <Button
                          onClick={() => refetchValidation()}
                          className="w-full text-xs font-semibold gap-2 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Try Again</span>
                        </Button>
                      )}
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
                  /* Password Setup Form (Valid Token) */
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
                      {(resolvedName || resolvedEmail) && (
                        <p className="text-xs font-medium text-foreground">
                          {resolvedName ? (
                            <span>Welcome, <strong className="text-primary">{resolvedName}</strong> {resolvedEmail ? `(${resolvedEmail})` : ""}</span>
                          ) : (
                            <span>Account for <strong className="text-primary">{resolvedEmail}</strong></span>
                          )}
                          {resolvedCompanyName ? ` • ${resolvedCompanyName}` : ""}
                        </p>
                      )}
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
                            disabled={isActivating}
                            required
                            autoComplete="new-password"
                            className="pl-9 pr-10 bg-muted/40 border-border/60 text-xs focus:ring-primary/20 h-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
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
                            disabled={isActivating}
                            required
                            autoComplete="new-password"
                            className="pl-9 pr-10 bg-muted/40 border-border/60 text-xs focus:ring-primary/20 h-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
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
                              Minimum 8 characters
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
                              Passwords must match
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

                      {/* Submit / Activate Account Button */}
                      <Button
                        type="submit"
                        disabled={isActivating || !isFormValid}
                        className="w-full font-semibold gap-2 py-5 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 transition-all"
                      >
                        {isActivating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Activating Account...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Activate Account</span>
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

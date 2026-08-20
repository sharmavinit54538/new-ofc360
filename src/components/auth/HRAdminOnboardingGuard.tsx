import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetHRAdminOnboardingStatusQuery } from "@/services/api/hrAdminOnboardingApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";

interface HRAdminOnboardingGuardProps {
  children: ReactNode;
}

/**
 * Route guard for /hr-admin/onboarding route:
 * 1. Verifies user authentication and hr_admin role.
 * 2. Fetches authoritative onboarding status from backend.
 * 3. Shows loading skeleton during status fetch (no premature onboarding rendering).
 * 4. Shows retry UI on status fetch error (never assumes incomplete).
 * 5. Redirects to /dashboard immediately if backend reports onboarding is completed.
 * 6. Renders onboarding wizard at the current incomplete step if backend reports incomplete.
 */
export function HRAdminOnboardingGuard({ children }: HRAdminOnboardingGuardProps) {
  const { user, isAuthenticated, role } = useAuth();
  const activeRole = user?.role || role || "employee";
  const isHRAdmin = isAuthenticated && !!user && activeRole === "hr_admin";

  // 1. Fetch backend onboarding status unconditionally at top level
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isFetching: isStatusFetching,
    isError: isStatusError,
    refetch: refetchStatus,
  } = useGetHRAdminOnboardingStatusQuery(undefined, {
    skip: !isHRAdmin,
    refetchOnMountOrArgChange: true,
  });

  // 2. Unauthenticated -> redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Non-HR Admin role -> access restricted
  if (activeRole !== "hr_admin") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card p-8 rounded-2xl border border-destructive/20 text-center space-y-6 shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>RBAC Guard Active</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Access Restricted
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              HR Admin onboarding is only available for accounts with the HR Administrator role.
            </p>
          </div>

          <Button
            onClick={() => window.history.back()}
            className="w-full gradient-bg text-primary-foreground hover:opacity-90 transition-opacity gap-2 h-10 font-medium rounded-xl shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  // CASE 4: Loading State — do NOT temporarily render onboarding before status is known
  if (isStatusLoading || (!statusData && isStatusFetching)) {
    return (
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <SEOHead
          title="Verifying Onboarding Status | OFC360"
          description="Verifying organization onboarding status..."
        />
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="text-center space-y-3">
            <Skeleton className="h-9 w-64 mx-auto rounded-xl" />
            <Skeleton className="h-4 w-96 mx-auto rounded-lg" />
          </div>
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  // CASE 5: API Error State — do NOT assume incomplete or start onboarding on error
  if (isStatusError || !statusData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEOHead
          title="Onboarding Status Error | OFC360"
          description="Failed to load onboarding status."
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-card p-8 rounded-2xl border border-destructive/20 text-center space-y-6 shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mx-auto shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Unable to Verify Onboarding Status
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Could not communicate with the OFC360 onboarding service. Please check your internet connection or try again.
            </p>
          </div>
          <Button
            onClick={() => refetchStatus()}
            className="w-full gap-2 gradient-bg text-primary-foreground font-semibold h-10 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Verification
          </Button>
        </motion.div>
      </div>
    );
  }

  // CASE 1: Backend says onboarding is completed -> Redirect to dashboard immediately
  if (statusData.completed) {
    return <Navigate to="/dashboard" replace />;
  }

  // CASE 2 & 3: Incomplete / In-Progress -> Render onboarding flow
  return <>{children}</>;
}

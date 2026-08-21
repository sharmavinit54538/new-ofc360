import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetHRAdminOnboardingStatusQuery } from "@/services/api/hrAdminOnboardingApi";

export function useDashboardOnboardingRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const isHRAdmin = (user?.role || role) === "hr_admin";
  const { data: onboardingStatus, isLoading: isOnboardingLoading } = useGetHRAdminOnboardingStatusQuery(undefined, {
    skip: !isHRAdmin,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isHRAdmin && !isOnboardingLoading && onboardingStatus) {
      if (!onboardingStatus.completed && location.pathname !== "/hr-admin/onboarding") {
        navigate("/hr-admin/onboarding", { replace: true });
      }
    }
  }, [isHRAdmin, isOnboardingLoading, onboardingStatus, location.pathname, navigate]);

  return { isHRAdmin, isOnboardingLoading, onboardingStatus };
}

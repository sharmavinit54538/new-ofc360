import React from "react";
import { useLocation, Navigate, useSearchParams } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";
import OnboardingPage from "@/pages/OnboardingPage";

/**
 * OnboardingRouteResolver
 * 
 * - If a token parameter is present (e.g. `/onboarding?token=XYZ` or `activation_token` / `invite_token`),
 *   routes to the Employee Password Activation page (`/employee/activate?token=XYZ...`).
 * - Otherwise, renders the standard protected HR Admin Onboarding page within the dashboard layout.
 */
export default function OnboardingRouteResolver() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const token =
    searchParams.get("token") ||
    searchParams.get("activation_token") ||
    searchParams.get("invite_token");

  if (token) {
    return <Navigate to={`/employee/activate${location.search}`} replace />;
  }

  return (
    <RoleGuard module="onboarding">
      <OnboardingPage />
    </RoleGuard>
  );
}
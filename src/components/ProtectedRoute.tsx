import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary animate-spin">
            <Loader2 className="w-6 h-6" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Restoring OFC360 Session...
          </span>
        </div>
        <div className="max-w-md w-full space-y-3">
          <Skeleton className="h-4 w-3/4 mx-auto rounded" />
          <Skeleton className="h-4 w-1/2 mx-auto rounded" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const searchParams = new URLSearchParams(location.search);
    const token =
      searchParams.get("token") ||
      searchParams.get("activation_token") ||
      searchParams.get("invite_token");

    if (location.pathname === "/onboarding" && token) {
      return <Navigate to={`/employee/activate${location.search}`} replace />;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}


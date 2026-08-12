import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSelectors";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
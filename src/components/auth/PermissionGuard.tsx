import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SystemRole, normalizeRole } from "@/features/auth/authTypes";
import { hasPermission, SystemModule, ActionCapability } from "@/lib/permissions";

interface PermissionGuardProps {
  module: SystemModule;
  action: ActionCapability;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({
  module,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuth();
  const currentRole: SystemRole = normalizeRole(user?.role || "employee");

  const allowed = hasPermission(currentRole, module, action);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

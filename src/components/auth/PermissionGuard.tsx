import { ReactNode } from "react";
import { useAuthStore, SystemRole } from "@/stores/authStore";
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
  const { user } = useAuthStore();
  const currentRole: SystemRole = user?.role || "employee";

  const allowed = hasPermission(currentRole, module, action);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

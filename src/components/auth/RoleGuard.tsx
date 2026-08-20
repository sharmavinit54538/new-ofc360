import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { roleLabels, SystemRole, normalizeRole } from "@/features/auth/authTypes";
import { useAuth } from "@/hooks/useAuth";
import { hasModuleAccess, SystemModule } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface RoleGuardProps {
  allowedRoles?: SystemRole[];
  module?: SystemModule;
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, module, children }: RoleGuardProps) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  const currentRole: SystemRole = normalizeRole(user?.role || role || "employee");

  // Check role eligibility
  const roleAllowed = !allowedRoles || allowedRoles.includes(currentRole);
  const moduleAllowed = !module || hasModuleAccess(currentRole, module);

  if (!roleAllowed || !moduleAllowed) {
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
              You don't have permission to access this module with your current role privileges.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/60 border border-border/50 text-xs text-left space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span>Active System Role:</span>
              <span className="font-semibold text-foreground">{roleLabels[currentRole] || currentRole}</span>
            </div>
            {module && (
              <div className="flex justify-between text-muted-foreground">
                <span>Requested Module:</span>
                <span className="font-mono text-primary font-medium">{module}</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => navigate(-1)}
            className="w-full gradient-bg text-primary-foreground hover:opacity-90 transition-opacity gap-2 h-10 font-medium rounded-xl shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}


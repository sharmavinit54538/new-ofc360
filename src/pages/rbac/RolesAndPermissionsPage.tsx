import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels, SystemRole } from "@/features/auth/authTypes";
import { ROLE_CONFIGS, SystemModule, ActionCapability } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Lock, CheckCircle2, XCircle, ArrowRight, Sparkles, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const matrixModules: { key: SystemModule; label: string }[] = [
  { key: "employees", label: "Employees & Directory" },
  { key: "departments", label: "Departments" },
  { key: "attendance", label: "Attendance & Time" },
  { key: "payroll", label: "Payroll Administration" },
  { key: "performance", label: "Performance Management" },
  { key: "engagement", label: "Engagement Intelligence" },
  { key: "culture", label: "Culture & Sentiment" },
  { key: "compliance", label: "Compliance & Audit" },
  { key: "documents", label: "Documents & Files" },
  { key: "analytics", label: "Workforce Analytics" },
  { key: "intelligence_hub", label: "Intelligence Hub" },
  { key: "recruitment", label: "Recruitment & ATS" },
  { key: "system_settings", label: "System Settings" },
  { key: "audit_logs", label: "Audit Logs & Security" },
];

const matrixActions: { key: ActionCapability; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "approve", label: "Approve" },
  { key: "export", label: "Export" },
  { key: "manage", label: "Manage" },
];

export default function RolesAndPermissionsPage() {
  const { user, setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<SystemRole>(user?.role || "hr_admin");

  const config = ROLE_CONFIGS[selectedRole];

  const handleSwitchActiveRole = (role: SystemRole) => {
    setRole(role);
    setSelectedRole(role);
    toast.success(`Active system role switched to: ${roleLabels[role]}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/50">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Centralized RBAC Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Roles & System Permissions
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
            Configure system authorization matrices, scope boundaries, and action capabilities across all 5 system roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleSwitchActiveRole(selectedRole)}
            className="gradient-bg text-primary-foreground text-xs gap-1.5 font-medium shadow-sm h-9"
          >
            <UserCheck className="w-4 h-4" />
            <span>Set Active Role: {roleLabels[selectedRole]}</span>
          </Button>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(ROLE_CONFIGS) as SystemRole[]).map((r) => {
          const roleCfg = ROLE_CONFIGS[r];
          const isSelected = selectedRole === r;
          const isActiveUserRole = user?.role === r;

          return (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between h-24 ${
                isSelected
                  ? "bg-primary/10 border-primary/40 shadow-sm text-primary"
                  : "glass-card border-border/60 hover:border-primary/30 text-foreground"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{roleCfg.name}</span>
                  {isActiveUserRole && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Current Active Role" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {roleCfg.scopeLabel}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium pt-2 border-t border-border/30">
                <span className="text-muted-foreground">{roleCfg.allowedModules.length} Modules</span>
                <ArrowRight className={`w-3 h-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Role Details Card */}
      <motion.div
        key={selectedRole}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 border border-border/60 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{config.name} Role Details</h2>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                {config.scopeLabel}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSwitchActiveRole(selectedRole)}
            className="border-primary/30 text-primary hover:bg-primary/10 text-xs gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Switch UI to {config.name}
          </Button>
        </div>
      </motion.div>

      {/* Permission Matrix Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Permission Matrix — {config.name}</h3>
          <span className="text-xs text-muted-foreground">
            View, Create, Edit, Delete, Approve, Export, Manage
          </span>
        </div>

        <div className="glass-card rounded-xl border border-border/60 overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold text-xs min-w-[200px]">System Module</TableHead>
                {matrixActions.map((act) => (
                  <TableHead key={act.key} className="font-semibold text-xs text-center w-24">
                    {act.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrixModules.map((mod) => {
                const isModuleAllowed = config.allowedModules.includes(mod.key);
                const allowedActions = config.permissions[mod.key] || [];

                return (
                  <TableRow key={mod.key} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-xs">
                      <div className="flex items-center gap-2">
                        {isModuleAllowed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                        <span className={isModuleAllowed ? "text-foreground font-semibold" : "text-muted-foreground"}>
                          {mod.label}
                        </span>
                      </div>
                    </TableCell>

                    {matrixActions.map((act) => {
                      const hasAct = isModuleAllowed && allowedActions.includes(act.key);
                      return (
                        <TableCell key={act.key} className="text-center">
                          {hasAct ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                              ✓
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30 text-xs">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

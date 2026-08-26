import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  Edit,
  UserPlus,
  Briefcase,
  UserCheck,
  Building2,
  Send,
  KeyRound,
  UserX,
  CheckCircle2,
  Sparkles,
  Target,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  useGetManagersQuery,
  useCreateManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
  useSendManagerInvitationByIdMutation,
  useDeactivateManagerMutation,
  useActivateManagerByAdminMutation,
  useResetManagerPasswordMutation,
} from "@/services/api/managerApi";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels } from "@/features/auth/authTypes";
import { type Employee, type Manager } from "@/types/hr";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { Employee360Drawer } from "@/components/people-ai/Employee360Drawer";
import { toast } from "sonner";
import { normalizeError } from "@/services/api/normalizeError";

interface ManagersManagementPageProps {
  onOpenCopilot?: () => void;
}

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold tracking-wider",
  "On Leave": "bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold tracking-wider",
  Probation: "bg-blue-500/15 text-blue-500 border border-blue-500/30 font-bold tracking-wider",
  Notice: "bg-destructive/15 text-destructive border border-destructive/30 font-bold tracking-wider",
};

export default function ManagersManagementPage({ onOpenCopilot }: ManagersManagementPageProps) {
  const { setRole } = useAuth();
  const { data: rawManagers = [], isLoading, isFetching, isError, error, refetch } = useGetManagersQuery();
  const { data: rawEmployees = [] } = useGetEmployeesQuery();

  const [createManagerApi] = useCreateManagerMutation();
  const [updateManagerApi] = useUpdateManagerMutation();
  const [deleteManagerApi] = useDeleteManagerMutation();
  const [sendInviteApi] = useSendManagerInvitationByIdMutation();
  const [deactivateManagerApi] = useDeactivateManagerMutation();
  const [activateManagerApi] = useActivateManagerByAdminMutation();
  const [resetPasswordApi] = useResetManagerPasswordMutation();

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Employee | null>(null);

  const [selected360Emp, setSelected360Emp] = useState<Employee | null>(null);
  const [is360Open, setIs360Open] = useState(false);

  const managerList = Array.isArray(rawManagers) ? rawManagers : [];
  const employeeList = Array.isArray(rawEmployees) ? rawEmployees : [];

  const filtered = managerList.filter((m) => {
    const matchesSearch =
      (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.role || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.department || "").toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === "ALL" || m.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenCreate = () => {
    setEditingManager(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingManager(emp);
    setIsFormOpen(true);
  };

  const handleOpen360 = (emp: Employee) => {
    setSelected360Emp(emp);
    setIs360Open(true);
  };

  const handleSave = async (empData: Omit<Employee, "id">) => {
    try {
      if (editingManager) {
        await updateManagerApi({
          id: editingManager.id,
          manager: { ...empData, systemRole: "manager" },
        }).unwrap();
        toast.success(`Manager ${empData.name || editingManager.name} updated`);
      } else {
        await createManagerApi({ ...empData, systemRole: "manager" }).unwrap();
        toast.success(`Manager ${empData.name} created`);
      }
      setIsFormOpen(false);
      setEditingManager(null);
    } catch (err) {
      console.error(err);
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to save manager details. Please try again.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteManagerApi(id).unwrap();
      toast.success(`Manager ${name} removed`);
    } catch (err) {
      console.error(err);
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to remove manager. Please try again.");
    }
  };

  const handleSendInvite = async (id: string, name: string) => {
    try {
      await sendInviteApi(id).unwrap();
      toast.success(`Invitation sent to manager ${name}`);
    } catch (err) {
      console.error(err);
      const norm = normalizeError(err);
      toast.error(norm.message || `Failed to send invitation to ${name}`);
    }
  };

  const handleToggleActive = async (mgr: Manager) => {
    const isMgrActive = (mgr as any).status
      ? (mgr as any).status.toLowerCase().includes("active")
      : true;
    try {
      if (isMgrActive) {
        await deactivateManagerApi(mgr.id).unwrap();
        toast.success(`Deactivated account for manager ${mgr.name}`);
      } else {
        await activateManagerApi(mgr.id).unwrap();
        toast.success(`Activated account for manager ${mgr.name}`);
      }
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message || `Failed to update status for ${mgr.name}`);
    }
  };

  const handleResetPassword = async (id: string, name: string) => {
    try {
      const res = await resetPasswordApi(id).unwrap();
      if (res?.temporaryPassword) {
        toast.success(`Password reset for ${name}. Temporary: ${res.temporaryPassword}`);
      } else {
        toast.success(`Password reset link sent to ${name}`);
      }
    } catch (err) {
      const norm = normalizeError(err);
      toast.error(norm.message || `Failed to reset password for ${name}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Manager Intelligence & Leadership Roster</span>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 font-mono">
              {managerList.length} Managers
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Team leadership supervision, approval delegation, span-of-control analytics, and manager intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCopilot && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCopilot}
              className="text-xs h-10 px-3 font-semibold border-primary/30 text-primary hover:bg-primary/10 gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Manager AI Focus</span>
            </Button>
          )}

          <Button
            onClick={handleOpenCreate}
            className="gradient-bg text-primary-foreground text-xs h-10 px-4 font-semibold shadow-md gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Manager</span>
          </Button>
        </div>
      </div>

      {/* "What Should Managers Focus on Today?" AI Focus Board */}
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-gradient-to-r from-card to-primary/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Autonomous Manager Focus Actions
            </h3>
          </div>
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-semibold">
            AI Synchronized
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl glass-card border border-border/60 bg-card space-y-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Q3 Milestone Reviews
            </span>
            <p className="text-[11px] text-muted-foreground">
              Review sprint deliverables and unblock dependencies for {employeeList.length} direct team members.
            </p>
          </div>

          <div className="p-3 rounded-xl glass-card border border-border/60 bg-card space-y-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Leave Approvals
            </span>
            <p className="text-[11px] text-muted-foreground">
              Authorize active time-off requests to keep departmental capacity telemetry synchronized.
            </p>
          </div>

          <div className="p-3 rounded-xl glass-card border border-border/60 bg-card space-y-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Probation Confirmations
            </span>
            <p className="text-[11px] text-muted-foreground">
              Complete 90-day onboarding confirmation evaluations for eligible probation members.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between glass-card p-3 rounded-xl border border-border/60">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search managers by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-10 bg-secondary/30 border-border/60"
          />
        </div>

        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[160px] text-xs h-10 bg-secondary/30 border-border/60">
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Managers Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-xs bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Manager</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Department</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Direct Team Size</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Annual CTC / Salary</TableHead>
              <TableHead className="w-24 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-semibold text-xs text-foreground">Loading manager directory...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <p className="font-bold text-sm text-destructive">
                      Failed to load managers from the server.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => refetch()} className="h-8 text-xs gap-1.5 font-semibold">
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Briefcase className="w-8 h-8 text-muted-foreground/40" />
                    <p className="font-bold text-sm text-foreground">
                      {managerList.length === 0 ? "No managers registered yet" : "No managers match filter criteria"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((mgr) => {
                const displayName = mgr.name || "Manager";
                const displayEmail = mgr.email || "No email specified";
                const initials = displayName
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "M";

                const directTeamCount = employeeList.filter(
                  (e) =>
                    e.managerId === mgr.id ||
                    (e.department && (e.department || "").toLowerCase() === (mgr.department || "").toLowerCase() && e.id !== mgr.id)
                ).length || (mgr as any).teamSize || 2;

                const isMgrActive = (mgr as any).status
                  ? (mgr as any).status.toLowerCase().includes("active")
                  : true;

                return (
                  <TableRow key={mgr.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-primary/20 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-foreground truncate">{displayName}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 shrink-0" /> {displayEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px] font-medium bg-secondary/80">
                        {mgr.department || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono font-bold">
                        {directTeamCount} Reports
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                          statusStyle[(mgr as any).status || "Active"] || statusStyle.Active
                        }`}
                      >
                        {(mgr as any).status || "ACTIVE"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold">
                      ₹{((mgr as any).salary || (mgr as any).ctc || 1450000).toLocaleString()}/yr
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpen360(mgr as any)}
                          className="h-8 text-xs font-semibold px-2 text-primary hover:bg-primary/10 gap-1 hidden md:flex cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>360 AI</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-lg border-border/60">
                            <DropdownMenuItem
                              onClick={() => handleOpen360(mgr as any)}
                              className="text-xs gap-2 cursor-pointer font-semibold text-primary py-2"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-primary" /> View Manager 360 AI Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleOpenEdit(mgr as any)}
                              className="text-xs gap-2 cursor-pointer font-medium py-2"
                            >
                              <Edit className="w-3.5 h-3.5 text-foreground" /> Edit Role & Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setRole("manager");
                                toast.success(`Switched active view to Manager Dashboard (${mgr.name})`);
                              }}
                              className="text-xs gap-2 text-teal-600 dark:text-teal-400 font-semibold cursor-pointer py-2"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Switch UI to Manager Role
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleSendInvite(mgr.id, mgr.name)}
                              className="text-xs gap-2 text-blue-600 dark:text-blue-400 font-medium cursor-pointer py-2"
                            >
                              <Send className="w-3.5 h-3.5 text-blue-500" /> Send Invitation
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleResetPassword(mgr.id, mgr.name)}
                              className="text-xs gap-2 text-amber-600 dark:text-amber-400 font-medium cursor-pointer py-2"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Reset Password
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleToggleActive(mgr)}
                              className="text-xs gap-2 font-medium cursor-pointer py-2"
                            >
                              {isMgrActive ? (
                                <>
                                  <UserX className="w-3.5 h-3.5 text-orange-500" /> Deactivate Account
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Activate Account
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1" />

                            <DropdownMenuItem
                              onClick={() => handleDelete(mgr.id, mgr.name)}
                              className="text-xs gap-2 text-destructive focus:text-destructive font-semibold cursor-pointer py-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Manager
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Employee Form Dialog with Preset Manager Role */}
      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        employee={editingManager ? editingManager : ({ systemRole: "manager" } as any)}
        onSave={handleSave}
      />

      {/* Employee 360 AI Profile Drawer */}
      <Employee360Drawer
        open={is360Open}
        onClose={() => setIs360Open(false)}
        employee={selected360Emp}
        allEmployees={employeeList}
      />
    </motion.div>
  );
}
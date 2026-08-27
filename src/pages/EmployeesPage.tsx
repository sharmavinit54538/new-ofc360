import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  Edit,
  UserPlus,
  Filter,
  ShieldCheck,
  UserCheck,
  Send,
  KeyRound,
  UserX,
  CheckCircle2,
  Plus,
  Sparkles,
  GitPullRequest,
  DoorOpen,
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
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useSendInvitationMutation,
  useDeactivateEmployeeMutation,
  useActivateEmployeeByAdminMutation,
  useResetEmployeePasswordMutation,
} from "@/services/api/employeeApi";
import {
  useTriggerJoinerWorkflowMutation,
  useTriggerMoverWorkflowMutation,
  useTriggerLeaverWorkflowMutation,
} from "@/services/api/peopleAiApi";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels, ROLE_OPTIONS, normalizeRole } from "@/features/auth/authTypes";
import { type Employee } from "@/types/hr";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { Employee360Drawer } from "@/components/people-ai/Employee360Drawer";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";

interface EmployeesPageProps {
  onOpenCopilot?: () => void;
}

const getStatusBadgeStyle = (status?: string) => {
  const s = (status || "active").toLowerCase().replace(/_/g, " ");
  if (s.includes("active") && !s.includes("in")) {
    return "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold tracking-wider";
  }
  if (s.includes("leave")) {
    return "bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold tracking-wider";
  }
  if (s.includes("probation")) {
    return "bg-blue-500/15 text-blue-500 border border-blue-500/30 font-bold tracking-wider";
  }
  if (s.includes("notice") || s.includes("inactive") || s.includes("reject")) {
    return "bg-destructive/15 text-destructive border border-destructive/30 font-bold tracking-wider";
  }
  return "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold tracking-wider";
};

export default function EmployeesPage({ onOpenCopilot }: EmployeesPageProps) {
  const { setRole } = useAuth();
  const { data: employees = [], isLoading, isFetching, isError, error, refetch } = useGetEmployeesQuery();
  const [createEmployeeApi] = useCreateEmployeeMutation();
  const [updateEmployeeApi] = useUpdateEmployeeMutation();
  const [deleteEmployeeApi] = useDeleteEmployeeMutation();
  const [sendInvitationApi] = useSendInvitationMutation();
  const [deactivateEmployeeApi] = useDeactivateEmployeeMutation();
  const [activateEmployeeApi] = useActivateEmployeeByAdminMutation();
  const [resetPasswordApi] = useResetEmployeePasswordMutation();

  const [triggerJoinerApi] = useTriggerJoinerWorkflowMutation();
  const [triggerMoverApi] = useTriggerMoverWorkflowMutation();
  const [triggerLeaverApi] = useTriggerLeaverWorkflowMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  const [selected360Emp, setSelected360Emp] = useState<Employee | null>(null);
  const [is360Open, setIs360Open] = useState(false);

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setIsFormOpen(true);
  };

  const handleOpen360 = (emp: Employee) => {
    setSelected360Emp(emp);
    setIs360Open(true);
  };

  const handleSaveEmployee = async (empData: Omit<Employee, "id">) => {
    try {
      if (editingEmp) {
        await updateEmployeeApi({ id: editingEmp.id, changes: empData }).unwrap();
        toast.success(`${empData.name || editingEmp.name} updated`);
      } else {
        const created = await createEmployeeApi(empData).unwrap();
        toast.success(`${empData.name} added`);
        if (created?.id) {
          triggerJoinerApi({ employee: created as Employee });
        }
      }
      setIsFormOpen(false);
      setEditingEmp(null);
    } catch (err: any) {
      console.error("Save employee error:", err);
      const norm = normalizeError(err);
      toast.error(norm.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteEmployeeApi(id).unwrap();
      toast.success(`User ${name} removed`);
    } catch (err: any) {
      console.error("Delete employee error:", err);
      const norm = normalizeError(err);
      toast.error(norm.message || "Failed to remove employee. Please try again.");
    }
  };

  const handleSendInvite = async (id: string, name: string) => {
    try {
      await sendInvitationApi(id).unwrap();
      toast.success(`Invitation sent to ${name}`);
    } catch (err: any) {
      console.error("Send invite error:", err);
      const norm = normalizeError(err);
      toast.error(norm.message || `Failed to send invitation to ${name}`);
    }
  };

  const handleToggleActive = async (emp: Employee) => {
    const isActive = (emp.status || "").toLowerCase().includes("active");
    try {
      if (isActive) {
        await deactivateEmployeeApi(emp.id).unwrap();
        toast.success(`Deactivated account for ${emp.name}`);
      } else {
        await activateEmployeeApi(emp.id).unwrap();
        toast.success(`Activated account for ${emp.name}`);
      }
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message || `Failed to update status for ${emp.name}`);
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
    } catch (err: any) {
      const norm = normalizeError(err);
      toast.error(norm.message || `Failed to reset password for ${name}`);
    }
  };

  const handleTriggerJoiner = async (emp: Employee) => {
    try {
      await triggerJoinerApi({ employee: emp }).unwrap();
      toast.success(`Onboarding lifecycle initiated for ${emp.name}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to trigger joiner workflow");
    }
  };

  const handleTriggerMover = async (emp: Employee) => {
    try {
      await triggerMoverApi({
        employee: emp,
        changes: { newRole: `Senior ${emp.role || "Specialist"}` },
      }).unwrap();
      toast.success(`Internal mobility pipeline initiated for ${emp.name}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to trigger mover workflow");
    }
  };

  const handleTriggerLeaver = async (emp: Employee) => {
    try {
      await triggerLeaverApi({
        employee: emp,
        reason: "Voluntary Transition",
      }).unwrap();
      toast.success(`Exit clearance workflow initiated for ${emp.name}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to trigger leaver workflow");
    }
  };

  const employeeList = Array.isArray(employees) ? employees : [];

  const filtered = employeeList.filter((e) => {
    const matchesSearch =
      (e.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.role || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.department || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === "ALL" || e.department === departmentFilter;
    const matchesStatus = statusFilter === "ALL" || (e.status || "Active").toLowerCase() === statusFilter.toLowerCase();
    const empRole = normalizeRole(e.role || e.systemRole || (e as any).backendRole);
    const matchesRole = roleFilter === "ALL" || empRole === roleFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesRole;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Employee Directory</span>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 font-mono">
              {employeeList.length} Total
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage corporate headcount, system role assignments, department mappings, and employee records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCopilot && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenCopilot}
              className="text-xs h-10 px-3.5 font-bold border-primary/40 text-primary bg-primary/5 hover:bg-primary/15 gap-1.5 shadow-xs cursor-pointer rounded-xl"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>People AI</span>
            </Button>
          )}

          <Button
            onClick={handleOpenAdd}
            className="gradient-bg text-primary-foreground text-xs h-10 px-4 font-semibold shadow-md gap-1.5 cursor-pointer rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between glass-card p-3 rounded-xl border border-border/60">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees by name, email, designation, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-10 bg-secondary/30 border-border/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* System Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px] text-xs h-10 bg-secondary/30 border-border/60">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <SelectValue placeholder="System Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              {ROLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[140px] text-xs h-10 bg-secondary/30 border-border/60">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Depts</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] text-xs h-10 bg-secondary/30 border-border/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Probation">Probation</SelectItem>
              <SelectItem value="Notice">Notice</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-xs bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">User / Employee</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Department</TableHead>
              <TableHead className="text-xs font-bold text-foreground">System Access Role</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Annual CTC / Salary</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Joined Date</TableHead>
              <TableHead className="w-12 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-semibold text-xs text-foreground">Loading employee directory...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <p className="font-bold text-sm text-destructive">
                      Failed to load employees from the server.
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-sm">
                      {(error as any)?.data?.message || (error as any)?.error || "An unexpected error occurred."}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => refetch()} className="h-8 text-xs gap-1.5 font-semibold">
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UserPlus className="w-8 h-8 text-muted-foreground/40" />
                    <p className="font-bold text-sm text-foreground">
                      {employeeList.length === 0 ? "No employees in directory" : "No users match your filter criteria"}
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-sm">
                      {employeeList.length === 0
                        ? 'Get started by creating employees and system user accounts using the "+ Add Employee" button above.'
                        : "Try clearing your search query or department filters to see more results."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((emp) => {
                const displayName =
                  emp.name ||
                  (emp.firstName ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "") ||
                  (emp.email ? emp.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "") ||
                  "Employee";

                const displayEmail =
                  emp.email ||
                  emp.companyWorkEmail ||
                  emp.personalEmail ||
                  "No email specified";

                const initials = displayName
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "E";

                const isEmpActive = (emp.status || "Active").toLowerCase().includes("active");

                return (
                  <TableRow key={emp.id} className="hover:bg-secondary/30 transition-colors">
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
                        {emp.department || "Unassigned"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                        {roleLabels[emp.systemRole || "employee"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase ${getStatusBadgeStyle(
                          emp.status
                        )}`}
                      >
                        {emp.status || "ACTIVE"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold">
                      ₹{(emp.salary || emp.ctc || 0).toLocaleString()}/yr
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {emp.joinedAt || emp.joiningDate || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5 shadow-lg border-border/60">
                          <DropdownMenuItem
                            onClick={() => handleOpen360(emp)}
                            className="text-xs gap-2 cursor-pointer font-semibold text-primary py-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> View Employee 360 AI Profile
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(emp)}
                            className="text-xs gap-2 cursor-pointer font-medium py-2"
                          >
                            <Edit className="w-3.5 h-3.5 text-foreground" /> Edit Role & Details
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Autonomous Workflows
                          </DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() => handleTriggerJoiner(emp)}
                            className="text-xs gap-2 text-blue-600 dark:text-blue-400 font-medium cursor-pointer py-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Start Onboarding Pipeline
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleTriggerMover(emp)}
                            className="text-xs gap-2 text-purple-600 dark:text-purple-400 font-medium cursor-pointer py-2"
                          >
                            <GitPullRequest className="w-3.5 h-3.5" /> Start Mover / Transfer Workflow
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleTriggerLeaver(emp)}
                            className="text-xs gap-2 text-amber-600 dark:text-amber-400 font-medium cursor-pointer py-2"
                          >
                            <DoorOpen className="w-3.5 h-3.5" /> Start Exit Clearance Workflow
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1" />

                          <DropdownMenuItem
                            onClick={() => {
                              const targetRole = normalizeRole(emp.systemRole || emp.role);
                              setRole(targetRole);
                              toast.success(
                                `Switched active role to ${roleLabels[targetRole] || "Employee"}`
                              );
                            }}
                            className="text-xs gap-2 text-teal-600 dark:text-teal-400 font-semibold cursor-pointer py-2"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Switch UI to This Role
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleSendInvite(emp.id, emp.name)}
                            className="text-xs gap-2 text-blue-600 dark:text-blue-400 font-medium cursor-pointer py-2"
                          >
                            <Send className="w-3.5 h-3.5 text-blue-500" /> Send Invitation
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleResetPassword(emp.id, emp.name)}
                            className="text-xs gap-2 text-amber-600 dark:text-amber-400 font-medium cursor-pointer py-2"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Reset Password
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleToggleActive(emp)}
                            className="text-xs gap-2 font-medium cursor-pointer py-2"
                          >
                            {isEmpActive ? (
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
                            onClick={() => handleDelete(emp.id, emp.name)}
                            className="text-xs gap-2 text-destructive focus:text-destructive font-semibold cursor-pointer py-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 11-Tab Add / Edit Employee Dialog */}
      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        employee={editingEmp}
        onSave={handleSaveEmployee}
      />

      {/* Employee 360 AI Profile Drawer */}
      <Employee360Drawer
        open={is360Open}
        onClose={() => setIs360Open(false)}
        employee={selected360Emp}
        allEmployees={employeeList}
        onTriggerAction={(act, emp) => {
          if (act.includes("Training")) handleTriggerJoiner(emp);
          else if (act.includes("Transfer") || act.includes("Mover")) handleTriggerMover(emp);
          else if (act.includes("Exit") || act.includes("Leaver")) handleTriggerLeaver(emp);
        }}
      />
    </motion.div>
  );
}
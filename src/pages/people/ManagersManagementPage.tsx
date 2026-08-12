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
import { useAuth } from "@/hooks/useAuth";
import { roleLabels } from "@/features/auth/authTypes";
import { type Employee, type Manager } from "@/types/hr";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { toast } from "sonner";
import { normalizeError } from "@/services/api/normalizeError";

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold tracking-wider",
  "On Leave": "bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold tracking-wider",
  Probation: "bg-blue-500/15 text-blue-500 border border-blue-500/30 font-bold tracking-wider",
  Notice: "bg-destructive/15 text-destructive border border-destructive/30 font-bold tracking-wider",
};

export default function ManagersManagementPage() {
  const { setRole } = useAuth();
  const { data: rawManagers = [], isLoading, isFetching, isError, error, refetch } = useGetManagersQuery();
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

  const managerList = Array.isArray(rawManagers) ? rawManagers : [];

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
    const isActive = (mgr.status || "").toLowerCase().includes("active");
    try {
      if (isActive) {
        await deactivateManagerApi(mgr.id).unwrap();
        toast.success(`Deactivated account for manager ${mgr.name}`);
      } else {
        await activateManagerApi(mgr.id).unwrap();
        toast.success(`Activated account for manager ${mgr.name}`);
      }
    } catch (err) {
      console.error(err);
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
        toast.success(`Password reset link sent to manager ${name}`);
      }
    } catch (err) {
      console.error(err);
      const norm = normalizeError(err);
      toast.error(norm.message || `Failed to reset password for ${name}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <span>Team Managers & Leads Directory</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {managerList.length} active managers with team delegation & approval privileges
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleOpenCreate}
          className="gap-1.5 gradient-bg text-primary-foreground font-bold h-10 px-4 rounded-xl shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Add / Create Manager
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search managers by name, email, or department..."
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

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-xs bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Manager</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Department</TableHead>
              <TableHead className="text-xs font-bold text-foreground">System Role</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">CTC / Salary</TableHead>
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
                    <p className="font-semibold text-xs text-foreground">Loading managers directory...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <p className="font-bold text-sm text-destructive">
                      Failed to load managers from the server.
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
                    <Briefcase className="w-8 h-8 text-muted-foreground/40" />
                    <p className="font-bold text-sm text-foreground">
                      {managerList.length === 0 ? "No managers registered yet" : "No managers match your search"}
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-sm">
                      {managerList.length === 0
                        ? 'Click the "+ Add / Create Manager" button to appoint team managers.'
                        : "Try resetting your department filter or search query."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((mgr) => {
                const initials = mgr.name
                  ? mgr.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "M";

                const isMgrActive = (mgr.status || "Active").toLowerCase().includes("active");

                return (
                  <TableRow key={mgr.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-xs text-foreground">{mgr.name}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {mgr.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px] font-medium bg-secondary/80">
                        {mgr.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-bold">
                        {roleLabels[mgr.systemRole || "manager"] || "Manager"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                          statusStyle[mgr.status] || "bg-secondary text-foreground"
                        }`}
                      >
                        {mgr.status || "ACTIVE"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold">
                      ₹{(mgr.salary || mgr.ctc || 0).toLocaleString()}/yr
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {mgr.joinedAt || mgr.joiningDate || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 shadow-lg border-border/60">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(mgr)}
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
                            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Switch UI to This Role
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

      {/* Employee Form Dialog with Preset Manager Role */}
      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        employee={editingManager ? editingManager : ({ systemRole: "manager" } as any)}
        onSave={handleSave}
      />
    </motion.div>
  );
}

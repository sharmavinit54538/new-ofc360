import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  Edit,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Building2,
  Sparkles,
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
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeFullMutation,
  useDeactivateEmployeeMutation,
} from "@/services/api/employeeApi";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels } from "@/features/auth/authTypes";
import { type Employee } from "@/types/hr";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { toast } from "sonner";

interface ITAdminsManagementPageProps {
  onOpenCopilot?: () => void;
  onOpenDataHealth?: () => void;
}

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold tracking-wider",
  "On Leave": "bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold tracking-wider",
  Probation: "bg-blue-500/15 text-blue-500 border border-blue-500/30 font-bold tracking-wider",
  Notice: "bg-destructive/15 text-destructive border border-destructive/30 font-bold tracking-wider",
};

export default function ITAdminsManagementPage({
  onOpenCopilot,
  onOpenDataHealth,
}: ITAdminsManagementPageProps) {
  const { setRole } = useAuth();
  const { data: rawEmployees = [], isLoading } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeFullMutation();
  const [deactivateEmployee] = useDeactivateEmployeeMutation();

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Employee | null>(null);

  // IT Admins are employees with systemRole === 'it_admin'
  const admins = employees.filter(
    (e) => (e.systemRole || "employee") === "it_admin"
  );

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      (admin.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (admin.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (admin.id || "").toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "ALL" || admin.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingAdmin(emp);
    setIsFormOpen(true);
  };

  const handleSave = async (data: Omit<Employee, "id">) => {
    try {
      if (editingAdmin) {
        await updateEmployee({ id: editingAdmin.id, employee: { ...data, systemRole: "it_admin" } }).unwrap();
        toast.success(`IT Admin ${data.name} updated successfully.`);
      } else {
        await createEmployee({ ...data, systemRole: "it_admin" }).unwrap();
        toast.success(`IT Admin ${data.name} created successfully.`);
      }
      setIsFormOpen(false);
      setEditingAdmin(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save IT admin record.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>IT & System Admin Directory</span>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 font-mono">
              {admins.length} Administrators
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            System administration roster, identity privileges, and account governance records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenCreate}
            className="gradient-bg text-primary-foreground text-xs h-10 px-4 font-semibold shadow-md gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add IT Admin</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between glass-card p-3 rounded-xl border border-border/60">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search IT Admins by name, email, ID..."
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
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-xs bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Administrator</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Department</TableHead>
              <TableHead className="text-xs font-bold text-foreground">System Role</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Security Scope</TableHead>
              <TableHead className="w-12 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-semibold text-xs text-foreground">Loading IT admin directory...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <ShieldCheck className="w-8 h-8 text-muted-foreground/40" />
                    <p className="font-bold text-sm text-foreground">
                      {admins.length === 0 ? "No IT Administrators assigned yet" : "No administrators match filter criteria"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => {
                const displayName = admin.name || "IT Admin";
                const displayEmail = admin.email || "No email specified";
                const initials = displayName
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "IT";

                return (
                  <TableRow key={admin.id} className="hover:bg-secondary/30 transition-colors">
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
                        {admin.department || "IT"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                        {roleLabels[admin.systemRole || "it_admin"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                          statusStyle[admin.status || "Active"] || statusStyle.Active
                        }`}
                      >
                        {admin.status || "ACTIVE"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono bg-secondary/50 text-foreground">
                        System Operations
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-lg border-border/60">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(admin)}
                            className="text-xs gap-2 cursor-pointer font-medium py-2"
                          >
                            <Edit className="w-3.5 h-3.5 text-foreground" /> Edit Role & Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setRole("it_admin");
                              toast.success(`Switched active view to IT Admin Dashboard (${admin.name})`);
                            }}
                            className="text-xs gap-2 text-teal-600 dark:text-teal-400 font-semibold cursor-pointer py-2"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Switch UI to IT Admin Role
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1" />

                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await deactivateEmployee(admin.id).unwrap();
                                toast.success(`Deactivated account for ${admin.name}`);
                              } catch (err: any) {
                                toast.error("Failed to deactivate account.");
                              }
                            }}
                            className="text-xs gap-2 text-destructive focus:text-destructive font-semibold cursor-pointer py-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Deactivate Account
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

      {/* Form Dialog */}
      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        employee={editingAdmin ? editingAdmin : ({ systemRole: "it_admin" } as any)}
        onSave={handleSave}
      />
    </motion.div>
  );
}
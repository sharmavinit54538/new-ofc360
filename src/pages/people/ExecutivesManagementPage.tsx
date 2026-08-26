import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  Edit,
  UserPlus,
  Crown,
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
import { Employee360Drawer } from "@/components/people-ai/Employee360Drawer";
import { toast } from "sonner";

interface ExecutivesManagementPageProps {
  onOpenCopilot?: () => void;
}

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold tracking-wider",
  "On Leave": "bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold tracking-wider",
  Probation: "bg-blue-500/15 text-blue-500 border border-blue-500/30 font-bold tracking-wider",
  Notice: "bg-destructive/15 text-destructive border border-destructive/30 font-bold tracking-wider",
};

export default function ExecutivesManagementPage({ onOpenCopilot }: ExecutivesManagementPageProps) {
  const { setRole } = useAuth();
  const { data: rawEmployees = [], isLoading } = useGetEmployeesQuery();

  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeFullMutation();
  const [deactivateEmployee] = useDeactivateEmployeeMutation();

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExec, setEditingExec] = useState<Employee | null>(null);

  const [selected360Emp, setSelected360Emp] = useState<Employee | null>(null);
  const [is360Open, setIs360Open] = useState(false);

  // Executives are employees with systemRole === 'executive' or CXO titles
  const executives = employees.filter(
    (e) =>
      (e.systemRole || (e as any).role || "employee") === "executive" ||
      (e.role || "").toLowerCase().includes("chief") ||
      (e.role || "").toLowerCase().includes("director") ||
      (e.role || "").toLowerCase().includes("vp")
  );

  const filtered = executives.filter((ex) => {
    const matchesSearch =
      (ex.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (ex.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (ex.role || "").toLowerCase().includes(search.toLowerCase()) ||
      (ex.department || "").toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === "ALL" || ex.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenCreate = () => {
    setEditingExec(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingExec(emp);
    setIsFormOpen(true);
  };

  const handleOpen360 = (emp: Employee) => {
    setSelected360Emp(emp);
    setIs360Open(true);
  };

  const handleSave = async (empData: Omit<Employee, "id">) => {
    try {
      if (editingExec) {
        await updateEmployee({ id: editingExec.id, employee: { ...empData, systemRole: "executive" } }).unwrap();
        toast.success(`Executive ${empData.name} updated.`);
      } else {
        await createEmployee({ ...empData, systemRole: "executive" }).unwrap();
        toast.success(`Executive ${empData.name} appointed.`);
      }
      setIsFormOpen(false);
      setEditingExec(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save executive record.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Executive & Leadership Roster</span>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 font-mono">
              {executives.length} CXO Leaders
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Executive leadership roster, strategic portfolio assignments, and governance records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenCreate}
            className="gradient-bg text-primary-foreground text-xs h-10 px-4 font-semibold shadow-md gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add CXO / Leader</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between glass-card p-3 rounded-xl border border-border/60">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search executives by name, role, department..."
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
            <SelectItem value="Executive">Executive</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-xs bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Executive Leader</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Department</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Designation / Role</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Annual CTC / Salary</TableHead>
              <TableHead className="w-12 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-semibold text-xs text-foreground">Loading executive roster...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Crown className="w-8 h-8 text-muted-foreground/40" />
                    <p className="font-bold text-sm text-foreground">
                      {executives.length === 0 ? "No executive leaders registered yet" : "No leaders match filter criteria"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ex) => {
                const displayName = ex.name || "Leader";
                const displayEmail = ex.email || "No email specified";
                const initials = displayName
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "L";

                return (
                  <TableRow key={ex.id} className="hover:bg-secondary/30 transition-colors">
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
                        {ex.department || "Executive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                        {ex.role || "Executive Leader"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                          statusStyle[ex.status || "Active"] || statusStyle.Active
                        }`}
                      >
                        {ex.status || "ACTIVE"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold">
                      ₹{(ex.salary || ex.ctc || 2800000).toLocaleString()}/yr
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
                            onClick={() => handleOpen360(ex)}
                            className="text-xs gap-2 cursor-pointer font-semibold text-primary py-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> View Executive 360 AI Profile
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(ex)}
                            className="text-xs gap-2 cursor-pointer font-medium py-2"
                          >
                            <Edit className="w-3.5 h-3.5 text-foreground" /> Edit Role & Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setRole("executive");
                              toast.success(`Switched active view to Executive Dashboard (${ex.name})`);
                            }}
                            className="text-xs gap-2 text-teal-600 dark:text-teal-400 font-semibold cursor-pointer py-2"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Switch UI to Executive Role
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
        employee={editingExec ? editingExec : ({ systemRole: "executive" } as any)}
        onSave={handleSave}
      />

      {/* Employee 360 AI Drawer */}
      <Employee360Drawer
        open={is360Open}
        onClose={() => setIs360Open(false)}
        employee={selected360Emp}
        allEmployees={employees}
      />
    </motion.div>
  );
}
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
  Building2
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
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold tracking-wider",
  "On Leave": "bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold tracking-wider",
  Probation: "bg-blue-500/15 text-blue-500 border-blue-500/30 font-bold tracking-wider",
  Notice: "bg-destructive/15 text-destructive border-destructive/30 font-bold tracking-wider",
};

export default function ExecutivesManagementPage() {
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

  // Executives are employees with systemRole === 'executive'
  const executives = employees.filter(
    (e) => (e.systemRole || (e as any).role || "employee") === "executive"
  );

  const filtered = executives.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.email.toLowerCase().includes(search.toLowerCase()) ||
      ex.role.toLowerCase().includes(search.toLowerCase()) ||
      ex.department.toLowerCase().includes(search.toLowerCase());

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

  const handleSave = async (empData: Omit<Employee, "id">) => {
    try {
      if (editingExec) {
        await updateEmployee({ id: editingExec.id, ...empData, role: "executive", systemRole: "executive" }).unwrap();
        toast.success(`Executive ${empData.name} updated successfully.`);
      } else {
        await createEmployee({ ...empData, role: "executive", systemRole: "executive" }).unwrap();
        toast.success(`New Executive ${empData.name} created successfully.`);
      }
      setIsFormOpen(false);
      setEditingExec(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save executive.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deactivateEmployee(id).unwrap();
      toast.success(`Executive ${name} removed`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove executive.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span>Executive Leadership & C-Suite Directory</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {executives.length} executive leaders with organization-wide intelligence access
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleOpenCreate}
          className="gap-1.5 gradient-bg text-primary-foreground font-bold h-10 px-4 rounded-xl shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Appoint Executive / CXO
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search executives by name, email, or designation..."
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
              <TableHead className="text-xs font-bold text-foreground">Executive / CXO</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Department / Division</TableHead>
              <TableHead className="text-xs font-bold text-foreground">System Role</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Compensation</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Appointed Date</TableHead>
              <TableHead className="w-12 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Crown className="w-8 h-8 text-muted-foreground/40" />
                    <p className="font-bold text-sm text-foreground">
                      {executives.length === 0 ? "No executives registered yet" : "No executives match your search"}
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-sm">
                      {executives.length === 0
                        ? 'Click the "+ Appoint Executive / CXO" button to appoint executive officers.'
                        : "Try resetting your department filter or search query."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ex) => {
                const displayName =
                  ex.name ||
                  (ex.firstName ? `${ex.firstName} ${ex.lastName || ""}`.trim() : "") ||
                  (ex.email ? ex.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "") ||
                  "Executive";

                const displayEmail =
                  ex.email ||
                  ex.companyWorkEmail ||
                  ex.personalEmail ||
                  "No email specified";

                const initials = displayName
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "C";

                return (
                  <TableRow key={ex.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-amber-500/30 shrink-0">
                          <AvatarFallback className="bg-amber-500/10 text-amber-500 text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-foreground flex items-center gap-1 truncate">
                            {displayName}
                            <Crown className="w-3 h-3 text-amber-500 fill-amber-500/20 shrink-0" />
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 shrink-0" /> {displayEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px] font-medium bg-secondary/80">
                        {ex.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-bold">
                        Executive / CXO
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          statusStyle[ex.status] || "bg-secondary text-foreground"
                        }`}
                      >
                        {ex.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold">
                      ₹{(ex.salary || ex.ctc || 0).toLocaleString()}/yr
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {ex.joinedAt || ex.joiningDate || "—"}
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
                            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Switch UI to This Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(ex.id, ex.name)}
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

      {/* Employee Form Dialog with Preset Executive Role */}
      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        employee={editingExec ? editingExec : ({ role: "executive", systemRole: "executive" } as any)}
        onSave={handleSave}
      />
    </motion.div>
  );
}
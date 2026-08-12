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
  UserCheck
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
import { useEmployeeStore } from "@/stores/employeeStore";
import { useAuthStore, roleLabels, SystemRole } from "@/stores/authStore";
import { type Employee } from "@/types/hr";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { toast } from "sonner";

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold tracking-wider",
  "On Leave": "bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold tracking-wider",
  Probation: "bg-blue-500/15 text-blue-500 border-blue-500/30 font-bold tracking-wider",
  Notice: "bg-destructive/15 text-destructive border-destructive/30 font-bold tracking-wider",
};

export default function EmployeesPage() {
  const { setRole } = useAuthStore();
  const {
    employees,
    searchQuery,
    departmentFilter,
    statusFilter,
    setSearchQuery,
    setDepartmentFilter,
    setStatusFilter,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployeeStore();

  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setIsFormOpen(true);
  };

  const handleSaveEmployee = (empData: Omit<Employee, "id">) => {
    if (editingEmp) {
      updateEmployee(editingEmp.id, empData);
    } else {
      addEmployee(empData);
    }
  };

  const handleDelete = (id: string, name: string) => {
    deleteEmployee(id);
    toast.success(`User ${name} removed`);
  };

  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === "ALL" || e.department === departmentFilter;
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    const matchesRole = roleFilter === "ALL" || (e.systemRole || "employee") === roleFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesRole;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Employees & Workforce Directory</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {employees.length} active employee profiles and system user accounts
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleOpenAdd}
          className="gap-1.5 gradient-bg text-primary-foreground font-bold h-10 px-4 rounded-xl shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Add User / Employee
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, job title or department..."
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
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="hr_admin">HR / Admin</SelectItem>
              <SelectItem value="cxo">Executive / CXO</SelectItem>
              <SelectItem value="it_admin">IT / System Admin</SelectItem>
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UserPlus className="w-8 h-8 text-muted-foreground/40" />
                    <p className="font-bold text-sm text-foreground">
                      {employees.length === 0 ? "No employees in directory" : "No users match your filter criteria"}
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-sm">
                      {employees.length === 0
                        ? 'Get started by creating employees and system user accounts using the "+ Add User / Employee" button above.'
                        : "Try clearing your search query or department filters to see more results."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((emp) => {
                const initials = emp.name
                  ? emp.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "U";

                return (
                  <TableRow key={emp.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-xs text-foreground">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {emp.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px] font-medium bg-secondary/80">
                        {emp.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                        {roleLabels[emp.systemRole || "employee"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          statusStyle[emp.status] || "bg-secondary text-foreground"
                        }`}
                      >
                        {emp.status}
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
                        <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 shadow-lg border-border/60">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(emp)}
                            className="text-xs gap-2 cursor-pointer font-medium py-2"
                          >
                            <Edit className="w-3.5 h-3.5 text-foreground" /> Edit Role & Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setRole(emp.systemRole || "employee");
                              toast.success(
                                `Switched active role to ${roleLabels[emp.systemRole || "employee"]}`
                              );
                            }}
                            className="text-xs gap-2 text-teal-600 dark:text-teal-400 font-semibold cursor-pointer py-2"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Switch UI to This Role
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
    </motion.div>
  );
}

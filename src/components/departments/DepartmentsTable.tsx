import { useDepartmentStore, DepartmentItem } from "@/stores/departmentStore";
import { useAuthStore } from "@/stores/authStore";
import { hasPermission } from "@/lib/permissions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Building2,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Plus,
  FileSpreadsheet,
  ArrowUpDown,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function DepartmentsTable() {
  const { user } = useAuthStore();
  const currentRole = user?.role || "employee";

  const {
    departments,
    searchQuery,
    statusFilter,
    locationFilter,
    hiringFilter,
    setSearchQuery,
    setStatusFilter,
    setLocationFilter,
    setHiringFilter,
    openDrawer,
    openCreateForm,
    openEditForm,
    deleteDepartment,
    openImportModal,
  } = useDepartmentStore();

  const [sortField, setSortField] = useState<keyof DepartmentItem>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Permission checks
  const canCreate = hasPermission(currentRole, "departments", "create");
  const canEdit = hasPermission(currentRole, "departments", "edit");
  const canDelete = hasPermission(currentRole, "departments", "delete");

  // Filtering
  const filtered = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || dept.status === statusFilter;
    const matchesLocation = locationFilter === "all" || dept.location === locationFilter;
    const matchesHiring = hiringFilter === "all" || dept.hiringStatus === hiringFilter;

    return matchesSearch && matchesStatus && matchesLocation && matchesHiring;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField] || "";
    const valB = b[sortField] || "";
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: keyof DepartmentItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">{status}</Badge>;
      case "Hiring":
      case "Growing":
        return <Badge className="bg-primary/10 text-primary border-primary/20">{status}</Badge>;
      case "Inactive":
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border/60 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by department name, code, head..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9 text-xs bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Hiring">Hiring</SelectItem>
              <SelectItem value="Growing">Growing</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={hiringFilter} onValueChange={setHiringFilter}>
            <SelectTrigger className="w-[130px] h-9 text-xs bg-background">
              <SelectValue placeholder="Hiring Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hiring</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={openImportModal}
            className="h-9 gap-1.5 text-xs border-border/60"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Bulk Import</span>
          </Button>

          {canCreate && (
            <Button
              size="sm"
              onClick={openCreateForm}
              className="h-9 gradient-bg text-primary-foreground gap-1.5 text-xs rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Department</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-card rounded-xl border border-border/60 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead onClick={() => toggleSort("name")} className="cursor-pointer font-semibold text-xs">
                <div className="flex items-center gap-1">
                  Department Name <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead onClick={() => toggleSort("code")} className="cursor-pointer font-semibold text-xs">
                Code
              </TableHead>
              <TableHead className="font-semibold text-xs">Department Head</TableHead>
              <TableHead className="font-semibold text-xs">Reporting Manager</TableHead>
              <TableHead className="font-semibold text-xs">Location</TableHead>
              <TableHead className="font-semibold text-xs text-center">Employees</TableHead>
              <TableHead className="font-semibold text-xs text-center">Capacity</TableHead>
              <TableHead className="font-semibold text-xs text-center">Open Reqs</TableHead>
              <TableHead className="font-semibold text-xs">Status</TableHead>
              <TableHead className="font-semibold text-xs">Hiring</TableHead>
              <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length > 0 ? (
              sorted.map((dept) => (
                <TableRow key={dept.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-xs">
                    <button
                      onClick={() => openDrawer(dept)}
                      className="text-left font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {dept.name}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{dept.code}</TableCell>
                  <TableCell className="text-xs">{dept.head || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{dept.manager || "—"}</TableCell>
                  <TableCell className="text-xs">{dept.location || "—"}</TableCell>
                  <TableCell className="text-xs text-center font-medium">
                    {dept.employeeCount !== null ? dept.employeeCount : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-center font-medium">
                    {dept.capacity !== null ? dept.capacity : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-center font-medium text-primary">
                    {dept.openPositions !== null ? dept.openPositions : "—"}
                  </TableCell>
                  <TableCell className="text-xs">{getStatusBadge(dept.status)}</TableCell>
                  <TableCell className="text-xs">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {dept.hiringStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => openDrawer(dept)} className="text-xs gap-2">
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => openEditForm(dept)} className="text-xs gap-2">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem
                            onClick={() => deleteDepartment(dept.id)}
                            className="text-xs gap-2 text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="h-48 text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-6 space-y-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground mb-1">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">No departments found</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Departments will appear here once organizational data is available.
                    </p>
                    {canCreate && (
                      <Button
                        size="sm"
                        onClick={openCreateForm}
                        className="mt-3 gradient-bg text-primary-foreground text-xs gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add First Department
                      </Button>
                    )}
                  </motion.div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

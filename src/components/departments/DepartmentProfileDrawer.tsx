import { useState } from "react";
import { useDepartmentStore } from "@/stores/departmentStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  FileText,
  GitFork,
  MapPin,
  UserCheck,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";
import { normalizeRole } from "@/features/auth/authTypes";
import { normalizeError } from "@/services/api/normalizeError";
import {
  useGetDepartmentByIdQuery,
  useGetDepartmentEmployeesQuery,
  useGetDepartmentStatsQuery,
  useDeleteDepartmentMutation,
} from "@/services/api/departmentApi";
import { toast } from "sonner";

export function DepartmentProfileDrawer() {
  const { user } = useAuth();
  const currentRole = normalizeRole(user?.role || "employee");
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { selectedDepartment: storeDepartment, isDrawerOpen, closeDrawer, openEditForm } = useDepartmentStore();

  const canEdit = hasPermission(currentRole, "departments", "edit") || currentRole === "hr_admin" || currentRole === "super_admin";
  const canDelete = hasPermission(currentRole, "departments", "delete") || currentRole === "hr_admin" || currentRole === "super_admin";
  const deptId = storeDepartment?.id || "";

  const [deleteDepartmentApi, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  // Query fresh department details from API
  const { data: fetchedDepartment } = useGetDepartmentByIdQuery(deptId, {
    skip: !deptId || !isDrawerOpen,
  });

  // Lazy query department employees when workforce tab is active
  const { data: departmentEmployees, isLoading: isLoadingEmployees } = useGetDepartmentEmployeesQuery(deptId, {
    skip: !deptId || !isDrawerOpen || activeTab !== "workforce",
  });

  // Lazy query department stats when activity/overview is active
  const { data: departmentStats } = useGetDepartmentStatsQuery(deptId, {
    skip: !deptId || !isDrawerOpen,
  });

  const department = fetchedDepartment || storeDepartment;

  const handleDelete = async () => {
    const rawId = deptId || department?.id || (department as any)?._id || (department as any)?.department_id || (department as any)?.departmentId || (department as any)?.dept_id;
    if (!rawId) {
      toast.error("Department ID not found. Cannot delete department.");
      return;
    }
    const id = String(rawId);
    try {
      await deleteDepartmentApi(id).unwrap();
      toast.success(`Department "${department?.name || "Department"}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      closeDrawer();
    } catch (err: any) {
      console.error("Delete department error - raw error:", err);
      const norm = normalizeError(err);
      if (norm.status === 409) {
        toast.error(norm.message || "Department cannot be deleted because it has associated employees.");
      } else if (norm.status === 404) {
        toast.error(norm.message || "Department not found. It may have already been deleted.");
        closeDrawer();
      } else if (norm.status === 403) {
        toast.error(norm.message || "Permission denied: You do not have permission to delete departments.");
      } else if (norm.status === 401) {
        toast.error(norm.message || "Unauthorized: Please log in to delete departments.");
      } else {
        toast.error(norm.message || "Failed to delete department. Please try again.");
      }
    }
  };

  if (!department) return null;

  const employeesList = Array.isArray(departmentEmployees) ? departmentEmployees : [];

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="sm:max-w-md w-full border-l border-border/60 p-0 flex flex-col h-full bg-card overflow-hidden">
        {/* Header */}
        <SheetHeader className="p-5 border-b border-border/50 bg-muted/30 flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {department.code ? department.code.slice(0, 3) : "DEP"}
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-foreground">
                {department.name}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs text-muted-foreground">
                  {department.code}
                </span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  {department.status || "Active"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 pr-6">
            {canEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  closeDrawer();
                  openEditForm(department);
                }}
                className="h-8 w-8 p-0"
                title="Edit Department"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Delete Department"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                ) : (
                  <Trash2 className="w-4 h-4 text-destructive" />
                )}
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-4 border-b border-border/40">
            <TabsList className="h-10 bg-transparent gap-2">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="workforce" className="text-xs">Workforce</TabsTrigger>
              <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin space-y-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0 space-y-4">
              <div className="glass-card rounded-xl p-4 border border-border/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Key Parameters
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-primary" /> Department Head
                    </span>
                    <span className="font-semibold text-foreground">{department.head || "Unassigned Lead"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Reporting Manager</span>
                    <span className="font-medium text-foreground">{department.manager || department.head || "Unassigned Manager"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Office Location
                    </span>
                    <span className="font-medium text-foreground">{department.location || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <GitFork className="w-3.5 h-3.5 text-primary" /> Parent Department
                    </span>
                    <span className="font-medium text-foreground">{department.parentDepartment || "None (Root)"}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 border border-border/50 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {department.description || "No department description configured."}
                </p>
              </div>
            </TabsContent>

            {/* Workforce Tab */}
            <TabsContent value="workforce" className="m-0 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card rounded-xl p-4 border border-border/50 text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold text-foreground">
                    {department.capacity !== null && department.capacity !== undefined ? department.capacity : "—"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Total Capacity</div>
                </div>

                <div className="glass-card rounded-xl p-4 border border-border/50 text-center">
                  <Building2 className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold text-primary">
                    {department.openPositions !== null && department.openPositions !== undefined ? department.openPositions : "—"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Open Positions</div>
                </div>
              </div>

              {isLoadingEmployees ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : employeesList.length > 0 ? (
                <div className="glass-card rounded-xl p-4 border border-border/50 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Department Members ({employeesList.length})
                  </h4>
                  <div className="divide-y divide-border/30">
                    {employeesList.map((emp) => (
                      <div key={emp.id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-medium text-foreground">{emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`}</p>
                          <p className="text-[11px] text-muted-foreground">{emp.role || emp.email}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {emp.status || "Active"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-xl p-6 border border-border/50 text-center space-y-2">
                  <Users className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                  <h5 className="text-xs font-semibold text-foreground">No employees assigned</h5>
                  <p className="text-[11px] text-muted-foreground">
                    Employee roster will display here once team members are assigned to this department.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="m-0 space-y-4">
              <div className="glass-card rounded-xl p-4 border border-border/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Financial Allocation
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-primary" /> Annual Budget
                    </span>
                    <span className="font-semibold text-foreground">{department.budget || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Cost Center Code</span>
                    <span className="font-mono font-medium text-foreground">{department.costCenter || "—"}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="m-0 space-y-4">
              {departmentStats ? (
                <div className="glass-card rounded-xl p-4 border border-border/50 space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-muted-foreground">Telemetry Stats</h4>
                  {Object.entries(departmentStats).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-border/30">
                      <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium text-foreground">{String(v)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl p-8 border border-border/50 text-center space-y-2">
                  <Activity className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                  <h5 className="text-xs font-semibold text-foreground">No recent activity</h5>
                  <p className="text-[11px] text-muted-foreground">
                    Audit trails and operational changes for this unit will be logged here.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="m-0 space-y-4">
              <div className="glass-card rounded-xl p-8 border border-border/50 text-center space-y-2">
                <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                <h5 className="text-xs font-semibold text-foreground">No documents attached</h5>
                <p className="text-[11px] text-muted-foreground">
                  Department policies, charters, and organizational documents will appear here.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            if (!isDeleting) {
              setIsDeleteDialogOpen(open);
            }
          }}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Delete Department?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground space-y-2" asChild>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Are you sure you want to delete &ldquo;{department.name}&rdquo;?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This action cannot be undone.
                  </p>
                  {(department.employeeCount && department.employeeCount > 0) || employeesList.length > 0 ? (
                    <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                      <p className="font-semibold mb-1">Active Employees Warning</p>
                      <p>
                        This department currently has <strong>{department.employeeCount || employeesList.length} active employee(s)</strong> assigned. The server guard will reject deletion while employees remain assigned. Please reassign them first.
                      </p>
                    </div>
                  ) : null}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting} className="text-xs">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-semibold"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}
import { useDepartmentStore } from "@/stores/departmentStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";

export function DepartmentProfileDrawer() {
  const { user } = useAuth();
  const currentRole = user?.role || "employee";

  const { selectedDepartment, isDrawerOpen, closeDrawer, openEditForm } = useDepartmentStore();

  const canEdit = hasPermission(currentRole, "departments", "edit");

  if (!selectedDepartment) return null;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="sm:max-w-md w-full border-l border-border/60 p-0 flex flex-col h-full bg-card overflow-hidden">
        {/* Header */}
        <SheetHeader className="p-5 border-b border-border/50 bg-muted/30 flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {selectedDepartment.code.slice(0, 3)}
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-foreground">
                {selectedDepartment.name}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs text-muted-foreground">
                  {selectedDepartment.code}
                </span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  {selectedDepartment.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {canEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  closeDrawer();
                  openEditForm(selectedDepartment);
                }}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={closeDrawer} className="h-8 w-8 p-0">
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
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
                    <span className="font-semibold text-foreground">{selectedDepartment.head || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Reporting Manager</span>
                    <span className="font-medium text-foreground">{selectedDepartment.manager || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Office Location
                    </span>
                    <span className="font-medium text-foreground">{selectedDepartment.location || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <GitFork className="w-3.5 h-3.5 text-primary" /> Parent Department
                    </span>
                    <span className="font-medium text-foreground">{selectedDepartment.parentDepartment || "None (Root)"}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 border border-border/50 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedDepartment.description || "No department description configured."}
                </p>
              </div>
            </TabsContent>

            {/* Workforce Tab */}
            <TabsContent value="workforce" className="m-0 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card rounded-xl p-4 border border-border/50 text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold text-foreground">
                    {selectedDepartment.capacity !== null ? selectedDepartment.capacity : "—"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Total Capacity</div>
                </div>

                <div className="glass-card rounded-xl p-4 border border-border/50 text-center">
                  <Building2 className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold text-primary">
                    {selectedDepartment.openPositions !== null ? selectedDepartment.openPositions : "—"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Open Positions</div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 border border-border/50 text-center space-y-2">
                <Users className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                <h5 className="text-xs font-semibold text-foreground">No employees assigned</h5>
                <p className="text-[11px] text-muted-foreground">
                  Employee roster will display here once team members are assigned to this department.
                </p>
              </div>
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
                    <span className="font-semibold text-foreground">{selectedDepartment.budget || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Cost Center Code</span>
                    <span className="font-mono font-medium text-foreground">{selectedDepartment.costCenter || "—"}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="m-0 space-y-4">
              <div className="glass-card rounded-xl p-8 border border-border/50 text-center space-y-2">
                <Activity className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                <h5 className="text-xs font-semibold text-foreground">No recent activity</h5>
                <p className="text-[11px] text-muted-foreground">
                  Audit trails and operational changes for this unit will be logged here.
                </p>
              </div>
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
      </SheetContent>
    </Sheet>
  );
}

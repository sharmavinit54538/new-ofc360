import { useState } from "react";
import { DepartmentStatsCards } from "@/components/departments/DepartmentStatsCards";
import { DepartmentsTable } from "@/components/departments/DepartmentsTable";
import { DepartmentHierarchy } from "@/components/departments/DepartmentHierarchy";
import { DepartmentAnalytics } from "@/components/departments/DepartmentAnalytics";
import { DepartmentFormDialog } from "@/components/departments/DepartmentFormDialog";
import { DepartmentProfileDrawer } from "@/components/departments/DepartmentProfileDrawer";
import { ImportDialog } from "@/components/departments/ImportDialog";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, List, GitFork, BarChart3 } from "lucide-react";

export default function DepartmentsPage() {
  const [activeView, setActiveView] = useState("table");

  return (
    <RoleGuard module="departments">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/50">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>Organizational Structure</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Departments Module
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Manage organizational units, reporting lines, capacity planning, cost centers, and departmental telemetry.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <DepartmentStatsCards />

        {/* Navigation Tabs for Views */}
        <Tabs defaultValue="table" value={activeView} onValueChange={setActiveView} className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <TabsList className="bg-card/70 border border-border/60 p-1 rounded-xl">
              <TabsTrigger value="table" className="text-xs gap-1.5 font-medium">
                <List className="w-3.5 h-3.5" /> Department Roster
              </TabsTrigger>
              <TabsTrigger value="hierarchy" className="text-xs gap-1.5 font-medium">
                <GitFork className="w-3.5 h-3.5" /> Org Hierarchy
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs gap-1.5 font-medium">
                <BarChart3 className="w-3.5 h-3.5" /> Department Telemetry
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="table" className="m-0">
            <DepartmentsTable />
          </TabsContent>

          <TabsContent value="hierarchy" className="m-0">
            <div className="glass-card rounded-xl p-6 border border-border/60">
              <DepartmentHierarchy />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            <DepartmentAnalytics />
          </TabsContent>
        </Tabs>

        {/* Dialogs and Drawers */}
        <DepartmentFormDialog />
        <DepartmentProfileDrawer />
        <ImportDialog />
      </div>
    </RoleGuard>
  );
}

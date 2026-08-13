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

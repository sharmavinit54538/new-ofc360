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
import { Button } from "@/components/ui/button";
import { Building2, List, GitFork, BarChart3, Sparkles } from "lucide-react";

interface DepartmentsPageProps {
  onOpenCopilot?: () => void;
}

export default function DepartmentsPage({ onOpenCopilot }: DepartmentsPageProps) {
  const [activeView, setActiveView] = useState("table");

  return (
    <RoleGuard module="departments">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>Department Intelligence & Structure</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Organizational hierarchy mapping, department telemetry, capacity diagnostics, and cost-center allocation.
            </p>
          </div>

          {onOpenCopilot && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenCopilot}
                className="text-xs h-9 px-3 font-semibold border-primary/30 text-primary hover:bg-primary/10 gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Department AI Insights</span>
              </Button>
            </div>
          )}
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
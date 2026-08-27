import { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Briefcase,
  Crown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeesPage from "@/pages/EmployeesPage";
import DepartmentsPage from "@/pages/departments/DepartmentsPage";
import ManagersManagementPage from "@/pages/people/ManagersManagementPage";
import ExecutivesManagementPage from "@/pages/people/ExecutivesManagementPage";
import ITAdminsManagementPage from "@/pages/people/ITAdminsManagementPage";
import { PeopleAICopilotDrawer } from "@/components/people-ai/PeopleAICopilotDrawer";
import { PeopleWorkflowApprovalsModal } from "@/components/people-ai/PeopleWorkflowApprovalsModal";
import { PeopleDataHealthModal } from "@/components/people-ai/PeopleDataHealthModal";

type TabType = "employees" | "departments" | "manager" | "executive" | "it_admin";

export default function PeoplePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isDataHealthOpen, setIsDataHealthOpen] = useState(false);

  const paramTab = searchParams.get("tab") as TabType | null;
  const currentTab: TabType =
    paramTab && ["employees", "departments", "manager", "executive", "it_admin"].includes(paramTab)
      ? paramTab
      : location.pathname === "/departments"
      ? "departments"
      : "employees";

  const handleTabChange = (tab: TabType) => {
    setSearchParams({ tab });
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "employees", label: "Employees", icon: Users },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "manager", label: "Manager", icon: Briefcase },
    { id: "executive", label: "Executive / CXO", icon: Crown },
    { id: "it_admin", label: "IT / System Admin", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Tab Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="flex items-center bg-secondary/60 p-1 rounded-xl border border-border/50 overflow-x-auto scrollbar-none max-w-full">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-card text-primary shadow-sm font-bold border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCopilotOpen(true)}
            className="text-xs h-9 px-3.5 font-bold border-primary/40 text-primary bg-primary/5 hover:bg-primary/15 gap-1.5 shadow-2xs cursor-pointer rounded-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>People AI</span>
          </Button>
        </div>
      </div>

      {/* Section Content */}
      <motion.div
        key={currentTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {currentTab === "employees" && <EmployeesPage onOpenCopilot={() => setIsCopilotOpen(true)} />}
        {currentTab === "departments" && <DepartmentsPage onOpenCopilot={() => setIsCopilotOpen(true)} />}
        {currentTab === "manager" && <ManagersManagementPage onOpenCopilot={() => setIsCopilotOpen(true)} />}
        {currentTab === "executive" && <ExecutivesManagementPage onOpenCopilot={() => setIsCopilotOpen(true)} />}
        {currentTab === "it_admin" && (
          <ITAdminsManagementPage
            onOpenCopilot={() => setIsCopilotOpen(true)}
            onOpenDataHealth={() => setIsDataHealthOpen(true)}
          />
        )}
      </motion.div>

      {/* AI Modals & Copilot Drawer */}
      <PeopleAICopilotDrawer
        open={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      <PeopleWorkflowApprovalsModal
        open={isApprovalsOpen}
        onOpenChange={setIsApprovalsOpen}
      />

      <PeopleDataHealthModal
        open={isDataHealthOpen}
        onOpenChange={setIsDataHealthOpen}
      />
    </div>
  );
}
import { useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Briefcase,
  Crown,
  ShieldCheck,
} from "lucide-react";
import EmployeesPage from "@/pages/EmployeesPage";
import DepartmentsPage from "@/pages/departments/DepartmentsPage";
import ManagersManagementPage from "@/pages/people/ManagersManagementPage";
import ExecutivesManagementPage from "@/pages/people/ExecutivesManagementPage";
import ITAdminsManagementPage from "@/pages/people/ITAdminsManagementPage";

type TabType = "employees" | "departments" | "manager" | "executive" | "it_admin";

export default function PeoplePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Tab Navigation (Clean Top Bar) */}
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
      </div>

      {/* Tab Contents */}
      <motion.div
        key={currentTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {currentTab === "employees" && <EmployeesPage />}
        {currentTab === "departments" && <DepartmentsPage />}
        {currentTab === "manager" && <ManagersManagementPage />}
        {currentTab === "executive" && <ExecutivesManagementPage />}
        {currentTab === "it_admin" && <ITAdminsManagementPage />}
      </motion.div>
    </div>
  );
}

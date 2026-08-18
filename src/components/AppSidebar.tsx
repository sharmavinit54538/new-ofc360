import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, UserSearch, Clock, DollarSign,
  ChevronLeft, Briefcase, UserPlus, GraduationCap,
  FileText, Monitor, UserMinus, Building2, ShieldCheck,
  Heart, BarChart3, PieChart, TrendingUp, Lightbulb, Target, PanelLeft,
  Boxes, Settings, Globe, Award, Key, Zap, FileCode2, Server, Cpu, Lock,
  Activity, ShieldAlert, MessageSquare, Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SystemRole } from "@/features/auth/authTypes";
import { usePayrollStore } from "@/stores/payrollStore";
import { getCurrencyIcon } from "@/utils/currency";

export function AppSidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const location = useLocation();
  const { user } = useAuth();
  const currentRole: SystemRole = user?.role || "hr_admin";
  const payrollSettings = usePayrollStore((state) => state.settings);
  const PayrollIcon = getCurrencyIcon(payrollSettings?.currency);

  // Build role-aware navigation
  const getNavSections = () => {
    switch (currentRole) {
      case "super_admin":
        return [
          {
            sectionTitle: "Super Admin",
            items: [
              { label: "Dashboard", icon: LayoutDashboard, path: "/super-admin" },
              { label: "Platform", icon: Building2, path: "/super-admin/platform" },
              { label: "Connect", icon: MessageSquare, path: "/connect" },
              { label: "Analytics", icon: BarChart3, path: "/super-admin/analytics" },
              { label: "System", icon: Server, path: "/super-admin/system" },
              { label: "Security", icon: Lock, path: "/super-admin/security" },
            ],
          },
        ];

      case "employee":
        return [
          {
            sectionTitle: "Employee",
            items: [
              { label: "Connect", icon: MessageSquare, path: "/connect" },
              { label: "My Leave", icon: Clock, path: "/employee/leave" },
              { label: "My Payslips", icon: PayrollIcon, path: "/employee/payslips" },
              { label: "My Documents", icon: FileText, path: "/employee/documents" },
              { label: "Onboarding", icon: UserPlus, path: "/employee/onboarding" },
              { label: "Helpdesk", icon: GraduationCap, path: "/employee/helpdesk" },
            ],
          },
        ];

      case "manager":
        return [
          {
            sectionTitle: "Manager",
            items: [
              { label: "Home", icon: LayoutDashboard, path: "/manager" },
              { label: "Connect", icon: MessageSquare, path: "/connect" },
              { label: "My Team", icon: Users, path: "/manager/team" },
              { label: "Approvals", icon: ShieldCheck, path: "/manager/approvals" },
              { label: "Goals", icon: Target, path: "/manager/goals" },
              { label: "Engagement", icon: Heart, path: "/manager/engagement" },
              { label: "Helpdesk", icon: GraduationCap, path: "/manager/helpdesk" },
            ],
          },
        ];

      case "executive":
        return [
          {
            sectionTitle: "Executive",
            items: [
              { label: "Home", icon: LayoutDashboard, path: "/executive" },
              { label: "Connect", icon: MessageSquare, path: "/connect" },
              { label: "Organization", icon: Building2, path: "/executive/organization" },
              { label: "KPIs", icon: Target, path: "/executive/kpis" },
              { label: "Outcomes", icon: Award, path: "/executive/outcomes" },
              { label: "Workforce", icon: Users, path: "/executive/workforce" },
              { label: "Insights", icon: Sparkles, path: "/executive/insights" },
              { label: "Reports", icon: BarChart3, path: "/executive/reports" },
            ],
          },
        ];

      case "it_admin":
        return [
          {
            sectionTitle: "IT Admin",
            items: [
              { label: "Home", icon: LayoutDashboard, path: "/it-admin" },
              { label: "Connect", icon: MessageSquare, path: "/connect" },
              { label: "SSO", icon: Key, path: "/it-admin/sso" },
              { label: "Access", icon: ShieldCheck, path: "/it-admin/access" },
              { label: "Security", icon: Lock, path: "/it-admin/security" },
              { label: "Integrations", icon: Zap, path: "/it-admin/integrations" },
              { label: "Audit Logs", icon: FileCode2, path: "/it-admin/audit-logs" },
              { label: "System Health", icon: Server, path: "/it-admin/system-health" },
              { label: "Deployments", icon: Cpu, path: "/it-admin/deployments" },
            ],
          },
        ];

      case "hr_admin":
      default:
        return [
          {
            sectionTitle: "Core HR",
            items: [
              { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
              { label: "Connect", icon: MessageSquare, path: "/connect" },
              { label: "People", icon: Users, path: "/people" },
              { label: "Attend", icon: Clock, path: "/attendance" },
              { label: "Payroll", icon: PayrollIcon, path: "/payroll" },
              { label: "Reports", icon: BarChart3, path: "/reports" },
              { label: "Talent", icon: Target, path: "/talent-intelligence" },
              { label: "Resources", icon: Boxes, path: "/resource-intelligence" },
              { label: "Experience", icon: Globe, path: "/employee-experience" },
              { label: "Settings", icon: Settings, path: "/settings" },
            ],
          },
        ];
    }
  };

  const navSections = getNavSections();

  return (
    <motion.aside
      animate={{ width: open ? 270 : 68 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="h-screen flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden shrink-0 select-none"
    >
      {/* Logo & Top Toggle */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-sidebar-border">
        {open ? (
          <>
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="OFC360 Logo"
                className="w-8 h-8 rounded-lg object-contain bg-white shadow-xs shrink-0"
              />
              <span className="font-bold text-lg gradient-text whitespace-nowrap tracking-tight">
                OFC360
              </span>
            </div>
            <button
              onClick={onToggle}
              title="Collapse Sidebar"
              className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary transition-colors shrink-0"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              onClick={onToggle}
              title="Expand Sidebar"
              className="p-0.5 rounded-lg hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer"
            >
              <img
                src="/logo.png"
                alt="OFC360 Logo"
                className="w-8 h-8 rounded-lg object-contain bg-white shadow-xs"
              />
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2.5 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navSections.map((sec, idx) => (
          <div key={sec.sectionTitle || idx} className="space-y-0.5">
            <SectionLabel open={open}>{sec.sectionTitle}</SectionLabel>
            {sec.items.map((item) => (
              <SidebarLink
                key={item.path}
                item={item}
                open={open}
                active={
                  location.pathname === item.path ||
                  (item.path === "/connect" && location.pathname.startsWith("/connect")) ||
                  (item.path !== "/super-admin" && item.path.startsWith("/super-admin") && location.pathname.startsWith(item.path)) ||
                  (item.path === "/people" && (location.pathname.startsWith("/people") || location.pathname.startsWith("/employees") || location.pathname.startsWith("/departments"))) ||
                  (item.path === "/talent-intelligence" && location.pathname.startsWith("/talent-intelligence")) ||
                  (item.path === "/resource-intelligence" && location.pathname.startsWith("/resource-intelligence")) ||
                  (item.path === "/employee-experience" && location.pathname.startsWith("/employee-experience"))
                }
              />
            ))}
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}

function SectionLabel({ open, children }: { open: boolean; children: React.ReactNode }) {
  return null;
}

function SidebarLink({
  item,
  open,
  active,
}: {
  item: { label: string; icon: any; path: string };
  open: boolean;
  active: boolean;
}) {
  return (
    <NavLink
      to={item.path}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
        active
          ? "bg-primary/12 text-foreground font-semibold border border-primary/20 shadow-xs"
          : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
      }`}
    >
      <item.icon
        className={`w-4 h-4 shrink-0 transition-colors ${
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        }`}
      />
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="whitespace-nowrap text-[13px]"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
}

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Clock,
  FileText, Building2, ShieldCheck,
  Heart, Target,
  Boxes, Settings, Globe, Award, Key, Zap, FileCode2, Server, Cpu, Lock,
  MessageSquare, Sparkles, UserPlus, GraduationCap,
  ChartNoAxesCombined, IndianRupee, PanelLeft, PanelRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SystemRole, normalizeRole } from "@/features/auth/authTypes";
import { usePayrollStore } from "@/stores/payrollStore";
import { getCurrencyIcon } from "@/utils/currency";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppSidebarProps {
  open?: boolean;
  onToggle?: () => void;
  isMobileDrawer?: boolean;
}

export function AppSidebar({ open = true, onToggle, isMobileDrawer = false }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const currentRole: SystemRole = role || normalizeRole(user?.role);
  const payrollSettings = usePayrollStore((state) => state.settings);
  const PayrollIcon = payrollSettings?.currency === "INR" ? IndianRupee : getCurrencyIcon(payrollSettings?.currency);

  const isExpanded = isMobileDrawer ? true : open;

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
              { label: "Analytics", icon: ChartNoAxesCombined, path: "/super-admin/analytics" },
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
              { label: "My Payslips", icon: PayrollIcon || IndianRupee, path: "/employee/payslips" },
              { label: "My Documents", icon: FileText, path: "/employee/documents" },
              { label: "Onboarding", icon: UserPlus, path: "/employee/onboarding" },
              { label: "Helpdesk", icon: GraduationCap, path: "/employee/helpdesk" },
              { label: "Settings", icon: Settings, path: "/settings" },
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
              { label: "Settings", icon: Settings, path: "/settings" },
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
              { label: "Reports", icon: ChartNoAxesCombined, path: "/executive/reports" },
              { label: "Settings", icon: Settings, path: "/settings" },
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
              { label: "Settings", icon: Settings, path: "/settings" },
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
              { label: "Payroll", icon: PayrollIcon || IndianRupee, path: "/payroll" },
              { label: "Reports", icon: ChartNoAxesCombined, path: "/reports" },
              { label: "AI", icon: Sparkles, path: "/intelligence" },
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
    <TooltipProvider delayDuration={100}>
      <motion.aside
        animate={{ width: isExpanded ? 260 : 68 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="h-screen flex flex-col bg-card text-card-foreground border-r border-border/60 shadow-xs overflow-hidden shrink-0 select-none relative z-30"
      >
        {/* Top Header: Logo + Toggle */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-border/40 shrink-0">
          {isExpanded ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2.5 group focus:outline-none cursor-pointer text-left"
                title="OFC360 Dashboard"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-xs">
                  <img
                    src="/logo.png"
                    alt="OFC360 Logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-lg text-primary tracking-tight whitespace-nowrap">
                  OFC360
                </span>
              </button>

              {onToggle && (
                <button
                  onClick={onToggle}
                  title="Collapse Sidebar"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <button
                onClick={onToggle}
                title="Expand Sidebar"
                className="p-1.5 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <PanelRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Center Navigation List */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {navSections.map((sec) =>
            sec.items.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/dashboard" && location.pathname === "/") ||
                (item.path === "/connect" && location.pathname.startsWith("/connect")) ||
                (item.path === "/people" && (location.pathname.startsWith("/people") || location.pathname.startsWith("/employees") || location.pathname.startsWith("/departments"))) ||
                (item.path === "/attendance" && location.pathname.startsWith("/attendance")) ||
                (item.path === "/payroll" && location.pathname.startsWith("/payroll")) ||
                (item.path === "/reports" && location.pathname.startsWith("/reports")) ||
                (item.path === "/intelligence" && (location.pathname.startsWith("/intelligence") || location.pathname.startsWith("/ai"))) ||
                (item.path === "/talent-intelligence" && location.pathname.startsWith("/talent-intelligence")) ||
                (item.path === "/resource-intelligence" && location.pathname.startsWith("/resource-intelligence")) ||
                (item.path === "/employee-experience" && location.pathname.startsWith("/employee-experience")) ||
                (item.path === "/settings" && location.pathname.startsWith("/settings")) ||
                (item.path !== "/super-admin" && item.path.startsWith("/super-admin") && location.pathname.startsWith(item.path)) ||
                (item.path !== "/manager" && item.path.startsWith("/manager") && location.pathname.startsWith(item.path)) ||
                (item.path !== "/it-admin" && item.path.startsWith("/it-admin") && location.pathname.startsWith(item.path));

              return (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isExpanded={isExpanded}
                  active={isActive}
                />
              );
            })
          )}
        </nav>
      </motion.aside>
    </TooltipProvider>
  );
}

function SidebarItem({
  item,
  isExpanded,
  active,
}: {
  item: { label: string; icon: React.ElementType; path: string };
  isExpanded: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  const content = (
    <NavLink
      to={item.path}
      className={`flex items-center gap-3 rounded-xl transition-all duration-150 group cursor-pointer ${
        isExpanded ? "w-full px-3.5 py-2.5" : "w-10 h-10 justify-center mx-auto"
      } ${
        active
          ? "bg-primary/10 text-primary border border-primary/25 font-semibold shadow-xs"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground border border-transparent font-medium"
      }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 transition-colors ${
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        }`}
      />
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap text-sm tracking-tight truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={14}
          className="bg-popover text-popover-foreground border border-border/60 shadow-xl text-xs font-semibold py-1.5 px-3 rounded-lg z-50 animate-in fade-in-0 zoom-in-95"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
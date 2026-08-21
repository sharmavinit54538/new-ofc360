import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Clock,
  FileText, Building2, ShieldCheck,
  Heart, BarChart3, Target, PanelLeft,
  Boxes, Settings, Globe, Award, Key, Zap, FileCode2, Server, Cpu, Lock,
  MessageSquare, Sparkles, BrainCircuit, ChevronRight, UserPlus, GraduationCap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SystemRole, normalizeRole, roleLabels } from "@/features/auth/authTypes";
import { usePayrollStore } from "@/stores/payrollStore";
import { getCurrencyIcon } from "@/utils/currency";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const currentRole: SystemRole = role || normalizeRole(user?.role);
  const payrollSettings = usePayrollStore((state) => state.settings);
  const PayrollIcon = getCurrencyIcon(payrollSettings?.currency);

  const userName =
    user?.name ||
    user?.full_name ||
    (user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "") ||
    "User";

  const initials = userName
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

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
              { label: "Reports", icon: BarChart3, path: "/executive/reports" },
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
              { label: "Payroll", icon: PayrollIcon, path: "/payroll" },
              { label: "Reports", icon: BarChart3, path: "/reports" },
              { label: "AI", icon: BrainCircuit, path: "/intelligence" },
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
        animate={{ width: open ? 240 : 76 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="h-screen flex flex-col bg-[#0b0d14] text-white border-r border-white/10 shadow-2xl overflow-hidden shrink-0 select-none relative z-30"
      >
        {/* Top Header: 4-Point Radiant Star + Upgrade Badge */}
        <div className="flex flex-col items-center pt-5 pb-3 px-2 gap-3 shrink-0">
          {/* Radiant Star Brand Icon */}
          <div className="w-full flex items-center justify-between px-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer mx-auto"
              title="OFC360 Home"
            >
              {/* 4-Point Radiant Star SVG */}
              <div className="relative flex items-center justify-center">
                <svg
                  viewBox="0 0 32 32"
                  className="w-8 h-8 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                >
                  <path d="M16 0C16 8.83656 8.83656 16 0 16C8.83656 16 16 23.1634 16 32C16 23.1634 23.1634 16 32 16C23.1634 16 16 8.83656 16 0Z" />
                </svg>
              </div>

              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-amber-200 whitespace-nowrap"
                >
                  OFC360
                </motion.span>
              )}
            </button>

            {open && (
              <button
                onClick={onToggle}
                title="Collapse Sidebar"
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upgrade Badge Pill (Gold/Amber style from reference image) */}
          <button
            onClick={() => navigate("/settings")}
            className={`flex items-center justify-center gap-1 py-1 px-3 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/25 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all duration-300 cursor-pointer ${
              open ? "w-auto self-center" : "w-11 px-0"
            }`}
            title="Upgrade to Pro"
          >
            {open ? (
              <>
                <span className="tracking-wide">Upgrade</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </>
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Center Vertical Nav Items */}
        <nav className="flex-1 py-3 px-2 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col items-center">
          {navSections.map((sec) =>
            sec.items.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                open={open}
                active={
                  location.pathname === item.path ||
                  (item.path === "/connect" && location.pathname.startsWith("/connect")) ||
                  (item.path !== "/super-admin" && item.path.startsWith("/super-admin") && location.pathname.startsWith(item.path)) ||
                  (item.path === "/people" && (location.pathname.startsWith("/people") || location.pathname.startsWith("/employees") || location.pathname.startsWith("/departments"))) ||
                  (item.path === "/intelligence" && (location.pathname.startsWith("/intelligence") || location.pathname.startsWith("/ai"))) ||
                  (item.path === "/talent-intelligence" && location.pathname.startsWith("/talent-intelligence")) ||
                  (item.path === "/resource-intelligence" && location.pathname.startsWith("/resource-intelligence")) ||
                  (item.path === "/employee-experience" && location.pathname.startsWith("/employee-experience"))
                }
              />
            ))
          )}
        </nav>

        {/* Bottom Profile Avatar (Glowing Blue-Purple Smiley Gradient Avatar) */}
        <div className="p-3 border-t border-white/10 flex items-center justify-center shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/settings")}
                className="group relative flex items-center justify-center rounded-full p-0.5 focus:outline-none transition-transform hover:scale-105 cursor-pointer"
              >
                {/* Glowing Aura */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 blur-sm opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Avatar Circle with gradient & cute face / initials */}
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center border-2 border-white/40 shadow-inner overflow-hidden">
                  <div className="flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-bold font-mono tracking-tighter">
                      {initials}
                    </span>
                  </div>
                </div>

                {open && (
                  <div className="ml-3 text-left hidden md:block max-w-[130px]">
                    <p className="text-xs font-semibold text-white truncate">{userName}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{roleLabels[currentRole]}</p>
                  </div>
                )}
              </button>
            </TooltipTrigger>
            {!open && (
              <TooltipContent side="right" sideOffset={14} className="bg-[#161822] text-white border border-white/20 shadow-xl text-xs py-1.5 px-2.5 rounded-lg">
                <p className="font-semibold">{userName}</p>
                <p className="text-[11px] text-zinc-400">{roleLabels[currentRole]}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

function SidebarItem({
  item,
  open,
  active,
}: {
  item: { label: string; icon: any; path: string };
  open: boolean;
  active: boolean;
}) {
  const content = (
    <NavLink
      to={item.path}
      className={`relative flex items-center rounded-xl transition-all duration-200 group ${
        open
          ? "w-full gap-3 px-3 py-2.5"
          : "w-11 h-11 justify-center"
      } ${
        active
          ? "text-white bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.12)] border border-white/20 font-semibold"
          : "text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent"
      }`}
    >
      {/* Active Left Pill Indicator */}
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
        />
      )}

      {/* Icon */}
      <item.icon
        className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
          active
            ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            : "text-zinc-400 group-hover:text-white"
        }`}
      />

      {/* Expanded Label */}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="whitespace-nowrap text-sm tracking-tight truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  if (!open) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={14}
          className="bg-[#181a24] text-white border border-white/20 shadow-2xl text-xs font-medium py-1.5 px-3 rounded-lg z-50 animate-in fade-in-0 zoom-in-95"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
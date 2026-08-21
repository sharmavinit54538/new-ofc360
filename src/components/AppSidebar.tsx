import { useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Clock,
  FileText, Building2, ShieldCheck,
  Heart, Target,
  Boxes, Settings, Globe, Award, Key, Zap, FileCode2, Server, Cpu, Lock,
  MessageSquare, Sparkles, UserPlus, GraduationCap,
  ChartNoAxesCombined, IndianRupee, Pin, PinOff, ChevronRight
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

interface AppSidebarProps {
  open?: boolean;
  onToggle?: () => void;
  isMobileDrawer?: boolean;
}

export function AppSidebar({ open: externalOpen, onToggle, isMobileDrawer = false }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const currentRole: SystemRole = role || normalizeRole(user?.role);
  const payrollSettings = usePayrollStore((state) => state.settings);
  const PayrollIcon = payrollSettings?.currency === "INR" ? IndianRupee : getCurrencyIcon(payrollSettings?.currency);

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // If in mobile drawer, always expanded. On desktop, expanded if pinned or hovered.
  const isExpanded = isMobileDrawer ? true : (isPinned || isHovered);

  const handleMouseEnter = () => {
    if (isMobileDrawer || isPinned) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobileDrawer || isPinned) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  const handleTogglePin = () => {
    setIsPinned((prev) => !prev);
    if (onToggle) onToggle();
  };

  const handleOpenAIAssistant = () => {
    window.dispatchEvent(new CustomEvent("ofc360-toggle-ai"));
  };

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
    <TooltipProvider delayDuration={50}>
      <motion.aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ width: isExpanded ? 240 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="h-screen flex flex-col bg-[#0B0D10] text-white border-r border-white/[0.08] shadow-2xl overflow-hidden shrink-0 select-none relative z-30"
      >
        {/* Top Header: Logo Mark & Upgrade */}
        <div className="flex flex-col items-center pt-4 pb-2 px-2.5 gap-2.5 shrink-0">
          {/* Logo & Expand/Pin Controls */}
          <div className="w-full flex items-center justify-between min-h-[38px] px-1">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer mx-auto"
              title="OFC360 Home"
            >
              {/* 4-Point Radiant Star SVG */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 32 32"
                  className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                >
                  <path d="M16 0C16 8.83656 8.83656 16 0 16C8.83656 16 16 23.1634 16 32C16 23.1634 23.1634 16 32 16C23.1634 16 16 8.83656 16 0Z" />
                </svg>
              </div>

              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-amber-200 whitespace-nowrap"
                >
                  OFC360
                </motion.span>
              )}
            </button>

            {/* Pin / Lock Expand Button (Only on desktop expanded) */}
            {isExpanded && !isMobileDrawer && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleTogglePin}
                title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isPinned
                    ? "text-primary bg-primary/20 hover:bg-primary/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
              </motion.button>
            )}
          </div>

          {/* Upgrade Button */}
          {isExpanded ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => navigate("/settings/billing")}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-amber-600/10 text-amber-300 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/25 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all duration-200 cursor-pointer group text-xs font-semibold"
              title="Upgrade to Pro"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="tracking-wide">Upgrade</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/settings/billing")}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/25 hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all duration-200 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={14} className="bg-[#161822] text-white border border-white/20 shadow-xl text-xs py-1.5 px-2.5 rounded-lg z-50">
                ✦ Upgrade to Pro
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Center Vertical Nav Items Rail */}
        <nav className="flex-1 py-2 px-2.5 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col items-center">
          {navSections.map((sec) =>
            sec.items.map((item) => {
              const isActive =
                location.pathname === item.path ||
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

        {/* Bottom AI Button (~16px padding above profile) */}
        <div className="px-2.5 pt-2 pb-2 flex flex-col items-center shrink-0 border-t border-white/[0.06]">
          {isExpanded ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleOpenAIAssistant}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-purple-500/30 hover:border-purple-400/50 flex items-center justify-between px-3 text-white transition-all cursor-pointer group shadow-[0_0_16px_rgba(168,85,247,0.25)]"
              title="OFC360 AI Assistant"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold tracking-tight text-white truncate">
                  ✦ OFC360 AI
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)] shrink-0" />
            </motion.button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleOpenAIAssistant}
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white shadow-[0_0_16px_rgba(147,51,234,0.45)] border border-white/30 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer relative group"
                  aria-label="OFC360 AI Assistant"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 opacity-40 animate-ping pointer-events-none" />
                  <Sparkles className="w-5 h-5 text-white relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={14} className="bg-[#161822] text-white border border-white/20 shadow-xl text-xs py-1.5 px-2.5 rounded-lg z-50">
                ✦ OFC360 AI Assistant
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Bottom Profile Avatar */}
        <div className="p-2.5 border-t border-white/[0.08] flex items-center justify-center shrink-0 bg-[#08090C]">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/settings")}
                className="group relative flex items-center justify-center rounded-full p-0.5 focus:outline-none transition-transform hover:scale-105 cursor-pointer w-full"
              >
                <div className="relative flex items-center gap-2.5 min-w-0">
                  {/* Glowing Aura & Avatar Circle */}
                  <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center border-2 border-white/30 shadow-inner overflow-hidden shrink-0">
                    <span className="text-xs font-bold font-mono text-white tracking-tighter">
                      {initials}
                    </span>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-left min-w-0 max-w-[130px]"
                    >
                      <p className="text-xs font-semibold text-white truncate">{userName}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{roleLabels[currentRole]}</p>
                    </motion.div>
                  )}
                </div>
              </button>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right" sideOffset={14} className="bg-[#161822] text-white border border-white/20 shadow-xl text-xs py-1.5 px-2.5 rounded-lg z-50">
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
      className={`relative flex items-center rounded-xl transition-all duration-150 group cursor-pointer ${
        isExpanded
          ? "w-full gap-3 px-3 py-2.5 h-11"
          : "w-11 h-11 justify-center mx-auto"
      } ${
        active
          ? "text-white bg-white/[0.12] shadow-[0_0_16px_rgba(59,130,246,0.3)] border border-white/20 font-semibold"
          : "text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:scale-[1.02]"
      }`}
    >
      {/* Active Left Pill Indicator */}
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]"
        />
      )}

      {/* 21-22px Navigation Icon */}
      <Icon
        className={`w-[21px] h-[21px] shrink-0 transition-all duration-150 group-hover:scale-105 ${
          active
            ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            : "text-zinc-400 group-hover:text-white"
        }`}
      />

      {/* Expanded Navigation Label */}
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap text-sm tracking-tight truncate font-medium"
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
          className="bg-[#161822] text-white border border-white/20 shadow-2xl text-xs font-medium py-1.5 px-3 rounded-lg z-50 animate-in fade-in-0 zoom-in-95"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
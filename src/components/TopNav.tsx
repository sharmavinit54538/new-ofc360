import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  ShieldCheck,
  Check,
  ChevronRight,
  LogOut,
  SlidersHorizontal,
  Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels, SystemRole, normalizeRole } from "@/features/auth/authTypes";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/common/BackButton";
import { NotificationPanel } from "@/components/connect/NotificationPanel";
import { toast } from "sonner";

const ROOT_DASHBOARD_PATHS = [
  "/",
  "/dashboard",
  "/employee",
  "/manager",
  "/executive",
  "/it-admin",
  "/super-admin",
  "/superadmin",
  "/super-admin/dashboard",
  "/super-admin/platform",
  "/super-admin/analytics",
  "/super-admin/system",
  "/super-admin/security",
];

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout, setRole } = useAuth();
  const currentRole: SystemRole = role || normalizeRole(user?.role);
  const isRootDashboard = ROOT_DASHBOARD_PATHS.includes(location.pathname);

  const userName =
    user?.name ||
    user?.full_name ||
    (user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "") ||
    (user?.email ? user.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "") ||
    "User";
  const userEmail = user?.email || "";

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      toast.success("Signed out successfully");
      navigate("/login");
    }
  };

  const handleRoleChange = (r: SystemRole) => {
    setRole(r);
    toast.success(`Role switched to: ${roleLabels[r] || r}`);
    if (r === "super_admin") {
      navigate("/super-admin");
    } else if (r === "employee") {
      navigate("/employee");
    } else if (r === "manager") {
      navigate("/manager");
    } else if (r === "executive") {
      navigate("/executive");
    } else if (r === "it_admin") {
      navigate("/it-admin");
    } else {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-16 border-b border-border/60 bg-sidebar/90 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">
      {/* Left Search / Mobile Menu / Back Button */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden shrink-0">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        {!isRootDashboard && (
          <BackButton />
        )}
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workforce, employees, candidates..."
            className="pl-9 bg-secondary/40 border border-border/50 focus-visible:border-primary text-xs h-9 rounded-lg"
          />
        </div>
      </div>

      {/* Right Actions & Profile Trigger */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="text-muted-foreground h-9 w-9">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Global Notifications Bell Panel */}
        <NotificationPanel />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-secondary/60 transition-colors outline-none cursor-pointer text-left">
              <Avatar className="h-9 w-9 border border-primary/20 shadow-sm shrink-0">
                <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start justify-center leading-tight">
                <span className="text-sm md:text-[15px] font-semibold text-foreground tracking-tight">
                  {userName}
                </span>
                <span className="text-xs md:text-[13px] font-medium text-muted-foreground">
                  {roleLabels[currentRole]}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[260px] rounded-xl p-2 bg-popover border border-border/60 shadow-xl space-y-1.5 z-50 animate-in fade-in-0 zoom-in-95"
          >
            {/* User Information Section */}
            <div className="p-3 bg-secondary/30 rounded-lg space-y-2 border border-border/30">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-foreground tracking-tight truncate">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground truncate font-normal">
                  {userEmail}
                </p>
              </div>

              <div className="pt-1.5 border-t border-border/20">
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20"
                >
                  {roleLabels[currentRole]}
                </Badge>
              </div>
            </div>

            <DropdownMenuSeparator className="my-1 bg-border/40" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="h-9 px-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 text-destructive shrink-0" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
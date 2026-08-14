import { useState, createContext, useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";
import { FloatingAIAssistant } from "@/components/FloatingAIAssistant";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useGetHRAdminOnboardingStatusQuery } from "@/services/api/hrAdminOnboardingApi";
import { Skeleton } from "@/components/ui/skeleton";

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({ sidebarOpen: true, setSidebarOpen: () => {} });
export const useLayout = () => useContext(LayoutContext);

export default function DashboardLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHRAdmin = user?.role === "hr_admin";
  const {
    data: onboardingStatus,
    isLoading: isOnboardingLoading,
  } = useGetHRAdminOnboardingStatusQuery(undefined, {
    skip: !isHRAdmin,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => { setMobileOpen(false); }, [isMobile]);

  useEffect(() => {
    if (isHRAdmin && !isOnboardingLoading && onboardingStatus) {
      if (!onboardingStatus.completed && location.pathname !== "/hr-admin/onboarding") {
        navigate("/hr-admin/onboarding", { replace: true });
      }
    }
  }, [isHRAdmin, isOnboardingLoading, onboardingStatus, location.pathname, navigate]);

  // Loading skeleton while verifying initial HR Admin onboarding status
  if (isHRAdmin && isOnboardingLoading && !onboardingStatus) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="w-64 border-r border-border/50 p-4 space-y-4 hidden md:block">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 border-b border-border/50 px-6 flex items-center justify-between">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <main className="flex-1 p-6 space-y-6">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-44 rounded-2xl" />
              <Skeleton className="h-44 rounded-2xl" />
              <Skeleton className="h-44 rounded-2xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex h-screen overflow-hidden bg-background">
        {!isMobile && <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
        <AnimatePresence>
          {isMobile && mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: -270 }} animate={{ x: 0 }} exit={{ x: -270 }}
                transition={{ type: "tween", duration: 0.22 }}
                className="fixed left-0 top-0 z-50 h-full"
              >
                <AppSidebar open={true} onToggle={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav onMenuClick={isMobile ? () => setMobileOpen(true) : undefined} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin space-y-4">
            <Outlet />
          </main>
        </div>
        <FloatingAIAssistant />
      </div>
    </LayoutContext.Provider>
  );
}

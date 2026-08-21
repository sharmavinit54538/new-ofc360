import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { LayoutContext, useLayout } from "./dashboard/LayoutContext";
import { useDashboardLifecycle } from "./dashboard/useDashboardLifecycle";
import { useDashboardOnboardingRedirect } from "./dashboard/useDashboardOnboardingRedirect";
import { DashboardSkeleton } from "./dashboard/DashboardSkeleton";
import { DashboardModals } from "./dashboard/DashboardModals";
import { MobileSidebarDrawer } from "./dashboard/MobileSidebarDrawer";
import { DashboardMainContent } from "./dashboard/DashboardMainContent";

export { useLayout };
export default function DashboardLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isHRAdmin, isOnboardingLoading, onboardingStatus } = useDashboardOnboardingRedirect();
  useDashboardLifecycle();
  useEffect(() => { setMobileOpen(false); }, [isMobile]);
  if (isHRAdmin && isOnboardingLoading && !onboardingStatus) return <DashboardSkeleton />;
  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex h-screen overflow-hidden bg-background">
        {!isMobile && <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
        {isMobile && <MobileSidebarDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />}
        <DashboardMainContent onMenuClick={isMobile ? () => setMobileOpen(true) : undefined} />
        <DashboardModals />
      </div>
    </LayoutContext.Provider>
  );
}
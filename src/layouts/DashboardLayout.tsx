import { useState, createContext, useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";
import { FloatingAIAssistant } from "@/components/FloatingAIAssistant";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { getStoredData } from "@/utils/storage";

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

  useEffect(() => { setMobileOpen(false); }, [isMobile]);

  useEffect(() => {
    if (user?.role === "hr_admin" && location.pathname !== "/hr-admin/onboarding") {
      const stored = getStoredData<any>(`ofc360_hr_onboarding_v1_${user.id}`, null);
      if (!stored?.onboarding?.is_completed) {
        navigate("/hr-admin/onboarding");
      }
    }
  }, [user, location.pathname, navigate]);

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

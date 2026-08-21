import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import PerformancePage from "@/pages/PerformancePage";
import TrainingPage from "@/pages/TrainingPage";
import EngagementPage from "@/pages/EngagementPage";
import DocumentsPage from "@/pages/DocumentsPage";

export const renderOperationsCoreRoutes = () => (
  <>
    <Route path="/performance" element={<RoleGuard module="performance"><PerformancePage /></RoleGuard>} />
    <Route path="/training" element={<RoleGuard module="training"><TrainingPage /></RoleGuard>} />
    <Route path="/engagement" element={<RoleGuard module="engagement"><EngagementPage /></RoleGuard>} />
    <Route path="/documents" element={<RoleGuard module="documents"><DocumentsPage /></RoleGuard>} />
  </>
);

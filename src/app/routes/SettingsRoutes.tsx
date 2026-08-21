import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import SettingsPage from "@/pages/settings/SettingsPage";

export const renderSettingsRoutes = () => (
  <Route path="/settings" element={<RoleGuard module="system_settings"><SettingsPage /></RoleGuard>} />
);

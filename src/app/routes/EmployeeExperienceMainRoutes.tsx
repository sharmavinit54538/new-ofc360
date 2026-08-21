import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import EmployeeExperienceLandingPage from "@/pages/employee-experience/EmployeeExperienceLandingPage";
import EmployeeTimelinePage from "@/pages/employee-experience/EmployeeTimelinePage";
import VisitorManagementPage from "@/pages/employee-experience/VisitorManagementPage";

export const renderEmployeeExperienceMainRoutes = () => (
  <>
    <Route path="/employee-experience" element={<RoleGuard module="employee_experience"><EmployeeExperienceLandingPage /></RoleGuard>} />
    <Route path="/employee-experience/timeline" element={<RoleGuard module="employee_experience"><EmployeeTimelinePage /></RoleGuard>} />
    <Route path="/employee-experience/visitors" element={<RoleGuard module="employee_experience"><VisitorManagementPage /></RoleGuard>} />
  </>
);

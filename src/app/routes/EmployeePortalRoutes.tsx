import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import EmployeeDashboardPage from "@/pages/dashboards/EmployeeDashboardPage";
import EmployeeLeavePage from "@/pages/employee/EmployeeLeavePage";
import EmployeePayslipsPage from "@/pages/employee/EmployeePayslipsPage";
import EmployeeDocumentsPage from "@/pages/employee/EmployeeDocumentsPage";
import EmployeeOnboardingPage from "@/pages/employee/EmployeeOnboardingPage";
import EmployeeHelpdeskPage from "@/pages/employee/EmployeeHelpdeskPage";

export const renderEmployeePortalRoutes = () => (
  <>
    <Route path="/employee" element={<EmployeeDashboardPage />} />
    <Route path="/employee/leave" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeeLeavePage /></RoleGuard>} />
    <Route path="/employee/payslips" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeePayslipsPage /></RoleGuard>} />
    <Route path="/employee/documents" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeeDocumentsPage /></RoleGuard>} />
    <Route path="/employee/onboarding" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeeOnboardingPage /></RoleGuard>} />
    <Route path="/employee/helpdesk" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeeHelpdeskPage /></RoleGuard>} />
  </>
);

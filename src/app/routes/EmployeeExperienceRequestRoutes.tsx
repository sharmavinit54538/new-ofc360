import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ExpenseClaimsPage from "@/pages/employee-experience/ExpenseClaimsPage";
import TravelRequestsPage from "@/pages/employee-experience/TravelRequestsPage";
import CompanyAnnouncementsPage from "@/pages/employee-experience/CompanyAnnouncementsPage";
import SupportHelpdeskPage from "@/pages/employee-experience/SupportHelpdeskPage";

export const renderEmployeeExperienceRequestRoutes = () => (
  <>
    <Route path="/employee-experience/expenses" element={<RoleGuard module="employee_experience"><ExpenseClaimsPage /></RoleGuard>} />
    <Route path="/employee-experience/travel" element={<RoleGuard module="employee_experience"><TravelRequestsPage /></RoleGuard>} />
    <Route path="/employee-experience/announcements" element={<RoleGuard module="employee_experience"><CompanyAnnouncementsPage /></RoleGuard>} />
    <Route path="/employee-experience/helpdesk" element={<RoleGuard module="employee_experience"><SupportHelpdeskPage /></RoleGuard>} />
  </>
);

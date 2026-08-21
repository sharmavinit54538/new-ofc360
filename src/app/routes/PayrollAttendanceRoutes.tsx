import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import PeoplePage from "@/pages/people/PeoplePage";
import AttendancePage from "@/pages/AttendancePage";
import PayrollPage from "@/pages/PayrollPage";

export const renderPayrollAttendanceRoutes = () => (
  <>
    <Route path="/people" element={<RoleGuard module="people"><PeoplePage /></RoleGuard>} />
    <Route path="/employees" element={<RoleGuard module="people"><PeoplePage /></RoleGuard>} />
    <Route path="/departments" element={<RoleGuard module="people"><PeoplePage /></RoleGuard>} />
    <Route path="/attendance" element={<RoleGuard module="attendance"><AttendancePage /></RoleGuard>} />
    <Route path="/payroll" element={<RoleGuard module="payroll"><PayrollPage /></RoleGuard>} />
  </>
);

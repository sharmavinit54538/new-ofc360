import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import IntelligenceLandingPage from "@/features/intelligence/pages/IntelligenceLandingPage";
import AIInterviewPage from "@/features/recruitment/pages/AIInterviewPage";
import AIFaceAttendancePage from "@/features/attendance/pages/ai-face-attendance/AIFaceAttendancePage";

export const renderAIOpsRoutes = () => (
  <>
    <Route path="/ai/insights" element={<RoleGuard module="intelligence_hub"><IntelligenceLandingPage /></RoleGuard>} />
    <Route path="/ai/interview" element={<AIInterviewPage />} />
    <Route path="/ai/cctv" element={<AIFaceAttendancePage />} />
    <Route path="/ai/face-attendance" element={<AIFaceAttendancePage />} />
  </>
);
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import HiringPlanningPage from "@/pages/HiringPlanningPage";
import RecruitmentPage from "@/pages/RecruitmentPage";
import OnboardingPage from "@/pages/OnboardingPage";
import EmployeesPage from "@/pages/EmployeesPage";
import AttendancePage from "@/pages/AttendancePage";
import PayrollPage from "@/pages/PayrollPage";
import PerformancePage from "@/pages/PerformancePage";
import TrainingPage from "@/pages/TrainingPage";
import EngagementPage from "@/pages/EngagementPage";
import CompliancePage from "@/pages/CompliancePage";
import DocumentsPage from "@/pages/DocumentsPage";
import ITAccessPage from "@/pages/ITAccessPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ReportsPage from "@/pages/ReportsPage";
import ExitManagementPage from "@/pages/ExitManagementPage";
import CulturePage from "@/pages/CulturePage";
import AIChatPage from "@/pages/AIChatPage";
import AIATSPage from "@/pages/AIATSPage";
import ResumeATSCheckerPage from "@/pages/tools/ResumeATSCheckerPage";

import AIInsightsPage from "@/pages/AIInsightsPage";
import AIInterviewPage from "@/pages/AIInterviewPage";
import AICCTVPage from "@/pages/AICCTVPage";
import AIFaceAttendancePage from "@/pages/AIFaceAttendancePage";
import AIRecruiterCopilotPage from "@/pages/AIRecruiterCopilotPage";
import AIPredictivePage from "@/pages/AIPredictivePage";
import AIDocumentIntelligencePage from "@/pages/AIDocumentIntelligencePage";
import IntelligenceLandingPage from "@/pages/intelligence/IntelligenceLandingPage";
import PerformanceIntelligencePage from "@/pages/intelligence/PerformanceIntelligencePage";
import WorkforceAnalyticsPage from "@/pages/intelligence/WorkforceAnalyticsPage";
import EngagementIntelligencePage from "@/pages/intelligence/EngagementIntelligencePage";
import CultureIntelligencePage from "@/pages/intelligence/CultureIntelligencePage";
import ComplianceIntelligencePage from "@/pages/intelligence/ComplianceIntelligencePage";
import PredictiveWorkforcePage from "@/pages/intelligence/PredictiveWorkforcePage";
import AIRecommendationsPage from "@/pages/intelligence/AIRecommendationsPage";
import TalentIntelligenceLandingPage from "@/pages/talent-intelligence/TalentIntelligenceLandingPage";
import DocumentIntelligencePage from "@/pages/talent-intelligence/DocumentIntelligencePage";
import OnboardingIntelligencePage from "@/pages/talent-intelligence/OnboardingIntelligencePage";
import LearningIntelligencePage from "@/pages/talent-intelligence/LearningIntelligencePage";
import ExitIntelligencePage from "@/pages/talent-intelligence/ExitIntelligencePage";
import HiringIntelligencePage from "@/pages/talent-intelligence/HiringIntelligencePage";
import ResourceIntelligenceLandingPage from "@/pages/resource-intelligence/ResourceIntelligenceLandingPage";
import AssetIntelligencePage from "@/pages/resource-intelligence/AssetIntelligencePage";
import VendorIntelligencePage from "@/pages/resource-intelligence/VendorIntelligencePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import EmployeeExperienceLandingPage from "@/pages/employee-experience/EmployeeExperienceLandingPage";
import EmployeeTimelinePage from "@/pages/employee-experience/EmployeeTimelinePage";
import VisitorManagementPage from "@/pages/employee-experience/VisitorManagementPage";
import ExpenseClaimsPage from "@/pages/employee-experience/ExpenseClaimsPage";
import TravelRequestsPage from "@/pages/employee-experience/TravelRequestsPage";
import CompanyAnnouncementsPage from "@/pages/employee-experience/CompanyAnnouncementsPage";
import SupportHelpdeskPage from "@/pages/employee-experience/SupportHelpdeskPage";
import PeoplePage from "@/pages/people/PeoplePage";
import DepartmentsPage from "@/pages/departments/DepartmentsPage";
import RolesAndPermissionsPage from "@/pages/rbac/RolesAndPermissionsPage";
import EmployeeDashboardPage from "@/pages/dashboards/EmployeeDashboardPage";

// OFC360 Connect Module
import ConnectOverviewPage from "@/pages/connect/ConnectOverviewPage";
import ConnectChatPage from "@/pages/connect/ConnectChatPage";
import ConnectChannelsPage from "@/pages/connect/ConnectChannelsPage";
import ConnectCallsPage from "@/pages/connect/ConnectCallsPage";
import ConnectMeetingsPage from "@/pages/connect/ConnectMeetingsPage";
import MeetingRoomPage from "@/pages/connect/MeetingRoomPage";
import ConnectFilesPage from "@/pages/connect/ConnectFilesPage";
import ConnectContactsPage from "@/pages/connect/ConnectContactsPage";
import ManagerDashboardPage from "@/pages/dashboards/ManagerDashboardPage";
import ExecutiveDashboardPage from "@/pages/dashboards/ExecutiveDashboardPage";
import ITAdminDashboardPage from "@/pages/dashboards/ITAdminDashboardPage";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import PublicCareersPage from "@/pages/PublicCareersPage";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import EmployeeLeavePage from "@/pages/employee/EmployeeLeavePage";
import EmployeePayslipsPage from "@/pages/employee/EmployeePayslipsPage";
import EmployeeDocumentsPage from "@/pages/employee/EmployeeDocumentsPage";
import EmployeeOnboardingPage from "@/pages/employee/EmployeeOnboardingPage";
import EmployeeHelpdeskPage from "@/pages/employee/EmployeeHelpdeskPage";
import ManagerTeamPage from "@/pages/manager/ManagerTeamPage";
import ManagerApprovalsPage from "@/pages/manager/ManagerApprovalsPage";
import ManagerGoalsPage from "@/pages/manager/ManagerGoalsPage";
import ManagerEngagementPage from "@/pages/manager/ManagerEngagementPage";
import ManagerHelpdeskPage from "@/pages/manager/ManagerHelpdeskPage";
import ExecutiveOrgPage from "@/pages/executive/ExecutiveOrgPage";
import ExecutiveKPIsPage from "@/pages/executive/ExecutiveKPIsPage";
import ExecutiveOutcomesPage from "@/pages/executive/ExecutiveOutcomesPage";
import ExecutiveWorkforcePage from "@/pages/executive/ExecutiveWorkforcePage";
import ExecutiveInsightsPage from "@/pages/executive/ExecutiveInsightsPage";
import ExecutiveReportsPage from "@/pages/executive/ExecutiveReportsPage";
import SSOPage from "@/pages/it-admin/SSOPage";
import AccessPage from "@/pages/it-admin/AccessPage";
import SecurityPage from "@/pages/it-admin/SecurityPage";
import IntegrationsPage from "@/pages/it-admin/IntegrationsPage";
import AuditLogsPage from "@/pages/it-admin/AuditLogsPage";
import SystemHealthPage from "@/pages/it-admin/SystemHealthPage";
import DeploymentsPage from "@/pages/it-admin/DeploymentsPage";
import LandingPage from "@/pages/LandingPage";
import FeaturesPage from "@/pages/FeaturesPage";
import PricingPage from "@/pages/PricingPage";
import AboutPage from "@/pages/AboutPage";
import EquinoxSphereAboutPage from "@/pages/about/EquinoxSphereAboutPage";
import FoundersPage from "@/pages/founders/FoundersPage";
import VinitSharmaPage from "@/pages/founders/VinitSharmaPage";
import BanothSiddarthPage from "@/pages/founders/BanothSiddarthPage";
import BlogPage from "@/pages/BlogPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import HRAdminOnboardingPage from "@/pages/onboarding/HRAdminOnboardingPage";
import { HRAdminOnboardingGuard } from "@/components/auth/HRAdminOnboardingGuard";
import OnboardingHubPage from "@/pages/onboarding/OnboardingHubPage";
import WorkflowsManagementPage from "@/pages/onboarding/WorkflowsManagementPage";
import NewHiresManagementPage from "@/pages/onboarding/NewHiresManagementPage";
import DocumentsManagementPage from "@/pages/onboarding/DocumentsManagementPage";
import TasksManagementPage from "@/pages/onboarding/TasksManagementPage";
import SuperAdminDashboardPage from "@/pages/super-admin/SuperAdminDashboardPage";
import PlatformLandingPage from "@/pages/super-admin/platform/PlatformLandingPage";
import CompaniesPage from "@/pages/super-admin/platform/CompaniesPage";
import UsersPage from "@/pages/super-admin/platform/UsersPage";
import HRAdminsPage from "@/pages/super-admin/platform/HRAdminsPage";
import OnboardingTrackerPage from "@/pages/super-admin/platform/OnboardingTrackerPage";
import SubscriptionsPage from "@/pages/super-admin/platform/SubscriptionsPage";
import AnalyticsLandingPage from "@/pages/super-admin/analytics/AnalyticsLandingPage";
import PlatformUsagePage from "@/pages/super-admin/analytics/PlatformUsagePage";
import UserGrowthPage from "@/pages/super-admin/analytics/UserGrowthPage";
import CompanyGrowthPage from "@/pages/super-admin/analytics/CompanyGrowthPage";
import SystemLandingPage from "@/pages/super-admin/system/SystemLandingPage";
import SuperAdminSystemHealthPage from "@/pages/super-admin/system/SuperAdminSystemHealthPage";
import SuperAdminAuditLogsPage from "@/pages/super-admin/system/SuperAdminAuditLogsPage";
import PlatformSettingsPage from "@/pages/super-admin/system/PlatformSettingsPage";
import SecurityLandingPage from "@/pages/super-admin/security/SecurityLandingPage";
import AdminSessionsPage from "@/pages/super-admin/security/AdminSessionsPage";
import SecurityEventsPage from "@/pages/super-admin/security/SecurityEventsPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";

import { ReduxProvider } from "@/app/providers";

const App = () => (
  <ReduxProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about/equinoxsphere" element={<EquinoxSphereAboutPage />} />
        <Route path="/founders" element={<FoundersPage />} />
        <Route path="/founders/vinit-sharma" element={<VinitSharmaPage />} />
        <Route path="/founders/banoth-siddarth" element={<BanothSiddarthPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-reset-otp" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/careers" element={<PublicCareersPage />} />
        <Route path="/hr-admin/onboarding" element={<HRAdminOnboardingGuard><HRAdminOnboardingPage /></HRAdminOnboardingGuard>} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* HR Admin Onboarding Management Routes */}
            <Route path="/hr-admin/onboarding/hub" element={<RoleGuard allowedRoles={["hr_admin"]}><OnboardingHubPage /></RoleGuard>} />
            <Route path="/hr-admin/onboarding/workflows" element={<RoleGuard allowedRoles={["hr_admin"]}><WorkflowsManagementPage /></RoleGuard>} />
            <Route path="/hr-admin/onboarding/new-hires" element={<RoleGuard allowedRoles={["hr_admin"]}><NewHiresManagementPage /></RoleGuard>} />
            <Route path="/hr-admin/onboarding/documents" element={<RoleGuard allowedRoles={["hr_admin"]}><DocumentsManagementPage /></RoleGuard>} />
            <Route path="/hr-admin/onboarding/tasks" element={<RoleGuard allowedRoles={["hr_admin"]}><TasksManagementPage /></RoleGuard>} />

            {/* Super Admin Routes */}
            <Route path="/super-admin" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminDashboardPage /></RoleGuard>} />
            <Route path="/superadmin" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminDashboardPage /></RoleGuard>} />
            <Route path="/super-admin/dashboard" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminDashboardPage /></RoleGuard>} />
            <Route path="/super-admin/platform" element={<RoleGuard allowedRoles={["super_admin"]}><PlatformLandingPage /></RoleGuard>} />
            <Route path="/super-admin/companies" element={<RoleGuard allowedRoles={["super_admin"]}><CompaniesPage /></RoleGuard>} />
            <Route path="/super-admin/users" element={<RoleGuard allowedRoles={["super_admin"]}><UsersPage /></RoleGuard>} />
            <Route path="/super-admin/hr-admins" element={<RoleGuard allowedRoles={["super_admin"]}><HRAdminsPage /></RoleGuard>} />
            <Route path="/super-admin/onboarding" element={<RoleGuard allowedRoles={["super_admin"]}><OnboardingTrackerPage /></RoleGuard>} />
            <Route path="/super-admin/subscriptions" element={<RoleGuard allowedRoles={["super_admin"]}><SubscriptionsPage /></RoleGuard>} />
            <Route path="/super-admin/analytics" element={<RoleGuard allowedRoles={["super_admin"]}><AnalyticsLandingPage /></RoleGuard>} />
            <Route path="/super-admin/analytics/usage" element={<RoleGuard allowedRoles={["super_admin"]}><PlatformUsagePage /></RoleGuard>} />
            <Route path="/super-admin/analytics/user-growth" element={<RoleGuard allowedRoles={["super_admin"]}><UserGrowthPage /></RoleGuard>} />
            <Route path="/super-admin/analytics/company-growth" element={<RoleGuard allowedRoles={["super_admin"]}><CompanyGrowthPage /></RoleGuard>} />
            <Route path="/super-admin/system" element={<RoleGuard allowedRoles={["super_admin"]}><SystemLandingPage /></RoleGuard>} />
            <Route path="/super-admin/system/health" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminSystemHealthPage /></RoleGuard>} />
            <Route path="/super-admin/system/audit-logs" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminAuditLogsPage /></RoleGuard>} />
            <Route path="/super-admin/system/settings" element={<RoleGuard allowedRoles={["super_admin"]}><PlatformSettingsPage /></RoleGuard>} />
            <Route path="/super-admin/security" element={<RoleGuard allowedRoles={["super_admin"]}><SecurityLandingPage /></RoleGuard>} />
            <Route path="/super-admin/security/sessions" element={<RoleGuard allowedRoles={["super_admin"]}><AdminSessionsPage /></RoleGuard>} />
            <Route path="/super-admin/security/events" element={<RoleGuard allowedRoles={["super_admin"]}><SecurityEventsPage /></RoleGuard>} />

            <Route path="/employee" element={<EmployeeDashboardPage />} />
            <Route path="/employee/leave" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeeLeavePage /></RoleGuard>} />
            <Route path="/employee/payslips" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeePayslipsPage /></RoleGuard>} />
            <Route path="/employee/documents" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeeDocumentsPage /></RoleGuard>} />
            <Route path="/employee/onboarding" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeeOnboardingPage /></RoleGuard>} />
            <Route path="/employee/helpdesk" element={<RoleGuard allowedRoles={["employee", "hr_admin", "manager", "executive", "it_admin"]}><EmployeeHelpdeskPage /></RoleGuard>} />
            <Route path="/manager" element={<ManagerDashboardPage />} />
            <Route path="/manager/team" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerTeamPage /></RoleGuard>} />
            <Route path="/manager/approvals" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerApprovalsPage /></RoleGuard>} />
            <Route path="/manager/goals" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerGoalsPage /></RoleGuard>} />
            <Route path="/manager/engagement" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerEngagementPage /></RoleGuard>} />
            <Route path="/manager/helpdesk" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerHelpdeskPage /></RoleGuard>} />
            <Route path="/executive" element={<ExecutiveDashboardPage />} />
            <Route path="/executive/organization" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveOrgPage /></RoleGuard>} />
            <Route path="/executive/kpis" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveKPIsPage /></RoleGuard>} />
            <Route path="/executive/outcomes" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveOutcomesPage /></RoleGuard>} />
            <Route path="/executive/workforce" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveWorkforcePage /></RoleGuard>} />
            <Route path="/executive/insights" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveInsightsPage /></RoleGuard>} />
            <Route path="/executive/reports" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveReportsPage /></RoleGuard>} />
            <Route path="/it-admin" element={<ITAdminDashboardPage />} />
            <Route path="/it-admin/sso" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><SSOPage /></RoleGuard>} />
            <Route path="/it-admin/access" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><AccessPage /></RoleGuard>} />
            <Route path="/it-admin/security" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><SecurityPage /></RoleGuard>} />
            <Route path="/it-admin/integrations" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><IntegrationsPage /></RoleGuard>} />
            <Route path="/it-admin/audit-logs" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><AuditLogsPage /></RoleGuard>} />
            <Route path="/it-admin/system-health" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><SystemHealthPage /></RoleGuard>} />
            <Route path="/it-admin/deployments" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><DeploymentsPage /></RoleGuard>} />

            <Route path="/hiring" element={<RoleGuard module="hiring_planning"><HiringPlanningPage /></RoleGuard>} />
            <Route path="/recruitment" element={<RoleGuard module="recruitment"><RecruitmentPage /></RoleGuard>} />
            <Route path="/onboarding" element={<RoleGuard module="onboarding"><OnboardingPage /></RoleGuard>} />
            <Route path="/people" element={<RoleGuard module="people"><PeoplePage /></RoleGuard>} />
            <Route path="/employees" element={<RoleGuard module="people"><PeoplePage /></RoleGuard>} />
            <Route path="/departments" element={<RoleGuard module="people"><PeoplePage /></RoleGuard>} />
            <Route path="/attendance" element={<RoleGuard module="attendance"><AttendancePage /></RoleGuard>} />
            <Route path="/payroll" element={<RoleGuard module="payroll"><PayrollPage /></RoleGuard>} />
            <Route path="/performance" element={<RoleGuard module="performance"><PerformancePage /></RoleGuard>} />
            <Route path="/training" element={<RoleGuard module="training"><TrainingPage /></RoleGuard>} />
            <Route path="/engagement" element={<RoleGuard module="engagement"><EngagementPage /></RoleGuard>} />
            <Route path="/compliance" element={<RoleGuard module="compliance"><CompliancePage /></RoleGuard>} />
            <Route path="/documents" element={<RoleGuard module="documents"><DocumentsPage /></RoleGuard>} />
            <Route path="/it-access" element={<RoleGuard module="it_access"><ITAccessPage /></RoleGuard>} />
            <Route path="/analytics" element={<RoleGuard module="analytics"><ReportsPage /></RoleGuard>} />
            <Route path="/reports" element={<RoleGuard module="analytics"><ReportsPage /></RoleGuard>} />
            <Route path="/exit" element={<RoleGuard module="exit"><ExitManagementPage /></RoleGuard>} />
            <Route path="/culture" element={<RoleGuard module="culture"><CulturePage /></RoleGuard>} />
            <Route path="/rbac" element={<RoleGuard module="rbac"><RolesAndPermissionsPage /></RoleGuard>} />

            {/* Intelligence Hub Routes */}
            <Route path="/intelligence" element={<RoleGuard module="intelligence_hub"><IntelligenceLandingPage /></RoleGuard>} />
            <Route path="/intelligence/performance" element={<RoleGuard module="intelligence_hub"><PerformanceIntelligencePage /></RoleGuard>} />
            <Route path="/intelligence/workforce" element={<RoleGuard module="intelligence_hub"><WorkforceAnalyticsPage /></RoleGuard>} />
            <Route path="/intelligence/engagement" element={<RoleGuard module="intelligence_hub"><EngagementIntelligencePage /></RoleGuard>} />
            <Route path="/intelligence/culture" element={<RoleGuard module="intelligence_hub"><CultureIntelligencePage /></RoleGuard>} />
            <Route path="/intelligence/compliance" element={<RoleGuard module="intelligence_hub"><ComplianceIntelligencePage /></RoleGuard>} />
            <Route path="/intelligence/predictive" element={<RoleGuard module="intelligence_hub"><PredictiveWorkforcePage /></RoleGuard>} />
            <Route path="/intelligence/recommendations" element={<RoleGuard module="intelligence_hub"><AIRecommendationsPage /></RoleGuard>} />

            {/* Talent Intelligence Routes */}
            <Route path="/talent-intelligence" element={<RoleGuard module="talent_intelligence"><TalentIntelligenceLandingPage /></RoleGuard>} />
            <Route path="/talent-intelligence/recruitment" element={<RoleGuard module="recruitment"><RecruitmentPage /></RoleGuard>} />
            <Route path="/talent-intelligence/documents" element={<RoleGuard module="talent_intelligence"><DocumentIntelligencePage /></RoleGuard>} />
            <Route path="/talent-intelligence/onboarding" element={<RoleGuard module="talent_intelligence"><OnboardingIntelligencePage /></RoleGuard>} />
            <Route path="/talent-intelligence/learning" element={<RoleGuard module="talent_intelligence"><LearningIntelligencePage /></RoleGuard>} />
            <Route path="/talent-intelligence/exit" element={<RoleGuard module="talent_intelligence"><ExitIntelligencePage /></RoleGuard>} />
            <Route path="/talent-intelligence/hiring" element={<RoleGuard module="talent_intelligence"><HiringIntelligencePage /></RoleGuard>} />

            {/* Resource Intelligence Routes */}
            <Route path="/assets" element={<RoleGuard module="resource_intelligence"><AssetIntelligencePage /></RoleGuard>} />
            <Route path="/resource-intelligence" element={<RoleGuard module="resource_intelligence"><ResourceIntelligenceLandingPage /></RoleGuard>} />
            <Route path="/resource-intelligence/assets" element={<RoleGuard module="resource_intelligence"><AssetIntelligencePage /></RoleGuard>} />
            <Route path="/resource-intelligence/vendors" element={<RoleGuard module="resource_intelligence"><VendorIntelligencePage /></RoleGuard>} />

            {/* Employee Experience Routes */}
            <Route path="/employee-experience" element={<RoleGuard module="employee_experience"><EmployeeExperienceLandingPage /></RoleGuard>} />
            <Route path="/employee-experience/timeline" element={<RoleGuard module="employee_experience"><EmployeeTimelinePage /></RoleGuard>} />
            <Route path="/employee-experience/visitors" element={<RoleGuard module="employee_experience"><VisitorManagementPage /></RoleGuard>} />
            <Route path="/employee-experience/expenses" element={<RoleGuard module="employee_experience"><ExpenseClaimsPage /></RoleGuard>} />
            <Route path="/employee-experience/travel" element={<RoleGuard module="employee_experience"><TravelRequestsPage /></RoleGuard>} />
            <Route path="/employee-experience/announcements" element={<RoleGuard module="employee_experience"><CompanyAnnouncementsPage /></RoleGuard>} />
            <Route path="/employee-experience/helpdesk" element={<RoleGuard module="employee_experience"><SupportHelpdeskPage /></RoleGuard>} />

            {/* Settings Route */}
            <Route path="/settings" element={<RoleGuard module="system_settings"><SettingsPage /></RoleGuard>} />

            {/* OFC360 Connect Routes */}
            <Route path="/connect" element={<RoleGuard module="connect"><ConnectOverviewPage /></RoleGuard>} />
            <Route path="/connect/chat" element={<RoleGuard module="connect"><ConnectChatPage /></RoleGuard>} />
            <Route path="/connect/chat/:conversationId" element={<RoleGuard module="connect"><ConnectChatPage /></RoleGuard>} />
            <Route path="/connect/channels" element={<RoleGuard module="connect"><ConnectChannelsPage /></RoleGuard>} />
            <Route path="/connect/channels/:channelId" element={<RoleGuard module="connect"><ConnectChannelsPage /></RoleGuard>} />
            <Route path="/connect/calls" element={<RoleGuard module="connect"><ConnectCallsPage /></RoleGuard>} />
            <Route path="/connect/meetings" element={<RoleGuard module="connect"><ConnectMeetingsPage /></RoleGuard>} />
            <Route path="/connect/meeting/:meetingId" element={<RoleGuard module="connect"><MeetingRoomPage /></RoleGuard>} />
            <Route path="/connect/files" element={<RoleGuard module="connect"><ConnectFilesPage /></RoleGuard>} />
            <Route path="/connect/contacts" element={<RoleGuard module="connect"><ConnectContactsPage /></RoleGuard>} />

            {/* Legacy AI Routes */}
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/ai" element={<IntelligenceLandingPage />} />
            <Route path="/ai/ats" element={<AIATSPage />} />
            {/* Resume ATS Checker Tool (All Authenticated Users) */}
            <Route path="/tools/ats-checker" element={<ResumeATSCheckerPage />} />
            <Route path="/tools/resume-ats-checker" element={<ResumeATSCheckerPage />} />
            <Route path="/resume-ats-checker" element={<ResumeATSCheckerPage />} />

            <Route path="/ai/insights" element={<IntelligenceLandingPage />} />
            <Route path="/ai/interview" element={<AIInterviewPage />} />
            <Route path="/ai/cctv" element={<AIFaceAttendancePage />} />
            <Route path="/ai/face-attendance" element={<AIFaceAttendancePage />} />
            <Route path="/ai/copilot" element={<AIRecruiterCopilotPage />} />
            <Route path="/ai/predictive" element={<PredictiveWorkforcePage />} />
            <Route path="/ai/documents" element={<AIDocumentIntelligencePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
  </ReduxProvider>
);

export default App;




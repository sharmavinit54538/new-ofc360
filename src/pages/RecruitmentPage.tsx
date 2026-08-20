import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileCheck2,
  Briefcase,
  Users,
  Kanban,
  Sparkles,
  Calendar,
  Star,
  FileText,
  Bookmark,
  Share2,
  Building2,
  Zap,
  UserCheck,
  ShieldCheck,
  BarChart3,
  Plus,
  Globe,
  Grid,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useATSStore } from "@/stores/atsStore";

// Modules imports
import { ExecutiveDashboard } from "@/components/recruitment/ExecutiveDashboard";
import { RequisitionsModule } from "@/components/recruitment/RequisitionsModule";
import { CandidateDirectory } from "@/components/recruitment/CandidateDirectory";
import { KanbanPipeline } from "@/components/recruitment/KanbanPipeline";
import { AIResumeCopilot } from "@/components/recruitment/AIResumeCopilot";
import { InterviewCalendar } from "@/components/recruitment/InterviewCalendar";
import { ScorecardsModule } from "@/components/recruitment/ScorecardsModule";
import { OfferManagement } from "@/components/recruitment/OfferManagement";
import { TalentPoolCRM } from "@/components/recruitment/TalentPoolCRM";
import { EmployeeReferral } from "@/components/recruitment/EmployeeReferral";
import { VendorAgencyPortal } from "@/components/recruitment/VendorAgencyPortal";
import { WorkflowAutomation } from "@/components/recruitment/WorkflowAutomation";
import { OnboardingBridge } from "@/components/recruitment/OnboardingBridge";
import { ComplianceAuditLogs } from "@/components/recruitment/ComplianceAuditLogs";
import { ATSAnalyticsReports } from "@/components/recruitment/ATSAnalyticsReports";
import { JobWizardModal } from "@/components/recruitment/JobWizardModal";
import { JobPublishingModal } from "@/components/recruitment/JobPublishingModal";

interface ModuleCardDef {
  id: string;
  title: string;
  description: string;
  icon: any;
  badge: string;
  badgeColor: string;
  component: React.ReactNode;
}

export default function RecruitmentPage() {
  const { activeTab, setActiveTab, jobs, requisitions, candidates, interviews, scorecards, offers, talentPool, referrals, vendors, automations, onboardingRecords } = useATSStore();
  const [openJobWizard, setOpenJobWizard] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "module">("grid");

  const modulesList: ModuleCardDef[] = [
    {
      id: "dashboard",
      title: "Executive Dashboard",
      description: "Real-time recruitment metrics, candidate funnel, upcoming interviews & activity feed.",
      icon: LayoutDashboard,
      badge: "Live Metrics",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      component: <ExecutiveDashboard />
    },
    {
      id: "requisitions",
      title: "Requisitions & Approvals",
      description: "Multi-level headcount approval workflow (Draft → HR → Finance → C-Level Signoff).",
      icon: FileCheck2,
      badge: `${requisitions.length} Active Reqs`,
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      component: <RequisitionsModule />
    },
    {
      id: "jobs",
      title: "Jobs Manager & AI Wizard",
      description: "Multi-step job opening creator, AI description generator & publishing matrix.",
      icon: Briefcase,
      badge: `${jobs.length} Open Roles`,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      component: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Job Openings Management</h2>
              <p className="text-sm text-muted-foreground">Manage role postings, compensation & multi-channel distribution.</p>
            </div>
            <Button size="sm" onClick={() => setOpenJobWizard(true)} className="gap-1.5 gradient-bg">
              <Plus className="w-4 h-4" /> AI Wizard Job Creator
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="text-[10px] font-mono mb-1">{job.id}</Badge>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-xs text-muted-foreground">{job.department} · {job.location}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                    {job.status}
                  </Badge>
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-primary bg-secondary/30 p-2.5 rounded-lg">
                  <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} {job.currency}</span>
                  <span>{job.applicantCount} Applicants</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <JobPublishingModal job={job} />
                  <Button size="sm" variant="ghost" onClick={() => { setActiveTab("kanban"); setViewMode("module"); }} className="text-xs">
                    View Applicants Pipeline →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "directory",
      title: "Candidates 360° Directory",
      description: "Filterable candidate search table & split-screen PDF resume drawer preview.",
      icon: Users,
      badge: `${candidates.length} Applicants`,
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      component: <CandidateDirectory />
    },
    {
      id: "kanban",
      title: "Drag & Drop Pipeline",
      description: "Interactive Kanban board across custom stages (Applied → Tech → Culture → Offer).",
      icon: Kanban,
      badge: "Interactive Board",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      component: <KanbanPipeline />
    },
    {
      id: "copilot",
      title: "AI Recruiter Copilot",
      description: "Resume auto-parsing, AI candidate match scoring % & tailored interview question generator.",
      icon: Sparkles,
      badge: "AI Powered",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      component: <AIResumeCopilot />
    },
    {
      id: "interviews",
      title: "Interviews & Calendar Sync",
      description: "Interviewer availability check, weekly/monthly calendar view & auto Google Meet links.",
      icon: Calendar,
      badge: `${interviews.length} Scheduled`,
      badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      component: <InterviewCalendar />
    },
    {
      id: "scorecards",
      title: "Structured Scorecards",
      description: "1-5 star rubric evaluation criteria, pros/cons feedback & hire recommendations.",
      icon: Star,
      badge: `${scorecards.length} Submitted`,
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      component: <ScorecardsModule />
    },
    {
      id: "offers",
      title: "Offer Letters & E-Signatures",
      description: "Dynamic offer letter templates with digital canvas candidate e-signature pad.",
      icon: FileText,
      badge: `${offers.length} Offers`,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      component: <OfferManagement />
    },
    {
      id: "talent-pool",
      title: "Passive Talent Pool & CRM",
      description: "Archive silver-medalist candidates, custom tags (Ex-FAANG) & email nurture sequences.",
      icon: Bookmark,
      badge: `${talentPool.length} Archived`,
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      component: <TalentPoolCRM />
    },
    {
      id: "referrals",
      title: "Employee Referral Portal",
      description: "Internal referral submission form, unique link generator & cash bonus leaderboard ($2.5k).",
      icon: Share2,
      badge: `${referrals.length} Referrals`,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      component: <EmployeeReferral />
    },
    {
      id: "vendors",
      title: "Vendor & Agency Portal",
      description: "External headhunter submission portal with automatic candidate duplicate detection.",
      icon: Building2,
      badge: `${vendors.length} Agencies`,
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      component: <VendorAgencyPortal />
    },
    {
      id: "automation",
      title: "Workflow Automation Engine",
      description: "If-Then trigger-action rule builder (Stage change → trigger email & calendar invite).",
      icon: Zap,
      badge: `${automations.length} Active Rules`,
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      component: <WorkflowAutomation />
    },
    {
      id: "onboarding",
      title: "Onboarding Handoff Bridge",
      description: "Convert hired candidates directly to employee onboarding records with pre-checklist.",
      icon: UserCheck,
      badge: `${onboardingRecords.length} Records`,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      component: <OnboardingBridge />
    },
    {
      id: "compliance",
      title: "Compliance & Audit Logs",
      description: "GDPR right-to-be-forgotten erasure action, EEOC compliance & immutable logs.",
      icon: ShieldCheck,
      badge: "GDPR Compliant",
      badgeColor: "bg-slate-500/10 text-slate-300 border-slate-500/20",
      component: <ComplianceAuditLogs />
    },
    {
      id: "analytics",
      title: "Executive Analytics & Reports",
      description: "Time-to-Hire, Cost-per-Hire, Funnel Conversion, Sourcing attribution & PDF/Excel export.",
      icon: BarChart3,
      badge: "Full Analytics",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      component: <ATSAnalyticsReports />
    }
  ];

  const currentModule = modulesList.find((m) => m.id === activeTab) || modulesList[0];

  const handleSelectModule = (id: string) => {
    setActiveTab(id);
    setViewMode("module");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="page-header">Enterprise Recruitment & ATS Platform</h1>
          <p className="page-subheader">End-to-end recruitment lifecycle, AI copilot, drag-and-drop pipeline & public portal.</p>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "module" && (
            <Button size="sm" variant="outline" onClick={() => setViewMode("grid")} className="gap-1.5 text-xs">
              <Grid className="w-3.5 h-3.5 text-primary" /> View All Cards Grid
            </Button>
          )}

          <Button size="sm" onClick={() => setOpenJobWizard(true)} className="gap-1.5 gradient-bg shadow">
            <Plus className="w-4 h-4" /> Create Job Opening
          </Button>
        </div>
      </div>

      {/* Mode 1: CARD GRID FORMAT (Module Hub Layout) */}
      {viewMode === "grid" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modulesList.map((m, idx) => {
              const IconComponent = m.icon;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => handleSelectModule(m.id)}
                  className="glass-card-hover rounded-xl p-5 border border-border/50 flex flex-col justify-between space-y-4 cursor-pointer group hover:border-primary/50 transition-all shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base group-hover:text-primary transition-colors">{m.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{m.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Open Module</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: ACTIVE MODULE FULL PAGE VIEW */}
      {viewMode === "module" && (
        <div className="space-y-6">
          {/* Active Module Component */}
          <div>{currentModule.component}</div>
        </div>
      )}

      {/* AI Wizard Modal */}
      <JobWizardModal open={openJobWizard} setOpen={setOpenJobWizard} />
    </motion.div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useGetHRAdminOnboardingStatusQuery,
} from "@/services/api/hrAdminOnboardingApi";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Rocket, GitBranch, UserPlus, FileText, ListChecks, ArrowRight, AlertTriangle, Info,
} from "lucide-react";
import WorkflowsManagementPage from "./WorkflowsManagementPage";
import NewHiresManagementPage from "./NewHiresManagementPage";
import DocumentsManagementPage from "./DocumentsManagementPage";
import TasksManagementPage from "./TasksManagementPage";

export default function OnboardingHubPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("workflows");

  const {
    data: status,
    isLoading: isStatusLoading,
  } = useGetHRAdminOnboardingStatusQuery();

  const progressPercent = status
    ? Math.round((status.current_step / status.total_steps) * 100)
    : 0;

  return (
    <div className="space-y-6 p-1">
      <SEOHead
        title="Onboarding Hub | OFC360"
        description="HR Admin Onboarding hub — manage wizard, workflows, new hires, documents, and tasks."
      />

      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Rocket className="w-7 h-7 text-primary" />
            Onboarding Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your organization and manage the employee onboarding pipeline.
          </p>
        </div>
      </div>

      {/* ─── Wizard Status Card ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border border-border/80 rounded-2xl p-5 sm:p-6 bg-card shadow-sm"
      >
        {isStatusLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-9 w-36" />
          </div>
        ) : status?.completed ? (
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-600"><Rocket className="w-3.5 h-3.5" /></span>
                Setup Complete ✓
              </h3>
              <p className="text-xs text-muted-foreground">Your organization onboarding is finished. Manage your onboarding pipeline below.</p>
            </div>
            <Progress value={100} className="h-2 max-w-[200px]" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Organization Setup</h3>
              <span className="text-xs font-semibold text-primary">{progressPercent}% complete</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Step {(status?.current_step ?? 0) + 1} of {status?.total_steps ?? 4} — continue your setup to unlock all features.
              </p>
              <Button
                size="sm"
                className="gap-1.5 gradient-bg text-primary-foreground"
                onClick={() => navigate("/hr-admin/onboarding")}
              >
                Continue Setup <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ─── In-Memory Warning Banner ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-300/40 bg-amber-50/50 dark:bg-amber-500/5 dark:border-amber-500/20"
      >
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <strong>Dev/Staging Note:</strong> Workflows, New Hires, Documents, and Tasks are stored in-memory on the backend. Data will reset on server restart.
        </div>
      </motion.div>

      {/* ─── Management Tabs ─────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="workflows" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg py-2.5 text-xs font-semibold">
            <GitBranch className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Workflows</span>
          </TabsTrigger>
          <TabsTrigger value="new-hires" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg py-2.5 text-xs font-semibold">
            <UserPlus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">New Hires</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg py-2.5 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg py-2.5 text-xs font-semibold">
            <ListChecks className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="workflows" className="m-0"><WorkflowsManagementPage /></TabsContent>
          <TabsContent value="new-hires" className="m-0"><NewHiresManagementPage /></TabsContent>
          <TabsContent value="documents" className="m-0"><DocumentsManagementPage /></TabsContent>
          <TabsContent value="tasks" className="m-0"><TasksManagementPage /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  User,
  Building2,
  Briefcase,
  Mail,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  GraduationCap,
  Shield,
  Activity,
  ArrowRight,
  TrendingUp,
  UserCheck,
  TrendingDown,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeopleAISignalBadge } from "./PeopleAISignalBadge";
import { useGetEmployee360IntelligenceQuery } from "@/services/api/peopleAiApi";
import type { Employee } from "@/types/hr";
import { toast } from "sonner";

interface Employee360DrawerProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  allEmployees?: Employee[];
  onTriggerAction?: (actionType: string, emp: Employee) => void;
}

export const Employee360Drawer: React.FC<Employee360DrawerProps> = ({
  open,
  onClose,
  employee,
  allEmployees = [],
  onTriggerAction,
}) => {
  const { data: intel, isLoading } = useGetEmployee360IntelligenceQuery(
      { employeeId: employee?.id || "", employees: allEmployees },
    { skip: !employee?.id }
  );

    if (!open || !employee) return null;

  const displayName = employee.name || "Employee";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAction = (actionLabel: string) => {
    toast.success(`Action "${actionLabel}" initiated for ${displayName}`);
    if (onTriggerAction) {
      onTriggerAction(actionLabel, employee);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-background/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="w-full max-w-2xl bg-card border-l border-border/60 shadow-2xl h-full flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-border/50 bg-secondary/20 flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0 shadow-xs">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-foreground tracking-tight">
                    {displayName}
                  </h2>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-semibold">
                    Employee 360 AI
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-muted-foreground" />
                    {employee.role || employee.designation || "Specialist"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {employee.department || "General"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    {employee.email || "No email"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
            <div className="px-5 border-b border-border/40 bg-secondary/10 shrink-0">
              <TabsList className="bg-transparent h-9 p-0 gap-4">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-xs font-semibold px-1 pb-2 pt-1.5"
                >
                  AI Overview & Signals
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-xs font-semibold px-1 pb-2 pt-1.5"
                >
                  Detected Insights ({intel?.insights.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="telemetry"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-xs font-semibold px-1 pb-2 pt-1.5"
                >
                  Workload & Goals
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-xs font-semibold px-1 pb-2 pt-1.5"
                >
                  AI Timeline
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-5">
              {/* TAB 1: OVERVIEW */}
              <TabsContent value="overview" className="m-0 space-y-5">
                {/* AI Summary Banner */}
                <div className="glass-card rounded-xl p-4 border border-primary/20 bg-primary/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
                      AI Executive Summary
                    </h4>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {intel?.aiSummary || `${displayName} is currently active in the ${employee.department || "General"} department. All operational metrics are being continuously monitored.`}
                  </p>
                </div>

                {/* 7 AI Signals Grid */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>7-Dimensional AI Signals</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Confidence: 94%</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {intel?.signals ? (
                      <>
                        <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Performance Signal</span>
                            <PeopleAISignalBadge status={intel.signals.performance.status} metric={intel.signals.performance.metricValue} />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{intel.signals.performance.headline}</p>
                        </div>

                        <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Engagement Signal</span>
                            <PeopleAISignalBadge status={intel.signals.engagement.status} />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{intel.signals.engagement.headline}</p>
                        </div>

                        <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Workload Signal</span>
                            <PeopleAISignalBadge status={intel.signals.workload.status} metric={intel.signals.workload.metricValue} />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{intel.signals.workload.headline}</p>
                        </div>

                        <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Attendance Signal</span>
                            <PeopleAISignalBadge status={intel.signals.attendance.status} metric={intel.signals.attendance.metricValue} />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{intel.signals.attendance.headline}</p>
                        </div>

                        <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Skill Signal</span>
                            <PeopleAISignalBadge status={intel.signals.skill.status} />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{intel.signals.skill.headline}</p>
                        </div>

                        <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Growth & Trajectory</span>
                            <PeopleAISignalBadge status={intel.signals.growth.status} />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{intel.signals.growth.headline}</p>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 text-center py-6 text-xs text-muted-foreground">
                        Loading multidimensional telemetry...
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Strengths & Growth Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl glass-card border border-border/60 bg-emerald-500/5 space-y-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                    </span>
                    <ul className="text-xs space-y-1.5 text-foreground/90">
                      {intel?.keyStrengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl glass-card border border-border/60 bg-blue-500/5 space-y-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Development Areas
                    </span>
                    <ul className="text-xs space-y-1.5 text-foreground/90">
                      {intel?.developmentAreas.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: DETECTED INSIGHTS */}
              <TabsContent value="insights" className="m-0 space-y-4">
                {intel?.insights && intel.insights.length > 0 ? (
                  intel.insights.map((ins) => (
                    <div
                      key={ins.id}
                      className="glass-card rounded-xl p-4 border border-border/70 bg-card space-y-3 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/30 mb-1">
                            {ins.category}
                          </Badge>
                          <h4 className="font-bold text-xs text-foreground">{ins.whatHappened}</h4>
                        </div>
                        <Badge className="text-[10px] font-mono bg-secondary text-foreground">
                          Confidence: {ins.confidence}
                        </Badge>
                      </div>

                      <div className="p-2.5 rounded-lg bg-secondary/40 text-[11px] text-muted-foreground space-y-1">
                        <span className="font-semibold text-foreground">Why It Matters:</span>
                        <p>{ins.whyItMatters}</p>
                      </div>

                      {ins.supportingData.length > 0 && (
                        <div className="space-y-1 text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground">Supporting Evidence:</span>
                          {ins.supportingData.map((d, idx) => (
                            <p key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> {d}
                            </p>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-primary">
                          Recommended Action: {ins.recommendedAction}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleAction(ins.recommendedAction)}
                          className="h-7 text-xs px-2.5 gradient-bg text-primary-foreground font-semibold gap-1 shrink-0"
                        >
                          <span>Execute Action</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-2 glass-card rounded-xl border border-border/50">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="font-bold text-xs text-foreground">Zero Critical Anomalies</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                      All delivery signals and lifecycle milestones are operating within nominal thresholds.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* TAB 3: WORKLOAD & GOALS */}
              <TabsContent value="telemetry" className="m-0 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                    <span className="text-[11px] text-muted-foreground">Weekly Workload</span>
                    <p className="text-base font-bold font-mono text-foreground">
                      {intel?.workloadTelemetry.currentWeeklyHours || 40} hrs
                    </p>
                    <span className="text-[10px] text-emerald-500 font-semibold">Optimal Bandwidth</span>
                  </div>

                  <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                    <span className="text-[11px] text-muted-foreground">Performance Index</span>
                    <p className="text-base font-bold font-mono text-primary">
                      {intel?.performanceTelemetry.score || 82}%
                    </p>
                    <span className="text-[10px] text-muted-foreground">Stable Trajectory</span>
                  </div>

                  <div className="p-3 rounded-xl glass-card border border-border/60 space-y-1">
                    <span className="text-[11px] text-muted-foreground">Active Goals</span>
                    <p className="text-base font-bold font-mono text-foreground">
                      {intel?.performanceTelemetry.activeGoalsCount || 3} Goals
                    </p>
                    <span className="text-[10px] text-muted-foreground">Q3 Milestone Cycle</span>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="p-4 rounded-xl glass-card border border-border/60 space-y-2.5">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Verified Skill Taxonomy</span>
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {intel?.skills && intel.skills.length > 0 ? (
                      intel.skills.map((sk, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-medium bg-secondary/80 gap-1.5">
                          <span>{sk.name}</span>
                          <span className="text-[10px] text-primary font-bold">({sk.level})</span>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No skills tagged in primary directory.</span>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: TIMELINE */}
              <TabsContent value="timeline" className="m-0 space-y-3">
                <div className="relative pl-6 border-l-2 border-primary/20 space-y-4 py-1">
                  {intel?.timeline && intel.timeline.length > 0 ? (
                    intel.timeline.map((evt) => (
                      <div key={evt.id} className="relative group">
                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                        <div className="glass-card rounded-xl p-3 border border-border/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">{evt.title}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{evt.date}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{evt.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No timeline events recorded yet.</p>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          {/* Quick Action Footer */}
          <div className="p-4 border-t border-border/50 bg-secondary/20 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Autonomous Operations:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("Assign Training")}
                className="text-xs h-8 px-2.5 font-medium border-border/60"
              >
                Assign Training
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("Schedule 1-on-1 Review")}
                className="text-xs h-8 px-2.5 font-medium border-border/60"
              >
                Schedule Review
              </Button>
              <Button
                size="sm"
                onClick={() => handleAction("Initiate Transfer / Mover Workflow")}
                className="text-xs h-8 px-3 gradient-bg text-primary-foreground font-semibold"
              >
                Mover / Transfer
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

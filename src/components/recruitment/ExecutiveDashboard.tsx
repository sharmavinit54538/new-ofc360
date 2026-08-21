import { motion } from "framer-motion";
import { Briefcase, Users, Calendar, Award, TrendingUp, Sparkles, Plus, Video, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useATSStore } from "@/stores/atsStore";

export function ExecutiveDashboard() {
  const store = useATSStore();
  const jobs = Array.isArray(store.jobs) ? store.jobs : [];
  const candidates = Array.isArray(store.candidates) ? store.candidates : [];
  const interviews = Array.isArray(store.interviews) ? store.interviews : [];
  const setActiveTab = store.setActiveTab;

  const totalActiveJobs = jobs.filter((j) => j?.status === "Published").length;
  const totalCandidates = candidates.length;
  const scheduledInterviews = interviews.filter((i) => i?.status === "Scheduled");
  const offerAccepted = candidates.filter((c) => c?.stage === "Offer Extended" || c?.stage === "Hired").length;

  const stageCounts = {
    Applied: candidates.filter((c) => c?.stage === "Applied").length,
    Screening: candidates.filter((c) => c?.stage === "Screening").length,
    "Tech Interview": candidates.filter((c) => c?.stage === "Tech Interview").length,
    "Culture Round": candidates.filter((c) => c?.stage === "Culture Round").length,
    "Offer Extended": candidates.filter((c) => c?.stage === "Offer Extended").length,
    Hired: candidates.filter((c) => c?.stage === "Hired").length,
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-hover rounded-xl p-5 border border-border/50"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Job Openings</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">{totalActiveJobs} Roles</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-500 flex items-center gap-1 mt-3">
            <TrendingUp className="w-3.5 h-3.5" /> +2 new positions this week
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card-hover rounded-xl p-5 border border-border/50"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Applicants</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">{totalCandidates} Candidates</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Avg. Match Score: <span className="text-primary font-semibold">92%</span></p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-hover rounded-xl p-5 border border-border/50"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Scheduled Today</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">{scheduledInterviews.length} Sessions</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-purple-400 mt-3">Google Meet links auto-generated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card-hover rounded-xl p-5 border border-border/50"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Offer Acceptance Rate</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">88.5%</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-500 mt-3">{offerAccepted} Active Offers Extended</p>
        </motion.div>
      </div>

      {/* Visual Pipeline Funnel & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Progress */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-border/50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base">Candidate Pipeline Distribution</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("kanban")} className="text-xs gap-1">
              View Kanban Board <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(stageCounts).map(([stage, count]) => {
              const percentage = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{stage}</span>
                    <span className="text-muted-foreground">
                      {count} candidates ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage > 5 ? percentage : 8} className="h-2.5" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Schedule Card */}
        <div className="glass-card rounded-xl p-6 border border-border/50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Upcoming Interviews
            </h3>
            <Badge variant="outline" className="text-xs">Live</Badge>
          </div>

          <div className="space-y-3 pt-1">
            {scheduledInterviews.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No interviews scheduled for today.</p>
            ) : (
              scheduledInterviews.map((int) => (
                <div key={int.id} className="p-3 rounded-lg bg-secondary/30 border border-border/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold">{int.candidateName}</h4>
                      <p className="text-xs text-muted-foreground">{int.jobTitle}</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
                      {int.stage}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-xs">
                    <span className="text-muted-foreground">14:00 PM (60 min)</span>
                    <a
                      href={int.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      <Video className="w-3 h-3" /> Join Call
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
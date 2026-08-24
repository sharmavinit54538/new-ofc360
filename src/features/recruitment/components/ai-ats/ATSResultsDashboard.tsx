import React from "react";
import { motion } from "framer-motion";
import { Layers, CheckCircle2, AlertOctagon, Save, Download, Sparkles, UserCheck, CheckCircle, Sparkles as SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ATSAnalysisResult } from "@/utils/atsScoringEngine";

interface ATSResultsDashboardProps {
  analysisResult: ATSAnalysisResult;
  onSaveToStore: () => void;
  onExportReport: (res: ATSAnalysisResult) => void;
}

export function ATSResultsDashboard({ analysisResult, onSaveToStore, onExportReport }: ATSResultsDashboardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* OVERALL SCORE & RECOMMENDATION BANNER */}
      <div className="glass-card rounded-3xl p-6 border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">
                ATS MATCH REPORT
              </Badge>
              <span className="text-xs text-muted-foreground">{analysisResult.analyzedAt}</span>
            </div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              {analysisResult.candidate.candidateName}
            </h2>
            <p className="text-xs text-muted-foreground">
              Target Role: <strong className="text-foreground">{analysisResult.jobTitle}</strong>
            </p>
          </div>

          {/* Circular Score Badge */}
          <div className="flex items-center gap-4 bg-card/80 p-4 rounded-2xl border border-border/60 shrink-0">
            <div className="text-center">
              <span className="text-xs text-muted-foreground uppercase font-bold text-[10px]">ATS Score</span>
              <p className="text-3xl font-extrabold font-mono gradient-text">{analysisResult.overallScore}/100</p>
            </div>
            <div className="h-10 w-px bg-border/60" />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Verdict</span>
              <div>
                <Badge className={
                  analysisResult.overallScore >= 85 ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-extrabold" : "bg-amber-500/15 text-amber-500 font-extrabold"
                }>
                  {analysisResult.recruiterRecommendation}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
          <Button size="sm" variant="outline" onClick={onSaveToStore} className="h-8 text-xs gap-1.5 border-border/60">
            <Save className="w-3.5 h-3.5" /> Save Analysis
          </Button>
          <Button size="sm" onClick={() => onExportReport(analysisResult)} className="h-8 text-xs gap-1.5 gradient-bg text-primary-foreground font-bold">
            <Download className="w-3.5 h-3.5" /> Export Report (.txt)
          </Button>
        </div>
      </div>

      {/* SCORE BREAKDOWN BARS */}
      <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-primary" /> Weighted ATS Compatibility Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Skills Match</span>
              <span className="font-mono text-emerald-500 font-bold">{analysisResult.scoreBreakdown.skillsMatchPct}%</span>
            </div>
            <Progress value={analysisResult.scoreBreakdown.skillsMatchPct} className="h-2" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Experience Relevance</span>
              <span className="font-mono text-emerald-500 font-bold">{analysisResult.scoreBreakdown.experienceMatchPct}%</span>
            </div>
            <Progress value={analysisResult.scoreBreakdown.experienceMatchPct} className="h-2" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Keyword Coverage</span>
              <span className="font-mono text-primary font-bold">{analysisResult.scoreBreakdown.keywordMatchPct}%</span>
            </div>
            <Progress value={analysisResult.scoreBreakdown.keywordMatchPct} className="h-2" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Education Alignment</span>
              <span className="font-mono text-emerald-500 font-bold">{analysisResult.scoreBreakdown.educationMatchPct}%</span>
            </div>
            <Progress value={analysisResult.scoreBreakdown.educationMatchPct} className="h-2" />
          </div>
        </div>
      </div>

      {/* MATCHED & MISSING SKILLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Skills */}
        <div className="glass-card rounded-3xl p-5 border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Matched Required Skills ({analysisResult.matchedSkills.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {analysisResult.matchedSkills.map((s) => (
              <Badge key={s} className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px]">
                {s}
              </Badge>
            ))}
            {analysisResult.matchedSkills.length === 0 && (
              <span className="text-xs text-muted-foreground">No matched skills data available.</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-card rounded-3xl p-5 border border-amber-500/30 bg-amber-500/5 space-y-3">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" /> Missing / Recommended Skills ({analysisResult.missingSkills.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {analysisResult.missingSkills.length === 0 ? (
              <span className="text-xs text-muted-foreground">Zero skill gaps detected!</span>
            ) : (
              analysisResult.missingSkills.map((s) => (
                <Badge key={s} variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px]">
                  {s}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RECRUITER VERDICT & RECOMMENDATIONS */}
      <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-primary" /> Recruiter Verdict & Optimization Suggestions
        </h3>
        <p className="text-xs text-foreground font-semibold leading-relaxed bg-secondary/30 p-3 rounded-xl border border-border/50">
          {analysisResult.recruiterSummary.verdict}
        </p>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Key Candidate Strengths</span>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {analysisResult.recruiterSummary.topStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">ATS Optimization Advice</span>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {analysisResult.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-foreground">
                <SparklesIcon className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
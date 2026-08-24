import React from "react";
import { Copy, Printer, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResumeATSReport } from "@/services/api/resumeAtsCheckerApi";

interface ScoreBannerProps {
  report: ResumeATSReport;
  onCopySummary: () => void;
  onPrint: () => void;
  onNewAnalysis: () => void;
  getScoreColor: (score: number) => string;
  getScoreBadge: (score: number) => { label: string; color: string };
}

export function ScoreBanner({
  report,
  onCopySummary,
  onPrint,
  onNewAnalysis,
  getScoreColor,
  getScoreBadge,
}: ScoreBannerProps) {
  return (
    <Card className="border-border/60 shadow-lg bg-card/90 overflow-hidden relative">
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-2xl border border-border/40 text-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                className="stroke-secondary fill-none"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                className={`fill-none transition-all duration-1000 ease-out ${getScoreColor(report.ats_score).split(" ")[1]}`}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - report.ats_score / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {report.ats_score}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                / 100 ATS Score
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <Badge variant="outline" className={`px-3 py-1 font-bold text-xs border ${getScoreBadge(report.ats_score).color}`}>
              {getScoreBadge(report.ats_score).label}
            </Badge>
            <p className="text-[11px] text-muted-foreground">
              {report.has_job_context ? "Evaluated with Job Context Match" : "Evaluated as General Resume Health"}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {report.parsed_resume.name || "Candidate Resume"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {report.parsed_resume.current_designation ? `${report.parsed_resume.current_designation} • ` : ""}
                {report.parsed_resume.experience_years > 0 ? `${report.parsed_resume.experience_years} Years Experience` : "Fresher / Not Specified"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onCopySummary} className="h-8 text-xs gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copy Summary
              </Button>
              <Button variant="outline" size="sm" onClick={onPrint} className="h-8 text-xs gap-1.5">
                <Printer className="w-3.5 h-3.5" /> Print Report
              </Button>
              <Button variant="default" size="sm" onClick={onNewAnalysis} className="h-8 text-xs gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> New Analysis
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
              <p className="text-[11px] text-muted-foreground font-medium">Formatting Quality</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{report.formatting_score}%</p>
            </div>

            <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
              <p className="text-[11px] text-muted-foreground font-medium">Job Compatibility</p>
              <p className="text-lg font-bold text-foreground mt-0.5">
                {report.job_match_score !== null ? `${report.job_match_score}%` : "N/A (No JD)"}
              </p>
            </div>

            <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
              <p className="text-[11px] text-muted-foreground font-medium">Skills Extracted</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{(report.parsed_resume?.skills || []).length}</p>
            </div>

            <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
              <p className="text-[11px] text-muted-foreground font-medium">Issues Detected</p>
              <p className={`text-lg font-bold mt-0.5 ${(report.issues || []).length > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {(report.issues || []).length}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            <span>File: <strong className="text-foreground font-medium">{report.meta?.file_name || "Document"}</strong></span>
            <span>Size: <strong className="text-foreground font-medium">{((report.meta?.file_size_bytes || 0) / 1024).toFixed(1)} KB</strong></span>
            <span>Text Length: <strong className="text-foreground font-medium">{report.meta?.char_count || 0} chars</strong></span>
            <span>Engine: <strong className="text-foreground font-medium">{report.meta?.ocr_engine_used || "FastAPI OCR"}</strong></span>
          </div>
        </div>
      </div>
    </Card>
  );
}
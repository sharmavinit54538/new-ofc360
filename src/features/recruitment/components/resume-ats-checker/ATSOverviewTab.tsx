import React from "react";
import { Sliders, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResumeATSReport } from "@/services/api/resumeAtsCheckerApi";

interface ATSOverviewTabProps {
  report: ResumeATSReport;
}

export function ATSOverviewTab({ report }: ATSOverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              ATS Category Contribution Breakdown
            </CardTitle>
            <CardDescription>
              How each resume pillar contributed to your overall weighted ATS score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Technical & Soft Skills Match", key: "skills", score: report.category_scores?.skills || 0, weight: "35%" },
              { label: "Experience Relevance & Timeline", key: "experience", score: report.category_scores?.experience || 0, weight: "20%" },
              { label: "NLP Keyword & Context Alignment", key: "keywords", score: report.category_scores?.keywords || 0, weight: "15%" },
              { label: "Education & Degree Verification", key: "education", score: report.category_scores?.education || 0, weight: "10%" },
              { label: "Projects & Technical Portfolio", key: "projects", score: report.category_scores?.projects || 0, weight: "10%" },
              { label: "Industry Certifications", key: "certifications", score: report.category_scores?.certifications || 0, weight: "5%" },
              { label: "Formatting & Document Integrity", key: "resume_quality", score: report.category_scores?.resume_quality || 0, weight: "5%" },
            ].map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    {item.label}
                    <span className="text-[10px] text-muted-foreground font-normal">({item.weight} weight)</span>
                  </span>
                  <span className="font-bold text-foreground">{item.score}/100</span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Actionable Recommendations
            </CardTitle>
            <CardDescription>
              Prioritized steps to boost your ATS compatibility score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.isArray(report.recommendations) && report.recommendations.length > 0 ? (
              report.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl border border-border/30 text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {index + 1}
                  </div>
                  <span className="text-foreground leading-relaxed font-medium">{rec}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground bg-secondary/20 rounded-xl">
                No major gaps detected! Your resume matches standard ATS criteria smoothly.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
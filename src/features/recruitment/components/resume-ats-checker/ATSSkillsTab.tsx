import React from "react";
import { CheckCircle2, XCircle, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeATSReport } from "@/services/api/resumeAtsCheckerApi";

interface ATSSkillsTabProps {
  report: ResumeATSReport;
}

export function ATSSkillsTab({ report }: ATSSkillsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Matched Skills ({(report.matched_skills || []).length})
            </CardTitle>
            <CardDescription className="text-xs">
              Skills found in both resume and target criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(report.matched_skills) && report.matched_skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {report.matched_skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs py-1 px-2.5 font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No direct job match skills found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-rose-500/30 bg-rose-500/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Missing Skills ({(report.missing_skills || []).length})
            </CardTitle>
            <CardDescription className="text-xs">
              Required by JD but absent in your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(report.missing_skills) && report.missing_skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {report.missing_skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 text-xs py-1 px-2.5 font-medium"
                  >
                    <XCircle className="w-3 h-3 mr-1" /> {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {report.has_job_context ? "Great! No missing required skills." : "Provide target job skills to detect gaps."}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Extra / Discovered Skills ({(report.extra_skills || []).length})
            </CardTitle>
            <CardDescription className="text-xs">
              Additional competencies extracted from your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(report.extra_skills) && report.extra_skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {report.extra_skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs py-1 px-2.5 font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No extra skills identified.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
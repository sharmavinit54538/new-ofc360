import React from "react";
import { FileText, GraduationCap, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeATSReport } from "@/services/api/resumeAtsCheckerApi";

interface ATSContentTabProps {
  report: ResumeATSReport;
}

export function ATSContentTab({ report }: ATSContentTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Structured Data Extracted From Your Resume
          </CardTitle>
          <CardDescription>
            Verify what the OCR & AI parser extracted to ensure high readability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-secondary/30 rounded-xl border border-border/40 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Header & Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Full Name</span>
                <strong className="text-foreground">{report.parsed_resume?.name || "Not Found"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Email Address</span>
                <strong className="text-foreground">{report.parsed_resume?.email || "Not Found"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Phone Number</span>
                <strong className="text-foreground">{report.parsed_resume?.phone || "Not Found"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Location</span>
                <strong className="text-foreground">{report.parsed_resume?.address || "Not Specified"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Current Designation</span>
                <strong className="text-foreground">{report.parsed_resume?.current_designation || "Not Specified"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Current Company</span>
                <strong className="text-foreground">{report.parsed_resume?.current_company || "Not Specified"}</strong>
              </div>
            </div>
          </div>

          {report.parsed_resume?.summary && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Professional Summary
              </h4>
              <p className="text-xs text-foreground bg-secondary/20 p-3.5 rounded-xl border border-border/30 leading-relaxed">
                {report.parsed_resume.summary}
              </p>
            </div>
          )}

          {Array.isArray(report.parsed_resume?.education) && report.parsed_resume.education.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-primary" /> Education History
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.parsed_resume.education.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-secondary/20 rounded-xl border border-border/30 text-xs space-y-1">
                    <p className="font-semibold text-foreground">{edu?.degree || edu?.field_of_study || "Degree"}</p>
                    <p className="text-muted-foreground">{edu?.university || edu?.college || "Institution"}</p>
                    {edu?.passing_year && <p className="text-[11px] text-muted-foreground">Year: {edu.passing_year}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(report.parsed_resume?.projects) && report.parsed_resume.projects.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary" /> Key Projects
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.parsed_resume.projects.map((proj, idx) => (
                  <div key={idx} className="p-3 bg-secondary/20 rounded-xl border border-border/30 text-xs space-y-1.5">
                    <p className="font-semibold text-foreground">{proj?.title}</p>
                    {proj?.description && <p className="text-muted-foreground leading-relaxed">{proj.description}</p>}
                    {Array.isArray(proj?.technologies) && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
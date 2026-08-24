import React from "react";
import { AlertCircle, FileSearch, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeATSReport } from "@/services/api/resumeAtsCheckerApi";

interface ATSQualityTabProps {
  report: ResumeATSReport;
}

export function ATSQualityTab({ report }: ATSQualityTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Detected Structural Issues ({(report.issues || []).length})
            </CardTitle>
            <CardDescription>
              Formatting or clarity anomalies identified by the document scanner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.isArray(report.issues) && report.issues.length > 0 ? (
              report.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium leading-relaxed">{issue}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                No structural or readability issues detected!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-rose-500" />
              Missing Standard Sections ({(report.missing_fields || []).length})
            </CardTitle>
            <CardDescription>
              Core resume sections expected by enterprise ATS parsers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.isArray(report.missing_fields) && report.missing_fields.length > 0 ? (
              report.missing_fields.map((field, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs"
                >
                  <span className="font-semibold text-rose-700 dark:text-rose-300 capitalize">
                    Missing Section: {field}
                  </span>
                  <Badge variant="outline" className="bg-rose-500/15 text-rose-600 border-rose-500/30 text-[10px]">
                    Action Required
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                All standard sections (Email, Phone, Skills, Education) are present.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
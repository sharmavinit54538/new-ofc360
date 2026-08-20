import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  frequency: string;
  size: string;
}

export default function ExecutiveReportsPage() {
  const reports: ReportTemplate[] = [
    {
      id: "rep-1",
      title: "Organization KPI & Headcount Summary Report",
      category: "Workforce Analytics",
      frequency: "Monthly",
      size: "1.4 MB",
    },
    {
      id: "rep-2",
      title: "Executive Compensation & Payroll Budget Audit",
      category: "Finance & Payroll",
      frequency: "Quarterly",
      size: "2.8 MB",
    },
    {
      id: "rep-3",
      title: "Departmental Performance & Outcome Matrix",
      category: "Performance OKRs",
      frequency: "Quarterly",
      size: "950 KB",
    },
    {
      id: "rep-4",
      title: "Retention, Attrition & Exit Risk Intelligence",
      category: "Talent Retention",
      frequency: "Monthly",
      size: "1.1 MB",
    },
    {
      id: "rep-5",
      title: "Employee Morale & Engagement Pulse Summary",
      category: "Culture & EX",
      frequency: "Bi-Weekly",
      size: "820 KB",
    },
  ];

  const handleExportCSV = (title: string) => {
    const textData = `EXECUTIVE REPORT STATEMENT\n=========================\nReport Title: ${title}\nGenerated Date: ${new Date().toLocaleDateString()}\nStatus: Verified Executive Confidential\n=========================\nOFC360 Enterprise Governance`;
    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}_Export.txt`;
    link.click();
    toast.success(`Exported report: "${title}" as CSV/Text`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span>Executive Organization Reports & Exports</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Download executive-ready KPI summaries, compensation reports, and organizational outcome matrices.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Authorized Executive Reports Repository</h3>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl border border-border/60 bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{rep.title}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    {rep.category} · {rep.frequency} · {rep.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px]">
                  Verified
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExportCSV(rep.title)}
                  className="h-8 text-xs gap-1.5 border-border/70 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Export Data
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
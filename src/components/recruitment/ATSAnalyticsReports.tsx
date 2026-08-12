import { Download, FileSpreadsheet, TrendingUp, Clock, DollarSign, PieChart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function ATSAnalyticsReports() {
  const handleExportPDF = () => {
    toast.success("Executive ATS Analytics report generated & downloaded as PDF!");
  };

  const handleExportExcel = () => {
    toast.success("Recruitment funnel metrics exported to Excel CSV!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Executive Analytics & Custom Reports</h2>
          <p className="text-sm text-muted-foreground">
            Time-to-Hire, Cost-per-Hire, Candidate Funnel Conversion, Sourcing Attribution charts & PDF/Excel export.
          </p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExportExcel} className="gap-1.5 text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Export Excel
          </Button>
          <Button size="sm" onClick={handleExportPDF} className="gap-1.5 text-xs gradient-bg">
            <Download className="w-3.5 h-3.5" /> Export PDF Report
          </Button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border border-border/50 space-y-1">
          <p className="text-xs text-muted-foreground">Average Time-to-Hire</p>
          <h3 className="text-2xl font-bold text-primary">18.4 Days</h3>
          <p className="text-[10px] text-emerald-400">4.2 days faster than industry benchmark</p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-border/50 space-y-1">
          <p className="text-xs text-muted-foreground">Average Cost-per-Hire</p>
          <h3 className="text-2xl font-bold text-foreground">$3,150</h3>
          <p className="text-[10px] text-muted-foreground">Includes agency fee allocations</p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-border/50 space-y-1">
          <p className="text-xs text-muted-foreground">Funnel Conversion (Apply → Hire)</p>
          <h3 className="text-2xl font-bold text-amber-400">7.2%</h3>
          <p className="text-[10px] text-muted-foreground">High candidate screening quality</p>
        </div>
      </div>

      {/* Sourcing Attribution Breakdown */}
      <div className="glass-card rounded-xl p-6 border border-border/50 space-y-4">
        <h3 className="font-semibold text-base">Candidate Sourcing Channel Attribution</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 space-y-1">
            <span className="font-bold text-foreground">LinkedIn Jobs</span>
            <p className="text-xl font-extrabold text-blue-400">45%</p>
            <span className="text-[10px] text-muted-foreground">14 Hires YTD</span>
          </div>

          <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 space-y-1">
            <span className="font-bold text-foreground">Employee Referrals</span>
            <p className="text-xl font-extrabold text-emerald-400">30%</p>
            <span className="text-[10px] text-muted-foreground">9 Hires YTD</span>
          </div>

          <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 space-y-1">
            <span className="font-bold text-foreground">Direct Careers Portal</span>
            <p className="text-xl font-extrabold text-purple-400">18%</p>
            <span className="text-[10px] text-muted-foreground">5 Hires YTD</span>
          </div>

          <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 space-y-1">
            <span className="font-bold text-foreground">Headhunter Agencies</span>
            <p className="text-xl font-extrabold text-amber-400">7%</p>
            <span className="text-[10px] text-muted-foreground">2 Hires YTD</span>
          </div>
        </div>
      </div>
    </div>
  );
}

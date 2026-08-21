import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttendanceStats } from "../AttendanceStats";
import type { AttendanceKPIStats } from "../../types/attendance.types";

interface AnalyticsTabProps {
  stats: AttendanceKPIStats;
  isExporting: boolean;
  onExportMusterRoll: () => void;
}

export function AnalyticsTab({
  stats,
  isExporting,
  onExportMusterRoll,
}: AnalyticsTabProps) {
  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Attendance Analytics & Monthly Muster Roll
          </h2>
          <p className="text-xs text-muted-foreground">
            Compliance audit logs and automated payroll export.
          </p>
        </div>
        <Button
          onClick={onExportMusterRoll}
          disabled={isExporting}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-sm"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isExporting ? "Generating Report..." : "Download Muster Roll (.csv)"}</span>
        </Button>
      </div>

      <AttendanceStats variant="analytics" stats={stats} />
    </motion.div>
  );
}

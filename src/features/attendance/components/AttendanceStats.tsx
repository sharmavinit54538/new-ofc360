import { Loader2 } from "lucide-react";
import type { AttendanceKPIStats } from "../types/attendance.types";

interface AttendanceStatsProps {
  variant: "overview" | "analytics";
  stats: AttendanceKPIStats;
  isAnalyticsLoading?: boolean;
  isLeavesLoading?: boolean;
}

export function AttendanceStats({
  variant,
  stats,
  isAnalyticsLoading = false,
  isLeavesLoading = false,
}: AttendanceStatsProps) {
  if (variant === "overview") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <span className="text-[11px] text-muted-foreground">Total Staff</span>
          <p className="text-xl font-bold font-mono text-foreground mt-1">
            {isAnalyticsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary mt-1" />
            ) : (
              stats.totalEmployeesCount
            )}
          </p>
          <span className="text-[10px] text-muted-foreground">Registered</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <span className="text-[11px] text-muted-foreground">Present Today</span>
          <p className="text-xl font-bold font-mono text-emerald-500 mt-1">
            {isAnalyticsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500 mt-1" />
            ) : (
              stats.presentTodayCount
            )}
          </p>
          <span className="text-[10px] text-emerald-500">Live active</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <span className="text-[11px] text-muted-foreground">Late Arrivals</span>
          <p className="text-xl font-bold font-mono text-amber-500 mt-1">
            {isAnalyticsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-500 mt-1" />
            ) : (
              stats.lateArrivalsCount
            )}
          </p>
          <span className="text-[10px] text-amber-500">15m+ Grace</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <span className="text-[11px] text-muted-foreground">On Leave</span>
          <p className="text-xl font-bold font-mono text-blue-500 mt-1">
            {isLeavesLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-500 mt-1" />
            ) : (
              stats.onLeaveCount
            )}
          </p>
          <span className="text-[10px] text-blue-500">Approved</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <span className="text-[11px] text-muted-foreground">Work From Home</span>
          <p className="text-xl font-bold font-mono text-purple-500 mt-1">{stats.remoteCount}</p>
          <span className="text-[10px] text-purple-500">Remote</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <span className="text-[11px] text-muted-foreground">Overtime Staff</span>
          <p className="text-xl font-bold font-mono text-primary mt-1">{stats.pendingOvertimeCount}</p>
          <span className="text-[10px] text-primary">Pending OT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
        <span className="text-xs text-muted-foreground">On-Time Arrival Rate</span>
        <p className="text-3xl font-extrabold font-mono text-emerald-500">
          {stats.attendanceRate}
        </p>
        <span className="text-[11px] text-muted-foreground">Average arrival: 09:12 AM</span>
      </div>

      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
        <span className="text-xs text-muted-foreground">Avg Working Hours</span>
        <p className="text-3xl font-extrabold font-mono text-primary">{stats.averageWorkingHours}</p>
        <span className="text-[11px] text-muted-foreground">Complies with statutory guidelines</span>
      </div>

      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
        <span className="text-xs text-muted-foreground">Absenteeism Rate</span>
        <p className="text-3xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
          {stats.absenteeismRate}
        </p>
        <span className="text-[11px] text-emerald-500 font-semibold">Low Risk</span>
      </div>
    </div>
  );
}

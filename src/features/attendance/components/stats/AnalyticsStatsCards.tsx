import { TrendingUp, UserX, Clock, Award } from "lucide-react";
import { StatCardItem } from "./StatCardItem";
import type { AttendanceKPIStats } from "../../types/attendance.types";

export function AnalyticsStatsCards({ stats }: { stats: AttendanceKPIStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCardItem title="Attendance Rate" value={stats.attendanceRate} subtitle="Month-to-date compliance" icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-500/10" />
      <StatCardItem title="Absenteeism Rate" value={stats.absenteeismRate} subtitle="Unplanned leaves" icon={UserX} color="text-rose-500" bg="bg-rose-500/10" />
      <StatCardItem title="Avg Work Hours" value={stats.averageWorkingHours} subtitle="Daily productive time" icon={Clock} color="text-indigo-500" bg="bg-indigo-500/10" />
      <StatCardItem title="Pending OT" value={stats.pendingOvertimeCount} subtitle="Awaiting manager review" icon={Award} color="text-amber-500" bg="bg-amber-500/10" />
    </div>
  );
}

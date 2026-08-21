import { Users, CheckCircle2, Clock, CalendarOff } from "lucide-react";
import { StatCardItem } from "./StatCardItem";
import type { AttendanceKPIStats } from "../../types/attendance.types";

export function OverviewStatsCards({ stats }: { stats: AttendanceKPIStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCardItem title="Present Today" value={stats.presentTodayCount} subtitle="Active on site & remote" icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-500/10" />
      <StatCardItem title="Late Arrivals" value={stats.lateArrivalsCount} subtitle="Beyond grace window" icon={Clock} color="text-amber-500" bg="bg-amber-500/10" />
      <StatCardItem title="On Leave" value={stats.onLeaveCount} subtitle="Approved time off" icon={CalendarOff} color="text-blue-500" bg="bg-blue-500/10" />
      <StatCardItem title="Total Headcount" value={stats.totalEmployeesCount} subtitle="Active staff directory" icon={Users} color="text-purple-500" bg="bg-purple-500/10" />
    </div>
  );
}

import type { PunchRecord, DisplayedLeave, AttendanceKPIStats } from "../types/attendance.types";

interface KpiParams {
  analyticsData?: { totalEmployees?: number; presentToday?: number; lateEmployees?: number; absentToday?: number; attendanceRate?: number };
  employeesCount: number; liveList: PunchRecord[]; leaves: DisplayedLeave[]; pendingOvertimeCount: number;
}

export function useAttendanceKpiStats({ analyticsData, employeesCount, liveList, leaves, pendingOvertimeCount }: KpiParams): AttendanceKPIStats {
  const total = analyticsData?.totalEmployees || employeesCount || 0;
  const present = analyticsData?.presentToday ?? liveList.filter((p) => p.type === "Check-In" || p.status === "Present").length;
  const late = analyticsData?.lateEmployees ?? liveList.filter((p) => p.status === "Late").length;
  const onLeave = leaves.filter((l) => l.status.toLowerCase() === "approved").length;

  return {
    totalEmployeesCount: total, presentTodayCount: present, lateArrivalsCount: late, onLeaveCount: onLeave,
    remoteCount: 0, pendingOvertimeCount,
    attendanceRate: analyticsData?.attendanceRate ? `${analyticsData.attendanceRate}%` : "97.4%",
    absenteeismRate: analyticsData?.absentToday && total > 0 ? `${((analyticsData.absentToday / total) * 100).toFixed(1)}%` : "1.8%",
    averageWorkingHours: "8.4 hrs/day",
  };
}

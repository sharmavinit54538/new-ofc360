import { Users, UserCheck, LogIn, LogOut, Flame, TrendingUp } from "lucide-react";

export function AnalyticsKpiCards({ analyticsData }: { analyticsData: any }) {
  const rate = analyticsData?.attendanceRate ? `${analyticsData.attendanceRate}%` : (analyticsData?.totalEmployees ? `${Math.round(((analyticsData?.presentToday || 0) / analyticsData.totalEmployees) * 100)}%` : "0%");
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1"><span className="text-xs text-muted-foreground flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /> Total Staff</span><p className="text-xl font-bold text-foreground">{analyticsData?.totalEmployees ?? 0}</p></div>
      <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1"><span className="text-xs text-muted-foreground flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Present Today</span><p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{analyticsData?.presentToday ?? 0}</p></div>
      <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1"><span className="text-xs text-muted-foreground flex items-center gap-1.5"><LogIn className="w-3.5 h-3.5 text-teal-500" /> On Floor (In)</span><p className="text-xl font-bold text-foreground">{analyticsData?.checkedIn ?? 0}</p></div>
      <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1"><span className="text-xs text-muted-foreground flex items-center gap-1.5"><LogOut className="w-3.5 h-3.5 text-blue-500" /> Completed (Out)</span><p className="text-xl font-bold text-foreground">{analyticsData?.checkedOut ?? 0}</p></div>
      <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1"><span className="text-xs text-muted-foreground flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-500" /> Late Arrivals</span><p className="text-xl font-bold text-amber-600 dark:text-amber-400">{analyticsData?.lateEmployees ?? 0}</p></div>
      <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1"><span className="text-xs text-muted-foreground flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Attendance Rate</span><p className="text-xl font-bold text-primary">{rate}</p></div>
    </div>
  );
}

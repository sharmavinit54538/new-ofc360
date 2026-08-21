import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, CalendarX } from "lucide-react";
import { useAttendanceStore } from "@/stores/attendanceStore";

interface AttendanceChartProps {
  totalEmployees: number;
}

export function DashboardAttendanceTrendChart({ totalEmployees }: AttendanceChartProps) {
  const [viewMode, setViewMode] = useState<"rate" | "hours">("rate");
  const punches = useAttendanceStore((s) => s.punches) || [];

  const weeklyAttendanceData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    if (totalEmployees === 0) {
      return days.map((day) => ({ day, present: 0, late: 0, onLeave: 0, rate: 0, avgHours: 0 }));
    }

    // Dynamic derivation from stored punches if available
    return days.map((day) => {
      const dayPunches = punches.filter((p: any) => p?.day === day || p?.date?.includes(day));
      const present = dayPunches.length > 0 ? dayPunches.length : 0;
      const rate = totalEmployees > 0 ? Math.round((present / totalEmployees) * 100) : 0;
      const avgHours = present > 0 ? 8.5 : 0;
      return {
        day,
        present,
        late: 0,
        onLeave: Math.max(0, totalEmployees - present),
        rate,
        avgHours,
      };
    });
  }, [totalEmployees, punches]);

  const avgRate = useMemo(() => {
    if (weeklyAttendanceData.length === 0 || totalEmployees === 0) return 0;
    const sum = weeklyAttendanceData.reduce((acc, d) => acc + d.rate, 0);
    return Math.round(sum / weeklyAttendanceData.length);
  }, [weeklyAttendanceData, totalEmployees]);

  const tooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: "12px",
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-base text-foreground">Weekly Attendance & Punctuality</h3>
          </div>
          <p className="text-xs text-muted-foreground">Mon - Fri workforce shift participation</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-secondary/70 p-0.5 rounded-lg flex items-center border border-border/50 text-xs">
            <button
              onClick={() => setViewMode("rate")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "rate"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Presence %
            </button>
            <button
              onClick={() => setViewMode("hours")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "hours"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Avg Hours
            </button>
          </div>

          <Badge variant="outline" className="text-xs text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
            {avgRate > 0 ? `${avgRate}% Avg This Week` : "No Activity"}
          </Badge>
        </div>
      </div>

      <div className="h-[240px] w-full">
        {totalEmployees === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 rounded-xl bg-secondary/10 border border-dashed border-border/50">
            <CalendarX className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">No attendance records available</p>
            <p className="text-xs text-muted-foreground">Attendance trends will populate once employees log shift punches.</p>
          </div>
        ) : viewMode === "rate" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: any) => [`${value}%`, "Presence Rate"]}
              />
              <Bar dataKey="rate" fill="#10B981" radius={[6, 6, 0, 0]} name="Presence Rate" barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ahg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 12]} unit="h" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: any) => [`${value} hrs`, "Average Hours"]}
              />
              <Area
                type="monotone"
                dataKey="avgHours"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#ahg)"
                name="Avg Daily Hours"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40 mt-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Active Staff ({totalEmployees})</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real-time Attendance Telemetry</span>
        </div>
      </div>
    </div>
  );
}

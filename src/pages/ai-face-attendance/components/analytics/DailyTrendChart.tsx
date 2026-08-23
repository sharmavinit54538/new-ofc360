import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function DailyTrendChart({ data }: { data: any[] }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border/60 space-y-3">
      <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold text-foreground">7-Day Attendance Trend</h3><p className="text-xs text-muted-foreground">Daily present vs absent pattern</p></div><Badge variant="outline" className="text-[10px]">Real-time Telemetry</Badge></div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs><linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} /><stop offset="95%" stopColor="#0d9488" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="present" stroke="#0d9488" fillOpacity={1} fill="url(#colorPresent)" name="Present" /><Area type="monotone" dataKey="absent" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Absent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
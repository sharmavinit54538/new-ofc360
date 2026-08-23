import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function DepartmentStatsChart({ data }: { data: any[] }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border/60 space-y-3">
      <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold text-foreground">Department Attendance Rates (%)</h3><p className="text-xs text-muted-foreground">Attendance performance across teams</p></div><Badge variant="outline" className="text-[10px]">Department Breakdown</Badge></div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} /><XAxis dataKey="department" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="rate" fill="#0d9488" radius={[4, 4, 0, 0]} name="Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

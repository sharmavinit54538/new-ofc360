import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { chartStyle } from "../../../constants/chartConstants";

export function WorkforceDeptChart({ data }: { data: any[] }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground">Department Allocation Chart</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
            {data.map((d) => (<Cell key={d.name} fill={d.color} />))}
          </Pie>
          <Tooltip contentStyle={chartStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

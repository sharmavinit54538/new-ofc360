import { motion } from "framer-motion";
import { TrendingDown, Users, DollarSign, Brain } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

const attr = [
  { m: "Jan", risk: 8 }, { m: "Feb", risk: 11 }, { m: "Mar", risk: 9 },
  { m: "Apr", risk: 14 }, { m: "May", risk: 18 }, { m: "Jun", risk: 22 },
  { m: "Jul", risk: 19 }, { m: "Aug", risk: 25 },
];
const forecast = [
  { q: "Q1", actual: 1100, predicted: 1100 },
  { q: "Q2", actual: 1180, predicted: 1190 },
  { q: "Q3", actual: 1248, predicted: 1260 },
  { q: "Q4", actual: null, predicted: 1340 },
  { q: "Q1+1", actual: null, predicted: 1410 },
];
const salary = [
  { role: "Engineer", current: 120, predicted: 138 },
  { role: "Designer", current: 95, predicted: 108 },
  { role: "PM", current: 130, predicted: 145 },
  { role: "Sales", current: 88, predicted: 102 },
  { role: "Data", current: 125, predicted: 148 },
];

const flightRisk = [
  { name: "Aria Walker", role: "Sr. Engineer", risk: 87 },
  { name: "Jonas Park", role: "Designer", risk: 74 },
  { name: "Mei Tanaka", role: "PM", risk: 68 },
  { name: "Diego Romero", role: "Data Sci", risk: 61 },
];

export default function AIPredictivePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">AI Predictive Analytics</h1>
        <p className="page-subheader">Forecast attrition, headcount, hiring demand & compensation</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attrition Risk" value="12.4%" change="+2.1% vs Q2" changeType="down" icon={TrendingDown} />
        <StatCard title="Predicted Hires" value="62" change="Next quarter" changeType="up" icon={Users} />
        <StatCard title="Comp Inflation" value="7.8%" change="YoY" changeType="neutral" icon={DollarSign} />
        <StatCard title="Model Confidence" value="91%" change="Healthy" changeType="up" icon={Brain} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Attrition Risk Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={attr}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(0,72%,55%)" stopOpacity={0.4} /><stop offset="95%" stopColor="hsl(0,72%,55%)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="risk" stroke="hsl(0,72%,55%)" fill="url(#rg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Workforce Forecast</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="q" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="actual" stroke="#6366F1" strokeWidth={2} />
              <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeDasharray="5 5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Salary Prediction by Role (k$)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salary}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="role" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="current" fill="#6366F1" radius={[4,4,0,0]} />
              <Bar dataKey="predicted" fill="#8B5CF6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Flight Risk Watchlist</h3>
          <div className="space-y-4">
            {flightRisk.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1">
                  <div><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.role}</p></div>
                  <span className="text-destructive font-mono text-xs">{p.risk}%</span>
                </div>
                <Progress value={p.risk} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
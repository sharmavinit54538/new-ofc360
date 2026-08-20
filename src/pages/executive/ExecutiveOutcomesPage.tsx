import { motion } from "framer-motion";
import { Award, TrendingUp, Target, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OutcomeItem {
  metric: string;
  category: string;
  current: string;
  previous: string;
  change: string;
  target: string;
  progress: number;
}

export default function ExecutiveOutcomesPage() {
  const outcomes: OutcomeItem[] = [
    {
      metric: "Workforce Output & Productivity",
      category: "Operations",
      current: "94.0%",
      previous: "91.2%",
      change: "+2.8%",
      target: "95.0%",
      progress: 94,
    },
    {
      metric: "Key Talent Retention Stability",
      category: "Retention",
      current: "95.8%",
      previous: "93.5%",
      change: "+2.3%",
      target: "95.0%",
      progress: 100,
    },
    {
      metric: "Critical Requisition Hiring Time",
      category: "Recruitment",
      current: "14 Days",
      previous: "18 Days",
      change: "-4 Days",
      target: "15 Days",
      progress: 92,
    },
    {
      metric: "Departmental Goal Fulfillment",
      category: "Performance",
      current: "91.2%",
      previous: "88.0%",
      change: "+3.2%",
      target: "90.0%",
      progress: 100,
    },
    {
      metric: "Employee Morale & Engagement Score",
      category: "Culture",
      current: "8.8 / 10",
      previous: "8.2 / 10",
      change: "+0.6",
      target: "8.5 / 10",
      progress: 98,
    },
    {
      metric: "Compensation Budget Variance",
      category: "Finance",
      current: "$450,000",
      previous: "$465,000",
      change: "-3.2%",
      target: "$460,000",
      progress: 96,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <span>Strategic Business Outcomes & Deliverables</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tracking organizational outcomes against target benchmarks, previous period comparison, and progress metrics.
        </p>
      </div>

      {/* Outcomes Grid */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Strategic Outcome Tracking Dashboard</h3>

        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-bold">Strategic Metric</TableHead>
                <TableHead className="text-xs font-bold">Category</TableHead>
                <TableHead className="text-xs font-bold">Current Period</TableHead>
                <TableHead className="text-xs font-bold">Previous Period</TableHead>
                <TableHead className="text-xs font-bold">Change</TableHead>
                <TableHead className="text-xs font-bold">Target vs Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outcomes.map((item) => (
                <TableRow key={item.metric}>
                  <TableCell className="font-bold text-xs text-foreground">{item.metric}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-xs font-mono font-bold text-foreground">{item.current}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{item.previous}</TableCell>
                  <TableCell className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> {item.change}
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground">Target: {item.target}</span>
                        <span className="text-primary">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-1.5 bg-secondary" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
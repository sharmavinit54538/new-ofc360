import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, TrendingUp, ShieldCheck, Lightbulb, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExecutiveInsightsPage() {
  const insights = [
    {
      title: "Low Attrition Risk in Senior Technical Roles",
      category: "Retention Risk",
      level: "Low Risk",
      levelColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
      icon: ShieldCheck,
      description: "Senior Engineering and Product Lead turnover risk remains low at 2.1%. Competitive market compensation adjustment in Q1 has effectively stabilized key technical talent.",
    },
    {
      title: "Hiring Bottleneck in Senior Product Management",
      category: "Recruitment Demand",
      level: "Medium Risk",
      levelColor: "bg-amber-500/15 text-amber-500 border-amber-500/30",
      icon: AlertTriangle,
      description: "Senior Product Manager open requisition has reached 18 days in candidate pipeline. Executive recommendation: Expedite technical interview evaluation cycle.",
    },
    {
      title: "Workforce Productivity Peak in Engineering Division",
      category: "Performance Output",
      level: "Positive Signal",
      levelColor: "bg-primary/15 text-primary border-primary/30",
      icon: TrendingUp,
      description: "Engineering team achieved 96% OKR milestone completion for Q3. Sprint velocity increased by 14% following the adoption of AI Developer Copilot tools.",
    },
    {
      title: "Compensation & Allowance Budget Efficiency",
      category: "Cost Governance",
      level: "Optimized",
      levelColor: "bg-purple-500/15 text-purple-500 border-purple-500/30",
      icon: Lightbulb,
      description: "Monthly payroll expenditure is 3.2% under projected Q3 budget variance, saving $15,000 monthly due to optimized remote allowance rebalancing.",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>Strategic Executive AI Insights</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Executive summaries, attrition risks, hiring bottlenecks, and strategic organizational advisories.
        </p>
      </div>

      {/* Insights Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const IconComp = item.icon;
          return (
            <motion.div
              key={item.title}
              whileHover={{ y: -2 }}
              className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px] border-primary/20 text-primary font-semibold">
                    {item.category}
                  </Badge>
                  <Badge className={`text-[10px] font-bold ${item.levelColor}`}>
                    {item.level}
                  </Badge>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground leading-snug">{item.title}</h4>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

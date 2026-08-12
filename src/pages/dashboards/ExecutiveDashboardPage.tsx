import { useAuthStore } from "@/stores/authStore";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sparkles,
  PieChart,
  BarChart3,
  Heart,
  Globe,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Database,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

const executiveIntelligenceModules = [
  {
    title: "Performance Intelligence",
    desc: "Goal alignment, developmental trends, and appraisal dynamics.",
    icon: BarChart3,
    path: "/intelligence/performance",
  },
  {
    title: "Workforce Analytics",
    desc: "Org headcount split, departmental capacity, and tenure spread.",
    icon: PieChart,
    path: "/intelligence/workforce",
  },
  {
    title: "Engagement Intelligence",
    desc: "Employee satisfaction signals, pulse morale, and EX indicators.",
    icon: Heart,
    path: "/intelligence/engagement",
  },
  {
    title: "Culture Intelligence",
    desc: "Workplace sentiment, psychological safety, and core values.",
    icon: Globe,
    path: "/intelligence/culture",
  },
  {
    title: "Compliance Intelligence",
    desc: "Statutory filing readiness, labor policy gap analysis, and risks.",
    icon: ShieldCheck,
    path: "/intelligence/compliance",
  },
  {
    title: "Predictive Workforce",
    desc: "ML attrition signals, headcount forecast, and hiring demand.",
    icon: TrendingUp,
    path: "/intelligence/predictive",
  },
  {
    title: "AI Recommendations",
    desc: "Prescriptive executive advisory for workforce interventions.",
    icon: Lightbulb,
    path: "/intelligence/recommendations",
  },
];

export default function ExecutiveDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <RoleGuard allowedRoles={["cxo", "hr_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/50">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Scope & Strategy</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Executive Dashboard
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Welcome back, {user?.name || "Executive"}. Organization-level workforce health, business outcomes, and AI intelligence synthesis.
            </p>
          </div>
        </div>

        {/* Executive Strategic KPI Cards (Data Honest: '—' when empty) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Workforce Health Index</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">—</div>
              <p className="text-[11px] text-muted-foreground">Org telemetry pending</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <PieChart className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Retention Stability Rate</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">—</div>
              <p className="text-[11px] text-muted-foreground">Predictive ML model awaiting data</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Audit & Policy Compliance</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">—</div>
              <p className="text-[11px] text-muted-foreground">Statutory registers pending</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">AI Prescriptions Active</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">—</div>
              <p className="text-[11px] text-muted-foreground">Prescriptive engine ready</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Lightbulb className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        {/* Executive Banner Empty State */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-accent/5">
          <div className="space-y-2 max-w-3xl">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Executive Briefing Readiness
            </Badge>
            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              Executive insights will synthesize when organizational data pipelines are connected.
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              NexaHR Executive Intelligence provides high-level organizational oversight across retention, culture, compliance, and departmental performance. Explore intelligence modules below.
            </p>
          </div>
        </div>

        {/* Executive Intelligence Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Strategic Intelligence Hub
            </h3>
            <span className="text-xs text-muted-foreground">
              7 Executive Modules Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {executiveIntelligenceModules.map((mod) => (
              <motion.div
                key={mod.path}
                whileHover={{ y: -3 }}
                className="glass-card rounded-2xl p-6 border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <mod.icon className="w-5 h-5" />
                  </div>

                  <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                    {mod.title}
                  </h4>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/40 flex justify-end">
                  <Link to={mod.path}>
                    <Button size="sm" className="gradient-bg text-primary-foreground text-xs gap-1.5 rounded-lg">
                      <span>Explore Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

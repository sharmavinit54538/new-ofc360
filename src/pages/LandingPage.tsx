import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Users,
  Clock,
  DollarSign,
  Briefcase,
  TrendingUp,
  Heart,
  SlidersHorizontal,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  Shield,
  Activity,
  Layers,
  BarChart3,
  Bot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";
import { StatCard } from "@/components/StatCard";
import { SEOHead } from "@/components/seo/SEOHead";

export default function LandingPage() {
  const navigate = useNavigate();

  // Hero Dashboard Mockup Tab Switcher
  const [activeTab, setActiveTab] = useState<
    "overview" | "employees" | "attendance" | "payroll" | "recruitment" | "performance" | "ai"
  >("overview");

  // Product Value Cards Data
  const productValues = [
    {
      icon: Users,
      title: "Workforce Management",
      desc: "Centralize employee profiles, organizational charts, department structures, and lifecycle events in one dynamic directory.",
      href: "/features#people",
    },
    {
      icon: Clock,
      title: "Attendance & Leave",
      desc: "Real-time facial & CCTV check-ins, automated shift scheduling, leave workflows, and overtime tracking.",
      href: "/features#attendance",
    },
    {
      icon: DollarSign,
      title: "Payroll & Compensation",
      desc: "Automated multi-currency payroll calculations, statutory tax compliance, direct deposits, and instant digital payslips.",
      href: "/features#payroll",
    },
    {
      icon: Briefcase,
      title: "Recruitment & ATS",
      desc: "Autonomous AI candidate screening, semantic resume parsing, interview scheduling, and pipeline analytics.",
      href: "/features#recruitment",
    },
    {
      icon: TrendingUp,
      title: "Performance Management",
      desc: "Continuous goal tracking, 360-degree reviews, KPI scorecards, and AI-driven growth recommendations.",
      href: "/features#performance",
    },
    {
      icon: Heart,
      title: "Employee Engagement",
      desc: "Pulse surveys, sentiment analysis, recognition programs, culture scores, and wellbeing telemetry.",
      href: "/features#engagement",
    },
    {
      icon: SlidersHorizontal,
      title: "Operations Hub",
      desc: "Asset allocation, vendor management, visitor check-in, IT access provisioning, and expense claims.",
      href: "/features#operations",
    },
    {
      icon: Brain,
      title: "AI Intelligence",
      desc: "Predictive 90-day attrition forecasting, workload imbalance alerts, and conversational workforce copilot.",
      href: "/features#ai",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title="OFC360 – AI-Powered HR & Workforce Management Platform | EquinoxSphere"
        description="OFC360 is an AI-powered HR and workforce management platform by EquinoxSphere, founded by Vinit Sharma and Banoth Siddarth, built to simplify HR, payroll, attendance, recruitment and employee operations."
        canonicalUrl="https://www.ofc360.com/"
      />

      {/* Navbar */}
      <OFC360Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-border/60">
        {/* Subtle Background Accent Gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]"
            >
              One Workforce. <br />
              <span className="text-primary">One Intelligent Platform.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              OFC360 is an AI-powered HR and workforce management platform by EquinoxSphere, founded by Vinit Sharma and Banoth Siddarth, built to simplify HR, payroll, attendance, recruitment and employee operations.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 rounded-xl shadow-sm text-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/contact")}
                className="bg-card hover:bg-secondary text-foreground border-border px-6 rounded-xl text-sm font-medium"
              >
                <Play className="w-3.5 h-3.5 mr-2 fill-primary text-primary" />
                <span>Book a Demo</span>
              </Button>
            </motion.div>
          </div>

          {/* Hero Product Preview - Realistic OFC360 Application Dashboard Window */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 mx-auto max-w-5xl rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            {/* Top Product Window Header Bar */}
            <div className="px-4 py-2.5 bg-muted/60 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[11px] font-mono text-muted-foreground hidden sm:inline">
                  app.ofc360.ai/dashboard
                </span>
              </div>

              {/* Navigation Tabs inside Product Preview */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {[
                  { id: "overview", label: "Workforce Overview" },
                  { id: "employees", label: "Employees" },
                  { id: "attendance", label: "Attendance" },
                  { id: "payroll", label: "Payroll" },
                  { id: "recruitment", label: "Recruitment" },
                  { id: "performance", label: "Performance" },
                  { id: "ai", label: "AI Insights" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-card text-primary font-semibold shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Content Mockup area matching hr-nexus-ai styling */}
            <div className="p-5 sm:p-6 bg-background/50 space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Stat Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      title="Total Headcount"
                      value="1,248"
                      change="+12% YoY"
                      changeType="up"
                      icon={Users}
                    />
                    <StatCard
                      title="Today's Attendance"
                      value="98.4%"
                      change="+1.2% vs avg"
                      changeType="up"
                      icon={Clock}
                    />
                    <StatCard
                      title="Payroll Status"
                      value="$540,200"
                      change="100% Processed"
                      changeType="neutral"
                      icon={DollarSign}
                    />
                    <StatCard
                      title="Attrition Risk"
                      value="3.2%"
                      change="-2.4% flight risk"
                      changeType="up"
                      icon={TrendingUp}
                    />
                  </div>

                  {/* Dashboard Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="md:col-span-2 glass-card border border-border/80">
                      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Department Attendance & Telemetry
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/20">
                          Live CCTV Sync
                        </Badge>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Engineering & Product</span>
                            <span className="text-emerald-500 font-semibold">99.2%</span>
                          </div>
                          <Progress value={99.2} className="h-2 bg-secondary" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Operations & Logistics</span>
                            <span className="text-amber-500 font-semibold">94.8%</span>
                          </div>
                          <Progress value={94.8} className="h-2 bg-secondary" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Sales & Customer Success</span>
                            <span className="text-emerald-500 font-semibold">98.1%</span>
                          </div>
                          <Progress value={98.1} className="h-2 bg-secondary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card border border-border/80">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          AI Workforce Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-2 text-xs text-muted-foreground">
                        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-foreground">
                          <p className="font-semibold text-primary text-[11px] mb-1">Recruitment Velocity</p>
                          <p className="text-[11px] text-muted-foreground">
                            14 open positions. 42 candidates screened today by AI Recruiter. 3 top matches scheduled.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab !== "overview" && (
                <div className="p-8 text-center bg-card border border-border rounded-xl space-y-2 animate-in fade-in duration-200">
                  <Badge variant="outline" className="text-primary border-primary/30">
                    OFC360 Product Module
                  </Badge>
                  <h4 className="text-base font-bold text-foreground capitalize">
                    {activeTab} Management Dashboard
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Full interactive views available upon signing in to your OFC360 workspace.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="mt-2 bg-primary text-primary-foreground text-xs"
                  >
                    Launch Live Module &rarr;
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= HOME — PRODUCT VALUE ================= */}
      <section className="py-20 bg-card/40 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Everything your workforce needs. Connected.
            </h2>
            <p className="text-sm text-muted-foreground">
              Built on a single unified data architecture to remove silos across HR, payroll, operations, and intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productValues.map((pv, i) => {
              const IconComponent = pv.icon;
              return (
                <Card
                  key={i}
                  className="glass-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  onClick={() => navigate(pv.href)}
                >
                  <CardHeader className="space-y-2.5 p-5">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {pv.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {pv.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore &rarr;
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= AI SECTION ================= */}
      <section className="py-20 bg-background border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Ask your workforce data anything.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Query employee records, absenteeism trends, payroll variances, and hiring pipelines in natural conversational language.
              </p>
              <div className="pt-2 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time cross-referencing of attendance & HR records</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Automated recommendation playbooks for managers</span>
                </div>
              </div>
            </div>

            {/* Right Realistic AI Assistant Chat Interface */}
            <div className="lg:col-span-7">
              <Card className="glass-card border border-border/90 shadow-lg rounded-2xl overflow-hidden">
                <div className="px-4 py-3 bg-muted/60 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground">OFC360 Copilot</span>
                      <span className="text-[10px] text-emerald-500 font-medium ml-2">● Online</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                    GPT-4o Enterprise Engine
                  </Badge>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  {/* User Query */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="p-3.5 rounded-2xl bg-primary text-primary-foreground font-medium max-w-md shadow-xs">
                      Which teams have the highest absenteeism this month?
                    </div>
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold shrink-0 text-[10px]">
                      US
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="space-y-3 max-w-lg">
                      <div className="p-3.5 rounded-2xl bg-secondary/70 border border-border/80 text-foreground leading-relaxed">
                        Operations has the highest absenteeism at <span className="font-bold text-rose-500">8.4%</span>, followed by Customer Support at <span className="font-bold text-amber-500">6.9%</span>.
                      </div>

                      {/* Recommended Action Card */}
                      <div className="p-3.5 rounded-xl bg-card border border-primary/30 shadow-xs space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          Recommended Action
                        </div>
                        <p className="text-xs text-muted-foreground leading-normal">
                          Review attendance trends across Operations and identify recurring absence patterns.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate("/login")}
                          className="w-full justify-between text-[11px] h-7 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary mt-1"
                        >
                          <span>Execute Attendance Audit Playbook</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORKFORCE INTELLIGENCE ================= */}
      <section className="py-20 bg-card/30 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                From workforce data to better decisions.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                OFC360 transforms everyday HR activity into actionable workforce intelligence.
              </p>
              <Button
                onClick={() => navigate("/features")}
                className="bg-primary text-primary-foreground text-xs font-semibold rounded-xl px-5"
              >
                Explore Analytics Engine &rarr;
              </Button>
            </div>

            {/* Right Dashboard Analytics Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard title="Total Employees" value="1,248" change="+12% YoY" changeType="up" icon={Users} />
              <StatCard title="Attendance Rate" value="98.4%" change="+2.1% this month" changeType="up" icon={Clock} />
              <StatCard title="Payroll Processed" value="$540K" change="100% compliant" changeType="neutral" icon={DollarSign} />
              <StatCard title="Open Positions" value="14 active" change="92% AI match" changeType="neutral" icon={Briefcase} />
              <StatCard title="Performance Avg" value="88%" change="On Target" changeType="up" icon={TrendingUp} />
              <StatCard title="Engagement Score" value="8.6 / 10" change="+0.4 pulse" changeType="up" icon={Heart} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <OFC360Footer />
    </div>
  );
}

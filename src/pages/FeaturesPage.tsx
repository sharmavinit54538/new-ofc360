import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  DollarSign,
  Briefcase,
  TrendingUp,
  Heart,
  SlidersHorizontal,
  Shield,
  Brain,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";

const featureCategories = [
  {
    num: "01",
    id: "people",
    category: "People & Workforce",
    headline: "Unified Employee Directory & Organizational Architecture",
    description: "Manage global workforce hierarchies, digital profiles, department structures, document vaults, and lifecycle milestones in one centralized system of record.",
    bullets: [
      "Dynamic org chart visualization with department drill-downs",
      "Employee self-service profile and document management",
      "Automated role-based access control and lifecycle triggers",
      "Multi-location workforce directory with custom attribute tagging",
    ],
    mockupType: "people",
  },
  {
    num: "02",
    id: "attendance",
    category: "Attendance & Time",
    headline: "Real-Time Biometric & CCTV Attendance Intelligence",
    description: "Eliminate manual check-ins and time fraud with AI liveness detection, thermal CCTV sync, shift scheduling, and automated leave approvals.",
    bullets: [
      "Contactless facial recognition & RTSP CCTV stream integration",
      "Liveness anti-spoofing and thermal entry verification",
      "Geo-fenced mobile check-ins for field & remote workers",
      "Automated overtime calculation and shift roster planning",
    ],
    mockupType: "attendance",
  },
  {
    num: "03",
    id: "payroll",
    category: "Payroll & Compensation",
    headline: "Multi-Currency Automated Payroll Engine",
    description: "Process global salaries with automatic tax withholding, statutory deductions, digital payslip generation, and direct bank integration.",
    bullets: [
      "Multi-country statutory tax compliance across 140+ jurisdictions",
      "One-click salary disbursement with automated payslips",
      "Expense claim reimbursement & bonus calculations",
      "Detailed payroll ledger reporting and audit trails",
    ],
    mockupType: "payroll",
  },
  {
    num: "04",
    id: "recruitment",
    category: "Recruitment & ATS",
    headline: "Autonomous AI Recruiter & Candidate Screening",
    description: "Accelerate hiring cycles by 70%. Semantic AI resume parsing screens applicants instantly, ranking top talent based on explainable competency scores.",
    bullets: [
      "Semantic resume parsing & PDF document extraction",
      "Automated candidate scoring against custom job requirements",
      "AI video screening interview analysis",
      "Collaborative hiring pipelines with interview feedback cards",
    ],
    mockupType: "recruitment",
  },
  {
    num: "05",
    id: "performance",
    category: "Performance Management",
    headline: "Continuous Goal Tracking & 360-Degree Feedback",
    description: "Align team objectives with corporate OKRs. Conduct structured performance appraisals, skill gap analysis, and AI-recommended growth plans.",
    bullets: [
      "OKR & SMART goal tracking with progress telemetry",
      "Automated 360-degree peer & manager review cycles",
      "Skill matrix benchmarking and competency gap analysis",
      "AI performance summary cards for appraisal meetings",
    ],
    mockupType: "performance",
  },
  {
    num: "06",
    id: "engagement",
    category: "Employee Engagement",
    headline: "Pulse Surveys, Culture Scores & Wellbeing Analytics",
    description: "Monitor employee sentiment in real time. Launch anonymous pulse surveys, track eNPS ratings, and celebrate team achievements.",
    bullets: [
      "Automated pulse surveys with real-time sentiment scoring",
      "Departmental eNPS benchmarks & culture index",
      "Peer recognition and digital kudos rewards",
      "Workplace wellbeing telemetry and burnout alerts",
    ],
    mockupType: "engagement",
  },
  {
    num: "07",
    id: "operations",
    category: "Operations Hub",
    headline: "Asset Management, Visitor Logging & IT Provisioning",
    description: "Streamline physical and digital workplace operations. Manage hardware asset lifecycles, visitor badges, helpdesk tickets, and IT access.",
    bullets: [
      "Hardware asset tracking (laptops, monitors, devices)",
      "Digital visitor management with QR code badge passes",
      "Internal IT & HR support helpdesk ticketing system",
      "Automated software access provisioning upon onboarding",
    ],
    mockupType: "operations",
  },
  {
    num: "08",
    id: "security",
    category: "Security & Administration",
    headline: "Enterprise Security, SSO & Role-Based Access Control",
    description: "Safeguard company telemetry with SOC 2 Type II certified infrastructure, SAML SSO integration, custom RBAC policies, and comprehensive audit logs.",
    bullets: [
      "SAML 2.0 Single Sign-On (Okta, Azure AD, Google Workspace)",
      "Granular Role-Based Access Control (RBAC) permissions",
      "Immutable audit logs tracking every data mutation",
      "SOC 2 Type II, ISO 27001, and GDPR compliance standards",
    ],
    mockupType: "security",
  },
  {
    num: "09",
    id: "ai",
    category: "AI Intelligence",
    headline: "Predictive Attrition Forecasting & Conversational Copilot",
    description: "Harness 90-day predictive flight risk algorithms to prevent employee turnover. Query workforce data using an interactive AI conversational copilot.",
    bullets: [
      "ML-driven 90-day employee attrition forecasting",
      "Workload imbalance & burnout early warning system",
      "Conversational HR & manager assistant (OFC360 Copilot)",
      "Automated retention recommendation playbooks",
    ],
    mockupType: "ai",
  },
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <OFC360Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-card/40 border-b border-border/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Everything HR needs. <br />
            <span className="text-primary">Intelligence built in.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore OFC360’s 9 core enterprise modules designed to automate administrative tasks and deliver workforce intelligence.
          </p>
        </div>
      </section>

      {/* Alternating Feature Sections */}
      <section className="py-16 space-y-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {featureCategories.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-24`}
              >
                {/* Content Side */}
                <div className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {item.num}
                    </span>
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground font-semibold">
                      {item.category}
                    </Badge>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                    {item.headline}
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-foreground">
                    {item.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3">
                    <Button
                      onClick={() => navigate("/login")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 rounded-xl shadow-xs"
                    >
                      <span>Explore {item.category} Module</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>

                {/* Mockup UI Side */}
                <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <Card className="glass-card border border-border/80 shadow-md rounded-2xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-muted/60 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="ml-2 text-[10px] font-mono text-muted-foreground">
                          ofc360.ai/{item.id}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-primary border-primary/20">
                        Product UI
                      </Badge>
                    </div>

                    <div className="p-5 bg-background/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{item.category} Overview</span>
                        <span className="text-[11px] text-emerald-500 font-semibold">Live System</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span>Module Operational Telemetry</span>
                          <span className="text-primary font-bold">100% Active</span>
                        </div>
                        <Progress value={88} className="h-1.5 bg-secondary" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/60">
                          <p className="text-[10px] text-muted-foreground">Status</p>
                          <p className="font-semibold text-foreground text-xs mt-0.5">Automated</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/60">
                          <p className="text-[10px] text-muted-foreground">Sync Frequency</p>
                          <p className="font-semibold text-primary text-xs mt-0.5">Real-Time</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <OFC360Footer />
    </div>
  );
}

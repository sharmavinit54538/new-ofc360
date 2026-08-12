import { useNavigate } from "react-router-dom";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <OFC360Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-card/40 border-b border-border/60 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Simple, Transparent Workforce Plans
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Tailored deployment options designed to fit teams from 20 to 50,000+ employees.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* STARTER PLAN */}
            <Card className="glass-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/30 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">STARTER</h3>
                  <p className="text-xs text-muted-foreground">
                    Essential HR, attendance, and employee directory for growing teams.
                  </p>
                </div>

                <div className="space-y-1 py-2 border-y border-border/60">
                  <div className="text-2xl font-bold text-foreground">Custom pricing</div>
                  <div className="text-xs text-muted-foreground">Talk to our team for a custom quote</div>
                </div>

                <div className="space-y-2.5 text-xs text-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Up to 50 Employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Core HR & Employee Directory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Mobile & Web Attendance Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Basic Payroll & Payslips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Standard Email Support</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/contact")}
                className="mt-8 w-full bg-card border-border text-foreground hover:bg-secondary text-xs font-semibold rounded-xl"
              >
                Get Started
              </Button>
            </Card>

            {/* GROWTH PLAN */}
            <Card className="glass-card border-2 border-primary/50 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-0.5 text-xs rounded-full shadow-xs">
                  Most Popular
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-1.5">
                    GROWTH <Sparkles className="w-4 h-4 text-primary" />
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Complete workforce suite with AI ATS, CCTV attendance, & predictive analytics.
                  </p>
                </div>

                <div className="space-y-1 py-2 border-y border-border/60">
                  <div className="text-2xl font-bold text-foreground">Custom pricing</div>
                  <div className="text-xs text-muted-foreground">Talk to our team for a custom quote</div>
                </div>

                <div className="space-y-2.5 text-xs text-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Up to 500 Employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Autonomous AI ATS & Candidate Scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>CCTV Facial Recognition Attendance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>90-Day Predictive Attrition Model</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Multi-Currency Payroll Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Priority 24/7 Account Support</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/contact")}
                className="mt-8 w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-xs"
              >
                Start Growing
              </Button>
            </Card>

            {/* ENTERPRISE PLAN */}
            <Card className="glass-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/30 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">ENTERPRISE</h3>
                  <p className="text-xs text-muted-foreground">
                    Custom AI fine-tuning, dedicated cloud/edge gateway, and 99.99% SLA.
                  </p>
                </div>

                <div className="space-y-1 py-2 border-y border-border/60">
                  <div className="text-2xl font-bold text-foreground">Custom pricing</div>
                  <div className="text-xs text-muted-foreground">Talk to our team for a custom quote</div>
                </div>

                <div className="space-y-2.5 text-xs text-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited Employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Custom AI Model Fine-Tuning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>On-Premise Edge Video Gateway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>SAML SSO & Custom RBAC Rules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dedicated Solution Architect & 99.99% SLA</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/contact")}
                className="mt-8 w-full bg-card border-border text-foreground hover:bg-secondary text-xs font-semibold rounded-xl"
              >
                Talk to Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <OFC360Footer />
    </div>
  );
}

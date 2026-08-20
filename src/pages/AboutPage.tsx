import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Shield, Cpu, Layers, Globe, CheckCircle2, ArrowRight, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";
import { SEOHead } from "@/components/seo/SEOHead";

export default function AboutPage() {
  const navigate = useNavigate();

  const principles = [
    {
      num: "01",
      title: "Unified",
      desc: "Single source of workforce truth eliminating disconnected point solutions across HR, attendance, payroll, and recruitment.",
      icon: Layers,
    },
    {
      num: "02",
      title: "Intelligent",
      desc: "AI-driven copilot and computer vision models that extract insights, automate audits, and streamline workflows.",
      icon: Cpu,
    },
    {
      num: "03",
      title: "Secure",
      desc: "Enterprise-grade SOC 2 Type II compliance, zero-trust RBAC permissions, and encrypted telemetry built from the core.",
      icon: Shield,
    },
    {
      num: "04",
      title: "Scalable",
      desc: "High-performance architecture supporting fast-growing startups to multi-national 50,000+ employee enterprises.",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title="About OFC360 – AI-Powered HR & Workforce Management Platform | EquinoxSphere"
        description="OFC360 is a modern AI-powered HR and workforce management platform developed by EquinoxSphere, founded by Vinit Sharma and Banoth Siddarth."
        canonicalUrl="https://www.ofc360.com/about"
      />

      <OFC360Navbar />

      {/* Hero Header */}
      <section className="py-16 md:py-24 bg-card/40 border-b border-border/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/5">
            About OFC360 & EquinoxSphere
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Building the intelligent operating system for modern workforces.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            OFC360 is an AI-powered HR and workforce management platform developed by EquinoxSphere, founded by Vinit Sharma and Banoth Siddarth.
          </p>
        </div>
      </section>

      {/* Primary Brand Sections */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: About OFC360 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="text-xs text-primary border-primary/20">Product Platform</Badge>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">About OFC360</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">OFC360</strong> is a modern AI-powered HR and workforce management platform developed by <strong className="text-foreground">EquinoxSphere</strong>. It brings HR operations, employee management, payroll, attendance, recruitment, performance and workforce intelligence into one unified platform.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By leveraging explainable AI algorithms and real-time CCTV & facial recognition telemetry, OFC360 empowers organizations to reduce manual HR overhead by up to 80% while enhancing employee engagement and trust.
            </p>
          </div>
          <Card className="glass-card border border-border/80 rounded-3xl p-6 bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base">Key Capabilities</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Unified HR Operations & Employee Directory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>AI Face & CCTV Attendance Telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Automated Multi-Currency Payroll Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>AI Recruiter Copilot & Smart ATS</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Predictive Flight-Risk & Performance Intelligence</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Section 2: Built by EquinoxSphere */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-border/60 pt-12">
          <Card className="glass-card border border-border/80 rounded-3xl p-6 bg-card space-y-3 order-2 md:order-1">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">EquinoxSphere</h3>
                <p className="text-xs text-muted-foreground">Parent Technology Ecosystem</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              EquinoxSphere engineers enterprise SaaS platforms designed for high scalability, SOC-2 compliance, and zero-trust security.
            </p>
            <Link to="/about/equinoxsphere">
              <Button variant="outline" size="sm" className="w-full text-xs rounded-xl gap-1.5 mt-2">
                Explore EquinoxSphere <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          <div className="space-y-4 order-1 md:order-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/20">Parent Organization</Badge>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Built by EquinoxSphere</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">OFC360</strong> is part of the <strong className="text-foreground">EquinoxSphere</strong> product ecosystem and is built with a focus on intelligent automation, modern workforce operations and enterprise-grade HR technology.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              EquinoxSphere brings together cloud architecture, advanced machine learning models, and security protocols to ensure seamless data flow across enterprise teams.
            </p>
          </div>
        </div>

        {/* Section 3: Founders Section */}
        <div className="border-t border-border/60 pt-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/20">Founders & Leadership</Badge>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Founders</h2>
            <p className="text-xs text-muted-foreground">
              OFC360 is owned and developed by EquinoxSphere, founded by Vinit Sharma and Banoth Siddarth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vinit Sharma Card */}
            <Card className="glass-card border border-border/80 rounded-3xl p-6 space-y-4 hover:border-primary/40 transition-all bg-card">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl font-mono">
                  VS
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">Vinit Sharma</h3>
                  <p className="text-xs text-primary font-bold">Founder / Owner</p>
                  <p className="text-xs text-muted-foreground">EquinoxSphere & OFC360</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Co-founder of EquinoxSphere, responsible for enterprise product architecture, cloud scale, and strategic direction of the OFC360 platform.
              </p>
              <Link to="/founders/vinit-sharma">
                <Button size="sm" variant="outline" className="w-full text-xs rounded-xl gap-1.5">
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Banoth Siddarth Card */}
            <Card className="glass-card border border-border/80 rounded-3xl p-6 space-y-4 hover:border-primary/40 transition-all bg-card">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl font-mono">
                  BS
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">Banoth Siddarth</h3>
                  <p className="text-xs text-primary font-bold">Founder / Owner</p>
                  <p className="text-xs text-muted-foreground">EquinoxSphere & OFC360</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Co-founder of EquinoxSphere, leading AI intelligence engineering, user interface experience, and predictive analytics in OFC360.
              </p>
              <Link to="/founders/banoth-siddarth">
                <Button size="sm" variant="outline" className="w-full text-xs rounded-xl gap-1.5">
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Product Principles Grid */}
        <div className="border-t border-border/60 pt-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Our Four Product Principles</h2>
            <p className="text-xs text-muted-foreground">The foundational pillars guiding every feature we build in OFC360.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p, i) => {
              const IconComp = p.icon;
              return (
                <Card key={i} className="glass-card border border-border/80 rounded-2xl p-5 space-y-3 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {p.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <OFC360Footer />
    </div>
  );
}
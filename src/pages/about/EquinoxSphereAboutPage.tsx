import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Building2, Users, Cpu, Shield, ArrowRight, CheckCircle2, Globe, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";
import { SEOHead } from "@/components/seo/SEOHead";

export default function EquinoxSphereAboutPage() {
  const navigate = useNavigate();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EquinoxSphere",
    "url": "https://www.ofc360.com/about/equinoxsphere",
    "logo": "https://www.ofc360.com/logo.png",
    "description": "EquinoxSphere is the technology organization behind OFC360, dedicated to engineering AI-powered workforce management ecosystems.",
    "brand": {
      "@type": "Brand",
      "name": "OFC360"
    },
    "founder": [
      {
        "@type": "Person",
        "name": "Vinit Sharma",
        "jobTitle": "Co-Founder & Owner"
      },
      {
        "@type": "Person",
        "name": "Banoth Siddarth",
        "jobTitle": "Co-Founder & Owner"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title="About EquinoxSphere – Creator of OFC360 Workforce Platform"
        description="EquinoxSphere is the technology company behind OFC360, founded by Vinit Sharma and Banoth Siddarth to pioneer AI-driven enterprise workforce solutions."
        canonicalUrl="https://www.ofc360.com/about/equinoxsphere"
        jsonLd={organizationSchema}
      />

      <OFC360Navbar />

      {/* Hero Banner */}
      <section className="py-16 md:py-24 bg-card/40 border-b border-border/60 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/5">
            Parent Organization & Ecosystem
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            EquinoxSphere
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Engineering next-generation SaaS software and autonomous workforce intelligence platforms for global enterprises.
          </p>
        </div>
      </section>

      {/* Main Content & Relationship */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Powering the Future of Workforce SaaS
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">OFC360</strong> is a premier product developed by{" "}
              <strong className="text-foreground font-semibold">EquinoxSphere</strong>. Built from the ground up, EquinoxSphere combines state-of-the-art AI automation, real-time telemetry, and secure enterprise architecture to simplify workforce operations.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Founded by <strong className="text-foreground font-semibold">Vinit Sharma</strong> and{" "}
              <strong className="text-foreground font-semibold">Banoth Siddarth</strong>, EquinoxSphere operates with a unified mission: eliminating operational friction across HR, payroll, attendance, and recruitment.
            </p>
          </div>

          <Card className="glass-card border border-border/80 rounded-2xl p-6 space-y-4 bg-card">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">EquinoxSphere Ecosystem</h3>
                <p className="text-xs text-muted-foreground">Product Portfolio & Technology</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Flagship Product: <strong>OFC360</strong> AI HRMS</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Enterprise Autonomous Workforce Models</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Zero-Trust Security & SOC-2 Compliance Architecture</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Co-founded by Vinit Sharma & Banoth Siddarth</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Founders Spotlight */}
        <div className="space-y-6 pt-6 border-t border-border/60">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/20">Leadership</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">EquinoxSphere Leadership</h2>
            <p className="text-xs text-muted-foreground">Meet the founders driving the vision and engineering of OFC360.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Vinit Sharma */}
            <Card className="glass-card border border-border/80 rounded-2xl p-6 space-y-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg font-mono">
                VS
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Vinit Sharma</h3>
                <p className="text-xs text-primary font-semibold">Founder / Owner</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Co-founder of EquinoxSphere, architecting high-scale SaaS infrastructure and product innovation for OFC360.
                </p>
              </div>
              <Link to="/founders/vinit-sharma">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 rounded-xl border-border">
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Banoth Siddarth */}
            <Card className="glass-card border border-border/80 rounded-2xl p-6 space-y-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg font-mono">
                BS
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Banoth Siddarth</h3>
                <p className="text-xs text-primary font-semibold">Founder / Owner</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Co-founder of EquinoxSphere, leading AI platform intelligence, design systems, and enterprise deployment.
                </p>
              </div>
              <Link to="/founders/banoth-siddarth">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 rounded-xl border-border">
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl p-8 bg-card border border-primary/20 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">Explore OFC360 Platform</h3>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Discover how EquinoxSphere's flagship product OFC360 transforms workforce management with intelligent AI automation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button size="sm" className="rounded-xl px-5" onClick={() => navigate("/register")}>
              Get Started with OFC360
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl px-5" onClick={() => navigate("/about")}>
              About OFC360
            </Button>
          </div>
        </div>
      </section>

      <OFC360Footer />
    </div>
  );
}
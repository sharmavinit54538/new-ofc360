import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";
import { SEOHead } from "@/components/seo/SEOHead";

export default function VinitSharmaPage() {
  const navigate = useNavigate();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Vinit Sharma",
    "jobTitle": "Co-Founder & Owner",
    "worksFor": {
      "@type": "Organization",
      "name": "EquinoxSphere",
      "url": "https://www.ofc360.com/"
    },
    "knowsAbout": ["Workforce Management", "HR Software", "EquinoxSphere", "OFC360"]
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title="Vinit Sharma – Founder & Owner of EquinoxSphere & OFC360"
        description="Vinit Sharma is the co-founder and owner of EquinoxSphere, building OFC360 — an AI-powered HR and workforce management platform."
        canonicalUrl="https://www.ofc360.com/founders/vinit-sharma"
        jsonLd={personSchema}
      />

      <OFC360Navbar />

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link to="/founders" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Founders
        </Link>

        <Card className="glass-card border border-border/80 rounded-3xl p-8 space-y-6 bg-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-3xl font-mono shrink-0">
              VS
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">Executive Profile</Badge>
              <h1 className="text-3xl font-extrabold text-foreground">Vinit Sharma</h1>
              <p className="text-sm text-primary font-bold">Founder / Owner at EquinoxSphere</p>
              <p className="text-xs text-muted-foreground">Co-Creator of OFC360 AI HR Platform</p>
            </div>
          </div>

          <div className="border-t border-border/60 pt-6 space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Vinit Sharma</strong> is a co-founder and owner of{" "}
              <strong className="text-foreground">EquinoxSphere</strong>, the company behind{" "}
              <strong className="text-foreground">OFC360</strong>.
            </p>
            <p>
              Under Vinit's leadership, EquinoxSphere engineered OFC360 to address complex enterprise HR challenges — unifying workforce management, attendance telemetry, payroll automation, and recruitment intelligence into a single intuitive platform.
            </p>
          </div>

          <div className="border-t border-border/60 pt-6 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Key Contributions & Focus</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Co-founded EquinoxSphere as an enterprise workforce technology organization.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Architected product strategy for OFC360's unified HR and payroll engines.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Champions zero-trust security and data privacy standards across OFC360 modules.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border/60 flex flex-wrap gap-3">
            <Button size="sm" className="rounded-xl text-xs" onClick={() => navigate("/about/equinoxsphere")}>
              About EquinoxSphere
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => navigate("/about")}>
              About OFC360
            </Button>
          </div>
        </Card>
      </section>

      <OFC360Footer />
    </div>
  );
}
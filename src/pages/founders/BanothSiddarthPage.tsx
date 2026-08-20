import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";
import { SEOHead } from "@/components/seo/SEOHead";

export default function BanothSiddarthPage() {
  const navigate = useNavigate();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Banoth Siddarth",
    "jobTitle": "Co-Founder & Owner",
    "worksFor": {
      "@type": "Organization",
      "name": "EquinoxSphere",
      "url": "https://www.ofc360.com/"
    },
    "knowsAbout": ["Artificial Intelligence", "Workforce Analytics", "EquinoxSphere", "OFC360"]
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title="Banoth Siddarth – Founder & Owner of EquinoxSphere & OFC360"
        description="Banoth Siddarth is the co-founder and owner of EquinoxSphere, developing OFC360 — an AI-powered HR and workforce management platform."
        canonicalUrl="https://www.ofc360.com/founders/banoth-siddarth"
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
              BS
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">Executive Profile</Badge>
              <h1 className="text-3xl font-extrabold text-foreground">Banoth Siddarth</h1>
              <p className="text-sm text-primary font-bold">Founder / Owner at EquinoxSphere</p>
              <p className="text-xs text-muted-foreground">Co-Creator of OFC360 AI HR Platform</p>
            </div>
          </div>

          <div className="border-t border-border/60 pt-6 space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Banoth Siddarth</strong> is a co-founder and owner of{" "}
              <strong className="text-foreground">EquinoxSphere</strong>, spearheading the design and AI capabilities of{" "}
              <strong className="text-foreground">OFC360</strong>.
            </p>
            <p>
              Banoth focuses on embedding explainable artificial intelligence, computer vision telemetry, and predictive retention analytics into OFC360 to give modern enterprises complete workforce operational clarity.
            </p>
          </div>

          <div className="border-t border-border/60 pt-6 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Key Contributions & Focus</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Co-founded EquinoxSphere to revolutionize autonomous HR and workforce management.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Leads AI intelligence modeling, computer vision attendance, and predictive analytics for OFC360.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Drives user experience design systems and enterprise product adoption.</span>
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
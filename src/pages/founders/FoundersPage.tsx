import { Link, useNavigate } from "react-router-dom";
import { Users, Sparkles, ArrowRight, Shield, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";
import { SEOHead } from "@/components/seo/SEOHead";

export default function FoundersPage() {
  const navigate = useNavigate();

  const foundersSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EquinoxSphere",
    "url": "https://www.ofc360.com/founders",
    "founder": [
      {
        "@type": "Person",
        "name": "Vinit Sharma",
        "jobTitle": "Co-Founder & Owner",
        "worksFor": {
          "@type": "Organization",
          "name": "EquinoxSphere"
        }
      },
      {
        "@type": "Person",
        "name": "Banoth Siddarth",
        "jobTitle": "Co-Founder & Owner",
        "worksFor": {
          "@type": "Organization",
          "name": "EquinoxSphere"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title="Founders of OFC360 & EquinoxSphere – Vinit Sharma & Banoth Siddarth"
        description="Meet Vinit Sharma and Banoth Siddarth, founders and owners of EquinoxSphere and creators of the OFC360 AI workforce management platform."
        canonicalUrl="https://www.ofc360.com/founders"
        jsonLd={foundersSchema}
      />

      <OFC360Navbar />

      {/* Hero Header */}
      <section className="py-16 md:py-24 bg-card/40 border-b border-border/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/5">
            Leadership & Vision
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Founders & Leadership
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The visionary team behind EquinoxSphere and the OFC360 AI Workforce Intelligence Platform.
          </p>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vinit Sharma */}
          <Card className="glass-card border border-border/80 rounded-2xl p-8 space-y-5 hover:border-primary/40 transition-all bg-card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl font-mono">
                VS
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Vinit Sharma</h2>
                <p className="text-xs text-primary font-bold uppercase tracking-wider">Founder / Owner</p>
                <p className="text-xs text-muted-foreground">EquinoxSphere & OFC360</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Vinit Sharma is the co-founder and owner of <strong className="text-foreground">EquinoxSphere</strong>. With expertise in enterprise software systems, cloud infrastructure, and product strategy, Vinit co-founded OFC360 to deliver unified, intelligent workforce management for modern organizations.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Co-Founder & Platform Architect at EquinoxSphere</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Product Strategy for OFC360 HR Ecosystem</span>
              </div>
            </div>

            <Link to="/founders/vinit-sharma">
              <Button className="w-full text-xs rounded-xl gap-1.5 mt-2">
                Read Full Profile <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          {/* Banoth Siddarth */}
          <Card className="glass-card border border-border/80 rounded-2xl p-8 space-y-5 hover:border-primary/40 transition-all bg-card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl font-mono">
                BS
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Banoth Siddarth</h2>
                <p className="text-xs text-primary font-bold uppercase tracking-wider">Founder / Owner</p>
                <p className="text-xs text-muted-foreground">EquinoxSphere & OFC360</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Banoth Siddarth is the co-founder and owner of <strong className="text-foreground">EquinoxSphere</strong>. Spearheading AI intelligence, design engineering, and enterprise adoption, Banoth focuses on creating seamless user experiences and predictive workforce models in OFC360.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Co-Founder & AI Intelligence Lead at EquinoxSphere</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>User Experience & Enterprise AI Models for OFC360</span>
              </div>
            </div>

            <Link to="/founders/banoth-siddarth">
              <Button className="w-full text-xs rounded-xl gap-1.5 mt-2">
                Read Full Profile <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Vision Statement */}
        <div className="rounded-3xl p-8 bg-card border border-border/80 text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="text-xs text-primary border-primary/20">The Founders' Commitment</Badge>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">Building Trust Through Enterprise AI</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            "Our goal at EquinoxSphere is to equip every company with complete workforce transparency, automated payroll accuracy, and predictive employee retention through OFC360."
          </p>
        </div>
      </section>

      <OFC360Footer />
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, BookOpen, ArrowRight, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";

const categories = [
  "All Insights",
  "AI in HR",
  "Workforce",
  "Payroll",
  "Recruitment",
  "Performance",
  "Employee Experience",
  "Product Updates",
];

const articles = [
  {
    id: "1",
    category: "AI in HR",
    title: "Autonomous ATS: Eliminating Resume Screening Bottlenecks in 2026",
    desc: "How semantic parsing and AI video interviews reduce hiring cycles from weeks to days while improving 90-day candidate retention.",
    readTime: "5 min read",
    date: "Aug 10, 2026",
    featured: true,
  },
  {
    id: "2",
    category: "Workforce",
    title: "CCTV Computer Vision in Biometric Attendance Systems",
    desc: "Deploying RTSP stream analysis and liveness anti-spoofing to track multi-facility attendance without physical badge touchpoints.",
    readTime: "4 min read",
    date: "Aug 05, 2026",
    featured: false,
  },
  {
    id: "3",
    category: "Payroll",
    title: "Navigating Multi-Currency Statutory Tax Filings Across 140 Countries",
    desc: "Best practices for automated compliance, local tax withholding, and real-time digital payslip distribution.",
    readTime: "6 min read",
    date: "Jul 28, 2026",
    featured: false,
  },
  {
    id: "4",
    category: "Performance",
    title: "Predictive Attrition Modeling: Detecting Burnout 90 Days Early",
    desc: "Machine learning algorithms analyzing workload telemetry, pulse sentiment, and overtime trends to prevent key talent flight.",
    readTime: "5 min read",
    date: "Jul 20, 2026",
    featured: false,
  },
  {
    id: "5",
    category: "Employee Experience",
    title: "Building High-Trust Remote Culture Through Telemetry Pulse Surveys",
    desc: "How continuous micro-feedback loops and eNPS tracking empower managers to take proactive engagement actions.",
    readTime: "4 min read",
    date: "Jul 12, 2026",
    featured: false,
  },
  {
    id: "6",
    category: "Product Updates",
    title: "Announcing OFC360 Copilot 3.0: Conversational Workforce Insights",
    desc: "Introducing instant natural language querying across organizational hierarchy, payroll ledgers, and attendance records.",
    readTime: "3 min read",
    date: "Jul 01, 2026",
    featured: false,
  },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState("All Insights");

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const filteredArticles = articles.filter(
    (a) => !a.featured && (selectedCat === "All Insights" || a.category === selectedCat)
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <OFC360Navbar />

      {/* Hero Header */}
      <section className="py-14 bg-card/40 border-b border-border/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            OFC360 Workforce Insights & Research
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Strategic analysis, AI workforce benchmarks, and technical product updates.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Featured Article Card */}
        <Card className="glass-card border border-border/80 rounded-2xl p-6 sm:p-8 hover:border-primary/40 transition-all space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <Badge className="bg-primary text-primary-foreground font-semibold text-[11px]">
              Featured Article
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground text-[11px]">
              {featuredArticle.category}
            </Badge>
            <span className="text-muted-foreground text-[11px]">• {featuredArticle.date}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
            {featuredArticle.title}
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {featuredArticle.desc}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}
            </span>
            <Button
              onClick={() => navigate("/login")}
              size="sm"
              className="bg-primary text-primary-foreground text-xs font-semibold rounded-lg"
            >
              <span>Read Article</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Card>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCat === cat
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <Card
              key={art.id}
              className="glass-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className="text-primary border-primary/20 text-[10px]">
                    {art.category}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{art.date}</span>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {art.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-4 text-xs">
                <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" /> {art.readTime}
                </span>
                <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article &rarr;
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <OFC360Footer />
    </div>
  );
}
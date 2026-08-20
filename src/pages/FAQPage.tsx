import { useState } from "react";
import { Search, HelpCircle, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";
import { SEOHead } from "@/components/seo/SEOHead";

const faqCategories = ["All", "General", "Ownership", "Features", "AI", "Security", "Implementation", "Pricing"];

const faqs = [
  {
    cat: "General",
    q: "What is OFC360?",
    a: "OFC360 is an AI-powered HR and workforce management platform developed by EquinoxSphere.",
  },
  {
    cat: "Ownership",
    q: "Who owns OFC360?",
    a: "OFC360 is owned and developed by EquinoxSphere, with Vinit Sharma and Banoth Siddarth as its founders/owners.",
  },
  {
    cat: "Ownership",
    q: "Who developed OFC360?",
    a: "OFC360 was developed by EquinoxSphere as part of its workforce technology ecosystem.",
  },
  {
    cat: "General",
    q: "What does OFC360 do?",
    a: "OFC360 provides HR, payroll, attendance, recruitment, employee management, performance and workforce-management capabilities through a unified platform.",
  },
  {
    cat: "Features",
    q: "Can OFC360 integrate with our existing camera hardware for CCTV attendance?",
    a: "Yes! OFC360 supports standard RTSP, ONVIF, and IP camera streams. You do not need dedicated proprietary hardware—our edge gateways connect seamlessly to your facility cameras.",
  },
  {
    cat: "AI",
    q: "How does the AI Assistant (OFC360 Copilot) process workforce data?",
    a: "OFC360 Copilot cross-references attendance telemetry, HR directory records, and payroll logs in real time. It delivers explainable insights, absenteeism alerts, and retention playbooks while enforcing strict role-based access permissions.",
  },
  {
    cat: "Security",
    q: "What compliance standards and encryption protocols does OFC360 maintain?",
    a: "OFC360 is SOC 2 Type II, ISO 27001, GDPR, and HIPAA compliant. All data in transit is encrypted using TLS 1.3, and data at rest is encrypted with AES-256. Facial vectors are hashed as non-reversible mathematical representations.",
  },
  {
    cat: "Implementation",
    q: "How long does enterprise onboarding take?",
    a: "Standard cloud deployment takes under 24 hours. Automated data importers allow seamless migration of employee profiles, org structures, and historical payroll ledgers from legacy systems.",
  },
  {
    cat: "Pricing",
    q: "How does OFC360 handle custom enterprise pricing?",
    a: "We offer tailored plans based on total employee headcount, AI module requirements, and edge gateway setups. Contact our sales team for a transparent custom quote with no hidden fees.",
  },
];

export default function FAQPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = selectedCat === "All" || f.cat === selectedCat;
    const matchesSearch =
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title="OFC360 FAQ – Questions & Ownership | EquinoxSphere"
        description="Find answers to common questions about OFC360, its developer EquinoxSphere, founders Vinit Sharma and Banoth Siddarth, AI HR features, and security."
        canonicalUrl="https://www.ofc360.com/faq"
      />

      <OFC360Navbar />

      {/* Hero Header */}
      <section className="py-14 bg-card/40 border-b border-border/60 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything you need to know about OFC360 features, EquinoxSphere ownership, security, and AI engines.
          </p>

          {/* Search Input */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search questions or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border text-xs h-10 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {faqCategories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCat === c
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto" />
            <h3 className="text-base font-semibold text-foreground">No questions found</h3>
            <p className="text-xs text-muted-foreground">Try adjusting your search query or filter category.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border border-border/80 rounded-2xl px-5 py-1 bg-card hover:border-primary/40 transition-colors"
              >
                <AccordionTrigger className="text-left text-sm font-bold text-foreground hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/20 shrink-0">
                      {faq.cat}
                    </Badge>
                    <span>{faq.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pt-1 pb-4 border-t border-border/40 mt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      <OFC360Footer />
    </div>
  );
}
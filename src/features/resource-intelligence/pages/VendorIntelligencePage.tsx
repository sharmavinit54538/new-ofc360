import { TalentIntelligenceLayout } from "@/features/talent-intelligence/components/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/features/talent-intelligence/components/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/features/talent-intelligence/components/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/features/talent-intelligence/components/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/features/talent-intelligence/components/TalentIntelligenceEmptyState";
import { Handshake, FileText, ShoppingCart, Award, Clock, Bot, ShieldCheck, DollarSign } from "lucide-react";

const featureCards = [
  {
    title: "Vendor Portfolio",
    description: "Central directory of all third-party suppliers, service partners, and technology vendors.",
    icon: Handshake,
    category: "Portfolio",
  },
  {
    title: "Contract & SLA Intelligence",
    description: "Track service-level agreements, penalty clauses, milestone deliverables, and terms.",
    icon: FileText,
    category: "Contracts",
  },
  {
    title: "Procurement & Purchase Orders",
    description: "Requisition workflows, PO approvals, quote comparisons, and delivery receipts.",
    icon: ShoppingCart,
    category: "Procurement",
  },
  {
    title: "Performance Scorecards",
    description: "Vendor delivery punctuality, quality benchmarks, SLA uptime, and support ratings.",
    icon: Award,
    category: "Performance",
  },
  {
    title: "Renewal & Expiry Alerts",
    description: "Advance contract renewal deadlines, auto-renewal notices, and price revision tracking.",
    icon: Clock,
    category: "Renewals",
  },
  {
    title: "AI Vendor Recommendations",
    description: "Predictive contract negotiations, vendor consolidation, and cost saving insights.",
    icon: Bot,
    category: "AI Copilot",
  },
];

const overviewSections = [
  { title: "Vendor Overview", desc: "Executive view of active supplier partnerships and spend distribution." },
  { title: "Contract Compliance", desc: "Audit readiness, confidentiality NDAs, and data security agreements." },
  { title: "Spend & Invoicing", desc: "Purchase order status, invoice reconciliation, and payment milestone tracking." },
];

export default function VendorIntelligencePage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">

        {/* Feature Cards Grid */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Vendor Intelligence Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map((card) => (
              <TalentIntelligenceFeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                category={card.category}
              />
            ))}
          </div>
        </div>

        {/* Overview Sections */}
        <div className="space-y-4 pt-2">
          {overviewSections.map((sec) => (
            <TalentIntelligenceSection key={sec.title} title={sec.title} description={sec.desc}>
              <TalentIntelligenceEmptyState
                title="No vendor data available"
                description="Vendor intelligence will appear when organizational supplier and contract data is available."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}

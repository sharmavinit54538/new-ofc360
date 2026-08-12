import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/components/talent-intelligence/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/components/talent-intelligence/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/components/talent-intelligence/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/components/talent-intelligence/TalentIntelligenceEmptyState";
import { LogOut, ListCheck, MessageSquare, RefreshCw, Briefcase, BarChart3, Bot, FileText, DollarSign } from "lucide-react";

const featureCards = [
  {
    title: "Exit Workflow",
    description: "Standardized offboarding clearance protocol for HR, IT, Finance, and Security.",
    icon: LogOut,
    category: "Workflow",
  },
  {
    title: "Exit Checklist",
    description: "Automated checklist for asset recovery, access revocation, and document handoffs.",
    icon: ListCheck,
    category: "Checklist",
  },
  {
    title: "Exit Interview Intelligence",
    description: "Sentiment analysis on exit interview feedback to uncover retention drivers.",
    icon: MessageSquare,
    category: "Interview",
  },
  {
    title: "Knowledge Transfer",
    description: "Structured documentation plans and handover sessions prior to departure.",
    icon: RefreshCw,
    category: "Knowledge",
  },
  {
    title: "Asset Clearance",
    description: "Hardware equipment recovery tracking and digital access de-provisioning.",
    icon: Briefcase,
    category: "Clearance",
  },
  {
    title: "Exit Insights",
    description: "Attrition analytics, departure reasons, and retention trend identification.",
    icon: BarChart3,
    category: "Insights",
  },
  {
    title: "AI Exit Recommendations",
    description: "Predictive recommendations for flight-risk mitigation and team restructuring.",
    icon: Bot,
    category: "AI Copilot",
  },
];

const overviewSections = [
  { title: "Exit Overview", desc: "Executive view of active offboarding cases and clearance statuses." },
  { title: "Resignation Management", desc: "Notice period tracking and resignation acceptance documentation." },
  { title: "Final Settlement", desc: "Prorated payroll, unused leave payouts, and severance clearance." },
];

export default function ExitIntelligencePage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">

        {/* Feature Cards Grid */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Exit Modules</h3>
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
                title="No exit data available"
                description="Exit intelligence will appear when employee exit data is available."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}

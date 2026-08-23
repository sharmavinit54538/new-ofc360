import { TalentIntelligenceLayout } from "@/features/talent-intelligence/components/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/features/talent-intelligence/components/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/features/talent-intelligence/components/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/features/talent-intelligence/components/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/features/talent-intelligence/components/TalentIntelligenceEmptyState";
import { Target, Briefcase, Users, BrainCircuit, TrendingUp, Bot, FileCheck, Layers } from "lucide-react";

const featureCards = [
  {
    title: "Workforce Planning",
    description: "Align headcount growth projections with strategic revenue and departmental targets.",
    icon: Target,
    category: "Planning",
  },
  {
    title: "Hiring Planning",
    description: "Budget allocation, requisition scheduling, and hiring manager workload optimization.",
    icon: Briefcase,
    category: "Hiring",
  },
  {
    title: "Talent Pipeline",
    description: "Cross-department sourcing funnel analytics and candidate conversion velocity.",
    icon: Users,
    category: "Pipeline",
  },
  {
    title: "Skill Demand Intelligence",
    description: "Identify emerging skill gaps and market talent availability for planned roles.",
    icon: BrainCircuit,
    category: "Skill Demand",
  },
  {
    title: "Workforce Forecast",
    description: "Predict future headcount requirements based on historical growth and turnover.",
    icon: TrendingUp,
    category: "Forecast",
  },
  {
    title: "AI Hiring Recommendations",
    description: "Smart recommendations for sourcing channels, compensation bands, and interview speed.",
    icon: Bot,
    category: "AI Copilot",
  },
];

const overviewSections = [
  { title: "Hiring Overview", desc: "Executive view of active headcount requisitions and capacity planning." },
  { title: "Open Positions", desc: "List of open positions awaiting budget approval or candidate sourcing." },
  { title: "Workforce Capacity", desc: "Departmental capacity analysis comparing workload against available staffing." },
];

export default function HiringIntelligencePage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">

        {/* Feature Cards Grid */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Hiring & Workforce Modules</h3>
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
                title="No talent and hiring data available"
                description="Talent intelligence will appear when workforce and hiring data is available."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}

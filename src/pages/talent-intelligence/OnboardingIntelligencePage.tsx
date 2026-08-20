import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/components/talent-intelligence/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/components/talent-intelligence/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/components/talent-intelligence/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/components/talent-intelligence/TalentIntelligenceEmptyState";
import { Rocket, ListCheck, FileText, UserCheck, BarChart3, Bot, Compass, UserCog, HeartHandshake } from "lucide-react";

const featureCards = [
  {
    title: "New Hire Journey",
    description: "Structured milestone roadmap from pre-boarding offer acceptance to Day 90 integration.",
    icon: Rocket,
    category: "Journey",
  },
  {
    title: "Onboarding Checklist",
    description: "Interactive task checklists for IT setup, HR paperwork, and buddy introduction.",
    icon: ListCheck,
    category: "Checklist",
  },
  {
    title: "Document Collection",
    description: "Automated pre-onboarding document requests and digital sign-off tracking.",
    icon: FileText,
    category: "Documents",
  },
  {
    title: "Employee Setup",
    description: "Provisioning requests for laptop, software access, email accounts, and workspace.",
    icon: UserCheck,
    category: "Setup",
  },
  {
    title: "Onboarding Insights",
    description: "Time-to-productivity analytics, onboarding feedback scores, and bottlenecks.",
    icon: BarChart3,
    category: "Insights",
  },
  {
    title: "AI Onboarding Recommendations",
    description: "Smart suggestions for buddy assignments, training modules, and check-in cadences.",
    icon: Bot,
    category: "AI Copilot",
  },
];

const overviewSections = [
  { title: "Onboarding Overview", desc: "Summary of active new hire cohorts and onboarding status." },
  { title: "Manager Actions", desc: "Action items for hiring managers during initial employee 30-60-90 day plans." },
  { title: "New Hire Experience", desc: "Pulse survey responses and new hire engagement feedback." },
];

export default function OnboardingIntelligencePage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">

        {/* Feature Cards Grid */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Onboarding Modules</h3>
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
                title="No onboarding data available"
                description="Onboarding intelligence will appear when new-hire data is available."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}
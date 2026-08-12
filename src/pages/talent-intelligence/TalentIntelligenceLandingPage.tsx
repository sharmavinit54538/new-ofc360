import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { TalentIntelligenceCard } from "@/components/talent-intelligence/TalentIntelligenceCard";
import { TalentIntelligenceEmptyState } from "@/components/talent-intelligence/TalentIntelligenceEmptyState";
import { Target, FileText, Rocket, GraduationCap, LogOut, UserSearch } from "lucide-react";

const talentModules = [
  {
    title: "Recruitment & ATS Intelligence",
    description: "End-to-end recruitment lifecycle, AI candidate scoring, drag-and-drop pipeline, and offer management.",
    icon: UserSearch,
    path: "/recruitment",
    tag: "Recruitment",
  },
  {
    title: "Document Intelligence",
    description: "Intelligent document management, verification and compliance across the employee lifecycle.",
    icon: FileText,
    path: "/talent-intelligence/documents",
    tag: "Documents",
  },
  {
    title: "Onboarding Intelligence",
    description: "Create an intelligent, structured and engaging employee onboarding experience.",
    icon: Rocket,
    path: "/talent-intelligence/onboarding",
    tag: "Onboarding",
  },
  {
    title: "Learning Intelligence",
    description: "Turn employee development, skills and learning into actionable intelligence.",
    icon: GraduationCap,
    path: "/talent-intelligence/learning",
    tag: "Learning",
  },
  {
    title: "Exit Intelligence",
    description: "Intelligently manage employee exits, knowledge transfer and offboarding.",
    icon: LogOut,
    path: "/talent-intelligence/exit",
    tag: "Exit",
  },
  {
    title: "Talent & Hiring Intelligence",
    description: "Plan workforce requirements and make smarter talent decisions.",
    icon: Target,
    path: "/talent-intelligence/hiring",
    tag: "Hiring",
  },
];

export default function TalentIntelligenceLandingPage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">
        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {talentModules.map((mod) => (
            <TalentIntelligenceCard
              key={mod.title}
              title={mod.title}
              description={mod.description}
              icon={mod.icon}
              path={mod.path}
              tag={mod.tag}
            />
          ))}
        </div>

        {/* Overview Section */}
        <div className="space-y-4 pt-2">
          <div className="glass-card rounded-2xl p-6 border border-border/60 bg-card shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-foreground">
              Talent Lifecycle Overview
            </h4>
            <TalentIntelligenceEmptyState
              title="No active talent lifecycle alerts"
              description="Candidate pipelines, onboarding journeys, and learning tracks will appear here."
            />
          </div>
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}

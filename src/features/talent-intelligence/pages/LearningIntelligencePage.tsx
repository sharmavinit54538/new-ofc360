import { TalentIntelligenceLayout } from "@/features/talent-intelligence/components/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/features/talent-intelligence/components/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/features/talent-intelligence/components/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/features/talent-intelligence/components/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/features/talent-intelligence/components/TalentIntelligenceEmptyState";
import { GraduationCap, BrainCircuit, BookOpen, Award, TrendingUp, Bot, Target, FileSpreadsheet, Sparkles } from "lucide-react";

const featureCards = [
  {
    title: "Learning Programs",
    description: "Structured organizational learning paths and skill accreditation frameworks.",
    icon: GraduationCap,
    category: "Programs",
  },
  {
    title: "Skill Gap Intelligence",
    description: "AI capability mapping identifying skill deficiencies across departments and roles.",
    icon: BrainCircuit,
    category: "Skill Gap",
  },
  {
    title: "Course Recommendations",
    description: "Personalized course suggestions aligned with career goals and performance reviews.",
    icon: BookOpen,
    category: "Courses",
  },
  {
    title: "Certification Intelligence",
    description: "Track mandatory compliance licenses and technical certifications.",
    icon: Award,
    category: "Certifications",
  },
  {
    title: "Learning Progress",
    description: "Monitor course completion velocity and employee skill acquisition over time.",
    icon: TrendingUp,
    category: "Progress",
  },
  {
    title: "AI Development Recommendations",
    description: "Intelligent career pathing and mentorship recommendations.",
    icon: Bot,
    category: "AI Copilot",
  },
];

const overviewSections = [
  { title: "Learning Overview", desc: "Executive view of organizational skill health and training investments." },
  { title: "Employee Skills Matrix", desc: "Catalog of validated technical and soft skills across team members." },
  { title: "Development Plans", desc: "Individual growth plans mapped to quarterly performance milestones." },
];

export default function LearningIntelligencePage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">

        {/* Feature Cards Grid */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Learning Modules</h3>
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
                title="No learning data available"
                description="Learning intelligence will appear when training and employee skill data is available."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}

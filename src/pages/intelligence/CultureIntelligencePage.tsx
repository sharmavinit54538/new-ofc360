import { IntelligenceHubLayout } from "@/components/intelligence/IntelligenceHubLayout";
import { IntelligenceHubHeader } from "@/components/intelligence/IntelligenceHubHeader";
import { IntelligenceEmptyState } from "@/components/intelligence/IntelligenceEmptyState";
import { InsightSection, InsightSectionItem } from "@/components/intelligence/InsightSection";
import {
  Globe,
  Sparkles,
  Smile,
  Users2,
  TrendingUp,
} from "lucide-react";

export default function CultureIntelligencePage() {
  const sections: { title: string; subtitle: string; icon: any; items: InsightSectionItem[] }[] = [
    {
      title: "Culture Overview",
      subtitle: "Summary of company values, alignment, and cultural health",
      icon: Globe,
      items: [
        {
          id: "cult-1",
          title: "Culture Alignment Index",
          subtitle: "Culture Overview",
          description: "Culture overview insights will appear here when organizational value assessments and culture logs are provided.",
          icon: Globe,
        },
      ],
    },
    {
      title: "Culture Signals",
      subtitle: "Behavioral cues, recognition frequency, and peer appreciation",
      icon: Sparkles,
      items: [
        {
          id: "cult-2",
          title: "Peer Recognition & Values Velocity",
          subtitle: "Culture Signals",
          description: "Value alignment indicators and recognition metrics will generate once peer shoutouts are connected.",
          icon: Sparkles,
        },
      ],
    },
    {
      title: "Workplace Sentiment",
      subtitle: "Organizational mood, psychological safety, and inclusion metrics",
      icon: Smile,
      items: [
        {
          id: "cult-3",
          title: "Psychological Safety & Sentiment",
          subtitle: "Workplace Sentiment",
          description: "Sentiment patterns will render here after employee sentiment check-ins are logged.",
          icon: Smile,
        },
      ],
    },
    {
      title: "Team Dynamics",
      subtitle: "Cross-functional collaboration, communication density, and team cohesion",
      icon: Users2,
      items: [
        {
          id: "cult-4",
          title: "Cross-Functional Cohesion",
          subtitle: "Team Dynamics",
          description: "Team interaction patterns and cross-departmental collaboration metrics will show when team logs exist.",
          icon: Users2,
        },
      ],
    },
    {
      title: "Culture Trends",
      subtitle: "Historical evolution of workplace culture across milestones",
      icon: TrendingUp,
      items: [
        {
          id: "cult-5",
          title: "Culture Evolution Tracking",
          subtitle: "Culture Trends",
          description: "Cultural shift trends will populate as long-term organizational telemetry is accrued.",
          icon: TrendingUp,
        },
      ],
    },
  ];

  return (
    <IntelligenceHubLayout>
      <div className="space-y-6">
        <IntelligenceHubHeader
          title="Culture Intelligence"
          subtitle="Understand organizational culture patterns and workplace sentiment."
          icon={Globe}
          badgeText="Culture"
          showBack={true}
          moduleName="Culture Intelligence"
        />

        <IntelligenceEmptyState
          icon={Globe}
          title="No culture data available"
          description="Connect recognition programs, team check-ins, or value surveys to start analyzing organizational culture and sentiment."
          actionText="Data Required"
          moduleName="Culture Intelligence"
        />

        <div className="space-y-8 pt-2">
          {sections.map((section) => (
            <InsightSection
              key={section.title}
              title={section.title}
              subtitle={section.subtitle}
              icon={section.icon}
              items={section.items}
            />
          ))}
        </div>
      </div>
    </IntelligenceHubLayout>
  );
}
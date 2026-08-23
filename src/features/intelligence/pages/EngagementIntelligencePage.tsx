import { IntelligenceHubLayout } from "@/features/intelligence/components/IntelligenceHubLayout";
import { IntelligenceHubHeader } from "@/features/intelligence/components/IntelligenceHubHeader";
import { IntelligenceEmptyState } from "@/features/intelligence/components/IntelligenceEmptyState";
import { InsightSection, InsightSectionItem } from "@/features/intelligence/components/InsightSection";
import {
  Heart,
  Smile,
  Activity,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

export default function EngagementIntelligencePage() {
  const sections: { title: string; subtitle: string; icon: any; items: InsightSectionItem[] }[] = [
    {
      title: "Engagement Overview",
      subtitle: "High-level summary of workplace satisfaction and sentiment signals",
      icon: Heart,
      items: [
        {
          id: "eng-1",
          title: "Engagement Health Index",
          subtitle: "Engagement Overview",
          description: "Engagement overview insights will display here once survey results or feedback logs are submitted.",
          icon: Heart,
        },
      ],
    },
    {
      title: "Employee Experience",
      subtitle: "Onboarding satisfaction, daily sentiment, and work environment",
      icon: Smile,
      items: [
        {
          id: "eng-2",
          title: "EX Satisfaction Scoring",
          subtitle: "Employee Experience",
          description: "Employee experience scores and pulse check metrics will generate when feedback channels are active.",
          icon: Smile,
        },
      ],
    },
    {
      title: "Engagement Signals",
      subtitle: "Real-time indicators of team morale and participation",
      icon: Activity,
      items: [
        {
          id: "eng-3",
          title: "Participation & Morale Indicators",
          subtitle: "Engagement Signals",
          description: "Engagement signal analysis will appear here after team activity and participation metrics are ingested.",
          icon: Activity,
        },
      ],
    },
    {
      title: "Feedback Insights",
      subtitle: "Qualitative NLP synthesis of anonymous employee feedback",
      icon: MessageSquare,
      items: [
        {
          id: "eng-4",
          title: "Qualitative Feedback Synthesis",
          subtitle: "Feedback Insights",
          description: "AI-driven feedback themes and comment sentiment analysis will show when pulse survey data is available.",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "Engagement Trends",
      subtitle: "Longitudinal tracking of employee experience over quarters",
      icon: TrendingUp,
      items: [
        {
          id: "eng-5",
          title: "Morale Trajectory & Quarterly Trends",
          subtitle: "Engagement Trends",
          description: "Long-term engagement trajectory graphs will populate upon connecting historical survey responses.",
          icon: TrendingUp,
        },
      ],
    },
  ];

  return (
    <IntelligenceHubLayout>
      <div className="space-y-6">
        <IntelligenceHubHeader
          title="Engagement Intelligence"
          subtitle="Understand employee engagement signals and identify opportunities to improve employee experience."
          icon={Heart}
          badgeText="Engagement"
          showBack={true}
          moduleName="Engagement Intelligence"
        />

        <IntelligenceEmptyState
          icon={Heart}
          title="No engagement data available"
          description="Connect pulse surveys, feedback forms, or exit check-ins to unlock real-time engagement intelligence and sentiment monitoring."
          actionText="Data Required"
          moduleName="Engagement Intelligence"
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

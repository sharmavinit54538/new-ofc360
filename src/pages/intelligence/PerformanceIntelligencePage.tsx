import { IntelligenceHubLayout } from "@/components/intelligence/IntelligenceHubLayout";
import { IntelligenceHubHeader } from "@/components/intelligence/IntelligenceHubHeader";
import { IntelligenceEmptyState } from "@/components/intelligence/IntelligenceEmptyState";
import { InsightSection, InsightSectionItem } from "@/components/intelligence/InsightSection";
import {
  BarChart3,
  Target,
  FileCheck2,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

export default function PerformanceIntelligencePage() {
  const sections: { title: string; subtitle: string; icon: any; items: InsightSectionItem[] }[] = [
    {
      title: "Performance Overview",
      subtitle: "High-level summary of performance patterns across teams",
      icon: BarChart3,
      items: [
        {
          id: "perf-1",
          title: "Performance Insights",
          subtitle: "Performance Overview",
          description: "Performance insights will appear here. Add organizational performance data to generate AI-powered performance insights.",
          icon: BarChart3,
        },
        {
          id: "perf-2",
          title: "Team Performance Index",
          subtitle: "Department Analysis",
          description: "Team performance metrics will render here once performance reviews and goal completions are ingested.",
          icon: Zap,
        },
      ],
    },
    {
      title: "Goal Intelligence",
      subtitle: "Tracking organizational OKRs, KPIs, and alignment",
      icon: Target,
      items: [
        {
          id: "goal-1",
          title: "OKR Progress Tracking",
          subtitle: "Goal Intelligence",
          description: "Goal alignment and completion insights will appear here when goal tracking data is available.",
          icon: Target,
        },
        {
          id: "goal-2",
          title: "KPI Alignment Analysis",
          subtitle: "Strategic Alignment",
          description: "Connect department objectives to view goal velocity and bottlenecks across teams.",
          icon: Award,
        },
      ],
    },
    {
      title: "Review Insights",
      subtitle: "Analysis of appraisal cycles and feedback quality",
      icon: FileCheck2,
      items: [
        {
          id: "rev-1",
          title: "Appraisal Cycle Sentiment",
          subtitle: "Review Insights",
          description: "Review insights will appear here once quarterly or annual performance evaluations are submitted.",
          icon: FileCheck2,
        },
      ],
    },
    {
      title: "Development Opportunities",
      subtitle: "Skill gap analysis and growth recommendations",
      icon: Award,
      items: [
        {
          id: "dev-1",
          title: "Skill Gap Identification",
          subtitle: "Development Opportunities",
          description: "AI-identified growth areas and learning pathways will render here after evaluation data is collected.",
          icon: Award,
        },
      ],
    },
    {
      title: "Performance Trends",
      subtitle: "Longitudinal performance trajectories and forecast",
      icon: TrendingUp,
      items: [
        {
          id: "trend-1",
          title: "Performance Velocity",
          subtitle: "Performance Trends",
          description: "Historical performance trends and trajectory predictions will display here with connected data.",
          icon: TrendingUp,
        },
      ],
    },
  ];

  return (
    <IntelligenceHubLayout>
      <div className="space-y-6">

        {/* Global Module Banner Empty State */}
        <IntelligenceEmptyState
          icon={BarChart3}
          title="Performance insights will appear here"
          description="Add organizational performance data to generate AI-powered performance insights, goal alignments, and developmental evaluations."
          actionText="Data Required"
          moduleName="Performance Intelligence"
        />

        {/* Individual Section Empty State Cards */}
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

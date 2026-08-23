import { IntelligenceHubLayout } from "@/features/intelligence/components/IntelligenceHubLayout";
import { IntelligenceHubHeader } from "@/features/intelligence/components/IntelligenceHubHeader";
import { IntelligenceEmptyState } from "@/features/intelligence/components/IntelligenceEmptyState";
import { InsightSection, InsightSectionItem } from "@/features/intelligence/components/InsightSection";
import {
  PieChart,
  Users,
  TrendingUp,
  Building2,
  GitFork,
  BarChart2,
} from "lucide-react";

export default function WorkforceAnalyticsPage() {
  const sections: { title: string; subtitle: string; icon: any; items: InsightSectionItem[] }[] = [
    {
      title: "Workforce Overview",
      subtitle: "High-level summary of headcount, structure, and headcount metrics",
      icon: Users,
      items: [
        {
          id: "wf-1",
          title: "Headcount & Composition",
          subtitle: "Workforce Overview",
          description: "Workforce overview data will appear here once organizational structure and employee census files are connected.",
          icon: Users,
        },
      ],
    },
    {
      title: "Workforce Trends",
      subtitle: "Growth rates, tenure analysis, and seasonal variations",
      icon: TrendingUp,
      items: [
        {
          id: "wf-2",
          title: "Growth & Retention Trends",
          subtitle: "Workforce Trends",
          description: "Workforce growth patterns and historical tenure trends will render here when organizational logs are integrated.",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Department Insights",
      subtitle: "Comparative metrics and operational distribution across departments",
      icon: Building2,
      items: [
        {
          id: "wf-3",
          title: "Departmental Allocation",
          subtitle: "Department Insights",
          description: "Departmental distribution and team density insights will display here with active workforce data.",
          icon: Building2,
        },
      ],
    },
    {
      title: "Workforce Distribution",
      subtitle: "Demographic, role level, and location spread",
      icon: PieChart,
      items: [
        {
          id: "wf-4",
          title: "Role & Skill Distribution",
          subtitle: "Workforce Distribution",
          description: "Workforce distribution charts and role mapping will generate when employee profile records exist.",
          icon: BarChart2,
        },
      ],
    },
    {
      title: "Workforce Movement",
      subtitle: "Internal mobility, transfers, and turnover rates",
      icon: GitFork,
      items: [
        {
          id: "wf-5",
          title: "Internal Mobility Patterns",
          subtitle: "Workforce Movement",
          description: "Internal transfers, promotion rates, and mobility tracking will appear here once workforce event data is synced.",
          icon: GitFork,
        },
      ],
    },
  ];

  return (
    <IntelligenceHubLayout>
      <div className="space-y-6">
        <IntelligenceHubHeader
          title="Workforce Analytics"
          subtitle="Explore workforce trends, organizational patterns, and business insights."
          icon={PieChart}
          badgeText="Analytics"
          showBack={true}
          moduleName="Workforce Analytics"
        />

        <IntelligenceEmptyState
          icon={PieChart}
          title="No workforce data available"
          description="Connect organizational data to start generating workforce insights, departmental structures, and growth trends."
          actionText="Data Required"
          moduleName="Workforce Analytics"
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

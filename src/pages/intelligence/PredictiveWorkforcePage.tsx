import { IntelligenceHubLayout } from "@/components/intelligence/IntelligenceHubLayout";
import { IntelligenceHubHeader } from "@/components/intelligence/IntelligenceHubHeader";
import { IntelligenceEmptyState } from "@/components/intelligence/IntelligenceEmptyState";
import { InsightSection, InsightSectionItem } from "@/components/intelligence/InsightSection";
import {
  TrendingUp,
  AlertOctagon,
  UserPlus,
  Scale,
  LineChart,
} from "lucide-react";

export default function PredictiveWorkforcePage() {
  const sections: { title: string; subtitle: string; icon: any; items: InsightSectionItem[] }[] = [
    {
      title: "Workforce Forecast",
      subtitle: "Predictive headcount modeling and future staffing projections",
      icon: TrendingUp,
      items: [
        {
          id: "pred-1",
          title: "Headcount Growth Forecast",
          subtitle: "Workforce Forecast",
          description: "Predictions unavailable. Predictive insights require historical workforce data.",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Attrition Signals",
      subtitle: "Early warning retention models and Flight Risk indicators",
      icon: AlertOctagon,
      items: [
        {
          id: "pred-2",
          title: "Retention Risk Modeling",
          subtitle: "Attrition Signals",
          description: "Predictions unavailable. Attrition warning signals require historical attrition and tenure records.",
          icon: AlertOctagon,
        },
      ],
    },
    {
      title: "Hiring Forecast",
      subtitle: "Talent acquisition demand forecasting and time-to-fill estimates",
      icon: UserPlus,
      items: [
        {
          id: "pred-3",
          title: "Recruitment Pipeline Demand",
          subtitle: "Hiring Forecast",
          description: "Predictions unavailable. Hiring projections require past recruitment cycle logs.",
          icon: UserPlus,
        },
      ],
    },
    {
      title: "Capacity Planning",
      subtitle: "Workload distribution modeling and team bandwidth forecasts",
      icon: Scale,
      items: [
        {
          id: "pred-4",
          title: "Capacity & Workload Balancer",
          subtitle: "Capacity Planning",
          description: "Predictions unavailable. Capacity forecasting models require active operational output telemetry.",
          icon: Scale,
        },
      ],
    },
    {
      title: "Future Workforce Trends",
      subtitle: "Strategic scenario simulations and multi-year workforce projections",
      icon: LineChart,
      items: [
        {
          id: "pred-5",
          title: "Multi-Year Scenario Simulation",
          subtitle: "Future Workforce Trends",
          description: "Predictions unavailable. Long-range workforce trend models require historical organizational data.",
          icon: LineChart,
        },
      ],
    },
  ];

  return (
    <IntelligenceHubLayout>
      <div className="space-y-6">
        <IntelligenceHubHeader
          title="Predictive Workforce"
          subtitle="Identify potential workforce trends and future organizational patterns using available data."
          icon={TrendingUp}
          badgeText="Predictive AI"
          showBack={true}
          moduleName="Predictive Workforce"
        />

        <IntelligenceEmptyState
          icon={TrendingUp}
          title="Predictions unavailable"
          description="Predictive insights require historical workforce data. Connect historical headcount and employee lifecycle records to activate ML forecast models."
          actionText="Data Required"
          moduleName="Predictive Workforce"
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

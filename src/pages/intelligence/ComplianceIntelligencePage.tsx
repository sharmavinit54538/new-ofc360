import { IntelligenceHubLayout } from "@/components/intelligence/IntelligenceHubLayout";
import { IntelligenceHubHeader } from "@/components/intelligence/IntelligenceHubHeader";
import { IntelligenceEmptyState } from "@/components/intelligence/IntelligenceEmptyState";
import { InsightSection, InsightSectionItem } from "@/components/intelligence/InsightSection";
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";

export default function ComplianceIntelligencePage() {
  const sections: { title: string; subtitle: string; icon: any; items: InsightSectionItem[] }[] = [
    {
      title: "Compliance Overview",
      subtitle: "High-level audit status, labor law adherence, and policy signatures",
      icon: ShieldCheck,
      items: [
        {
          id: "comp-1",
          title: "Regulatory Audit Status",
          subtitle: "Compliance Overview",
          description: "Compliance overview data will appear here once statutory registers and document policies are uploaded.",
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: "Policy Compliance",
      subtitle: "Tracking code of conduct acknowledgements and policy distribution",
      icon: FileCheck,
      items: [
        {
          id: "comp-2",
          title: "Policy Acknowledgement Tracking",
          subtitle: "Policy Compliance",
          description: "Policy signature completion metrics will render when compliance documents are distributed.",
          icon: FileCheck,
        },
      ],
    },
    {
      title: "Compliance Risks",
      subtitle: "Automated vulnerability detection and regulatory gap identification",
      icon: AlertTriangle,
      items: [
        {
          id: "comp-3",
          title: "Regulatory Risk Detector",
          subtitle: "Compliance Risks",
          description: "Compliance risk alerts and gap analysis will display upon connecting labor regulatory requirements.",
          icon: AlertTriangle,
        },
      ],
    },
    {
      title: "Upcoming Requirements",
      subtitle: "Statutory deadlines, tax filings, and mandatory policy renewals",
      icon: CalendarCheck,
      items: [
        {
          id: "comp-4",
          title: "Statutory Filing Calendar",
          subtitle: "Upcoming Requirements",
          description: "Upcoming compliance obligations and filing schedules will show when regional rules are set.",
          icon: CalendarCheck,
        },
      ],
    },
    {
      title: "Compliance Trends",
      subtitle: "Longitudinal audit readiness and compliance score health over time",
      icon: TrendingUp,
      items: [
        {
          id: "comp-5",
          title: "Audit Readiness Trajectory",
          subtitle: "Compliance Trends",
          description: "Compliance audit readiness history will populate after historical audits are imported.",
          icon: TrendingUp,
        },
      ],
    },
  ];

  return (
    <IntelligenceHubLayout>
      <div className="space-y-6">
        <IntelligenceHubHeader
          title="Compliance Intelligence"
          subtitle="Monitor HR compliance areas, policies, and organizational requirements."
          icon={ShieldCheck}
          badgeText="Compliance"
          showBack={true}
          moduleName="Compliance Intelligence"
        />

        <IntelligenceEmptyState
          icon={ShieldCheck}
          title="No compliance data available"
          description="Connect policy registers, statutory logs, or legal documentation to begin AI compliance monitoring."
          actionText="Data Required"
          moduleName="Compliance Intelligence"
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
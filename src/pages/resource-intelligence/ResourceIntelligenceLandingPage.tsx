import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { TalentIntelligenceCard } from "@/components/talent-intelligence/TalentIntelligenceCard";
import { TalentIntelligenceEmptyState } from "@/components/talent-intelligence/TalentIntelligenceEmptyState";
import { Laptop, Handshake } from "lucide-react";

const resourceModules = [
  {
    title: "Asset Intelligence",
    description: "AI-powered tracking, lifecycle depreciation, warranty alerts, and license optimization for enterprise resources.",
    icon: Laptop,
    path: "/resource-intelligence/assets",
    tag: "Assets",
  },
  {
    title: "Vendor Intelligence",
    description: "Manage vendor contracts, SLAs, procurement pipelines, performance scorecards, and renewal risk intelligence.",
    icon: Handshake,
    path: "/resource-intelligence/vendors",
    tag: "Vendors",
  },
];

export default function ResourceIntelligenceLandingPage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">
        {/* Feature Cards Grid */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourceModules.map((mod) => (
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
        </div>

        {/* Overview Section */}
        <div className="space-y-4 pt-2">
          <div className="glass-card rounded-2xl p-6 border border-border/60 bg-card shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-foreground">
              Enterprise Resource Overview
            </h4>
            <TalentIntelligenceEmptyState
              title="No active resource allocations or vendor contracts found"
              description="Connected assets and active vendor contracts will appear here."
            />
          </div>
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}

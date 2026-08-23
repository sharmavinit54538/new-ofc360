import { WorkforceTab } from "../categories/workforce/WorkforceTab";
import { PerformanceTab } from "../categories/performance/PerformanceTab";
import { EngagementTab } from "../categories/engagement/EngagementTab";
import { CultureTab } from "../categories/culture/CultureTab";
import { ComplianceTab } from "../categories/compliance/ComplianceTab";

export function ReportsCategoryContent({ activeCategory, wf, perf, eng, cult, comp }: any) {
  return (
    <div className="space-y-6">
      {activeCategory === "workforce" && <WorkforceTab {...wf} />}
      {activeCategory === "performance" && <PerformanceTab {...perf} />}
      {activeCategory === "engagement" && <EngagementTab {...eng} />}
      {activeCategory === "culture" && <CultureTab {...cult} />}
      {activeCategory === "compliance" && <ComplianceTab {...comp} />}
    </div>
  );
}

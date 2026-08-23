import { AnimatePresence } from "framer-motion";
import { WorkforceReportTab } from "./tabs/workforce/WorkforceReportTab";
import { PerformanceReportTab } from "./tabs/performance/PerformanceReportTab";
import { EngagementReportTab } from "./tabs/engagement/EngagementReportTab";
import { CultureReportTab } from "./tabs/culture/CultureReportTab";
import { ComplianceReportTab } from "./tabs/compliance/ComplianceReportTab";

export function ReportsPageContent({ d }: { d: any }) {
  const { p, stores, q, deptMap, dynamicDeptData } = d;
  return (
    <AnimatePresence mode="wait">
      {p.activeTab === "workforce" && <WorkforceReportTab employees={stores.employees} punches={stores.punches} leaveRequests={stores.leaveRequests} deptMap={deptMap} dynamicDeptData={dynamicDeptData} headcountRes={q.headcount} onNavigate={() => p.navigate("/people")} />}
      {p.activeTab === "performance" && <PerformanceReportTab perfDash={q.perfDash} perfTop={q.perfTop} perfSkills={q.perfSkills} perfKpi={q.perfKpi} onNavigate={() => p.navigate("/performance")} />}
      {p.activeTab === "engagement" && <EngagementReportTab engSum={q.engSum} enpsTrend={q.enpsTrend} engBreak={q.engBreak} engSurveys={q.engSurveys} onNavigate={() => p.navigate("/engagement")} />}
      {p.activeTab === "culture" && <CultureReportTab cultTelem={q.cultTelem} cultBreak={q.cultBreak} cultFeedback={q.cultFeedback} onNavigate={() => p.navigate("/culture")} />}
      {p.activeTab === "compliance" && <ComplianceReportTab compDash={q.compDash} compRisks={q.compRisks} compReadiness={q.compReadiness} complianceFilings={stores.complianceFilings} />}
    </AnimatePresence>
  );
}

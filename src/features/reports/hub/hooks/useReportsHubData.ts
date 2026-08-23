import { useReportsHubState } from "./useReportsHubState";
import { useCoreReportsData } from "./useCoreReportsData";
import { useWorkforceReportsData } from "./useWorkforceReportsData";
import { usePerformanceReportsData } from "./usePerformanceReportsData";
import { useEngagementReportsData } from "./useEngagementReportsData";
import { useCultureReportsData } from "./useCultureReportsData";
import { useComplianceReportsData } from "./useComplianceReportsData";
import { useReportActions } from "./useReportActions";

export function useReportsHubData() {
  const s = useReportsHubState();
  const c = useCoreReportsData(s.searchTerm, s.selectedType);
  const wf = useWorkforceReportsData(s.activeCategory);
  const perf = usePerformanceReportsData(s.activeCategory);
  const eng = useEngagementReportsData(s.activeCategory);
  const cult = useCultureReportsData(s.activeCategory);
  const comp = useComplianceReportsData(s.activeCategory);
  const a = useReportActions();
  return { s, c, wf: { ...wf, headcountRes: c.headcountRes, headcountLoading: c.headcountLoading, deptRes: c.deptRes, deptLoading: c.deptLoading }, perf, eng, cult, comp, a };
}
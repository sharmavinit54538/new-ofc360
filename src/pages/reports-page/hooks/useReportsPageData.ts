import { useReportsPageStores } from "./useReportsPageStores";
import { useReportsPageParams } from "./useReportsPageParams";
import { useReportsPageQueries } from "./useReportsPageQueries";
import { DEPT_COLORS } from "../constants/chartConstants";

export function useReportsPageData() {
  const stores = useReportsPageStores();
  const hasRecords = stores.employees.length > 0 || stores.punches.length > 0 || stores.runs.length > 0;
  const p = useReportsPageParams(hasRecords);
  const q = useReportsPageQueries(p.activeTab);

  const deptMap: Record<string, number> = {};
  stores.employees.forEach((emp: any) => { if (emp?.department) deptMap[emp.department] = (deptMap[emp.department] || 0) + 1; });
  const dynamicDeptData = Object.entries(deptMap).map(([name, count], idx) => ({ name, count, color: DEPT_COLORS[idx % DEPT_COLORS.length] }));

  return { p, stores, q, deptMap, dynamicDeptData };
}

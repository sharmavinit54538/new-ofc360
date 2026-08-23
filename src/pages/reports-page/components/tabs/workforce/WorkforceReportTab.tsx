import { motion } from "framer-motion";
import { WorkforceStatsCards } from "./WorkforceStatsCards";
import { WorkforceEmptyState } from "./WorkforceEmptyState";
import { WorkforceDeptBreakdown } from "./WorkforceDeptBreakdown";
import { WorkforceDeptChart } from "./WorkforceDeptChart";
import { WorkforceTrendCard } from "./WorkforceTrendCard";

export function WorkforceReportTab({ employees, punches, leaveRequests, deptMap, dynamicDeptData, headcountRes, onNavigate }: any) {
  const punchCount = punches.filter((p: any) => p?.type === "Check-In").length;
  const leaveCount = leaveRequests.filter((l: any) => l?.status === "approved" || l?.status === "Approved").length;
  return (
    <motion.div key="workforce" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-6">
      <WorkforceStatsCards empCount={employees.length} deptCount={Object.keys(deptMap).length} punchCount={punchCount} leaveCount={leaveCount} />
      {employees.length === 0 ? <WorkforceEmptyState onNavigate={onNavigate} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><WorkforceDeptBreakdown data={dynamicDeptData} total={employees.length} /><WorkforceDeptChart data={dynamicDeptData} /></div>
      )}
      <WorkforceTrendCard headcountRes={headcountRes} />
    </motion.div>
  );
}

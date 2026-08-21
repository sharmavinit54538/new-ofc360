import { TabsContent } from "@/components/ui/tabs";
import { RegularizationTab } from "../components/tabs/RegularizationTab";
import { TimesheetsTab } from "../components/tabs/TimesheetsTab";
import { LeavesTab } from "../components/tabs/LeavesTab";
import { OvertimeTab } from "../components/tabs/OvertimeTab";
import { AnalyticsTab } from "../components/tabs/AnalyticsTab";
import type { AttendanceHookResult } from "../types/attendanceHookResult";

export function AttendanceTabPanesPart2({ att }: { att: AttendanceHookResult }) {
  return (
    <>
      <TabsContent value="regularization" className="m-0 focus-visible:outline-none"><RegularizationTab list={att.filters.filteredRegularizations} isManagerOrAbove={att.isManagerOrAbove} onApply={() => att.modals.setIsRegModalOpen(true)} onUpdate={att.actions.updateRegularizationStatus} searchQuery={att.filters.searchQuery} setSearchQuery={att.filters.setSearchQuery} statusFilter={att.filters.statusFilter} setStatusFilter={att.filters.setStatusFilter} /></TabsContent>
      <TabsContent value="timesheets" className="m-0 focus-visible:outline-none"><TimesheetsTab list={att.displayedTimesheets} isManagerOrAbove={att.isManagerOrAbove} onLogTimesheet={() => att.modals.setIsTimesheetModalOpen(true)} onApprove={att.actions.handleApproveTimesheet} /></TabsContent>
      <TabsContent value="leaves" className="m-0 focus-visible:outline-none"><LeavesTab list={att.displayedLeaves} isManagerOrAbove={att.isManagerOrAbove} onApplyLeave={() => att.modals.setIsLeaveModalOpen(true)} onReview={att.actions.handleReviewLeave} /></TabsContent>
      <TabsContent value="overtime" className="m-0 focus-visible:outline-none"><OvertimeTab list={att.overtimes} isManagerOrAbove={att.isManagerOrAbove} onRequestOvertime={() => att.modals.setIsOvertimeModalOpen(true)} onUpdate={att.actions.updateOvertimeStatus} /></TabsContent>
      <TabsContent value="analytics" className="m-0 focus-visible:outline-none"><AnalyticsTab stats={att.stats} onRefresh={att.refetchAnalytics} isLoading={att.isAnalyticsLoading} /></TabsContent>
    </>
  );
}

import { AnimatePresence } from "framer-motion";
import { useAttendance } from "./hooks/useAttendance";
import { AttendanceHeader } from "./components/AttendanceHeader";
import { AttendanceDialogs } from "./components/AttendanceDialogs";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { CheckinTab } from "./components/tabs/CheckinTab";
import { ShiftsTab } from "./components/tabs/ShiftsTab";
import { RostersTab } from "./components/tabs/RostersTab";
import { HolidaysTab } from "./components/tabs/HolidaysTab";
import { RegularizationTab } from "./components/tabs/RegularizationTab";
import { TimesheetsTab } from "./components/tabs/TimesheetsTab";
import { LeavesTab } from "./components/tabs/LeavesTab";
import { OvertimeTab } from "./components/tabs/OvertimeTab";
import { AnalyticsTab } from "./components/tabs/AnalyticsTab";

export function AttendanceView() {
  const attendance = useAttendance();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Clean Top Header Control Row */}
      <AttendanceHeader
        activeTab={attendance.activeTab}
        onTabChange={attendance.setTab}
      />

      {/* TAB CONTENT PANES */}
      <AnimatePresence mode="wait">
        {attendance.activeTab === "overview" && (
          <OverviewTab
            stats={attendance.stats}
            isAnalyticsLoading={attendance.isAnalyticsLoading}
            isLeavesLoading={attendance.isLeavesLoading}
            isLiveStreamLoading={attendance.isLiveStreamLoading}
            liveAttendanceList={attendance.liveAttendanceList}
            onRefresh={() => {
              attendance.refetchAnalytics();
              if (attendance.isHrOrAdmin && attendance.refetchCompany) {
                attendance.refetchCompany();
              } else if (attendance.isManagerOrAbove && attendance.refetchTeam) {
                attendance.refetchTeam();
              } else if (attendance.refetchPersonal) {
                attendance.refetchPersonal();
              }
            }}
            onNavigateTab={attendance.setTab}
          />
        )}

        {attendance.activeTab === "checkin" && (
          <CheckinTab
            currentTime={attendance.currentTime}
            isClockedIn={attendance.isClockedIn}
            isOnBreak={attendance.isOnBreak}
            workSeconds={attendance.workSeconds}
            breakSeconds={attendance.breakSeconds}
            taskNotes={attendance.taskNotes}
            onTaskNotesChange={attendance.setTaskNotes}
            isCheckingIn={attendance.isCheckingIn}
            isCheckingOut={attendance.isCheckingOut}
            camera={attendance.camera}
            punches={attendance.punches}
            onCheckIn={attendance.actions.handleCheckIn}
            onToggleBreak={attendance.actions.handleToggleBreak}
            onCheckOut={attendance.actions.handleCheckOut}
          />
        )}

        {attendance.activeTab === "shifts" && (
          <ShiftsTab
            shifts={attendance.shifts}
            onOpenAddShift={() => attendance.modals.setIsShiftModalOpen(true)}
            onDeleteShift={attendance.deleteShift}
          />
        )}

        {attendance.activeTab === "rosters" && (
          <RostersTab
            rosters={attendance.rosters}
            onOpenAssignRoster={() => attendance.modals.setIsRosterModalOpen(true)}
            onDeleteRoster={attendance.deleteRoster}
          />
        )}

        {attendance.activeTab === "holidays" && (
          <HolidaysTab
            holidays={attendance.displayedHolidays}
            onOpenAddHoliday={(dateStr) => {
              if (dateStr) {
                attendance.modals.setHolidayDate(dateStr);
              }
              attendance.modals.setIsHolidayModalOpen(true);
            }}
            onDeleteHoliday={attendance.actions.handleDeleteHoliday}
          />
        )}

        {attendance.activeTab === "regularization" && (
          <RegularizationTab
            regularizations={attendance.regularizations}
            filteredRegularizations={attendance.filters.filteredRegularizations}
            searchQuery={attendance.filters.regSearchQuery}
            onSearchChange={attendance.filters.setRegSearchQuery}
            filterStatus={attendance.filters.regFilterStatus}
            onStatusChange={attendance.filters.setRegFilterStatus}
            onResetFilters={attendance.filters.resetFilters}
            onOpenApplyRegularization={() => attendance.modals.setIsRegModalOpen(true)}
            onUpdateStatus={attendance.actions.updateRegularizationStatus}
            currentUserName={attendance.user?.name}
          />
        )}

        {attendance.activeTab === "timesheets" && (
          <TimesheetsTab
            displayedTimesheets={attendance.displayedTimesheets}
            onOpenLogTimesheet={() => attendance.modals.setIsTimesheetModalOpen(true)}
            onApproveTimesheet={attendance.actions.handleApproveTimesheet}
          />
        )}

        {attendance.activeTab === "leaves" && (
          <LeavesTab
            displayedLeaves={attendance.displayedLeaves}
            onOpenApplyLeave={() => attendance.modals.setIsLeaveModalOpen(true)}
            onReviewLeave={attendance.actions.handleReviewLeave}
          />
        )}

        {attendance.activeTab === "overtime" && (
          <OvertimeTab
            overtimes={attendance.overtimes}
            onOpenRequestOvertime={() => attendance.modals.setIsOvertimeModalOpen(true)}
            onApproveOvertime={(id) => attendance.actions.updateOvertimeStatus(id, "Approved")}
          />
        )}

        {attendance.activeTab === "analytics" && (
          <AnalyticsTab
            stats={attendance.stats}
            isExporting={attendance.isExporting}
            onExportMusterRoll={attendance.actions.handleExportMusterRoll}
          />
        )}
      </AnimatePresence>

      {/* Aggregate Modal Dialogs */}
      <AttendanceDialogs
        modals={attendance.modals}
        actions={attendance.actions}
        isCreatingHoliday={attendance.isCreatingHoliday}
        isCreatingTimesheet={attendance.isCreatingTimesheet}
        isApplyingLeave={attendance.isApplyingLeave}
      />
    </div>
  );
}

export default AttendanceView;

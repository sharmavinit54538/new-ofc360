import { AddShiftDialog } from "./dialogs/AddShiftDialog";
import { AssignRosterDialog } from "./dialogs/AssignRosterDialog";
import { AddHolidayDialog } from "./dialogs/AddHolidayDialog";
import { ApplyRegularizationDialog } from "./dialogs/ApplyRegularizationDialog";
import { LogTimesheetDialog } from "./dialogs/LogTimesheetDialog";
import { RequestOvertimeDialog } from "./dialogs/RequestOvertimeDialog";
import { ApplyLeaveDialog } from "./dialogs/ApplyLeaveDialog";
import type { useAttendanceModals } from "../hooks/useAttendanceModals";
import type { useAttendanceActions } from "../hooks/useAttendanceActions";

interface AttendanceDialogsProps {
  modals: ReturnType<typeof useAttendanceModals>;
  actions: ReturnType<typeof useAttendanceActions>;
  isCreatingHoliday: boolean;
  isCreatingTimesheet: boolean;
  isApplyingLeave: boolean;
}

export function AttendanceDialogs({
  modals,
  actions,
  isCreatingHoliday,
  isCreatingTimesheet,
  isApplyingLeave,
}: AttendanceDialogsProps) {
  return (
    <>
      {/* 1. Add Shift Dialog */}
      <AddShiftDialog
        open={modals.isShiftModalOpen}
        onOpenChange={modals.setIsShiftModalOpen}
        shiftName={modals.shiftName}
        onShiftNameChange={modals.setShiftName}
        shiftStart={modals.shiftStart}
        onShiftStartChange={modals.setShiftStart}
        shiftEnd={modals.shiftEnd}
        onShiftEndChange={modals.setShiftEnd}
        shiftGrace={modals.shiftGrace}
        onShiftGraceChange={modals.setShiftGrace}
        shiftDept={modals.shiftDept}
        onShiftDeptChange={modals.setShiftDept}
        onSubmit={actions.handleCreateShift}
      />

      {/* 2. Assign Roster Dialog */}
      <AssignRosterDialog
        open={modals.isRosterModalOpen}
        onOpenChange={modals.setIsRosterModalOpen}
        rosterEmp={modals.rosterEmp}
        onRosterEmpChange={modals.setRosterEmp}
        rosterShift={modals.rosterShift}
        onRosterShiftChange={modals.setRosterShift}
        rosterDay={modals.rosterDay}
        onRosterDayChange={modals.setRosterDay}
        onSubmit={actions.handleCreateRoster}
      />

      {/* 3. Add Holiday Dialog */}
      <AddHolidayDialog
        open={modals.isHolidayModalOpen}
        onOpenChange={modals.setIsHolidayModalOpen}
        holidayTitle={modals.holidayTitle}
        onHolidayTitleChange={modals.setHolidayTitle}
        holidayDate={modals.holidayDate}
        onHolidayDateChange={modals.setHolidayDate}
        holidayType={modals.holidayType}
        onHolidayTypeChange={modals.setHolidayType}
        holidayBranch={modals.holidayBranch}
        onHolidayBranchChange={modals.setHolidayBranch}
        isLoading={isCreatingHoliday}
        onSubmit={actions.handleCreateHoliday}
      />

      {/* 4. Regularization Dialog */}
      <ApplyRegularizationDialog
        open={modals.isRegModalOpen}
        onOpenChange={modals.setIsRegModalOpen}
        regDate={modals.regDate}
        onRegDateChange={modals.setRegDate}
        regType={modals.regType}
        onRegTypeChange={modals.setRegType}
        regTime={modals.regTime}
        onRegTimeChange={modals.setRegTime}
        regReason={modals.regReason}
        onRegReasonChange={modals.setRegReason}
        onSubmit={actions.handleCreateRegularization}
      />

      {/* 5. Log Timesheet Dialog */}
      <LogTimesheetDialog
        open={modals.isTimesheetModalOpen}
        onOpenChange={modals.setIsTimesheetModalOpen}
        tsProject={modals.tsProject}
        onTsProjectChange={modals.setTsProject}
        tsTask={modals.tsTask}
        onTsTaskChange={modals.setTsTask}
        tsHours={modals.tsHours}
        onTsHoursChange={modals.setTsHours}
        tsBillable={modals.tsBillable}
        onTsBillableChange={modals.setTsBillable}
        isLoading={isCreatingTimesheet}
        onSubmit={actions.handleCreateTimesheet}
      />

      {/* 6. Request Overtime Dialog */}
      <RequestOvertimeDialog
        open={modals.isOvertimeModalOpen}
        onOpenChange={modals.setIsOvertimeModalOpen}
        otHours={modals.otHours}
        onOtHoursChange={modals.setOtHours}
        otMultiplier={modals.otMultiplier}
        onOtMultiplierChange={modals.setOtMultiplier}
        otReason={modals.otReason}
        onOtReasonChange={modals.setOtReason}
        onSubmit={actions.handleCreateOvertime}
      />

      {/* 7. Apply Leave Dialog */}
      <ApplyLeaveDialog
        open={modals.isLeaveModalOpen}
        onOpenChange={modals.setIsLeaveModalOpen}
        leaveType={modals.leaveType}
        onLeaveTypeChange={modals.setLeaveType}
        leaveStart={modals.leaveStart}
        onLeaveStartChange={modals.setLeaveStart}
        leaveEnd={modals.leaveEnd}
        onLeaveEndChange={modals.setLeaveEnd}
        leaveReason={modals.leaveReason}
        onLeaveReasonChange={modals.setLeaveReason}
        isLoading={isApplyingLeave}
        onSubmit={actions.handleApplyLeave}
      />
    </>
  );
}

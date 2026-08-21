import { ApplyRegularizationDialog } from "./dialogs/ApplyRegularizationDialog";
import { LogTimesheetDialog } from "./dialogs/LogTimesheetDialog";
import { RequestOvertimeDialog } from "./dialogs/RequestOvertimeDialog";
import { ApplyLeaveDialog } from "./dialogs/ApplyLeaveDialog";

export function AttendanceEmployeeDialogs({ modals, actions }: any) {
  return (
    <>
      <ApplyRegularizationDialog isOpen={modals.isRegModalOpen} onOpenChange={modals.setIsRegModalOpen} regDate={modals.regDate} setRegDate={modals.setRegDate} regType={modals.regType} setRegType={modals.setRegType} regTime={modals.regTime} setRegTime={modals.setRegTime} regReason={modals.regReason} setRegReason={modals.setRegReason} onSubmit={actions.handleCreateRegularization} />
      <LogTimesheetDialog isOpen={modals.isTimesheetModalOpen} onOpenChange={modals.setIsTimesheetModalOpen} tsProject={modals.tsProject} setTsProject={modals.setTsProject} tsTask={modals.tsTask} setTsTask={modals.setTsTask} tsHours={modals.tsHours} setTsHours={modals.setTsHours} tsBillable={modals.tsBillable} setTsBillable={modals.setTsBillable} onSubmit={actions.handleCreateTimesheet} />
      <RequestOvertimeDialog isOpen={modals.isOvertimeModalOpen} onOpenChange={modals.setIsOvertimeModalOpen} otHours={modals.otHours} setOtHours={modals.setOtHours} otMultiplier={modals.otMultiplier} setOtMultiplier={modals.setOtMultiplier} otReason={modals.otReason} setOtReason={modals.setOtReason} onSubmit={actions.handleCreateOvertime} />
      <ApplyLeaveDialog isOpen={modals.isLeaveModalOpen} onOpenChange={modals.setIsLeaveModalOpen} leaveType={modals.leaveType} setLeaveType={modals.setLeaveType} leaveStart={modals.leaveStart} setLeaveStart={modals.setLeaveStart} leaveEnd={modals.leaveEnd} setLeaveEnd={modals.setLeaveEnd} leaveReason={modals.leaveReason} setLeaveReason={modals.setLeaveReason} onSubmit={actions.handleApplyLeave} />
    </>
  );
}

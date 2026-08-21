import { AttendanceOrgDialogs } from "./dialogs/AttendanceOrgDialogs";
import { AttendanceEmployeeDialogs } from "./dialogs/AttendanceEmployeeDialogs";
import type { AttendanceDialogProps } from "../types/dialogPropTypes";

export function AttendanceDialogs({ modals, actions }: AttendanceDialogProps) {
  return (
    <>
      <AttendanceOrgDialogs modals={modals} actions={actions} />
      <AttendanceEmployeeDialogs modals={modals} actions={actions} />
    </>
  );
}

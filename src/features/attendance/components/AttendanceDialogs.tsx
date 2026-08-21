import { AttendanceOrgDialogs } from "./dialogs/AttendanceOrgDialogs";
import { AttendanceEmployeeDialogs } from "./dialogs/AttendanceEmployeeDialogs";

export function AttendanceDialogs({ modals, actions }: any) {
  return (
    <>
      <AttendanceOrgDialogs modals={modals} actions={actions} />
      <AttendanceEmployeeDialogs modals={modals} actions={actions} />
    </>
  );
}

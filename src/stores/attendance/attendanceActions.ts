import { regActions } from "./regularizationActions";
import { punchStoreActions } from "./punchActions";
import { shiftStoreActions } from "./shiftActions";

export const createAttendanceActions = (set: any, get: any) => ({
  ...punchStoreActions(set, get),
  ...shiftStoreActions(set),
  ...regActions(set, get),
});
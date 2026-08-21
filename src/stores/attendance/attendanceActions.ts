import { regActions } from "./regularizationActions";
import { punchStoreActions } from "./punchActions";
import { shiftStoreActions } from "./shiftActions";
import type { StoreSet, StoreGet } from "./storeTypes";

export const createAttendanceActions = (set: StoreSet, get: StoreGet) => ({
  ...punchStoreActions(set, get),
  ...shiftStoreActions(set),
  ...regActions(set, get),
});
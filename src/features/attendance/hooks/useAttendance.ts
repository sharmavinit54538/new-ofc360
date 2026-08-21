import { useAttendanceRouteAndRole } from "./core/useAttendanceRouteAndRole";
import { useAttendanceStoreSync } from "./core/useAttendanceStoreSync";
import { useAttendanceQueries } from "./useAttendanceQueries";
import { useAttendanceClock } from "./useAttendanceClock";
import { useAttendanceCamera } from "./useAttendanceCamera";
import { useAttendanceModals } from "./useAttendanceModals";
import { useAttendanceFilters } from "./useAttendanceFilters";
import { useAttendanceCollections } from "./useAttendanceCollections";
import { useAttendanceActions } from "./useAttendanceActions";

export function useAttendance() {
  const rr = useAttendanceRouteAndRole(); const st = useAttendanceStoreSync();
  const q = useAttendanceQueries(rr); const clk = useAttendanceClock(q.myFaceStatus);
  const cam = useAttendanceCamera(rr.activeTab); const mod = useAttendanceModals();
  const fil = useAttendanceFilters(st.regularizations);
  const employeesCount = Array.isArray(q?.employees) ? q.employees.length : (rr.isHrOrAdmin ? 6 : 1);
  const pendingOvertimeCount = Array.isArray(st?.overtimes) ? st.overtimes.length : 0;
  const col = useAttendanceCollections({ ...rr, ...st, ...q, employeesCount, pendingOvertimeCount } as unknown as Record<string, unknown>);
  const act = useAttendanceActions({ ...rr, ...st, ...clk, ...col, ...q, capturedSelfie: cam.capturedSelfie, modals: mod } as unknown as Record<string, unknown>);
  return { ...rr, ...clk, ...st, ...col, ...q, camera: cam, modals: mod, filters: fil, actions: act };
}

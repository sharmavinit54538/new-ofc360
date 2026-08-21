import { exportMusterRollCsv } from "../../utils/attendance.utils";
import type { PunchRecord } from "../../types/attendance.types";

export function useExportAction(p: {
  punches: PunchRecord[]; liveAttendanceList: PunchRecord[]; user?: { id?: string; name?: string } | null;
  triggerAttendanceExport: (a: undefined) => { unwrap: () => Promise<unknown> };
}) {
  return async () => {
    try { await p.triggerAttendanceExport(undefined).unwrap(); } catch { /* CSV fallback */ }
    const recs = (p.punches.length > 0 ? p.punches : p.liveAttendanceList) as unknown as Array<Record<string, unknown>>;
    exportMusterRollCsv(recs, p.user || undefined);
  };
}

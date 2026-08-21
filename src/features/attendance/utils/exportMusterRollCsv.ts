import { toast } from "sonner";
import { MUSTER_ROLL_HEADERS } from "./musterRollHeaders";
import { mapRecordToMusterRow } from "./musterRollRowMapper";
import { triggerCsvDownload } from "./musterRollDownload";

export function exportMusterRollCsv(
  records: Array<Record<string, unknown>>,
  user?: { id?: string; name?: string }
): void {
  if (!records || records.length === 0) {
    toast.info("No attendance punch records to export yet.");
    return;
  }
  const rows = records.map((r) => mapRecordToMusterRow(r, user));
  const csv = [MUSTER_ROLL_HEADERS.join(","), ...rows.map((r) => r.join(","))].join("\n");
  triggerCsvDownload(csv);
  toast.success("Downloaded Attendance Muster Roll (.csv)");
}

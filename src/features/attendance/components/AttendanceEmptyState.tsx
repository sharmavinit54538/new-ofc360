import { AttendanceEmptyCard } from "./empty/AttendanceEmptyCard";
import { AttendanceEmptyRow } from "./empty/AttendanceEmptyRow";

export function AttendanceEmptyState({
  title = "No records found", description = "There are currently no items to display in this view.",
  isTableRow = false, colSpan = 6,
}: {
  title?: string; description?: string; isTableRow?: boolean; colSpan?: number;
}) {
  if (isTableRow) {
    return <AttendanceEmptyRow colSpan={colSpan} message={description} />;
  }
  return <AttendanceEmptyCard title={title} description={description} />;
}

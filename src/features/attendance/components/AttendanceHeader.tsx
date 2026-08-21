import { AttendanceHeaderSelect } from "./header/AttendanceHeaderSelect";
import { AttendanceHeaderBadge } from "./header/AttendanceHeaderBadge";
import type { AttendanceTabType } from "../types/attendance.types";

export function AttendanceHeader({ activeTab, onTabChange }: { activeTab: AttendanceTabType; onTabChange: (t: string) => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-border/40">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Attendance & Time Hub</h1>
          <AttendanceHeaderBadge />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Enterprise biometric tracking, shifts, regularization & leaves.</p>
      </div>
      <AttendanceHeaderSelect activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}

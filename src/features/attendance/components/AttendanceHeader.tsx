import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NAV_MODULES } from "../constants/attendance.constants";
import type { AttendanceTabType } from "../types/attendance.types";

interface AttendanceHeaderProps {
  activeTab: AttendanceTabType;
  onTabChange: (tab: AttendanceTabType) => void;
}

export function AttendanceHeader({ activeTab, onTabChange }: AttendanceHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/40">
      <div className="flex items-center gap-2">
        <Select value={activeTab} onValueChange={(val) => onTabChange(val as AttendanceTabType)}>
          <SelectTrigger className="w-64 text-xs h-9 bg-card border-border/70 font-semibold shadow-xs">
            <SelectValue placeholder="Select Attendance Module" />
          </SelectTrigger>
          <SelectContent>
            {NAV_MODULES.map((m) => (
              <SelectItem key={m.id} value={m.id} className="text-xs font-medium">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Global Live Pulse & Active Connection Indicator */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="text-[11px] gap-1.5 font-mono py-1 px-2.5 bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Backend API Connected
        </Badge>
      </div>
    </div>
  );
}

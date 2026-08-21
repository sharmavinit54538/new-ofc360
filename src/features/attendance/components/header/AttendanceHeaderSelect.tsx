import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NAV_MODULES } from "../../constants/attendance.constants";
import type { AttendanceTabType } from "../../types/attendance.types";

export function AttendanceHeaderSelect({ activeTab, onTabChange }: { activeTab: AttendanceTabType; onTabChange: (t: string) => void }) {
  return (
    <div className="w-full md:w-64">
      <Select value={activeTab} onValueChange={onTabChange}>
        <SelectTrigger className="w-full h-9 bg-card border-border/80 shadow-sm text-xs font-semibold"><SelectValue placeholder="Select Module" /></SelectTrigger>
        <SelectContent align="end" className="w-56">
          {NAV_MODULES.map((m) => (
            <SelectItem key={m.id} value={m.id} className="text-xs py-1.5 flex items-center gap-2">
              <m.icon className="h-3.5 w-3.5 mr-1.5 inline text-muted-foreground" /> {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

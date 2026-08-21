import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HOLIDAY_TYPES, BRANCH_OPTIONS } from "../../constants/attendance.constants";

export function HolidayDialogForm(p: any) {
  return (
    <div className="space-y-3 py-2">
      <div><Label className="text-xs">Holiday Title</Label><Input value={p.holidayTitle} onChange={(e) => p.setHolidayTitle(e.target.value)} placeholder="e.g. Independence Day" className="h-8 text-xs mt-1" /></div>
      <div><Label className="text-xs">Holiday Date</Label><Input type="date" value={p.holidayDate} onChange={(e) => p.setHolidayDate(e.target.value)} className="h-8 text-xs mt-1" /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label className="text-xs">Type</Label><Select value={p.holidayType} onValueChange={p.setHolidayType}><SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger><SelectContent className="text-xs">{HOLIDAY_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent></Select></div>
        <div><Label className="text-xs">Branch</Label><Select value={p.holidayBranch} onValueChange={p.setHolidayBranch}><SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger><SelectContent className="text-xs">{BRANCH_OPTIONS.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}</SelectContent></Select></div>
      </div>
    </div>
  );
}

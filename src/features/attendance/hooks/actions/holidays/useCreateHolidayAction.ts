import { toast } from "sonner";
import type { HolidayItem } from "../../../types/attendance.types";

export function useCreateHolidayAction(p: {
  holidayModal: { holidayTitle: string; holidayDate: string; holidayType: HolidayItem["type"]; holidayBranch: string; setHolidayTitle: (v: string) => void; setHolidayDate: (v: string) => void; setIsHolidayModalOpen: (v: boolean) => void };
  addLocalHoliday: (h: HolidayItem) => void; createHolidayApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> }; refetchHolidays: () => void;
}) {
  return async () => {
    if (!p.holidayModal.holidayTitle.trim() || !p.holidayModal.holidayDate) { toast.error("Title and Date are required."); return; }
    const h: HolidayItem = { id: `holiday_${Date.now()}`, title: p.holidayModal.holidayTitle.trim(), date: p.holidayModal.holidayDate, type: p.holidayModal.holidayType, branchLocation: p.holidayModal.holidayBranch || "Headquarters (HQ)", mandatory: p.holidayModal.holidayType !== "Optional Floating" };
    try { await p.createHolidayApi(h).unwrap(); p.refetchHolidays(); } catch { /* local sync */ }
    p.addLocalHoliday(h); p.holidayModal.setHolidayTitle(""); p.holidayModal.setHolidayDate(""); p.holidayModal.setIsHolidayModalOpen(false); toast.success("Holiday added to calendar!");
  };
}

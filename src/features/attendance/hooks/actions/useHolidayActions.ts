import { useCreateHolidayAction } from "./holidays/useCreateHolidayAction";
import { useDeleteHolidayAction } from "./holidays/useDeleteHolidayAction";
import type { HolidayItem } from "../../types/attendance.types";

export function useHolidayActions(p: {
  holidayModal: { holidayTitle: string; holidayDate: string; holidayType: HolidayItem["type"]; holidayBranch: string; setHolidayTitle: (v: string) => void; setHolidayDate: (v: string) => void; setIsHolidayModalOpen: (v: boolean) => void };
  addLocalHoliday: (h: HolidayItem) => void; deleteLocalHoliday: (id: string) => void;
  createHolidayApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  deleteHolidayApi: (id: string) => { unwrap: () => Promise<unknown> }; refetchHolidays: () => void;
}) {
  const handleCreateHoliday = useCreateHolidayAction(p);
  const handleDeleteHoliday = useDeleteHolidayAction(p);
  return { handleCreateHoliday, handleDeleteHoliday };
}

import { toast } from "sonner";

export function useDeleteHolidayAction(p: {
  deleteLocalHoliday: (id: string) => void;
  deleteHolidayApi: (id: string) => { unwrap: () => Promise<unknown> };
  refetchHolidays: () => void;
}) {
  return async (id: string) => {
    try {
      await p.deleteHolidayApi(id).unwrap();
      p.refetchHolidays();
    } catch {
      // Local fallback
    }
    p.deleteLocalHoliday(id);
    toast.success("Holiday removed.");
  };
}

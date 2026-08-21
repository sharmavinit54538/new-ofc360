import { toast } from "sonner";
import type { HolidayItem } from "../../types/attendance.types";

interface HolidayModalState {
  holidayTitle: string;
  holidayDate: string;
  holidayType: HolidayItem["type"];
  holidayBranch: string;
  setHolidayTitle: (val: string) => void;
  setHolidayDate: (val: string) => void;
  setIsHolidayModalOpen: (val: boolean) => void;
}

interface UseHolidayActionsProps {
  holidayModal: HolidayModalState;
  addLocalHoliday: (holiday: Omit<HolidayItem, "id"> | HolidayItem) => void;
  deleteLocalHoliday: (id: string) => void;
  createHolidayApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  deleteHolidayApi: (id: string) => { unwrap: () => Promise<unknown> };
  refetchHolidays: () => void;
}

export function useHolidayActions({
  holidayModal,
  addLocalHoliday,
  deleteLocalHoliday,
  createHolidayApi,
  deleteHolidayApi,
  refetchHolidays,
}: UseHolidayActionsProps) {
  const handleCreateHoliday = async () => {
    if (!holidayModal.holidayTitle.trim() || !holidayModal.holidayDate) {
      toast.error("Title and Date are required.");
      return;
    }
    const payload = {
      title: holidayModal.holidayTitle.trim(),
      date: holidayModal.holidayDate,
      type: holidayModal.holidayType,
      branchLocation: holidayBranchFallback(holidayModal.holidayBranch),
      mandatory: holidayModal.holidayType !== "Optional Floating",
    };
    try {
      await createHolidayApi(payload).unwrap();
      refetchHolidays();
    } catch {
      // Local sync fallback
    }
    addLocalHoliday(payload);
    holidayModal.setHolidayTitle("");
    holidayModal.setHolidayDate("");
    holidayModal.setIsHolidayModalOpen(false);
    toast.success("Holiday added to calendar!");
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await deleteHolidayApi(id).unwrap();
      refetchHolidays();
    } catch {
      // Local fallback
    }
    deleteLocalHoliday(id);
    toast.success("Holiday removed.");
  };

  return {
    handleCreateHoliday,
    handleDeleteHoliday,
  };
}

function holidayBranchFallback(branch: string): string {
  return branch || "Headquarters (HQ)";
}

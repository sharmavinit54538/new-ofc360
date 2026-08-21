import { useState } from "react";
import type { HolidayItem } from "../../types/attendance.types";

export function useHolidayModal() {
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [holidayTitle, setHolidayTitle] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayType, setHolidayType] = useState<HolidayItem["type"]>("National");
  const [holidayBranch, setHolidayBranch] = useState("Headquarters (HQ)");

  return {
    isHolidayModalOpen, setIsHolidayModalOpen,
    holidayTitle, setHolidayTitle,
    holidayDate, setHolidayDate,
    holidayType, setHolidayType,
    holidayBranch, setHolidayBranch,
  };
}

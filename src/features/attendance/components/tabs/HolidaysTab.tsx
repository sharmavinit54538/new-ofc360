import { motion } from "framer-motion";
import HolidayCalendarView from "@/components/attendance/HolidayCalendarView";
import type { HolidayItem } from "../../types/attendance.types";

interface HolidaysTabProps {
  holidays: HolidayItem[];
  onOpenAddHoliday: (dateStr?: string) => void;
  onDeleteHoliday: (id: string) => void;
}

export function HolidaysTab({
  holidays,
  onOpenAddHoliday,
  onDeleteHoliday,
}: HolidaysTabProps) {
  return (
    <motion.div
      key="holidays"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <HolidayCalendarView
        holidays={holidays}
        onAddHoliday={(dateStr) => {
          onOpenAddHoliday(dateStr);
        }}
        onDeleteHoliday={onDeleteHoliday}
      />
    </motion.div>
  );
}

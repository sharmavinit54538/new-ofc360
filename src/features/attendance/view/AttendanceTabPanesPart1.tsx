import { TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "../components/tabs/OverviewTab";
import { CheckinTab } from "../components/tabs/CheckinTab";
import { ShiftsTab } from "../components/tabs/ShiftsTab";
import { RostersTab } from "../components/tabs/RostersTab";
import { HolidaysTab } from "../components/tabs/HolidaysTab";
import type { AttendanceHookResult } from "../types/attendanceHookResult";

export function AttendanceTabPanesPart1({ att }: { att: AttendanceHookResult }) {
  return (
    <>
      <TabsContent value="overview" className="m-0 focus-visible:outline-none"><OverviewTab list={att.liveAttendanceList} stats={att.stats} onExport={att.actions.handleExportMusterRoll} isExporting={att.isExporting} /></TabsContent>
      <TabsContent value="checkin" className="m-0 focus-visible:outline-none"><CheckinTab {...att} list={att.punches} /></TabsContent>
      <TabsContent value="shifts" className="m-0 focus-visible:outline-none"><ShiftsTab shifts={att.shifts} onAddShift={() => att.modals.setIsShiftModalOpen(true)} onDeleteShift={att.deleteShift} /></TabsContent>
      <TabsContent value="rosters" className="m-0 focus-visible:outline-none"><RostersTab rosters={att.rosters} onAssignRoster={() => att.modals.setIsRosterModalOpen(true)} onDeleteRoster={att.deleteRoster} /></TabsContent>
      <TabsContent value="holidays" className="m-0 focus-visible:outline-none"><HolidaysTab holidays={att.displayedHolidays} isHrOrAdmin={att.isHrOrAdmin} onAddHoliday={() => att.modals.setIsHolidayModalOpen(true)} onDeleteHoliday={att.actions.handleDeleteHoliday} /></TabsContent>
    </>
  );
}

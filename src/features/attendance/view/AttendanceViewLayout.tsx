import { Tabs } from "@/components/ui/tabs";
import { AttendanceHeader } from "../components/AttendanceHeader";
import { AttendanceTabPanes } from "./AttendanceTabPanes";
import { AttendanceDialogs } from "../components/AttendanceDialogs";

export function AttendanceViewLayout({ att }: { att: any }) {
  return (
    <div className="space-y-5 p-4 md:p-6 max-w-7xl mx-auto">
      <AttendanceHeader activeTab={att.activeTab} onTabChange={att.setTab} />
      <Tabs value={att.activeTab} onValueChange={att.setTab} className="space-y-4">
        <AttendanceTabPanes att={att} />
      </Tabs>
      <AttendanceDialogs modals={att.modals} actions={att.actions} />
    </div>
  );
}
